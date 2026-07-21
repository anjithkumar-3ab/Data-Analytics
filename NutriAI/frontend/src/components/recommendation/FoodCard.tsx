import type { MealItem } from "../../types/recommendation";

interface FoodCardProps {
  item: MealItem;
}

/** Single food item card with nutritional data rows. */
export default function FoodCard({ item }: FoodCardProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {item.quantity} &middot; {item.calories} kcal
          </p>
        </div>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {item.category}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[10px]">
        <div>
          <span className="font-semibold text-green-600 dark:text-green-400">{item.protein}g</span>
          <p className="text-gray-400">Protein</p>
        </div>
        <div>
          <span className="font-semibold text-blue-600 dark:text-blue-400">{item.carbohydrates}g</span>
          <p className="text-gray-400">Carbs</p>
        </div>
        <div>
          <span className="font-semibold text-purple-600 dark:text-purple-400">{item.fat}g</span>
          <p className="text-gray-400">Fat</p>
        </div>
        <div>
          <span className="font-semibold text-orange-600 dark:text-orange-400">{item.fiber}g</span>
          <p className="text-gray-400">Fiber</p>
        </div>
      </div>
    </div>
  );
}
