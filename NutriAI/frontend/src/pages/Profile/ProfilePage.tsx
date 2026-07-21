import { useState } from "react";
import { DashboardLayout } from "../../components/layout";
import { ProfileForm } from "../../components/profile";
import {
  HealthCard,
  HealthStatus,
  MetricCard,
} from "../../components/profile";
import type { HealthProfile } from "../../types/profile";
import {
  Flame,
  Dumbbell,
  Apple,
  Droplets,
  Scale,
  Zap,
} from "lucide-react";

/** Full health profile page: form on the left, live metrics on the right. */
export default function ProfilePage() {
  const [profile, setProfile] = useState<HealthProfile | null>(null);

  const handleProfileSaved = (p: HealthProfile) => {
    setProfile(p);
  };

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        👤 Health Profile
      </h1>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: Form */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              {profile ? "Update Your Profile" : "Create Your Profile"}
            </h2>
            <ProfileForm onProfileSaved={handleProfileSaved} />
          </div>
        </div>

        {/* Right: Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Status indicators */}
          <HealthStatus
            bmi={profile?.bmi}
            bmiCategory={profile?.bmi_category}
            goal={profile?.goal}
          />

          {/* Computed metrics from backend */}
          {profile && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard
                  label="Daily Calories"
                  value={profile.daily_calories.toFixed(0)}
                  unit="kcal"
                  icon={<Flame size={16} />}
                  color="orange"
                  subtext="Based on TDEE + goal"
                />
                <MetricCard
                  label="BMR"
                  value={profile.bmr.toFixed(0)}
                  unit="kcal"
                  icon={<Zap size={16} />}
                  color="blue"
                  subtext="Basal metabolic rate"
                />
                <MetricCard
                  label="TDEE"
                  value={profile.tdee.toFixed(0)}
                  unit="kcal"
                  icon={<Scale size={16} />}
                  color="purple"
                  subtext="Total daily energy expenditure"
                />
                <MetricCard
                  label="Water Goal"
                  value={8}
                  unit="glasses"
                  icon={<Droplets size={16} />}
                  color="blue"
                />
              </div>

              {/* Macronutrient breakdown */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Daily Macros
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Dumbbell size={16} className="text-green-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Protein</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {profile.protein}g
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Apple size={16} className="text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Carbs</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {profile.carbohydrates}g
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets size={16} className="text-purple-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fat</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {profile.fat}g
                    </span>
                  </div>
                </div>
              </div>

              {/* HealthCard summary */}
              <HealthCard profile={profile} />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
