import { Calendar } from "lucide-react";
import type { TimePeriod } from "../../types/analytics";

interface AnalyticsFiltersProps {
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const PERIODS: { value: TimePeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
  { value: "1year", label: "Last Year" },
];

/** Time period filter pills for the analytics dashboard. */
export default function AnalyticsFilters({ period, onPeriodChange }: AnalyticsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Calendar size={16} className="text-gray-400" />
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onPeriodChange(p.value)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            period === p.value
              ? "bg-green-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
          aria-pressed={period === p.value}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
