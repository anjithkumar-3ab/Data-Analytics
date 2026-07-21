import { Card } from "../common";

interface LoadingSkeletonProps {
  rows?: number;
  type?: "table" | "cards";
}

/** Animated skeleton loader for admin data tables and cards. */
export default function LoadingSkeleton({
  rows = 5,
  type = "table",
}: LoadingSkeletonProps) {
  if (type === "cards") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} padding="md">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-8 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-gray-600" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card padding="none">
      <div className="animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-gray-100 px-6 py-4 last:border-0 dark:border-gray-700"
          >
            <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-16 rounded bg-gray-100 dark:bg-gray-600" />
          </div>
        ))}
      </div>
    </Card>
  );
}
