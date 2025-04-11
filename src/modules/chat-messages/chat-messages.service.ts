import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ChatMessage,
  ChatMessageDocument,
} from './schemas/chat-messages.schema';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessage>,
  ) {}

  async getMessagesChat(
    chatId: ChatMessageDocument['_id'],
  ): Promise<ChatMessage[]> {
    return await this.chatMessageModel
      .find({ chat: chatId })
      .sort({ createdAt: 'desc' });
  }
}
