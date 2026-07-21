import { DashboardLayout } from "../components/layout";
import { Card } from "../components/common";

/** Weekly meal planner page. */
export default function WeeklyPlanner() {
  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        📅 Weekly Planner
      </h1>
      <Card>
        <p className="text-gray-500 dark:text-gray-400">
          Weekly meal planning tool will be implemented here.
        </p>
      </Card>
    </DashboardLayout>
  );
}
