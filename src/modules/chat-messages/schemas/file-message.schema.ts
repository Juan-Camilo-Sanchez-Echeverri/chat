import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class FileMessage {
  @Prop()
  name: string;

  @Prop()
  url: string;

  @Prop()
  size: number;

  @Prop()
  duration?: number;
}

export const FileMessageSchema = SchemaFactory.createForClass(FileMessage);
