import { useEffect, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { Alert, Card } from "../../components/common";
import { fetchAdminAnalytics } from "../../services/adminService";

export default function Analytics() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const result = await fetchAdminAnalytics({ period: "monthly" });
        if (active) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load analytics.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {error ? <Alert variant="warning" title="Analytics notice">{error}</Alert> : null}
      <Card>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Administrative analytics</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Insights for business reporting and product momentum.</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">Preparing analytics…</div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/60">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <TrendingUp size={16} />
                Live metrics
              </div>
              <pre className="mt-4 overflow-x-auto text-xs text-gray-600 dark:text-gray-400">{JSON.stringify(data ?? {}, null, 2)}</pre>
            </div>
            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Operational guidance</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Monitor recommendation throughput and growing user engagement.</li>
                <li>• Review nutrition dataset health for quality and freshness.</li>
                <li>• Track adoption of admin actions across the platform.</li>
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
