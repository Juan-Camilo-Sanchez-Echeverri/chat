import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '../users/users.module';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatMessagesModule } from '../chat-messages/chat-messages.module';

@Module({
  imports: [
    UsersModule,
    ChatMessagesModule,
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
