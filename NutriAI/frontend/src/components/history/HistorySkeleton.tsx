import { motion } from "framer-motion";

/** Loading skeleton shown while history records are being fetched. */
export default function HistorySkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
      role="status"
      aria-label="Loading history..."
    >
      {/* Filter bar skeleton */}
      <div className="h-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />

      {/* Table header skeleton */}
      <div className="h-10 w-full animate-pulse rounded-t-xl bg-gray-200 dark:bg-gray-800" />

      {/* Row skeletons */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800/50"
        />
      ))}

      {/* Pagination skeleton */}
      <div className="flex justify-between pt-2">
        <div className="h-8 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>
    </motion.div>
  );
}
