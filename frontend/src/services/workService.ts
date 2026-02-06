/**
 * Work Service
 * API calls for work session tracking
 * Backend handles metric calculations using health_calculator
 */

import api from './api';

export interface WorkLogData {
  duration_hours: number;
  intensity: number;
  pranked_boss: number;
  notes?: string;
  // These fields are ignored by backend (it calculates them)
  energy_cost?: number;
  stress_gain?: number;
  experience_gain?: number;
}

export interface WorkLog {
  id: number;
  user_id: number;
  duration_hours: number;
  intensity: number;
  energy_cost: number;
  stress_gain: number;
  stamina_cost: number;
  experience_gain: number;
  pranked_boss: number;
  notes?: string;
  logged_at: string;
  created_at: string;
}

export interface WorkStats {
  total_hours: number;
  total_sessions: number;
  avg_intensity: number;
  total_pranks: number;
  total_stress_gained: number;
}

export const logWork = async (workData: WorkLogData): Promise<WorkLog> => {
  // Backend only needs duration, intensity, pranked_boss, and notes
  const response = await api.post('/work/log', {
    duration_hours: workData.duration_hours,
    intensity: workData.intensity,
    pranked_boss: workData.pranked_boss,
    notes: workData.notes,
  });
  return response.data;
};

export const getWorkLogs = async (days: number = 7): Promise<WorkLog[]> => {
  const response = await api.get(`/work/logs?days=${days}`);
  return response.data;
};

export const getWorkStats = async (days: number = 7): Promise<WorkStats> => {
  const response = await api.get(`/work/stats?days=${days}`);
  return response.data;
};

export const deleteWorkLog = async (logId: number): Promise<void> => {
  await api.delete(`/work/log/${logId}`);
};