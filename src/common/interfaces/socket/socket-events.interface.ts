import { User } from '@modules/users/types/user.types';

import { ChatMessage } from '@modules/chat-messages/schemas/chat-messages.schema';
import { ResumeChat } from '@modules/chat/interfaces/chat.interfaces';

import { InitChatResponse } from './socket-response.interface';

export interface ClientToServerEvents {
  'init-chat': (to: string) => void;
  'direct-message': (message: string) => void;
}

export interface ServerToClientEvents {
  'init-chat': (response: InitChatResponse) => void;
  'messages-chat': (response: ChatMessage[]) => void;
  'resume-chat': (response: ResumeChat) => void;
  'init-chat-error': (error: { message: string }) => void;
  'direct-message': (error?: { message: string }) => void;
}

export interface SocketData {
  user: User;
}

export interface SocketErrorEvent {
  event: keyof ServerToClientEvents;
  message: string;
}
