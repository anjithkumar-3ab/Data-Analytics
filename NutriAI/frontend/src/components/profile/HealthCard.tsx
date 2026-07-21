import { motion } from "framer-motion";
import {
  Activity,
  Scale,
  Ruler,
  Target,
  Footprints,
  Apple,
} from "lucide-react";
import { cn } from "../../utils";
import type { HealthProfile } from "../../types/profile";

interface HealthCardProps {
  profile: HealthProfile | null;
  isLoading?: boolean;
}

/** Displays the complete health metrics summary after profile is saved. */
export default function HealthCard({ profile, isLoading }: HealthCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 animate-pulse space-y-4">
        <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const metrics = [
    { label: "BMI", value: profile.bmi.toFixed(1), sub: profile.bmi_category, icon: Activity, color: "text-green-600" },
    { label: "Weight", value: `${profile.weight} kg`, icon: Scale, color: "text-blue-600" },
    { label: "Height", value: `${profile.height} cm`, icon: Ruler, color: "text-purple-600" },
    { label: "Goal", value: profile.goal, icon: Target, color: "text-orange-600" },
    { label: "Activity", value: profile.activity_level, icon: Footprints, color: "text-red-600" },
    { label: "Diet", value: profile.food_preference, icon: Apple, color: "text-green-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Health Metrics
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <Icon size={20} className={cn("shrink-0", m.color)} />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{m.label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {m.value}
                </p>
                {m.sub && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{m.sub}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
