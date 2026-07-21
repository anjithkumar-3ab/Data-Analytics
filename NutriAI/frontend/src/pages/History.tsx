import { DashboardLayout } from "../components/layout";
import { Card } from "../components/common";

/** User diet history page. */
export default function History() {
  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        📜 History
      </h1>
      <Card>
        <p className="text-gray-500 dark:text-gray-400">
          Diet and nutrition history will be displayed here.
        </p>
      </Card>
    </DashboardLayout>
  );
}
