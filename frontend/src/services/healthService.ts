/**
 * Health tracking API service (diet, exercise, sleep)
 */
import api from './api';
import { API_ENDPOINTS } from '../config/api';
import type { DietLog, ExerciseLog, SleepLog } from '../types';

// Diet API

export interface DietLogCreate {
  food_name: string;
  meal_type?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  serving_size?: number;
  serving_unit?: string;
  notes?: string;
  logged_at?: string;
}

export const createDietLog = async (data: DietLogCreate): Promise<DietLog> => {
  const response = await api.post<DietLog>(API_ENDPOINTS.diet, data);
  return response.data;
};

export const getDietLogs = async (days: number = 7): Promise<DietLog[]> => {
  const response = await api.get<DietLog[]>(`${API_ENDPOINTS.diet}?days=${days}`);
  return response.data;
};

export const deleteDietLog = async (logId: number): Promise<void> => {
  await api.delete(`${API_ENDPOINTS.diet}/${logId}`);
};

// Exercise API

export interface ExerciseLogCreate {
  activity_name: string;
  activity_type?: string;
  duration_minutes: number;
  intensity?: string;
  calories_burned?: number;
  distance?: number;
  distance_unit?: string;
  heart_rate_avg?: number;
  steps?: number;
  notes?: string;
  logged_at?: string;
}

export const createExerciseLog = async (data: ExerciseLogCreate): Promise<ExerciseLog> => {
  const response = await api.post<ExerciseLog>(API_ENDPOINTS.exercise, data);
  return response.data;
};

export const getExerciseLogs = async (days: number = 7): Promise<ExerciseLog[]> => {
  const response = await api.get<ExerciseLog[]>(`${API_ENDPOINTS.exercise}?days=${days}`);
  return response.data;
};

export const deleteExerciseLog = async (logId: number): Promise<void> => {
  await api.delete(`${API_ENDPOINTS.exercise}/${logId}`);
};

// Sleep API

export interface SleepLogCreate {
  sleep_start: string;
  sleep_end: string;
  duration_hours: number;
  quality?: string;
  quality_score?: number;
  deep_sleep_minutes?: number;
  light_sleep_minutes?: number;
  rem_sleep_minutes?: number;
  awake_minutes?: number;
  interruptions?: number;
  notes?: string;
  logged_at?: string;
}

export const createSleepLog = async (data: SleepLogCreate): Promise<SleepLog> => {
  const response = await api.post<SleepLog>(API_ENDPOINTS.sleep, data);
  return response.data;
};

export const getSleepLogs = async (days: number = 7): Promise<SleepLog[]> => {
  const response = await api.get<SleepLog[]>(`${API_ENDPOINTS.sleep}?days=${days}`);
  return response.data;
};

export const deleteSleepLog = async (logId: number): Promise<void> => {
  await api.delete(`${API_ENDPOINTS.sleep}/${logId}`);
};