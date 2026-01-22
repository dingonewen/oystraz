/**
 * AI Assistant API service
 */
import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface HealthAdviceRequest {
  query?: string;
  days?: number;
}

export interface HealthAdviceResponse {
  advice: string;
}

export interface WorkplaceScenarioResponse {
  event_type: string;
  description: string;
  outcome: string;
}

export interface FoodSearchRequest {
  query: string;
  page_size?: number;
}

export interface FoodSearchResponse {
  foods: Array<{
    fdcId: number;
    description: string;
    dataType: string;
  }>;
}

export interface FoodDetailsResponse {
  food: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

/**
 * Get personalized health advice from Gemini AI
 */
export const getHealthAdvice = async (
  request: HealthAdviceRequest = {}
): Promise<HealthAdviceResponse> => {
  const response = await api.post<HealthAdviceResponse>(
    API_ENDPOINTS.aiAdvice,
    request
  );
  return response.data;
};

/**
 * Generate a workplace scenario based on current health state
 */
export const generateWorkplaceScenario = async (): Promise<WorkplaceScenarioResponse> => {
  const response = await api.post<WorkplaceScenarioResponse>(
    API_ENDPOINTS.workplaceScenario
  );
  return response.data;
};

/**
 * Search for foods in USDA database
 */
export const searchFoods = async (
  request: FoodSearchRequest
): Promise<FoodSearchResponse> => {
  const response = await api.post<FoodSearchResponse>(
    API_ENDPOINTS.foodSearch,
    request
  );
  return response.data;
};

/**
 * Get detailed nutrition information for a food
 */
export const getFoodDetails = async (fdcId: number): Promise<FoodDetailsResponse> => {
  const response = await api.get<FoodDetailsResponse>(
    API_ENDPOINTS.foodDetails(fdcId)
  );
  return response.data;
};