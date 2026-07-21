/**
 * TypeScript types mirroring the FastAPI recommendation schemas.
 */

// --------------- Enums ---------------
export type Gender = "Male" | "Female";

export type ActivityLevel =
  | "Sedentary" | "Light" | "Moderate" | "Active" | "Very Active";

export type Goal =
  | "Weight Loss" | "Maintenance" | "Weight Gain";

export type FoodPreference =
  | "Vegetarian" | "Non-Vegetarian" | "Vegan";

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type BmiCategory =
  | "Underweight" | "Normal Weight" | "Overweight" | "Obese";

// --------------- Request ---------------
export interface RecommendationRequest {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activity_level: ActivityLevel;
  goal: Goal;
  food_preference: FoodPreference;
  allergies: string[];
  medical_conditions: string[];
  budget?: number;
  meals_per_day: number;
}

// --------------- Food Item ---------------
export interface MealItem {
  food_id: string;
  name: string;
  category: string;
  quantity: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

// --------------- Meal ---------------
export interface Meal {
  meal_type: MealType;
  items: MealItem[];
  total_calories: number;
  total_protein: number;
  total_carbohydrates: number;
  total_fat: number;
  total_fiber: number;
}

// --------------- Daily Plan ---------------
export interface DailyPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal;
  total_daily_calories: number;
  target_daily_calories: number;
  total_protein: number;
  target_protein: number;
  total_carbohydrates: number;
  target_carbohydrates: number;
  total_fat: number;
  target_fat: number;
  total_fiber: number;
  recommended_water_liters: number;
}

// --------------- Response ---------------
export interface RecommendationResponse {
  success: boolean;
  message: string;
  bmi: number;
  bmi_category: string;
  bmr: number;
  tdee: number;
  daily_calories: number;
  target_protein: number;
  target_carbohydrates: number;
  target_fat: number;
  daily_plan: DailyPlan;
  food_preference: FoodPreference;
  goal?: Goal;
  allergies: string[];
  medical_conditions: string[];
  recommendation_id: string | null;
  created_at: string;
}

// --------------- History ---------------
export interface HistoryResponse {
  success: boolean;
  count: number;
  recommendations: RecommendationResponse[];
  message?: string;
}

export interface SingleRecommendationResponse {
  success: boolean;
  recommendation?: RecommendationResponse;
  message?: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
