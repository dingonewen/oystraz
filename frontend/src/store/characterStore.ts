/**
 * Character State Management
 * Manages the virtual character's health metrics and state
 */

import { create } from 'zustand';
import { CharacterState } from '../types';

interface CharacterStore {
  // State
  character: CharacterState | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCharacter: (character: CharacterState) => void;
  updateMetric: (metric: keyof CharacterState, value: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetCharacter: () => void;
}

const initialCharacterState: CharacterState = {
  stamina: 50,
  energy: 50,
  nutrition: 50,
  mood: 50,
  stress: 50,
  level: 1,
  experience: 0,
  bodyType: 'normal',
  emotionalState: 'normal',
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  // Initial state
  character: initialCharacterState,
  isLoading: false,
  error: null,

  // Actions
  setCharacter: (character) => set({ character }),

  updateMetric: (metric, value) =>
    set((state) => ({
      character: state.character
        ? { ...state.character, [metric]: Math.max(0, Math.min(100, value)) }
        : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  resetCharacter: () => set({ character: initialCharacterState, error: null }),
}));