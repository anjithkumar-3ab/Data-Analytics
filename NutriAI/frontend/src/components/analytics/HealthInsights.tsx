import { motion } from "framer-motion";
import type { HealthInsight } from "../../types/analytics";

interface HealthInsightsProps {
  insights: HealthInsight[];
}

const severityStyles: Record<string, string> = {
  good: "border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  warning: "border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  info: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

export default function HealthInsights({ insights }: HealthInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        💡 Health Insights
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-lg border p-3 ${severityStyles[insight.severity]}`}
          >
            <p className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 shrink-0">{insight.icon}</span>
              <span>{insight.message}</span>
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
