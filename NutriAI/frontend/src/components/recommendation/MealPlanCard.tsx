import { motion } from "framer-motion";
import type { DailyPlan } from "../../types/recommendation";
import MealCard from "./MealCard";

interface MealPlanCardProps {
  plan: DailyPlan;
}

/** Displays all four meals (breakfast, lunch, dinner, snacks) of a daily plan. */
export default function MealPlanCard({ plan }: MealPlanCardProps) {
  const meals = [plan.breakfast, plan.lunch, plan.dinner, plan.snacks].filter(Boolean);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        🍽️ Daily Meal Plan
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {meals.map((meal) => (
          <MealCard key={meal.meal_type} meal={meal} />
        ))}
      </div>

      {/* Daily totals footer */}
      <div className="rounded-xl border border-gray-200 bg-linear-to-r from-green-50 to-blue-50 p-4 dark:border-gray-800 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100">
              {plan.total_daily_calories.toFixed(0)}
            </p>
            <p className="text-gray-500">kcal</p>
          </div>
          <div>
            <p className="font-bold text-green-600">{plan.total_protein.toFixed(0)}g</p>
            <p className="text-gray-500">Protein</p>
          </div>
          <div>
            <p className="font-bold text-blue-600">{plan.total_carbohydrates.toFixed(0)}g</p>
            <p className="text-gray-500">Carbs</p>
          </div>
          <div>
            <p className="font-bold text-purple-600">{plan.total_fat.toFixed(0)}g</p>
            <p className="text-gray-500">Fat</p>
          </div>
          <div>
            <p className="font-bold text-orange-600">{plan.total_fiber.toFixed(0)}g</p>
            <p className="text-gray-500">Fiber</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
