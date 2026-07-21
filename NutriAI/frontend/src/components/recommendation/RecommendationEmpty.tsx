import { Bot, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface RecommendationEmptyProps {
  onGenerate: () => void;
}

/** Empty state displayed when no recommendation has been generated yet. */
export default function RecommendationEmpty({ onGenerate }: RecommendationEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 rounded-full bg-green-100 p-5 dark:bg-green-900/30">
        <Bot size={48} className="text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        No Recommendations Yet
      </h3>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        Fill in your preferences above and let our AI generate a personalized diet plan tailored just for you.
      </p>
      <button
        onClick={onGenerate}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
      >
        Generate My Plan <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}
