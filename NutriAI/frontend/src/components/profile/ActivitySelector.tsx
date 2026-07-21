import { cn } from "../../utils";
import { Footprints } from "lucide-react";

interface ActivitySelectorProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
}

const levels = [
  { value: "Sedentary", label: "Sedentary", desc: "Little/no exercise" },
  { value: "Light", label: "Light", desc: "1-3 days/week" },
  { value: "Moderate", label: "Moderate", desc: "3-5 days/week" },
  { value: "Active", label: "Active", desc: "6-7 days/week" },
  { value: "Very Active", label: "Very Active", desc: "Athlete/2x day" },
];

export default function ActivitySelector({ value, onChange, error, disabled }: ActivitySelectorProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Activity Level <span className="text-red-500">*</span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-5">
        {levels.map((l) => (
          <button
            key={l.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(l.value)}
            className={cn(
              "flex flex-col items-center rounded-lg border-2 p-2 text-center transition-all",
              "border-gray-200 text-gray-600 hover:border-green-400 dark:border-gray-700 dark:text-gray-400",
              value === l.value && "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-300 dark:bg-green-900/30 dark:text-green-400",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <Footprints size={16} className="mb-1" />
            <span className="text-[11px] font-semibold">{l.label}</span>
            <span className="text-[9px] opacity-60">{l.desc}</span>
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </fieldset>
  );
}
