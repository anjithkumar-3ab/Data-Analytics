import { Sparkles, Clock } from "lucide-react";
import type { RecommendationResponse } from "../../types/recommendation";

interface RecommendationHeaderProps {
  result: RecommendationResponse;
}

/** Header bar showing generation time and food preference summary. */
export default function RecommendationHeader({ result }: RecommendationHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
          <Sparkles size={20} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            AI-Generated Plan
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {result.food_preference} diet &middot; {result.daily_calories} kcal/day
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Clock size={14} />
        <span>{new Date(result.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}
