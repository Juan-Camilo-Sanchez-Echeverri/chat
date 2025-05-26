import { User } from '@modules/users/types/user.types';

export class InitChatDto {
  recipientId: string;

  sender: User;
}
