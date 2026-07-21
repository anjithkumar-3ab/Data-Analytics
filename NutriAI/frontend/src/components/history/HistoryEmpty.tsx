import { motion } from "framer-motion";
import { ClipboardList, Sparkles } from "lucide-react";
import { Button } from "../common";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

/** Empty state displayed when no recommendations exist in history. */
export default function HistoryEmpty() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 rounded-full bg-blue-100 p-5 dark:bg-blue-900/30">
        <ClipboardList size={48} className="text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        No Recommendations Yet
      </h3>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        Your generated meal plans will appear here. Start by creating your first
        personalized diet plan.
      </p>
      <Button
        onClick={() => navigate(ROUTES.RECOMMENDATION)}
        className="mt-6"
        size="lg"
      >
        <Sparkles size={16} className="mr-2" />
        Generate Your First Plan
      </Button>
    </motion.div>
  );
}
