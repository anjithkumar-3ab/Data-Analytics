import { DashboardLayout } from "../components/layout";
import { Card } from "../components/common";

/** Analytics & progress tracking page. */
export default function Analytics() {
  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        📈 Analytics
      </h1>
      <Card>
        <p className="text-gray-500 dark:text-gray-400">
          Progress charts and analytics will be displayed here.
        </p>
      </Card>
    </DashboardLayout>
  );
}
