import { UseFilters } from '@nestjs/common';

import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { SocketUser } from '@common/decorators';
import { Role } from '@common/enums';
import { SocketException } from '@common/exceptions';
import { SocketExceptionFilter } from '@common/filters';
import { AppServer, AppSocket } from '@common/types';

import { AuthService } from '@modules/auth/auth.service';
import { ChatMessagesService } from '@modules/chat-messages/chat-messages.service';
import { User } from '@modules/users/types/user.types';
import { UsersService } from '@modules/users/users.service';

import { ChatService } from './chat.service';

import { DirectMessageDto } from './dto';

@UseFilters(SocketExceptionFilter)
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayConnection<AppSocket>, OnGatewayDisconnect<AppSocket>
{
  @WebSocketServer()
  server: AppServer;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly chatMessagesService: ChatMessagesService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: AppSocket): Promise<void> {
    try {
      const authUser = await this.authService.authenticateSocket(client);
      await client.join(authUser._id.toString());
      client.data.user = authUser;
    } catch (error) {
      console.error('[Socket] Error de autenticación:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AppSocket): Promise<void> {
    const user = client.data.user;
    if (user) {
      await this.usersService.update(user._id, {
        online: false,
        lastActivity: new Date(),
        inChat: null,
      });

      client.disconnect();
    }
  }

  @SubscribeMessage('init-chat')
  async handleInitChat(
    @MessageBody('to') recipientId: string,
    @SocketUser() sender: User,
  ): Promise<void> {
    try {
      const chat = await this.chatService.initializeChat({
        recipientId,
        sender,
      });

      const { chatId, chatLockedForProfessors, chatLockedForStudents } = chat;

      const [messages, resume] = await Promise.all([
        this.chatMessagesService.getMessagesChat(chatId, 1),
        this.chatService.resumeChat(chatId),
      ]);

      const response = {
        chatId,
        chatLockedForProfessors,
        chatLockedForStudents,
      };

      this.server.emit('init-chat', response);
      if (messages.length) this.server.emit('messages-chat', messages);
      if (resume) this.server.emit('resume-chat', resume);

      await this.usersService.update(sender._id, {
        lastActivity: new Date(),
        inChat: chatId,
      });
    } catch (error) {
      throw new SocketException('init-chat-error', error.message);
    }
  }

  @SubscribeMessage('direct-message')
  async handleDirectMessage(
    @MessageBody() directMessageDto: DirectMessageDto,
    @SocketUser() sender: User,
  ): Promise<void> {
    try {
      const meId = sender._id.toString();
      const { role } = sender;

      await this.usersService.update(sender._id, {
        lastActivity: new Date(),
      });

      const { message } = await this.chatService.sendDirectMessage(
        sender,
        directMessageDto,
      );

      const resumeChat = await this.chatService.resumeChat(
        String(message.chat),
      );

      if (role === Role.Student) {
      }

      this.server.to(directMessageDto.to).emit('direct-message', message);
      this.server.to(meId).emit('resume-chat', resumeChat);
    } catch (error) {
      throw new SocketException('direct-message', error.message);
    }
  }
}
