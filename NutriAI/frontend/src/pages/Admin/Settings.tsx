import { useEffect, useState } from "react";
import { Save, ShieldCheck } from "lucide-react";
import { Alert, Button, Card } from "../../components/common";
import { fetchSettings, updateSettings } from "../../services/adminService";
import type { AdminSettings } from "../../types/admin";

export default function Settings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const result = await fetchSettings();
        if (active) {
          setSettings(result);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load settings.");
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

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error ? <Alert variant="warning" title="Settings notice">{error}</Alert> : null}
      <Card>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Platform settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage the operational levers for deployment readiness.</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">Loading settings…</div>
        ) : settings ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              <span className="mb-1 block">Application name</span>
              <input value={settings.app_name} onChange={(event) => setSettings((current) => (current ? { ...current, app_name: event.target.value } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
            </label>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              <span className="mb-1 block">Theme</span>
              <select value={settings.theme} onChange={(event) => setSettings((current) => (current ? { ...current, theme: event.target.value as AdminSettings["theme"] } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </label>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              <span className="mb-1 block">JWT expiration (minutes)</span>
              <input type="number" value={settings.jwt_expiration_minutes} onChange={(event) => setSettings((current) => (current ? { ...current, jwt_expiration_minutes: Number(event.target.value) } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
            </label>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              <span className="mb-1 block">Recommendation limit per day</span>
              <input type="number" value={settings.recommendation_limit_per_day} onChange={(event) => setSettings((current) => (current ? { ...current, recommendation_limit_per_day: Number(event.target.value) } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={settings.maintenance_mode} onChange={(event) => setSettings((current) => (current ? { ...current, maintenance_mode: event.target.checked } : current))} />
              Maintenance mode
            </label>
          </div>
        ) : null}

        <div className="mt-6 flex justify-end">
          <Button size="sm" isLoading={saving} onClick={() => void handleSave()}>
            <Save size={16} className="mr-1" />
            Save settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
