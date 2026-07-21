import { motion } from "framer-motion";
import type { RecommendationResponse } from "../../types/recommendation";

interface MacroChartProps {
  result: RecommendationResponse;
}

/** Animated progress bars showing macro distribution (Protein/Carbs/Fat). */
export default function MacroChart({ result }: MacroChartProps) {
  const { target_protein: pro, target_carbohydrates: car, target_fat: fat } = result;
  const total = pro + car + fat || 1;

  const bars = [
    { label: "Protein", value: pro, pct: (pro / total) * 100, color: "bg-green-500" },
    { label: "Carbs", value: car, pct: (car / total) * 100, color: "bg-blue-500" },
    { label: "Fat", value: fat, pct: (fat / total) * 100, color: "bg-purple-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Macro Distribution
      </h3>
      <div className="space-y-3">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">{b.label}</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {b.value.toFixed(0)}g &middot; {b.pct.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${b.pct}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`h-full rounded-full ${b.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
