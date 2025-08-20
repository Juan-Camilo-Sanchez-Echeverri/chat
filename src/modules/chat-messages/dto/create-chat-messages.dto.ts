import { ChatMessageType } from '../enums/chat-messages-type.enum';
import { FileMessage } from '../schemas/file-message.schema';

export class CreateChatMessagesDto {
  chat: string;
  user: string;
  message: string;
  file: FileMessage | null = null;
  type: `${ChatMessageType}`;
}
