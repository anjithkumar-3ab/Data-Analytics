import { useNavigate } from "react-router-dom";
import {
  Flame,
  Droplets,
  Dumbbell,
  Apple,
  BrainCircuit,
  Sparkles,
  TrendingUp,
  CalendarDays,
  History,
  User,
} from "lucide-react";
import { defaultUser } from "../../constants/user";
import { DashboardLayout } from "../../components/layout";
import {
  KPICard,
  QuickAction,
  StatCard,
  ProfileCard,
  RecentActivity,
  HealthSummary,
} from "../../components/dashboard";
import { ROUTES } from "../../constants";

/** Dummy data — will be replaced with API data in a future iteration. */
const dummyActivities = [
  { id: "1", type: "plan" as const, title: "Weekly meal plan generated", timestamp: "2 hours ago" },
  { id: "2", type: "profile" as const, title: "Health profile updated", timestamp: "Yesterday" },
  { id: "3", type: "recommendation" as const, title: "New diet recommendation received", timestamp: "2 days ago" },
];

/** Main authenticated dashboard home page. */
export default function Dashboard() {
  const user = defaultUser;
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Welcome / Profile Card */}
      <ProfileCard
        name={user?.name ?? "User"}
        email={user?.email ?? ""}
        bmi={24.3}
        bmr={1785}
        tdee={2230}
      />

      <section className="mt-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          Today's Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <KPICard
            title="Today's Calories"
            value={1820}
            unit="kcal"
            trend={-5}
            icon={<Flame size={22} />}
            color="orange"
          />
          <KPICard
            title="Protein"
            value={95}
            unit="g"
            trend={8}
            icon={<Apple size={22} />}
            color="green"
          />
          <KPICard
            title="Carbohydrates"
            value={210}
            unit="g"
            trend={-2}
            icon={<Dumbbell size={22} />}
            color="blue"
          />
          <KPICard
            title="Fat"
            value={52}
            unit="g"
            trend={3}
            icon={<Droplets size={22} />}
            color="purple"
          />
          <KPICard
            title="Water Intake"
            value={6}
            unit="/ 8 glasses"
            icon={<Droplets size={22} />}
            color="blue"
          />
          <KPICard
            title="Recommendations"
            value={5}
            trend={12}
            icon={<BrainCircuit size={22} />}
            color="purple"
          />
        </div>
      </section>

      {/* Quick Actions + Health Summary row */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <QuickAction
                label="Generate Plan"
                icon={<Sparkles size={20} className="text-green-600" />}
                onClick={() => navigate(ROUTES.RECOMMENDATION)}
                color="green"
              />
              <QuickAction
                label="Update Profile"
                icon={<User size={20} className="text-blue-600" />}
                onClick={() => navigate(ROUTES.PROFILE)}
                color="blue"
              />
              <QuickAction
                label="View History"
                icon={<History size={20} className="text-orange-600" />}
                onClick={() => navigate(ROUTES.HISTORY)}
                color="orange"
              />
              <QuickAction
                label="Weekly Planner"
                icon={<CalendarDays size={20} className="text-purple-600" />}
                onClick={() => navigate(ROUTES.WEEKLY_PLANNER)}
                color="purple"
              />
              <QuickAction
                label="Analytics"
                icon={<TrendingUp size={20} className="text-green-600" />}
                onClick={() => navigate(ROUTES.ANALYTICS)}
                color="green"
              />
            </div>
          </div>

          {/* Nutrition Stats */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Nutrition Breakdown
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Protein" value={95} max={120} progress={79} unit="g" variant="success" />
              <StatCard label="Carbs" value={210} max={300} progress={70} unit="g" variant="warning" />
              <StatCard label="Fat" value={52} max={65} progress={80} unit="g" variant="danger" />
            </div>
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <HealthSummary
            bmi={24.3}
            weight={72}
            height={172}
            goal="Weight Loss"
            activityLevel="Moderate"
          />
          <RecentActivity activities={dummyActivities} />
        </div>
      </div>
    </DashboardLayout>
  );
}
