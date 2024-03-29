// src/app/models/chat-message.model.ts
export interface ChatMessage {
  type: string;
  author: string;
  content: string;
  timestamp: string; // Or Date, depending on how you handle dates
}
