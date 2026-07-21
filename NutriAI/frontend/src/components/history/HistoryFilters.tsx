import { Filter, SlidersHorizontal } from "lucide-react";
import type { FilterState, SortOption } from "../../types/history";

interface HistoryFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500";

const labelClass = "mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400";

const GOALS = ["", "Weight Loss", "Maintenance", "Weight Gain"] as const;
const PREFERENCES = ["", "Vegetarian", "Non-Vegetarian", "Vegan"] as const;
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "calories-high", label: "Calories (High-Low)" },
  { value: "calories-low", label: "Calories (Low-High)" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

/** Filter bar for date range, goal, calories, diet preference, favorites, and sort. */
export default function HistoryFilters({ filters, onChange }: HistoryFiltersProps) {
  const set = (key: keyof FilterState, value: string | boolean) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-gray-500" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filters</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Date From */}
        <div>
          <label className={labelClass}>Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set("dateFrom", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Date To */}
        <div>
          <label className={labelClass}>Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set("dateTo", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Goal */}
        <div>
          <label className={labelClass}>Goal</label>
          <select
            value={filters.goal}
            onChange={(e) => set("goal", e.target.value)}
            className={inputClass}
          >
            {GOALS.map((g) => (
              <option key={g} value={g}>
                {g || "All Goals"}
              </option>
            ))}
          </select>
        </div>

        {/* Diet Preference */}
        <div>
          <label className={labelClass}>Diet Preference</label>
          <select
            value={filters.foodPreference}
            onChange={(e) => set("foodPreference", e.target.value)}
            className={inputClass}
          >
            {PREFERENCES.map((p) => (
              <option key={p} value={p}>
                {p || "All Preferences"}
              </option>
            ))}
          </select>
        </div>

        {/* Calories Min */}
        <div>
          <label className={labelClass}>Calories Min</label>
          <input
            type="number"
            value={filters.caloriesMin}
            onChange={(e) => set("caloriesMin", e.target.value)}
            placeholder="e.g. 1500"
            className={inputClass}
          />
        </div>

        {/* Calories Max */}
        <div>
          <label className={labelClass}>Calories Max</label>
          <input
            type="number"
            value={filters.caloriesMax}
            onChange={(e) => set("caloriesMax", e.target.value)}
            placeholder="e.g. 3000"
            className={inputClass}
          />
        </div>

        {/* Sort */}
        <div>
          <label className={labelClass}>Sort By</label>
          <select
            value={filters.sort}
            onChange={(e) => set("sort", e.target.value)}
            className={inputClass}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Favorites Toggle */}
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800">
            <input
              type="checkbox"
              checked={filters.favoritesOnly}
              onChange={(e) => set("favoritesOnly", e.target.checked)}
              className="h-4 w-4 accent-green-600"
            />
            <Filter size={14} className="text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">Favorites Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
