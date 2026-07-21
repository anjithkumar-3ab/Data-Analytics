
interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  filters: { key: string; label: string; value: string; options: FilterOption[] }[];
  onChange: (key: string, value: string) => void;
}

/** Horizontal filter bar with select dropdowns. */
export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((f) => (
        <div key={f.key} className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {f.label}
          </label>
          <select
            value={f.value}
            onChange={(e) => onChange(f.key, e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">All</option>
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
