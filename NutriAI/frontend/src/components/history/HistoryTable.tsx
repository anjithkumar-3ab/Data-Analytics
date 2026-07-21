import { motion } from "framer-motion";
import { Calendar, Flame, Eye, Trash2, RefreshCw } from "lucide-react";
import type { HistoryItem } from "../../types/history";
import FavoriteButton from "./FavoriteButton";
import { Button } from "../common";

interface HistoryTableProps {
  items: HistoryItem[];
  onView: (item: HistoryItem) => void;
  onRegenerate: (item: HistoryItem) => void;
  onDelete: (item: HistoryItem) => void;
  onToggleFavorite: (item: HistoryItem) => void;
  isRegenerating: boolean;
}

/** Desktop-optimised table view for recommendation history. */
export default function HistoryTable({
  items,
  onView,
  onRegenerate,
  onDelete,
  onToggleFavorite,
  isRegenerating,
}: HistoryTableProps) {
  const headerClass =
    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400";
  const cellClass = "px-4 py-3 text-sm text-gray-700 dark:text-gray-300";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      role="table"
      aria-label="Recommendation history"
    >
      {/* Header */}
      <div className="hidden border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 lg:grid lg:grid-cols-7">
        <div className={headerClass}>Plan</div>
        <div className={headerClass}>Date</div>
        <div className={headerClass}>Goal</div>
        <div className={headerClass}>Calories</div>
        <div className={headerClass}>BMI</div>
        <div className={headerClass}>Diet</div>
        <div className={headerClass}>Actions</div>
      </div>

      {/* Rows */}
      {items.map((item, idx) => (
        <motion.div
          key={item.recommendation_id ?? idx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.03 }}
          className="border-b border-gray-100 last:border-b-0 dark:border-gray-800 lg:grid lg:grid-cols-7 lg:items-center"
        >
          {/* Name */}
          <div className={cellClass}>
            <div className="flex items-center gap-2">
              <FavoriteButton
                isFavorite={item.isFavorite}
                onClick={() => onToggleFavorite(item)}
              />
              <span className="truncate font-medium">{item.displayName}</span>
            </div>
          </div>

          {/* Date */}
          <div className={cellClass}>
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Calendar size={13} />
              {new Date(item.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Goal */}
          <div className={cellClass}>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {item.goal ?? "N/A"}
            </span>
          </div>

          {/* Calories */}
          <div className={cellClass}>
            <div className="flex items-center gap-1.5">
              <Flame size={13} className="text-red-500" />
              <span className="font-medium">
                {item.daily_calories.toFixed(0)} kcal
              </span>
            </div>
          </div>

          {/* BMI */}
          <div className={cellClass}>
            <span className="font-medium">{item.bmi.toFixed(1)}</span>
            <span className="ml-1.5 text-xs text-gray-400">
              ({item.bmi_category})
            </span>
          </div>

          {/* Diet */}
          <div className={cellClass}>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {item.food_preference}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 px-4 py-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onView(item)}
              aria-label="View recommendation"
            >
              <Eye size={14} className="mr-1" /> View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRegenerate(item)}
              isLoading={isRegenerating}
              aria-label="Regenerate recommendation"
            >
              <RefreshCw size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item)}
              className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              aria-label="Delete recommendation"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </motion.div>
      ))}

      {/* Empty rows message */}
      {items.length === 0 && (
        <div className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
          No recommendations match your filters.
        </div>
      )}
    </motion.div>
  );
}
