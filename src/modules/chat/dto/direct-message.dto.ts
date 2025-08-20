import { IsMongoId } from 'class-validator';

import { ChatMessageType } from '@modules/chat-messages/enums/chat-messages-type.enum';

export class DirectMessageDto {
  @IsMongoId()
  to: string;

  @IsMongoId()
  message: string;
  file?: File;
  type: ChatMessageType;
}

export class File {
  url: string;
  name: string;
  size: number;
  duration?: number;
}
