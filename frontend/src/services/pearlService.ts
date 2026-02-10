/**
 * Pearl AI Assistant Service
 */

import api from './api';
import { API_ENDPOINTS } from '../config/api';

interface PearlChatRequest {
  message: string;
  conversation_history?: any[];
}

interface PearlChatResponse {
  response: string;
}

/**
 * Send a message to Pearl AI assistant
 */
export const chatWithPearl = async (
  message: string,
  conversationHistory?: any[]
): Promise<string> => {
  const response = await api.post<PearlChatResponse>(
    API_ENDPOINTS.pearlChat,
    {
      message,
      conversation_history: conversationHistory,
    } as PearlChatRequest
  );

  return response.data.response;
};