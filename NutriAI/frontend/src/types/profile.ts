/**
 * TypeScript types mirroring the FastAPI HealthProfile schema.
 * Field names and enum values match the backend exactly.
 */

export type Gender = "Male" | "Female";

export type ActivityLevel =
  | "Sedentary"
  | "Light"
  | "Moderate"
  | "Active"
  | "Very Active";

export type Goal =
  | "Weight Loss"
  | "Weight Gain"
  | "Maintain Weight";

export type FoodPreference =
  | "Vegetarian"
  | "Non-Vegetarian"
  | "Vegan";

export type BmiCategory =
  | "Underweight"
  | "Normal Weight"
  | "Overweight"
  | "Obese";

/** Shape of the request payload sent to POST /profile. */
export interface HealthProfileRequest {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activity_level: ActivityLevel;
  goal: Goal;
  food_preference: FoodPreference;
  allergies?: string;
  medical_conditions?: string;
}

/** Shape of the response returned by POST /profile. */
export interface HealthProfileResponse {
  success: boolean;
  message: string;
  bmi: number;
  category: BmiCategory;
  bmr: number;
  tdee: number;
  daily_calories: number;
  id: string;
  protein: number;
  carbohydrates: number;
  fat: number;
}

/** Complete health profile for display (request + computed fields). */
export interface HealthProfile extends HealthProfileRequest {
  bmi: number;
  bmi_category: BmiCategory;
  bmr: number;
  tdee: number;
  daily_calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}
