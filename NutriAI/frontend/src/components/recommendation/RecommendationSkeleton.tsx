import { motion } from "framer-motion";

/** Loading skeleton shown while a recommendation is being generated. */
export default function RecommendationSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4"
      role="status"
      aria-label="Generating recommendation..."
    >
      {/* Health metrics row */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
          />
        ))}
      </div>

      {/* Meals */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
        />
      ))}
    </motion.div>
  );
}
