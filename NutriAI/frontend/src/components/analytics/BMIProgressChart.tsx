import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { BmiEntry } from "../../types/analytics";

interface BMIProgressChartProps {
  data: BmiEntry[];
}

/** Line chart tracking BMI over time with healthy range reference lines. */
export default function BMIProgressChart({ data }: BMIProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900">
        No BMI data yet.
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
        ⚖️ BMI Progress
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} domain={["dataMin - 2", "dataMax + 2"]} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
          />
          <ReferenceLine y={18.5} stroke="#f59e0b" strokeDasharray="4 4" label="" />
          <ReferenceLine y={25} stroke="#f59e0b" strokeDasharray="4 4" label="" />
          <Line
            type="monotone"
            dataKey="bmi"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4, fill: "#6366f1" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
