import { Injectable } from '@nestjs/common';

import { WsException } from '@nestjs/websockets';

import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ObjectId } from '@common/types/mongo.types';
import { Role } from '@common/enums';

import { InitChatDto } from './dto/init-chat.dto';

import { ChatMessagesService } from '../chat-messages/chat-messages.service';
import { UsersService } from '../users/users.service';

import { Chat, ChatDocument } from './schemas/chat.schema';
import { User } from '../users/types/user.types';

interface ChatServiceInitChat {
  chatLockedForProfessors: boolean;
  chatLockedForStudents: boolean;
  chat: ChatDocument;
  messages?: any[];
}

export interface InitChat {
  chatId: string;
  chatLockedForProfessors: boolean;
  chatLockedForStudents: boolean;
  messages?: any;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private readonly usersService: UsersService,
    private readonly chatMessagesService: ChatMessagesService,
  ) {}

  async findOneByQuery(query: FilterQuery<Chat>): Promise<ChatDocument | null> {
    return await this.chatModel.findOne(query);
  }

  async findByQuery(query: FilterQuery<Chat>): Promise<ChatDocument[]> {
    return await this.chatModel.find(query);
  }

  async initChat(initChatDto: InitChatDto): Promise<InitChat> {
    const { to, user } = initChatDto;
    const { _id, institution } = user;

    const [userFrom, userTo] = await Promise.all([
      this.usersService.findOneById(_id),
      this.usersService.findOneById(to),
    ]);

    if (!userFrom || !userTo) throw new WsException('User not found');

    const chatData = await this.initiateChat([_id, to], institution);

    return {
      chatId: chatData.chat._id.toString(),
      chatLockedForProfessors: chatData.chatLockedForProfessors,
      chatLockedForStudents: chatData.chatLockedForStudents,
      messages: chatData.messages,
    };
  }

  async initiateChat(
    users: [string, string],
    institution: ObjectId,
  ): Promise<ChatServiceInitChat> {
    try {
      const chat =
        (await this.findOneByQuery({
          users: { $size: users.length, $all: [...users] },
          type: 'direct',
        })) ||
        (await this.chatModel.create({
          users,
          initiator: users[0],
          type: 'direct',
        }));

      const userTo = await this.usersService.findOneById(users[1]);
      if (!userTo) throw new WsException('User not found');

      const { chatLockedForProfessors, chatLockedForStudents, role } = userTo;

      if (role !== Role.Student) {
        const administrative = await this.getAdministrativeUsers(institution);
        const isAdministrative = administrative.some(
          (admin) => String(admin._id) === String(users[1]),
        );
        if (isAdministrative) return this.getDiffusionChat(users[0], users[1]);
      }

      const messages = await this.chatMessagesService.getMessagesChat(chat._id);

      const result: ChatServiceInitChat = {
        chatLockedForProfessors: chatLockedForProfessors ?? false,
        chatLockedForStudents: chatLockedForStudents ?? false,
        chat,
        messages,
      };

      return result;
    } catch (error) {
      console.log('error al iniciar chat', error);
      throw new WsException('Error al iniciar chat');
    }
  }

  async getMessagesChat(chatId: ObjectId) {
    return await this.chatMessagesService.getMessagesChat(chatId);
  }

  async getAdministrativeUsers(institution: ObjectId): Promise<User[]> {
    const rectors = await this.usersService.findByQuery({
      role: 'rector',
      status: 'active',
      institution,
    });

    const admins = await this.usersService.findByQuery({
      role: 'admin',
      status: 'active',
      institution,
    });

    return [...admins, ...rectors];
  }

  async getDiffusionChat(
    userFrom: string,
    userTo: string,
  ): Promise<ChatServiceInitChat> {
    const diffusionChats = await this.findByQuery({
      initiator: userTo,
      users: { $in: [userFrom] },
    });

    const result = await Promise.all(
      diffusionChats.map(async (chat) => {
        const messages = await this.chatMessagesService.getMessagesChat(
          chat._id,
        );
        return { chat, messages };
      }),
    );

    const chat = result.map((item) => item.chat)[0];
    const messages = result.map((item) => item.messages).flat();

    return {
      chat,
      messages,
      chatLockedForProfessors: false,
      chatLockedForStudents: false,
    };
  }
}
