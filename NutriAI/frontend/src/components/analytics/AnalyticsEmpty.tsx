import { motion } from "framer-motion";
import { BarChart3, Sparkles } from "lucide-react";
import { Button } from "../common";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

/** Empty state shown when no analytics data is available. */
export default function AnalyticsEmpty() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 rounded-full bg-indigo-100 p-5 dark:bg-indigo-900/30">
        <BarChart3 size={48} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        No Analytics Data Yet
      </h3>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        Generate your first meal plan to unlock nutrition insights, trend
        charts, and health recommendations.
      </p>
      <Button
        onClick={() => navigate(ROUTES.RECOMMENDATION)}
        className="mt-6"
        size="lg"
      >
        <Sparkles size={16} className="mr-2" />
        Generate First Recommendation
      </Button>
    </motion.div>
  );
}
