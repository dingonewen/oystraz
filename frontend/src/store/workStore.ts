/**
 * Work Simulation State Management
 * Manages workplace scenarios and events
 */

import { create } from 'zustand';
import { WorkEvent, WorkEventResult } from '../types';

interface WorkStore {
  // State
  currentEvent: WorkEvent | null;
  eventHistory: WorkEventResult[];
  isWorking: boolean;
  isLoading: boolean;

  // Actions
  setCurrentEvent: (event: WorkEvent | null) => void;
  addEventResult: (result: WorkEventResult) => void;
  startWork: () => void;
  endWork: () => void;
  setLoading: (isLoading: boolean) => void;
  clearHistory: () => void;
}

export const useWorkStore = create<WorkStore>((set) => ({
  // Initial state
  currentEvent: null,
  eventHistory: [],
  isWorking: false,
  isLoading: false,

  // Actions
  setCurrentEvent: (event) => set({ currentEvent: event }),

  addEventResult: (result) =>
    set((state) => ({
      eventHistory: [...state.eventHistory, result],
      currentEvent: null,
    })),

  startWork: () => set({ isWorking: true }),

  endWork: () => set({ isWorking: false, currentEvent: null }),

  setLoading: (isLoading) => set({ isLoading }),

  clearHistory: () => set({ eventHistory: [] }),
}));