import { Injectable, NotFoundException } from '@nestjs/common';

import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ObjectId } from '@common/types/mongo.types';
import { Role } from '@common/enums';

import { InitChatDto } from './dto/init-chat.dto';

import { User } from '@modules/users/types/user.types';
import { ChatMessagesService } from '@modules/chat-messages/chat-messages.service';
import { UsersService } from '@modules/users/users.service';

import { Chat, ChatDocument } from './schemas/chat.schema';

import {
  ChatServiceInitChat,
  InitChat,
  ResumeChat,
} from './interfaces/chat.interfaces';

import { ChatTypes } from './types/chat.types';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    private readonly usersService: UsersService,
    private readonly chatMessagesService: ChatMessagesService,
  ) {}

  async createChat(chatData: Chat): Promise<ChatDocument> {
    const chat = new this.chatModel(chatData);
    return chat.save();
  }

  async findChatByQuery(
    query: FilterQuery<Chat>,
  ): Promise<ChatDocument | null> {
    return await this.chatModel.findOne(query);
  }

  async findChatsByQuery(query: FilterQuery<Chat>): Promise<ChatDocument[]> {
    return await this.chatModel.find(query);
  }

  async initializeChat(initChatDto: InitChatDto): Promise<InitChat> {
    const { recipientId, sender } = initChatDto;
    const { institution } = sender;

    const [senderInfo, receiver] = await Promise.all([
      this.usersService.findOneById(sender._id),
      this.usersService.findOneById(recipientId),
    ]);

    if (!senderInfo || !receiver) throw new NotFoundException('User not found');

    const chatInitResult = await this.createOrRetrieveChat(
      [senderInfo, receiver],
      institution,
    );

    return {
      chatId: chatInitResult.chat._id.toString(),
      chatLockedForProfessors: chatInitResult.chatLockedForProfessors,
      chatLockedForStudents: chatInitResult.chatLockedForStudents,
    };
  }

  private async createOrRetrieveChat(
    users: [User, User],
    institution: ObjectId,
  ): Promise<ChatServiceInitChat> {
    const userIds = users.map((user) => user._id.toString());

    try {
      let chat = await this.findChatByQuery({
        users: { $all: userIds, $size: users.length },
        type: 'direct',
      });

      if (!chat) {
        chat = await this.createChat({
          users: userIds,
          type: 'direct',
          initiator: users[0],
          locked: false,
        });
      }

      const recipient = users[1];
      const { chatLockedForProfessors, chatLockedForStudents } = recipient;

      if (recipient.role !== Role.Student) {
        const admins = await this.findActiveInstitutionAdmins(institution);
        const isAdmin = admins.some(
          (admin) => admin._id.toString() === recipient._id.toString(),
        );

        if (isAdmin) {
          return this.loadDiffusionChat(userIds[0], userIds[1]);
        }
      }

      return {
        chat,
        chatLockedForProfessors: chatLockedForProfessors ?? false,
        chatLockedForStudents: chatLockedForStudents ?? false,
      };
    } catch (error) {
      console.error('Failed to create or retrieve chat:', error);
      throw new Error('Error while initiating chat');
    }
  }

  async findChatBetweenUsers(
    users: [string, string],
    type: ChatTypes = 'direct',
  ): Promise<ChatDocument | null> {
    const chat = await this.chatModel.findOne({
      users: { $size: users.length, $all: [...users] },
      type,
    });

    return chat ? chat : null;
  }

  async findActiveInstitutionAdmins(institution: ObjectId): Promise<User[]> {
    const [admins, rectors] = await Promise.all([
      this.usersService.findByQuery({
        role: Role.Admin,
        status: 'active',
        institution,
      }),

      this.usersService.findByQuery({
        role: Role.Rector,
        status: 'active',
        institution,
      }),
    ]);

    return [...admins, ...rectors];
  }

  private async loadDiffusionChat(
    senderId: string,
    adminId: string,
  ): Promise<ChatServiceInitChat> {
    const diffusionChats = await this.findChatsByQuery({
      initiator: adminId,
      users: { $in: [senderId] },
    });

    const chatsWithMessages = await Promise.all(
      diffusionChats.map(async (chat) => ({
        chat,
        messages: await this.chatMessagesService.getMessagesChat(
          chat._id.toString(),
          1,
        ),
      })),
    );

    const firstChat = chatsWithMessages[0]?.chat;
    const allMessages = chatsWithMessages.flatMap((item) => item.messages);

    return {
      chat: firstChat,
      messages: allMessages,
      chatLockedForProfessors: false,
      chatLockedForStudents: false,
    };
  }

  async resumeChat(chatId: string): Promise<ResumeChat> {
    const messages = await this.chatMessagesService.getMessagesChat(chatId);

    const filesSend: ResumeChat['filesSend'] = [];
    const linksSend: ResumeChat['linksSend'] = [];

    messages.forEach(({ file, type, message, createdAt }) => {
      if (file) {
        const { name, url, size, duration } = file;
        filesSend.push({ name, url, size, duration, date: createdAt });
      }

      if (type === 'link') {
        const urls = this.extractValidUrls(message);
        urls.forEach((url) => {
          linksSend.push({ message: url, date: createdAt });
        });
      }
    });

    return { filesSend, linksSend };
  }

  private extractValidUrls(text: string): string[] {
    const urlRegex = /((http|https):\/\/|www\.)[^\s]+/g;
    const urls = text.match(urlRegex) || [];
    return urls.filter((url) => this.isValidUrl(url));
  }

  private isValidUrl(urlString: string): boolean {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  }
}
