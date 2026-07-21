import { type ReactElement } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils";

interface QuickActionProps {
  label: string;
  icon: ReactElement;
  onClick: () => void;
  color?: "green" | "blue" | "orange" | "purple";
}

const colorMap = {
  green: "hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20",
  blue: "hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
  orange: "hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20",
  purple: "hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20",
};

/** Clickable quick-action card for dashboard shortcuts. */
export default function QuickAction({ label, icon, onClick, color = "green" }: QuickActionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900",
        colorMap[color],
      )}
    >
      <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">{icon}</div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </motion.button>
  );
}
