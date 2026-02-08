/**
 * Work Session Store
 * Persists work session state when navigating away from the Work page
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkSession {
  isActive: boolean;
  startTime: number | null;  // timestamp when work started
  workHours: number;
  workIntensity: number;
  fishCaught: number;
  totalFishGoal: number;
  hookedFish: Array<{ id: number; color: string; hookIndex: number }>;
  sealPos: { x: number; y: number };
  sealDirection: number;
}

interface WorkSessionStore {
  session: WorkSession | null;
  startSession: (workHours: number, workIntensity: number, totalFishGoal: number) => void;
  updateSession: (updates: Partial<WorkSession>) => void;
  endSession: () => void;
  getSession: () => WorkSession | null;
}

export const useWorkSessionStore = create<WorkSessionStore>()(
  persist(
    (set, get) => ({
      session: null,

      startSession: (workHours: number, workIntensity: number, totalFishGoal: number) => {
        set({
          session: {
            isActive: true,
            startTime: Date.now(),
            workHours,
            workIntensity,
            fishCaught: 0,
            totalFishGoal,
            hookedFish: [],
            sealPos: { x: 20, y: 55 },
            sealDirection: 1,
          },
        });
      },

      updateSession: (updates: Partial<WorkSession>) => {
        const current = get().session;
        if (current) {
          set({ session: { ...current, ...updates } });
        }
      },

      endSession: () => {
        set({ session: null });
      },

      getSession: () => get().session,
    }),
    {
      name: 'oystraz-work-session',
    }
  )
);