import { motion } from "framer-motion";
import { Calendar, Flame, Activity, Eye, Trash2, RefreshCw } from "lucide-react";
import type { HistoryItem } from "../../types/history";
import FavoriteButton from "./FavoriteButton";
import { Button } from "../common";

interface HistoryCardProps {
  item: HistoryItem;
  onView: (item: HistoryItem) => void;
  onRegenerate: (item: HistoryItem) => void;
  onDelete: (item: HistoryItem) => void;
  onToggleFavorite: (item: HistoryItem) => void;
  isRegenerating: boolean;
}

/** Mobile-optimized card view for a single recommendation history item. */
export default function HistoryCard({
  item,
  onView,
  onRegenerate,
  onDelete,
  onToggleFavorite,
  isRegenerating,
}: HistoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {item.displayName}
          </h4>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <span>
              {new Date(item.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <FavoriteButton
          isFavorite={item.isFavorite}
          onClick={() => onToggleFavorite(item)}
        />
      </div>

      {/* Quick stats */}
      <div className="mb-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-red-50 py-1.5 dark:bg-red-900/20">
          <Flame size={12} className="mx-auto mb-0.5 text-red-500" />
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {item.daily_calories.toFixed(0)}
          </p>
          <p className="text-gray-400">kcal</p>
        </div>
        <div className="rounded-lg bg-blue-50 py-1.5 dark:bg-blue-900/20">
          <Activity size={12} className="mx-auto mb-0.5 text-blue-500" />
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {item.bmi.toFixed(1)}
          </p>
          <p className="text-gray-400">BMI</p>
        </div>
        <div className="rounded-lg bg-green-50 py-1.5 dark:bg-green-900/20">
          <span className="mx-auto mb-0.5 block text-[10px] font-bold text-green-600">
            {item.food_preference?.slice(0, 4).toUpperCase()}
          </span>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {item.goal}
          </p>
          <p className="text-gray-400">Goal</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="sm" variant="primary" className="flex-1" onClick={() => onView(item)}>
          <Eye size={14} className="mr-1" /> View
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onRegenerate(item)}
          isLoading={isRegenerating}
        >
          <RefreshCw size={14} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(item)}
          className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </motion.div>
  );
}
