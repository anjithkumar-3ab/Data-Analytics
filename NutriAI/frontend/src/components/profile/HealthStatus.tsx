import { motion } from "framer-motion";
import {
  Heart,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import { cn } from "../../utils";
import type { BmiCategory, Goal } from "../../types/profile";

interface HealthStatusProps {
  bmi?: number;
  bmiCategory?: BmiCategory;
  goal?: Goal;
}

const bmiConfig: Record<BmiCategory, { color: string; bg: string; label: string }> = {
  Underweight: { color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/30", label: "Underweight" },
  "Normal Weight": { color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/30", label: "Normal Weight" },
  Overweight: { color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/30", label: "Overweight" },
  Obese: { color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/30", label: "Obese" },
};

const goalConfig: Record<Goal, { icon: React.ElementType; color: string; label: string }> = {
  "Weight Loss": { icon: TrendingDown, color: "text-orange-600", label: "Weight Loss" },
  "Weight Gain": { icon: TrendingUp, color: "text-blue-600", label: "Weight Gain" },
  "Maintain Weight": { icon: Minus, color: "text-green-600", label: "Maintain Weight" },
};

/** Color-coded health status indicators for BMI category and fitness goal. */
export default function HealthStatus({ bmi, bmiCategory, goal }: HealthStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Health Status
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* BMI indicator */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-red-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">BMI</span>
          </div>
          {bmi !== undefined && bmiCategory ? (
            <div className="mt-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bmi.toFixed(1)}</p>
              <span
                className={cn(
                  "mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                  bmiConfig[bmiCategory].bg,
                  bmiConfig[bmiCategory].color,
                )}
              >
                {bmiConfig[bmiCategory].label}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-400">Not set</p>
          )}
        </div>

        {/* Goal indicator */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-purple-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Goal</span>
          </div>
          {goal ? (
            (() => {
              const GoalIcon = goalConfig[goal].icon;
              return (
                <div className="mt-2">
                  <div className="flex items-center gap-1.5">
                    <GoalIcon size={18} className={goalConfig[goal].color} />
                    <span className={cn("text-sm font-semibold", goalConfig[goal].color)}>
                      {goalConfig[goal].label}
                    </span>
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="mt-2 text-sm text-gray-400">Not set</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
