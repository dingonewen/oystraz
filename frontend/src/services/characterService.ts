/**
 * Character API service
 */
import api from './api';
import { API_ENDPOINTS } from '../config/api';
import type { CharacterState } from '../types';

export interface CharacterResponse {
  id: number;
  user_id: number;
  stamina: number;
  energy: number;
  nutrition: number;
  mood: number;
  stress: number;
  level: number;
  experience: number;
  body_type: string;
  emotional_state: string;
  last_updated: string;
}

/**
 * Get user's character
 */
export const getCharacter = async (): Promise<CharacterResponse> => {
  const response = await api.get<CharacterResponse>(API_ENDPOINTS.character);
  return response.data;
};

/**
 * Update character stats
 */
export const updateCharacter = async (
  data: Partial<CharacterState>
): Promise<CharacterResponse> => {
  const response = await api.put<CharacterResponse>(API_ENDPOINTS.character, data);
  return response.data;
};