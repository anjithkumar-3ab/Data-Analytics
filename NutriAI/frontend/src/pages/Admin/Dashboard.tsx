import { useEffect, useMemo, useState } from "react";
import { Activity, Apple, BrainCircuit, Users2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, Alert } from "../../components/common";
import { StatsCard } from "../../components/admin";
import { fetchDashboardStats } from "../../services/adminService";
import type { DashboardStats } from "../../types/admin";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const result = await fetchDashboardStats();
        if (active) {
          setStats(result);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load admin metrics.");
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

  const summary = useMemo(() => {
    if (!stats) {
      return [];
    }

    return [
      { title: "Total Users", value: stats.total_users, color: "indigo" as const, icon: <Users2 size={18} /> },
      { title: "Active Users", value: stats.active_users, color: "green" as const, icon: <Activity size={18} /> },
      { title: "Total Foods", value: stats.total_foods, color: "blue" as const, icon: <Apple size={18} /> },
      { title: "Recommendations", value: stats.recommendations_total, color: "amber" as const, icon: <BrainCircuit size={18} /> },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? <Alert variant="warning" title="Connectivity notice">{error}</Alert> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <StatsCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Operational Overview</p>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Enterprise admin health</h2>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {stats?.system_status ?? "healthy"}
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                <p className="text-sm text-gray-500 dark:text-gray-400">Weekly recommendations</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats?.recommendations_weekly ?? 0}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly recommendations</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats?.recommendations_monthly ?? 0}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                <p className="text-sm text-gray-500 dark:text-gray-400">Average calories</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats?.average_calories ?? 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="h-full">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">System status</p>
            <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">Admin panel readiness</h2>
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>• Authentication and route guards are active.</li>
              <li>• Food, recommendation, and analytics views are wired to the backend.</li>
              <li>• Settings and logs are persisted locally when backend endpoints are unavailable.</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
