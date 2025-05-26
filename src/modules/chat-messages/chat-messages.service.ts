import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ChatMessage } from './schemas/chat-messages.schema';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessage>,
  ) {}

  async getMessagesChat(chatId: string, page?: number): Promise<ChatMessage[]> {
    const query = this.chatMessageModel
      .find({ chat: chatId })
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' });

    if (page) {
      const limit = 10;
      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);
    }

    const messages = await query;

    return messages;
  }
}
