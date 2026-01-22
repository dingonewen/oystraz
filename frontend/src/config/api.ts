/**
 * API configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Authentication
  register: '/api/auth/register',
  login: '/api/auth/login',

  // User
  userMe: '/api/users/me',

  // Character
  character: '/api/character',

  // Health Tracking
  diet: '/api/diet',
  exercise: '/api/exercise',
  sleep: '/api/sleep',

  // AI Assistant
  aiAdvice: '/api/assistant/advice',
  workplaceScenario: '/api/assistant/workplace-scenario',
  foodSearch: '/api/assistant/food-search',
  foodDetails: (fdcId: number) => `/api/assistant/food/${fdcId}`,
} as const;