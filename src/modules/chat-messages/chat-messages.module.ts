import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesController } from './chat-messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-messages.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}
