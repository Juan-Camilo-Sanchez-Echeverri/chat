import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { FileMessage, FileMessageSchema } from './file-message.schema';
import { ChatMessageType } from '../enums/chat-messages-type.enum';

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

  @Prop({ type: FileMessageSchema })
  file: FileMessage;

  @Prop({ enum: ChatMessageType })
  type: `${ChatMessageType}`;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  readBy: Types.ObjectId[];
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

ChatMessageSchema.method('toJSON', function () {
  const { _id, read, ...rest } = this.toObject();
  void _id;
  void read;
  return rest;
});
