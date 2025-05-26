import { UseFilters } from '@nestjs/common';

import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { WsUser } from '@common/decorators';
import { WebSocketErrorFilter } from '@common/filters';
import { AppWsException } from '@common/exceptions';

import { User } from '@modules/users/types/user.types';
import { AuthService } from '@modules/auth/auth.service';
import { UsersService } from '@modules/users/users.service';
import { ChatMessagesService } from '@modules/chat-messages/chat-messages.service';

import { ChatService } from './chat.service';
import { AppServer, AppSocket } from '../../common/types/websocket-connection.types';

@UseFilters(WebSocketErrorFilter)
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

  handleDisconnect(client: AppSocket): void {
    client.disconnect();
  }

  @SubscribeMessage('init-chat')
  async handleInitChat(
    @MessageBody('to') recipientId: string,
    @WsUser() sender: User,
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
      throw new AppWsException('init-chat-error', error.message);
    }
  }
}
