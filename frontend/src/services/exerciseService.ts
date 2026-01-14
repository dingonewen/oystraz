/**
 * Exercise Service
 * Handles exercise logging and calorie calculations
 */

import api from './api';
import { Exercise, ApiResponse } from '../types';

export const exerciseService = {
  /**
   * Log an exercise session
   */
  logExercise: async (exercise: Omit<Exercise, 'id'>): Promise<Exercise> => {
    const response = await api.post<ApiResponse<Exercise>>(
      '/exercises',
      exercise
    );
    if (!response.data.data) {
      throw new Error('Failed to log exercise');
    }
    return response.data.data;
  },

  /**
   * Get exercise history
   */
  getExerciseHistory: async (
    startDate?: string,
    endDate?: string
  ): Promise<Exercise[]> => {
    const response = await api.get<ApiResponse<Exercise[]>>('/exercises', {
      params: { startDate, endDate },
    });
    return response.data.data || [];
  },

  /**
   * Calculate calories burned for an activity
   */
  calculateCalories: async (
    exerciseType: string,
    duration: number,
    weight: number
  ): Promise<number> => {
    const response = await api.post<ApiResponse<{ calories: number }>>(
      '/exercises/calculate',
      {
        exerciseType,
        duration,
        weight,
      }
    );
    return response.data.data?.calories || 0;
  },

  /**
   * Get list of available exercise types
   */
  getExerciseTypes: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>(
      '/exercises/types'
    );
    return response.data.data || [];
  },
};