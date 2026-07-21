import { motion } from "framer-motion";
import { Scale, Flame, Droplets, ClipboardList, Dumbbell, Apple } from "lucide-react";
import type { AnalyticsSummary } from "../../types/analytics";

interface SummaryCardsProps {
  summary: AnalyticsSummary;
}

interface CardItem {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
}

/** Grid of summary metric cards for the analytics dashboard. */
export default function SummaryCards({ summary }: SummaryCardsProps) {
  const items: CardItem[] = [
    { label: "BMI", value: summary.currentBmi.toFixed(1), icon: Scale, color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
    { label: "Daily Calories", value: `${summary.currentCalories.toFixed(0)} kcal`, icon: Flame, color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
    { label: "Protein Target", value: `${summary.currentProtein.toFixed(0)}g`, icon: Dumbbell, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    { label: "Carbs Target", value: `${summary.currentCarbs.toFixed(0)}g`, icon: Apple, color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" },
    { label: "Fat Target", value: `${summary.currentFat.toFixed(0)}g`, icon: Apple, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
    { label: "Water", value: `${summary.waterIntake.toFixed(1)}L`, icon: Droplets, color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20" },
    { label: "Plans Generated", value: String(summary.mealPlansGenerated), icon: ClipboardList, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${item.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {item.value}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
