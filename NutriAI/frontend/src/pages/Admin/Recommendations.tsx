import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Alert, Card } from "../../components/common";
import { EmptyState, RecommendationTable, SearchBar } from "../../components/admin";
import { deleteRecommendationAdmin, fetchRecommendations, regenerateRecommendation } from "../../services/adminService";
import type { AdminRecommendation } from "../../types/admin";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<AdminRecommendation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminRecommendation | null>(null);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const result = await fetchRecommendations({ search, limit: 100 });
      setRecommendations(result.recommendations);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRecommendations();
  }, [search]);

  const filteredRecommendations = useMemo(() => recommendations, [recommendations]);

  const handleDelete = async (recommendation: AdminRecommendation) => {
    try {
      await deleteRecommendationAdmin(recommendation._id);
      setRecommendations((current) => current.filter((entry) => entry._id !== recommendation._id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete recommendation.");
    }
  };

  const handleRegenerate = async (recommendation: AdminRecommendation) => {
    try {
      const regenerated = await regenerateRecommendation(recommendation._id);
      setRecommendations((current) => [regenerated, ...current.filter((entry) => entry._id !== recommendation._id)]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to regenerate recommendation.");
    }
  };

  return (
    <div className="space-y-6">
      {error ? <Alert variant="warning" title="Recommendations notice">{error}</Alert> : null}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recommendation review</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Inspect generated diet plans and regenerate them when needed.</p>
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by goal or email" />
        </div>
      </Card>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">Loading recommendations…</div>
      ) : filteredRecommendations.length === 0 ? (
        <EmptyState title="No recommendations available" description="Generated plans will appear here once the recommendation flow runs." />
      ) : (
        <RecommendationTable recommendations={filteredRecommendations} onView={setSelected} onDelete={handleDelete} onRegenerate={handleRegenerate} />
      )}

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recommendation details</p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selected.goal}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{selected.daily_calories.toFixed(0)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                <p className="text-sm text-gray-500 dark:text-gray-400">BMI</p>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{selected.bmi.toFixed(1)}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => { void handleRegenerate(selected); setSelected(null); }} className="inline-flex items-center rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700">
                <RefreshCw size={16} className="mr-1" />
                Regenerate
              </button>
              <button onClick={() => { void handleDelete(selected); setSelected(null); }} className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
