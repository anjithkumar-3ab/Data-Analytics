import { motion } from "framer-motion";
import { cn } from "../../utils";

interface StatCardProps {
  label: string;
  value: string | number;
  max?: number;
  progress?: number; // 0–100
  unit?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantColors = {
  default: "bg-green-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
};

/** Compact stat card with optional progress bar. */
export default function StatCard({
  label,
  value,
  max,
  progress,
  unit,
  variant = "default",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900",
      )}
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
        {value}
        {unit ? <span className="text-xs font-normal text-gray-500"> {unit}</span> : null}
        {max !== undefined ? (
          <span className="text-xs font-normal text-gray-400"> / {max}</span>
        ) : null}
      </p>
      {progress !== undefined && (
        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={cn("h-full rounded-full transition-all", variantColors[variant])}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}
