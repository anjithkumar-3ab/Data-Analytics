import { User, Edit2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCardProps {
  name: string;
  email: string;
  avatar?: string;
  bmi?: number;
  bmr?: number;
  tdee?: number;
}

/** User profile summary card displayed on the dashboard. */
export default function ProfileCard({
  name,
  email,
  avatar,
  bmi,
  bmr,
  tdee,
}: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <User size={28} />
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
          </div>
        </div>
        <button
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          title="Edit profile"
        >
          <Edit2 size={16} />
        </button>
      </div>

      {(bmi !== undefined || bmr !== undefined || tdee !== undefined) && (
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          {bmi !== undefined && (
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{bmi.toFixed(1)}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">BMI</p>
            </div>
          )}
          {bmr !== undefined && (
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{bmr.toFixed(0)}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                BMR <span className="lowercase">kcal</span>
              </p>
            </div>
          )}
          {tdee !== undefined && (
            <div className="text-center">
              <p className="text-lg font-bold text-orange-600">{tdee.toFixed(0)}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                TDEE <span className="lowercase">kcal</span>
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
