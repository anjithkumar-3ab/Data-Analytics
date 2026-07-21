import { useEffect, useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import { Alert, Card } from "../../components/common";
import { EmptyState, FilterPanel, SearchBar } from "../../components/admin";
import { fetchLogs } from "../../services/adminService";
import type { SystemLogEntry } from "../../types/admin";

const levelOptions = [
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
];

const typeOptions = [
  { label: "Login", value: "login" },
  { label: "Error", value: "error" },
  { label: "Warning", value: "warning" },
  { label: "API Request", value: "api_request" },
  { label: "Recommendation Generation", value: "recommendation_generation" },
];

export default function SystemLogs() {
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const result = await fetchLogs({ search, level, event_type: type, limit: 100 });
        if (active) {
          setLogs(result.logs);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load logs.");
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
  }, [search, level, type]);

  const sortedLogs = useMemo(() => [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [logs]);

  return (
    <div className="space-y-6">
      {error ? <Alert variant="warning" title="System logs notice">{error}</Alert> : null}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-50 p-3 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
              <ScrollText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System logs</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Audit recommendations, API usage, and authentication events.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchBar value={search} onChange={setSearch} placeholder="Search logs" />
            <FilterPanel filters={[{ key: "level", label: "Level", value: level, options: levelOptions }, { key: "type", label: "Type", value: type, options: typeOptions }]} onChange={(key, value) => { if (key === "level") setLevel(value); if (key === "type") setType(value); }} />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">Loading logs…</div>
      ) : sortedLogs.length === 0 ? (
        <EmptyState title="No logs found" description="Recent audit events will appear here after the backend exposes them." />
      ) : (
        <div className="space-y-3">
          {sortedLogs.map((log) => (
            <Card key={log._id} padding="md">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">{log.event_type}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{log.level}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{log.message}</p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>{log.user_email ?? "system"}</p>
                  <p>{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
