/**
 * Gemini AI Service
 * Handles AI chat and conversations
 */

import api from './api';
import { ChatMessage, CharacterState, ApiResponse } from '../types';

export const geminiService = {
  /**
   * Send a message to the AI coach
   */
  sendMessage: async (
    message: string,
    characterState: CharacterState,
    conversationHistory: ChatMessage[]
  ): Promise<ChatMessage> => {
    const response = await api.post<ApiResponse<ChatMessage>>('/ai/chat', {
      message,
      characterState,
      conversationHistory,
    });

    if (!response.data.data) {
      throw new Error('Failed to get AI response');
    }

    return response.data.data;
  },

  /**
   * Get health advice based on current character state
   */
  getHealthAdvice: async (
    characterState: CharacterState
  ): Promise<string> => {
    const response = await api.post<ApiResponse<{ advice: string }>>(
      '/ai/advice',
      { characterState }
    );

    return response.data.data?.advice || 'Stay healthy!';
  },

  /**
   * Get commentary on a workplace event
   */
  getEventCommentary: async (
    eventType: string,
    userChoice: string,
    consequences: Partial<CharacterState>
  ): Promise<string> => {
    const response = await api.post<ApiResponse<{ commentary: string }>>(
      '/ai/event-commentary',
      {
        eventType,
        userChoice,
        consequences,
      }
    );

    return (
      response.data.data?.commentary ||
      'Interesting choice!'
    );
  },
};