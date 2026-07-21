import { motion } from "framer-motion";
import { Droplets } from "lucide-react";

interface WaterCardProps {
  waterLiters: number;
}

/** Displays the recommended daily water intake goal. */
export default function WaterCard({ waterLiters }: WaterCardProps) {
  const glasses = Math.round(waterLiters * 4); // 1 glass ≈ 250ml

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        💧 Water Goal
      </h3>
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
          <Droplets size={24} className="text-blue-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {waterLiters.toFixed(1)}L
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ~{glasses} glasses per day
          </p>
        </div>
      </div>
    </motion.div>
  );
}
