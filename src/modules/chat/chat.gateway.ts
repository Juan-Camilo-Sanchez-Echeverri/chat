import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsUser } from '@common/decorators/ws-user.decorator';

import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';

import { User } from '../users/types/user.types';

interface SocketData {
  user: User;
}

type InterEvents = Record<never, never>;

interface InitChatResponse {
  chatId: string;
  chatLockedForProfessors: boolean;
  chatLockedForStudents: boolean;
}

interface ClientEvents {
  'init-chat': (to: string) => void;
}

interface ServerEvents {
  'init-chat': (response: InitChatResponse) => void;
}

type AppSocket = Socket<ClientEvents, ServerEvents, InterEvents, SocketData>;
type AppServer = Server<ClientEvents, ServerEvents, InterEvents, SocketData>;

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: AppServer;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: AppSocket) {
    try {
      const infoUser = await this.authService.authenticateSocket(client);
      await client.join(infoUser._id);
      client.data.user = infoUser;
    } catch (error) {
      console.log('Error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AppSocket) {
    void client.leave(client.id);
  }

  @SubscribeMessage('init-chat')
  async create(@MessageBody() to: string, @WsUser() user: User) {
    try {
      const chat = await this.chatService.initChat({ to, user });

      const response = {
        chatId: chat.chatId,
        chatLockedForProfessors: chat.chatLockedForProfessors,
        chatLockedForStudents: chat.chatLockedForStudents,
      };

      this.server.emit('init-chat', response);
      return response;
    } catch (error) {
      console.log('Error:', error);
    }
  }
}
