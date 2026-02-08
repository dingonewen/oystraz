/**
 * Audio Store
 * Manages background music state with persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioStore {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      isMuted: false,
      volume: 0.3,  // Default 30% volume

      toggleMute: () => {
        set({ isMuted: !get().isMuted });
      },

      setVolume: (volume: number) => {
        set({ volume: Math.max(0, Math.min(1, volume)) });
      },
    }),
    {
      name: 'oystraz-audio',
    }
  )
);