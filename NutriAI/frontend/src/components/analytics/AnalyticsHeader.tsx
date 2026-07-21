import { BarChart3 } from "lucide-react";
import type { TimePeriod } from "../../types/analytics";
import AnalyticsFilters from "./AnalyticsFilters";

interface AnalyticsHeaderProps {
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

/** Page header with title and time period filter. */
export default function AnalyticsHeader({ period, onPeriodChange }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
          <BarChart3 size={22} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your nutrition & health trends
          </p>
        </div>
      </div>
      <AnalyticsFilters period={period} onPeriodChange={onPeriodChange} />
    </div>
  );
}
