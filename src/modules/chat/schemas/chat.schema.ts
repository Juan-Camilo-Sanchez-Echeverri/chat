import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from '@modules/users/types/user.types';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true, versionKey: false })
export class Chat {
  @Prop({
    type: [{ type: String }],
    required: true,
  })
  users: string[];

  @Prop({
    type: String,
    enum: ['direct', 'diffusion', 'ia'],
    default: 'direct',
  })
  type: string;

  @Prop({ type: Boolean, default: false })
  locked: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  initiator: User;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
