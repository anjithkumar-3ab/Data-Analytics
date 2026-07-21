/**
 * Types for the Analytics Dashboard module.
 */
import type { RecommendationResponse } from "./recommendation";

// --------------- Time Period ---------------
export type TimePeriod = "today" | "7days" | "30days" | "3months" | "1year" | "custom";

export interface DateRange {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

// --------------- Summary ---------------
export interface AnalyticsSummary {
  currentBmi: number;
  currentWeight: number | null;
  currentCalories: number;
  currentProtein: number;
  currentCarbs: number;
  currentFat: number;
  waterIntake: number;
  mealPlansGenerated: number;
}

// --------------- Chart Data ---------------
export interface DailyCalorieEntry {
  date: string;
  calories: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface BmiEntry {
  date: string;
  bmi: number;
}

export interface MacroDistribution {
  name: string;
  value: number;
  color: string;
}

export interface WeeklyCalorieEntry {
  week: string;
  calories: number;
}

export interface WaterEntry {
  date: string;
  liters: number;
}

export interface NutritionRadarEntry {
  metric: string;
  score: number;
  target: number;
}

// --------------- Insights ---------------
export type InsightSeverity = "good" | "warning" | "info";

export interface HealthInsight {
  id: string;
  message: string;
  severity: InsightSeverity;
  icon: string; // emoji
}

// --------------- Filtered Data ---------------
export interface AnalyticsData {
  summary: AnalyticsSummary;
  caloriesHistory: DailyCalorieEntry[];
  macroDistribution: MacroDistribution[];
  bmiHistory: BmiEntry[];
  waterHistory: WaterEntry[];
  weeklyCalories: WeeklyCalorieEntry[];
  radarData: NutritionRadarEntry[];
  insights: HealthInsight[];
  recommendations: RecommendationResponse[];
}
