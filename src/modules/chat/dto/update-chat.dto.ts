import { PartialType } from '@nestjs/mapped-types';
import { InitChatDto } from './init-chat.dto';

export class UpdateChatDto extends PartialType(InitChatDto) {
  id: number;
}
