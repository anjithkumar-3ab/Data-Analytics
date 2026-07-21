import { Trash2, RefreshCw, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { AdminRecommendation } from "../../types/admin";

interface RecommendationTableProps {
  recommendations: AdminRecommendation[];
  onView: (rec: AdminRecommendation) => void;
  onDelete: (rec: AdminRecommendation) => void;
  onRegenerate: (rec: AdminRecommendation) => void;
}

/** Table for viewing and managing diet plan recommendations. */
export default function RecommendationTable({
  recommendations,
  onView,
  onDelete,
  onRegenerate,
}: RecommendationTableProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">ID</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">User</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Goal</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Calories</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">BMI</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {recommendations.map((rec) => (
            <tr
              key={rec._id}
              className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                {rec._id.slice(-8)}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {rec.user_email ?? "N/A"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={rec.goal} />
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">
                {rec.daily_calories.toFixed(0)}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                {rec.bmi.toFixed(1)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={rec.status} />
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {new Date(rec.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onView(rec)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onRegenerate(rec)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-800"
                    title="Regenerate"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(rec)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
                    title="Delete"
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
