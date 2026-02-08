/**
 * Pearl Store
 * Manages Pearl's activity level and interaction tracking
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PearlActivityLevel = 'calm' | 'flow' | 'tide';

interface PearlBubble {
  id: string;
  message: string;
  timestamp: number;
}

interface PearlStore {
  // Activity level
  activityLevel: PearlActivityLevel;
  setActivityLevel: (level: PearlActivityLevel) => void;

  // Input tracking for bubble triggers
  inputCount: number;
  lastInputTime: number;
  lastActivityType: string | null;
  incrementInput: (activityType: string) => void;
  resetInputCount: () => void;

  // Bubble state
  currentBubble: PearlBubble | null;
  showBubble: (message: string) => void;
  hideBubble: () => void;

  // Idle tracking
  lastActiveTime: number;
  updateActiveTime: () => void;

  // Health warnings (for calm/flow to increase frequency)
  consecutiveWorkSessions: number;
  consecutiveHighCalorie: number;
  consecutiveExercise: number;
  trackWorkSession: () => void;
  trackHighCalorie: () => void;
  trackExercise: () => void;
  resetHealthTrackers: () => void;

  // Check if should show bubble based on activity level
  shouldShowBubble: () => boolean;
}

// Get inputs needed before showing bubble based on activity level
const getInputsNeeded = (level: PearlActivityLevel): number => {
  switch (level) {
    case 'tide': return 1;
    case 'flow': return 3;
    case 'calm': return 6;
  }
};

export const usePearlStore = create<PearlStore>()(
  persist(
    (set, get) => ({
      // Default to tide (most active)
      activityLevel: 'tide',
      setActivityLevel: (level) => set({ activityLevel: level }),

      // Input tracking
      inputCount: 0,
      lastInputTime: Date.now(),
      lastActivityType: null,
      incrementInput: (activityType) => set((state) => ({
        inputCount: state.inputCount + 1,
        lastInputTime: Date.now(),
        lastActivityType: activityType,
        lastActiveTime: Date.now(),
      })),
      resetInputCount: () => set({ inputCount: 0 }),

      // Bubble state
      currentBubble: null,
      showBubble: (message) => {
        const bubble = {
          id: `bubble-${Date.now()}`,
          message,
          timestamp: Date.now(),
        };
        set({ currentBubble: bubble });
        // Auto-hide after 4 seconds
        setTimeout(() => {
          const current = get().currentBubble;
          if (current?.id === bubble.id) {
            set({ currentBubble: null });
          }
        }, 4000);
      },
      hideBubble: () => set({ currentBubble: null }),

      // Idle tracking
      lastActiveTime: Date.now(),
      updateActiveTime: () => set({ lastActiveTime: Date.now() }),

      // Health warnings
      consecutiveWorkSessions: 0,
      consecutiveHighCalorie: 0,
      consecutiveExercise: 0,
      trackWorkSession: () => set((state) => ({
        consecutiveWorkSessions: state.consecutiveWorkSessions + 1,
      })),
      trackHighCalorie: () => set((state) => ({
        consecutiveHighCalorie: state.consecutiveHighCalorie + 1,
      })),
      trackExercise: () => set((state) => ({
        consecutiveExercise: state.consecutiveExercise + 1,
      })),
      resetHealthTrackers: () => set({
        consecutiveWorkSessions: 0,
        consecutiveHighCalorie: 0,
        consecutiveExercise: 0,
      }),

      // Check if should show bubble
      shouldShowBubble: () => {
        const state = get();
        const inputsNeeded = getInputsNeeded(state.activityLevel);

        // For calm/flow, increase frequency if health concerns
        let adjustedInputsNeeded = inputsNeeded;
        if (state.activityLevel !== 'tide') {
          if (state.consecutiveWorkSessions >= 3) adjustedInputsNeeded = Math.max(1, adjustedInputsNeeded - 2);
          if (state.consecutiveHighCalorie >= 3) adjustedInputsNeeded = Math.max(1, adjustedInputsNeeded - 1);
          if (state.consecutiveExercise >= 4) adjustedInputsNeeded = Math.max(1, adjustedInputsNeeded - 1);
        }

        return state.inputCount >= adjustedInputsNeeded;
      },
    }),
    {
      name: 'oystraz-pearl',
      partialize: (state) => ({
        activityLevel: state.activityLevel,
        lastActiveTime: state.lastActiveTime,
      }),
    }
  )
);