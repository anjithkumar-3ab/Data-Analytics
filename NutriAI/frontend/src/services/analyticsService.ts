/**
 * Analytics service layer.
 *
 * Aggregates data from existing APIs (recommendation history, profile)
 * to compute summaries, chart data, and health insights.
 */
import { fetchHistory } from "./recommendationService";
import type { RecommendationResponse } from "../types/recommendation";
import type {
  AnalyticsData,
  AnalyticsSummary,
  DailyCalorieEntry,
  MacroDistribution,
  BmiEntry,
  WaterEntry,
  WeeklyCalorieEntry,
  NutritionRadarEntry,
  HealthInsight,
} from "../types/analytics";

const MACRO_COLORS = {
  protein: "#22c55e",
  carbs: "#3b82f6",
  fat: "#a855f7",
};

/** Fetch all recommendation history (max 100 records) for analytics. */
async function fetchAllHistory(): Promise<RecommendationResponse[]> {
  const { recommendations } = await fetchHistory(100, 0);
  return recommendations ?? [];
}

/** Compute an analytics summary from the latest recommendation data. */
function computeSummary(
  history: RecommendationResponse[],
): AnalyticsSummary {
  const latest = history[0];
  return {
    currentBmi: latest?.bmi ?? 0,
    currentWeight: null, // Backend doesn't return weight in history
    currentCalories: latest?.daily_calories ?? 0,
    currentProtein: latest?.target_protein ?? 0,
    currentCarbs: latest?.target_carbohydrates ?? 0,
    currentFat: latest?.target_fat ?? 0,
    waterIntake: latest?.daily_plan?.recommended_water_liters ?? 0,
    mealPlansGenerated: history.length,
  };
}

/** Build daily calorie entries sorted by date ascending. */
function buildCalorieHistory(
  history: RecommendationResponse[],
): DailyCalorieEntry[] {
  return [...history]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((rec) => ({
      date: new Date(rec.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      calories: rec.daily_calories,
    }));
}

/** Build macro distribution from latest or averaged targets. */
function buildMacroDistribution(
  history: RecommendationResponse[],
): MacroDistribution[] {
  const latest = history[0];
  if (!latest) return [];
  return [
    { name: "Protein", value: latest.target_protein, color: MACRO_COLORS.protein },
    { name: "Carbs", value: latest.target_carbohydrates, color: MACRO_COLORS.carbs },
    { name: "Fat", value: latest.target_fat, color: MACRO_COLORS.fat },
  ];
}

/** Build BMI history entries from recommendation data. */
function buildBmiHistory(history: RecommendationResponse[]): BmiEntry[] {
  return [...history]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((rec) => ({
      date: new Date(rec.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      bmi: rec.bmi,
    }));
}

/** Build water intake history. */
function buildWaterHistory(history: RecommendationResponse[]): WaterEntry[] {
  return [...history]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((rec) => ({
      date: new Date(rec.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      liters: rec.daily_plan?.recommended_water_liters ?? 0,
    }));
}

/** Build weekly aggregated calorie data. */
function buildWeeklyCalories(
  history: RecommendationResponse[],
): WeeklyCalorieEntry[] {
  const weeklyMap = new Map<string, number>();
  history.forEach((rec) => {
    const d = new Date(rec.created_at);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    weeklyMap.set(key, (weeklyMap.get(key) ?? 0) + rec.daily_calories);
  });
  return Array.from(weeklyMap.entries()).map(([week, calories]) => ({
    week,
    calories,
  }));
}

/** Build radar chart data from latest recommendation targets vs actuals. */
function buildRadarData(history: RecommendationResponse[]): NutritionRadarEntry[] {
  const latest = history[0];
  if (!latest || !latest.daily_plan) return [];
  const dp = latest.daily_plan;
  return [
    {
      metric: "Protein",
      score: (dp.total_protein / (latest.target_protein || 1)) * 100,
      target: 100,
    },
    {
      metric: "Carbs",
      score: (dp.total_carbohydrates / (latest.target_carbohydrates || 1)) * 100,
      target: 100,
    },
    {
      metric: "Fat",
      score: (dp.total_fat / (latest.target_fat || 1)) * 100,
      target: 100,
    },
    {
      metric: "Calories",
      score: (dp.total_daily_calories / (latest.daily_calories || 1)) * 100,
      target: 100,
    },
    {
      metric: "Fiber",
      score: Math.min((dp.total_fiber / 30) * 100, 100),
      target: 100,
    },
  ];
}

/** Generate health insights based on trend analysis. */
function buildInsights(history: RecommendationResponse[]): HealthInsight[] {
  if (history.length < 2) {
    return [
      {
        id: "more-data",
        message: "Generate more meal plans to unlock detailed health insights.",
        severity: "info",
        icon: "📊",
      },
    ];
  }

  const insights: HealthInsight[] = [];
  const latest = history[0];

  // BMI insight
  if (latest.bmi < 18.5) {
    insights.push({ id: "bmi-low", message: "Your BMI is below normal range. Consider a balanced diet.", severity: "warning", icon: "⚖️" });
  } else if (latest.bmi > 25) {
    insights.push({ id: "bmi-high", message: "Your BMI is above normal. Focus on calorie-controlled meals.", severity: "warning", icon: "⚖️" });
  } else {
    insights.push({ id: "bmi-good", message: "Your BMI is within the healthy range!", severity: "good", icon: "✅" });
  }

  // Water insight
  if (latest.daily_plan?.recommended_water_liters < 2) {
    insights.push({ id: "water-low", message: "Water intake could be improved. Aim for 2+ liters daily.", severity: "warning", icon: "💧" });
  } else {
    insights.push({ id: "water-good", message: "Your recommended water intake is on track.", severity: "good", icon: "💧" });
  }

  // Calorie trend
  const recentCals = history.slice(0, 5).map((r) => r.daily_calories);
  const avgCal = recentCals.reduce((a, b) => a + b, 0) / recentCals.length;
  if (avgCal < 1500) {
    insights.push({ id: "cal-low", message: "Average calorie target is low. Ensure adequate nutrition.", severity: "warning", icon: "🔥" });
  } else {
    insights.push({ id: "cal-good", message: "Your calorie targets are in a healthy range.", severity: "good", icon: "🔥" });
  }

  // Meal plan consistency
  insights.push({
    id: "consistency",
    message: `You've generated ${history.length} meal plans. Keep it up!`,
    severity: history.length >= 5 ? "good" : "info",
    icon: "🎯",
  });

  return insights;
}

/** Main analytics fetch: aggregates data from all sources. */
export async function fetchAnalytics(): Promise<AnalyticsData> {
  const history = await fetchAllHistory();

  return {
    summary: computeSummary(history),
    caloriesHistory: buildCalorieHistory(history),
    macroDistribution: buildMacroDistribution(history),
    bmiHistory: buildBmiHistory(history),
    waterHistory: buildWaterHistory(history),
    weeklyCalories: buildWeeklyCalories(history),
    radarData: buildRadarData(history),
    insights: buildInsights(history),
    recommendations: history,
  };
}
