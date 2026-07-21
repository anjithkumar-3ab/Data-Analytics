import { type ReactElement } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number; // positive = up, negative = down
  icon: ReactElement;
  color?: "green" | "blue" | "orange" | "purple" | "red";
  isLoading?: boolean;
}

const colorMap = {
  green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

/** KPI metric card with icon, trend arrow, and loading skeleton. */
export default function KPICard({
  title,
  value,
  unit,
  trend,
  icon,
  color = "green",
  isLoading = false,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
              {unit && (
                <span className="ml-1 text-sm font-normal text-gray-500">
                  {unit}
                </span>
              )}
            </p>
          )}
          {trend !== undefined && trend !== 0 && (
            <div className="flex items-center gap-1 text-xs">
              {trend > 0 ? (
                <TrendingUp size={14} className="text-green-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span
                className={
                  trend > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
              <span className="text-gray-400">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", colorMap[color])}>{icon}</div>
      </div>
    </motion.div>
  );
}
