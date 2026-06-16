/**
 * Pearl AI Assistant Service
 */

import api from './api';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { useUserStore } from '../store/userStore';

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

/**
 * Stream Pearl's response chunk by chunk via SSE
 */
export const chatWithPearlStream = async (
  message: string,
  onChunk: (chunk: string) => void,
  conversationHistory?: any[]
): Promise<void> => {
  const token = useUserStore.getState().token;

  const response = await fetch(`${API_BASE_URL}/api${API_ENDPOINTS.pearlChatStream}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ message, conversation_history: conversationHistory }),
  });

  if (!response.ok) throw new Error(`Stream request failed: ${response.status}`);
  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    for (const line of text.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.chunk) onChunk(parsed.chunk);
      } catch {
        // ignore malformed SSE lines
      }
    }
  }
};