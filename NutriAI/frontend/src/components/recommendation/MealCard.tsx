import { motion } from "framer-motion";
import type { Meal } from "../../types/recommendation";
import FoodCard from "./FoodCard";
import { Coffee, Sun, Moon, Cookie } from "lucide-react";

const mealConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  Breakfast: { icon: Coffee, label: "Breakfast", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" },
  Lunch: { icon: Sun, label: "Lunch", color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" },
  Dinner: { icon: Moon, label: "Dinner", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
  Snack: { icon: Cookie, label: "Snack", color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20" },
};

interface MealCardProps {
  meal: Meal;
}

/** Displays a single meal with its foods and nutritional totals. */
export default function MealCard({ meal }: MealCardProps) {
  const config = mealConfig[meal.meal_type] ?? mealConfig.Snack;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Meal header */}
      <div className="mb-3 flex items-center gap-3">
        <div className={`rounded-lg p-2 ${config.color}`}>
          <Icon size={18} className="shrink-0" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {config.label}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {meal.total_calories.toFixed(0)} kcal &middot; P:{meal.total_protein.toFixed(0)}g &middot; C:{meal.total_carbohydrates.toFixed(0)}g &middot; F:{meal.total_fat.toFixed(0)}g
          </p>
        </div>
      </div>

      {/* Food items */}
      {meal.items.length === 0 ? (
        <p className="text-xs text-gray-400">No foods selected for this meal.</p>
      ) : (
        <div className="space-y-2">
          {meal.items.map((item) => (
            <FoodCard key={item.food_id} item={item} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
