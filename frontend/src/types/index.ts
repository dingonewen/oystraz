/**
 * Core type definitions for Oystraz
 */

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  height: number; // in cm
  weight: number; // in kg
  age: number;
  gender: 'male' | 'female' | 'other';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_health';
  createdAt: string;
}

// Character health metrics
export interface CharacterState {
  stamina: number; // 0-100
  energy: number; // 0-100
  nutrition: number; // 0-100
  mood: number; // 0-100
  stress: number; // 0-100
  level: number;
  experience: number;
  bodyType: 'thin' | 'normal' | 'overweight' | 'obese';
  emotionalState: 'happy' | 'normal' | 'tired' | 'stressed' | 'angry';
}

// Meal types
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  servingSize: string;
}

export interface Meal {
  id: string;
  userId: string;
  datetime: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// Exercise types
export interface Exercise {
  id: string;
  userId: string;
  datetime: string;
  exerciseType: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
}

// Sleep types
export interface Sleep {
  id: string;
  userId: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number; // in hours
  qualityScore: number; // 0-100
}

// Workplace event types
export interface WorkEvent {
  id: string;
  eventType: string;
  title: string;
  description: string;
  availableChoices: WorkChoice[];
  characterStateBefore: CharacterState;
}

export interface WorkChoice {
  id: string;
  text: string;
  emoji: string;
  requires?: Partial<CharacterState>; // Minimum requirements
  consequences: Partial<CharacterState>; // Changes to apply
}

export interface WorkEventResult {
  eventId: string;
  choice: WorkChoice;
  stateAfter: CharacterState;
  message: string;
}

// Achievement types
export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

// AI Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Daily summary
export interface DailySummary {
  date: string;
  meals: Meal[];
  exercises: Exercise[];
  sleep?: Sleep;
  workEvents: WorkEventResult[];
  characterState: CharacterState;
  healthTrend: 'improving' | 'stable' | 'declining';
}