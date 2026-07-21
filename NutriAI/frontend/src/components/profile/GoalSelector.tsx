import { cn } from "../../utils";
import { Target } from "lucide-react";

/**
 * Selector for fitness goal: Weight Loss / Weight Gain / Maintain Weight.
 * Accepts RHF register props for full integration with the parent form.
 */
interface GoalSelectorProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
}

const goals = [
  {
    value: "Weight Loss",
    label: "Weight Loss",
    desc: "Caloric deficit",
    color: "border-orange-400 text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
    activeColor: "border-orange-500 bg-orange-100 ring-2 ring-orange-300 dark:bg-orange-900/40",
  },
  {
    value: "Weight Gain",
    label: "Weight Gain",
    desc: "Caloric surplus",
    color: "border-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    activeColor: "border-blue-500 bg-blue-100 ring-2 ring-blue-300 dark:bg-blue-900/40",
  },
  {
    value: "Maintain Weight",
    label: "Maintain",
    desc: "Balance",
    color: "border-green-400 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    activeColor: "border-green-500 bg-green-100 ring-2 ring-green-300 dark:bg-green-900/40",
  },
];

export default function GoalSelector({ value, onChange, error, disabled }: GoalSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Fitness Goal <span className="text-red-500">*</span>
      </legend>
      <div className="grid grid-cols-3 gap-2">
        {goals.map((g) => (
          <button
            key={g.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(g.value)}
            className={cn(
              "flex flex-col items-center rounded-lg border-2 p-3 text-center transition-all",
              g.color,
              value === g.value && g.activeColor,
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <Target size={18} className="mb-1" />
            <span className="text-xs font-semibold">{g.label}</span>
            <span className="text-[10px] opacity-70">{g.desc}</span>
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </fieldset>
  );
}
