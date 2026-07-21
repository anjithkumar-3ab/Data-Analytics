import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Activity, Zap, Scale } from "lucide-react";
import type { RecommendationResponse } from "../../types/recommendation";
import { Button } from "../common";

interface RecommendationPreviewProps {
  open: boolean;
  onClose: () => void;
  result: RecommendationResponse | null;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

/** Side-panel preview of a recommendation's nutrition summary and meal overview. */
export default function RecommendationPreview({
  open,
  onClose,
  result,
  onRegenerate,
  isRegenerating,
}: RecommendationPreviewProps) {
  if (!result) return null;

  const metrics = [
    { label: "BMI", value: result.bmi.toFixed(1), sub: result.bmi_category, icon: Scale, color: "text-green-600" },
    { label: "BMR", value: `${result.bmr.toFixed(0)} kcal`, icon: Zap, color: "text-blue-600" },
    { label: "TDEE", value: `${result.tdee.toFixed(0)} kcal`, icon: Activity, color: "text-orange-600" },
    { label: "Daily Target", value: `${result.daily_calories.toFixed(0)} kcal`, icon: Flame, color: "text-red-600" },
  ];

  const meals = [
    { label: "Breakfast", meal: result.daily_plan.breakfast },
    { label: "Lunch", meal: result.daily_plan.lunch },
    { label: "Dinner", meal: result.daily_plan.dinner },
    { label: "Snacks", meal: result.daily_plan.snacks },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
              <h2 id="preview-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                📋 Plan Preview
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Quick metrics */}
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.label}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon size={14} className={m.color} />
                        <span className="text-xs text-gray-500">{m.label}</span>
                      </div>
                      <p className="mt-1 text-base font-bold text-gray-900 dark:text-gray-100">
                        {m.value}
                      </p>
                      {m.sub && <p className="text-xs text-gray-400">{m.sub}</p>}
                    </div>
                  );
                })}
              </div>

              {/* Water */}
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  💧 Water Goal: {result.daily_plan.recommended_water_liters.toFixed(1)}L
                </p>
              </div>

              {/* Meal overview */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Meal Summary
                </h3>
                <div className="space-y-2">
                  {meals.map(({ label, meal }) => (
                    <div
                      key={label}
                      className="rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {meal.total_calories.toFixed(0)} kcal
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {meal.items.slice(0, 4).map((item) => (
                          <span
                            key={item.food_id}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          >
                            {item.name}
                          </span>
                        ))}
                        {meal.items.length > 4 && (
                          <span className="text-[10px] text-gray-400">
                            +{meal.items.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRegenerate}
                  isLoading={isRegenerating}
                  className="flex-1"
                >
                  🔄 Regenerate
                </Button>
                <Button size="sm" variant="primary" onClick={onClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
