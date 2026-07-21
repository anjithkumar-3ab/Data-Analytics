import { motion } from "framer-motion";
import type { RecommendationResponse } from "../../types/recommendation";
import { Flame, Activity, Zap, Scale } from "lucide-react";

interface NutritionSummaryProps {
  result: RecommendationResponse;
}

/** Health metrics cards (BMI, BMR, TDEE, Daily Calories) displayed above meal plan. */
export default function NutritionSummary({ result }: NutritionSummaryProps) {
  const items = [
    { label: "BMI", value: result.bmi.toFixed(1), sub: result.bmi_category, icon: Scale, color: "text-green-600" },
    { label: "BMR", value: `${result.bmr.toFixed(0)} kcal`, icon: Zap, color: "text-blue-600" },
    { label: "TDEE", value: `${result.tdee.toFixed(0)} kcal`, icon: Activity, color: "text-orange-600" },
    { label: "Daily Target", value: `${result.daily_calories.toFixed(0)} kcal`, icon: Flame, color: "text-red-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-2">
              <Icon size={16} className={item.color} />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
            </div>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
            {item.sub && <p className="text-xs text-gray-400">{item.sub}</p>}
          </div>
        );
      })}
    </motion.div>
  );
}
