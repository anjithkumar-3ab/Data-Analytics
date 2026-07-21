import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import type { NutritionRadarEntry } from "../../types/analytics";

interface NutritionRadarChartProps {
  data: NutritionRadarEntry[];
}

/** Radar chart showing nutrition score across key metrics vs targets. */
export default function NutritionRadarChart({ data }: NutritionRadarChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900">
        No nutrition score data yet.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        🎯 Nutrition Score
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#6b7280" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
            formatter={(val: unknown) => `${Number(val).toFixed(0)}%`}
          />
          <Radar name="Score" dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
          <Radar name="Target" dataKey="target" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
