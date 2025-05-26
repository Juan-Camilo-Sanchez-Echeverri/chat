export interface InitChatResponse {
  chatId: string;
  chatLockedForProfessors: boolean;
  chatLockedForStudents: boolean;
  error?: string;
}
