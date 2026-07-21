import { Clock, FileText, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  type: "plan" | "profile" | "recommendation";
  title: string;
  timestamp: string;
}

const iconMap = {
  plan: FileText,
  profile: RefreshCw,
  recommendation: FileText,
};

interface RecentActivityProps {
  activities: Activity[];
}

/** Timeline of recently generated plans & profile updates. */
export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Recent Activity
      </h3>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-400">No recent activity yet.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((item) => {
            const Icon = iconMap[item.type];
            return (
              <li key={item.id} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                  <Icon size={14} className="text-gray-500 dark:text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-700 dark:text-gray-300">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={10} />
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}
