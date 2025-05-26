import { ChatMessage } from '../../chat-messages/schemas/chat-messages.schema';
import { ChatDocument } from '../schemas/chat.schema';

export interface ChatServiceInitChat {
  chatLockedForProfessors: boolean;
  chatLockedForStudents: boolean;
  chat: ChatDocument;
  messages?: ChatMessage[];
}

export interface InitChat {
  chatId: string;
  chatLockedForProfessors: boolean;
  chatLockedForStudents: boolean;
}

interface ResumeChatFile {
  name: string;
  url: string;
  size: number;
  duration?: number;
  date: Date;
}

interface ResumeChatLink {
  message: string;
  date: Date;
}

export interface ResumeChat {
  filesSend: ResumeChatFile[];
  linksSend: ResumeChatLink[];
}
