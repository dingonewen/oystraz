/**
 * API configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Authentication
  register: '/auth/register',
  login: '/auth/login',

  // User
  userMe: '/users/me',

  // Character
  character: '/character',

  // Health Tracking
  diet: '/diet',
  exercise: '/exercise',
  sleep: '/sleep',

  // AI Assistant
  aiAdvice: '/assistant/advice',
  workplaceScenario: '/assistant/workplace-scenario',
  foodSearch: '/assistant/food-search',
  foodDetails: (fdcId: number) => `/assistant/food/${fdcId}`,
} as const;