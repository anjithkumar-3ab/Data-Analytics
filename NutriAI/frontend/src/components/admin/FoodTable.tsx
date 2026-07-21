import { Edit, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { AdminFood } from "../../types/admin";

interface FoodTableProps {
  foods: AdminFood[];
  onEdit: (food: AdminFood) => void;
  onDelete: (food: AdminFood) => void;
}

/** Table for browsing and managing the food database. */
export default function FoodTable({ foods, onEdit, onDelete }: FoodTableProps) {
  if (foods.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Category</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Meal Type</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Calories</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Protein</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Carbs</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Fat</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {foods.map((food) => (
            <tr
              key={food._id}
              className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                {food.name}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={food.category} />
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {food.meal_type}
              </td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-mono text-xs">
                {food.calories.toFixed(0)}
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">
                {food.protein.toFixed(1)}g
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">
                {food.carbohydrates.toFixed(1)}g
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">
                {food.fat.toFixed(1)}g
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(food)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-800"
                    title="Edit food"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(food)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
                    title="Delete food"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
