export class CreateChatMessagesDto {
  chat: string;
  user: string;
  message: string;
  read: boolean;
  isDiffusion: boolean;
  readBy: string[];
}
