import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout";
import { Alert } from "../components/common";
import HistorySearch from "../components/history/HistorySearch";
import HistoryFilters from "../components/history/HistoryFilters";
import HistoryTable from "../components/history/HistoryTable";
import HistoryCard from "../components/history/HistoryCard";
import HistoryPagination from "../components/history/HistoryPagination";
import HistoryEmpty from "../components/history/HistoryEmpty";
import HistorySkeleton from "../components/history/HistorySkeleton";
import DeleteDialog from "../components/history/DeleteDialog";
import RecommendationPreview from "../components/history/RecommendationPreview";
import {
  fetchEnrichedHistory,
  toggleFavorite as toggleFavService,
} from "../services/historyService";
import {
  deleteRecommendation,
  regenerateRecommendation,
} from "../services/recommendationService";
import type { HistoryItem, FilterState, PaginationState } from "../types/history";
import { DEFAULT_FILTERS, DEFAULT_PAGINATION } from "../types/history";
import type { RecommendationResponse } from "../types/recommendation";
import type { AxiosError } from "axios";

/** Main History page — search, filter, sort, paginate, and manage recommendations. */
export default function HistoryPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HistoryItem | null>(null);
  const [previewItem] = useState<RecommendationResponse | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });
      setTimeout(() => setToast(null), 3500);
    },
    [],
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (pagination.page - 1) * pagination.limit;
      const { items: fetched, count } = await fetchEnrichedHistory(
        pagination.limit,
        skip,
      );
      setItems(fetched);
      setPagination((p) => ({ ...p, total: count }));
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      setError(axiosErr.response?.data?.detail ?? "Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.displayName.toLowerCase().includes(q) ||
          (item.goal ?? "").toLowerCase().includes(q) ||
          item.food_preference.toLowerCase().includes(q),
      );
    }
    if (filters.goal) {
      result = result.filter((item) => item.goal === filters.goal);
    }
    if (filters.foodPreference) {
      result = result.filter((item) => item.food_preference === filters.foodPreference);
    }
    if (filters.caloriesMin) {
      result = result.filter((item) => item.daily_calories >= Number(filters.caloriesMin));
    }
    if (filters.caloriesMax) {
      result = result.filter((item) => item.daily_calories <= Number(filters.caloriesMax));
    }
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom).getTime();
      result = result.filter((item) => new Date(item.created_at).getTime() >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo).setHours(23, 59, 59, 999);
      result = result.filter((item) => new Date(item.created_at).getTime() <= to);
    }
    if (filters.favoritesOnly) {
      result = result.filter((item) => item.isFavorite);
    }
    const sort = filters.sort;
    result.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "calories-high":
          return b.daily_calories - a.daily_calories;
        case "calories-low":
          return a.daily_calories - b.daily_calories;
        case "name-asc":
          return a.displayName.localeCompare(b.displayName);
        case "name-desc":
          return b.displayName.localeCompare(a.displayName);
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return result;
  }, [items, search, filters]);

  const handleView = useCallback(
    (item: HistoryItem) => {
      navigate(`/history/${item.recommendation_id}`);
    },
    [navigate],
  );

  const handleToggleFavorite = useCallback((item: HistoryItem) => {
    const id = item.recommendation_id;
    if (!id) return;
    const newState = toggleFavService(id);
    setItems((prev) =>
      prev.map((i) => (i.recommendation_id === id ? { ...i, isFavorite: newState } : i)),
    );
  }, []);

  const handleRegenerate = useCallback(
    async (item: HistoryItem) => {
      const id = item.recommendation_id;
      if (!id) return;
      setIsRegenerating(true);
      try {
        await regenerateRecommendation(id);
        showToast("success", "Plan regenerated successfully! 🔄");
        await fetchData();
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ detail?: string }>;
        showToast("error", axiosErr.response?.data?.detail ?? "Regeneration failed.");
      } finally {
        setIsRegenerating(false);
      }
    },
    [fetchData, showToast],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget?.recommendation_id) return;
    setIsDeleting(true);
    try {
      await deleteRecommendation(deleteTarget.recommendation_id);
      showToast("success", "Recommendation deleted.");
      setDeleteTarget(null);
      await fetchData();
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      showToast("error", axiosErr.response?.data?.detail ?? "Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, fetchData, showToast]);

  const handlePageChange = useCallback((page: number) => {
    setPagination((p) => ({ ...p, page }));
  }, []);

  return (
    <DashboardLayout>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed left-1/2 top-20 z-50 w-full max-w-sm -translate-x-1/2"
        >
          <Alert
            variant={toast.type === "success" ? "success" : "error"}
            className="shadow-lg"
          >
            {toast.message}
          </Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-6 pb-16"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            📜 Diet Plan History
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Browse, search, and manage your previously generated meal plans.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <HistorySearch value={search} onChange={setSearch} />
        </div>
        <HistoryFilters filters={filters} onChange={setFilters} />

        {loading ? (
          <HistorySkeleton />
        ) : error ? (
          <div className="space-y-3">
            <Alert variant="error">{error}</Alert>
            <button
              onClick={fetchData}
              className="text-sm font-medium text-green-600 hover:underline"
            >
              🔄 Retry
            </button>
          </div>
        ) : filteredItems.length === 0 && items.length === 0 ? (
          <HistoryEmpty />
        ) : (
          <>
            <div className="hidden lg:block">
              <HistoryTable
                items={filteredItems}
                onView={handleView}
                onRegenerate={handleRegenerate}
                onDelete={setDeleteTarget}
                onToggleFavorite={handleToggleFavorite}
                isRegenerating={isRegenerating}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              {filteredItems.map((item) => (
                <HistoryCard
                  key={item.recommendation_id}
                  item={item}
                  onView={handleView}
                  onRegenerate={handleRegenerate}
                  onDelete={setDeleteTarget}
                  onToggleFavorite={handleToggleFavorite}
                  isRegenerating={isRegenerating}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">
                No plans match your current filters. Try adjusting your search or filters.
              </p>
            )}

            <HistoryPagination
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </motion.div>

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        itemName={deleteTarget?.displayName ?? ""}
      />

      <RecommendationPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        result={previewItem}
        onRegenerate={async () => {
          if (previewItem?.recommendation_id) {
            setIsRegenerating(true);
            try {
              await regenerateRecommendation(previewItem.recommendation_id);
              showToast("success", "Regenerated! 🔄");
              await fetchData();
            } catch {
              showToast("error", "Regeneration failed.");
            } finally {
              setIsRegenerating(false);
            }
          }
        }}
        isRegenerating={isRegenerating}
      />
    </DashboardLayout>
  );
}
