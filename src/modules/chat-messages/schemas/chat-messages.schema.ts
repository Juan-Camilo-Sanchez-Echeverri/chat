import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument, Types } from 'mongoose';

import { ChatMessageType } from '../enums/chat-messages-type.enum';

import { FileMessage, FileMessageSchema } from './file-message.schema';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema({ timestamps: true, versionKey: false })
export class ChatMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true })
  chat: Types.ObjectId;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: false })
  isDiffusion: boolean;

  @Prop({ type: FileMessageSchema, default: null })
  file: FileMessage | null;

  @Prop({ enum: ChatMessageType })
  type: `${ChatMessageType}`;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
  readBy: Types.ObjectId[];

  createdAt: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

ChatMessageSchema.method('toJSON', function () {
  const { _id, read, ...rest } = this.toObject();
  void _id;
  void read;
  return rest;
});
