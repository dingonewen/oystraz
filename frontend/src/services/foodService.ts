/**
 * Food Service
 * Handles food search and meal logging
 */

import api from './api';
import { FoodItem, Meal, ApiResponse } from '../types';

export const foodService = {
  /**
   * Search for food items using USDA database or local RAG
   */
  searchFood: async (query: string): Promise<FoodItem[]> => {
    const response = await api.get<ApiResponse<FoodItem[]>>('/food/search', {
      params: { q: query },
    });
    return response.data.data || [];
  },

  /**
   * Get food details by ID
   */
  getFoodById: async (id: string): Promise<FoodItem> => {
    const response = await api.get<ApiResponse<FoodItem>>(`/food/${id}`);
    if (!response.data.data) {
      throw new Error('Food not found');
    }
    return response.data.data;
  },

  /**
   * Log a meal
   */
  logMeal: async (meal: Omit<Meal, 'id'>): Promise<Meal> => {
    const response = await api.post<ApiResponse<Meal>>('/meals', meal);
    if (!response.data.data) {
      throw new Error('Failed to log meal');
    }
    return response.data.data;
  },

  /**
   * Get user's meal history
   */
  getMealHistory: async (
    startDate?: string,
    endDate?: string
  ): Promise<Meal[]> => {
    const response = await api.get<ApiResponse<Meal[]>>('/meals', {
      params: { startDate, endDate },
    });
    return response.data.data || [];
  },

  /**
   * Analyze food from image using Gemini Vision
   */
  analyzeFoodImage: async (imageFile: File): Promise<FoodItem[]> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post<ApiResponse<FoodItem[]>>(
      '/food/analyze-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data || [];
  },
};