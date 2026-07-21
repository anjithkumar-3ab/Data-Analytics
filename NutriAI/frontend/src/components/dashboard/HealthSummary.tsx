import { motion } from "framer-motion";
import {
  Activity,
  Dumbbell,
  Ruler,
  Target,
  Weight,
} from "lucide-react";
import { cn } from "../../utils";

interface HealthSummaryProps {
  bmi?: number;
  weight?: number;
  height?: number;
  goal?: string;
  activityLevel?: string;
}

interface HealthItem {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  unit?: string;
}

const items: HealthItem[] = [
  { key: "bmi", label: "BMI", icon: Activity, color: "text-green-600" },
  { key: "weight", label: "Weight", icon: Weight, color: "text-blue-600", unit: "kg" },
  { key: "height", label: "Height", icon: Ruler, color: "text-purple-600", unit: "cm" },
  { key: "goal", label: "Goal", icon: Target, color: "text-orange-600" },
  { key: "activityLevel", label: "Activity", icon: Dumbbell, color: "text-red-600" },
];

/** Health metrics summary card (BMI, weight, height, goal, activity level). */
export default function HealthSummary({
  bmi,
  weight,
  height,
  goal,
  activityLevel,
}: HealthSummaryProps) {
  const data: Record<string, string | number | undefined> = {
    bmi,
    weight,
    height,
    goal,
    activityLevel,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Health Summary
      </h3>
      <div className="space-y-3">
        {items.map(({ key, label, icon: Icon, color, unit }) => {
          const val = data[key];
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon size={16} className={cn("shrink-0", color)} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {label}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {val !== undefined ? `${val}${unit ? ` ${unit}` : ""}` : "--"}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
