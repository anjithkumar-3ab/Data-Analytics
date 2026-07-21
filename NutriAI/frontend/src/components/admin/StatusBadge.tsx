import { cn } from "../../utils";

interface StatusBadgeProps {
  status: string;
  variant?: "pill" | "dot";
}

const statusStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  Suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Admin: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  User: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Generated: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Viewed: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Regenerated: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  healthy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  degraded: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  down: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  debug: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  login: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  api_request: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  recommendation_generation: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

/** Compact status badge with color-coded styling. */
export default function StatusBadge({ status, variant = "pill" }: StatusBadgeProps) {
  const style =
    statusStyles[status] ??
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";

  if (variant === "dot") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm">
        <span
          className={cn(
            "inline-block h-2 w-2 rounded-full",
            (status === "Active" || status === "healthy" || status === "Generated") && "bg-green-500",
            status === "Inactive" && "bg-gray-400",
            (status === "Suspended" || status === "down" || status === "error") && "bg-red-500",
            (status === "degraded" || status === "warning" || status === "Regenerated") && "bg-amber-500",
            (status === "Viewed" || status === "info") && "bg-blue-500",
            status === "Admin" && "bg-indigo-500",
          )}
        />
        <span className="text-gray-600 dark:text-gray-400">{status}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
      )}
    >
      {status}
    </span>
  );
}
