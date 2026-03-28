/**
 * Represents a single chat message in the conversation
 */
export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * Request payload sent to the backend API
 */
export interface ChatRequest {
  message: string;
}

/**
 * Response received from the backend API
 */
export interface ChatResponse {
  response: string;
  timestamp: number;
}
