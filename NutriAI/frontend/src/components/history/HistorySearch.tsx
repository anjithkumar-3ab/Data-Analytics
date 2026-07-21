import { Search, X } from "lucide-react";

interface HistorySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Search input for filtering history by name, goal, or diet type. */
export default function HistorySearch({
  value,
  onChange,
  placeholder = "Search by name, goal, or diet type...",
}: HistorySearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-9 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Search recommendations"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
