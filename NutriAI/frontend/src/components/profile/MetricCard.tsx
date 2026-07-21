import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { cn } from "../../utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: ReactElement;
  color?: "green" | "blue" | "orange" | "purple" | "red";
  subtext?: string;
}

const colors = {
  green: "border-l-green-500 dark:border-l-green-400",
  blue: "border-l-blue-500 dark:border-l-blue-400",
  orange: "border-l-orange-500 dark:border-l-orange-400",
  purple: "border-l-purple-500 dark:border-l-purple-400",
  red: "border-l-red-500 dark:border-l-red-400",
};

/** Single health metric card with left accent border. */
export default function MetricCard({
  label,
  value,
  unit,
  icon,
  color = "green",
  subtext,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 border-l-4 shadow-sm",
        "dark:border-gray-800 dark:bg-gray-900",
        colors[color],
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <span className="text-gray-400">{icon}</span>
      </div>
      <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-gray-500">{unit}</span>}
      </p>
      {subtext && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtext}</p>
      )}
    </motion.div>
  );
}
