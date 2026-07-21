import { Copy, Printer, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "../common";
import type { RecommendationResponse } from "../../types/recommendation";

interface RecommendationFooterProps {
  result: RecommendationResponse;
  onRegenerate: () => void;
  onDelete: () => void;
  isRegenerating: boolean;
  isDeleting: boolean;
}

/** Action bar below the generated meal plan: copy, print, regenerate, delete. */
export default function RecommendationFooter({
  result,
  onRegenerate,
  onDelete,
  isRegenerating,
  isDeleting,
}: RecommendationFooterProps) {
  const handleCopy = () => {
    const text = `NutriAI Meal Plan\n${result.daily_calories} kcal/day\nProtein: ${result.target_protein}g | Carbs: ${result.target_carbohydrates}g | Fat: ${result.target_fat}g`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 print:hidden">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        <Copy size={14} className="mr-1.5" /> Copy
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer size={14} className="mr-1.5" /> Print
      </Button>
      <div className="flex-1" />
      <Button
        variant="secondary"
        size="sm"
        onClick={onRegenerate}
        isLoading={isRegenerating}
      >
        <RefreshCw size={14} className="mr-1.5" /> Regenerate
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        isLoading={isDeleting}
        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        <Trash2 size={14} className="mr-1.5" /> Delete
      </Button>
    </div>
  );
}
