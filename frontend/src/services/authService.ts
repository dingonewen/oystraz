/**
 * Authentication API service
 */
import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(API_ENDPOINTS.register, data);
  return response.data;
};

/**
 * Login with username and password
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  // FastAPI OAuth2 expects form data, not JSON
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);

  const response = await api.post<AuthResponse>(API_ENDPOINTS.login, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

/**
 * Get current user information
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>(API_ENDPOINTS.userMe);
  return response.data;
};

/**
 * Update user profile
 */
export const updateUser = async (data: Partial<User>): Promise<User> => {
  const response = await api.put<User>(API_ENDPOINTS.userMe, data);
  return response.data;
};