import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, RefreshCw, Printer, Copy, Trash2, Calendar,
} from "lucide-react";
import { DashboardLayout } from "../components/layout";
import { Button, Alert, Spinner } from "../components/common";
import NutritionSummary from "../components/recommendation/NutritionSummary";
import MacroChart from "../components/recommendation/MacroChart";
import WaterCard from "../components/recommendation/WaterCard";
import MealPlanCard from "../components/recommendation/MealPlanCard";
import { ROUTES } from "../constants";
import {
  fetchRecommendation,
  regenerateRecommendation,
  deleteRecommendation,
} from "../services/recommendationService";
import type { RecommendationResponse } from "../types/recommendation";
import type { AxiosError } from "axios";

/** Detail view of a single recommendation — accessed by ID. */
export default function RecommendationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRecommendation(id);
      if (res.success && res.recommendation) {
        setResult(res.recommendation);
      } else {
        setError(res.message ?? "Recommendation not found.");
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      setError(axiosErr.response?.data?.detail ?? "Failed to load recommendation.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleRegenerate = async () => {
    if (!id) return;
    setIsRegenerating(true);
    try {
      const res = await regenerateRecommendation(id);
      setResult(res);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      setError(axiosErr.response?.data?.detail ?? "Regeneration failed.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteRecommendation(id);
      navigate(ROUTES.HISTORY, { replace: true });
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      setError(axiosErr.response?.data?.detail ?? "Delete failed.");
      setIsDeleting(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `NutriAI Meal Plan\n${result.daily_calories} kcal/day\nBMI: ${result.bmi} | BMR: ${result.bmr} | TDEE: ${result.tdee}`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !result) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <button
            onClick={() => navigate(ROUTES.HISTORY)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={16} /> Back to History
          </button>
          <Alert variant="error">{error ?? "Recommendation not found."}</Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl space-y-6 pb-16"
      >
        {/* Back + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate(ROUTES.HISTORY)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            aria-label="Back to history"
          >
            <ArrowLeft size={16} /> Back to History
          </button>
          <div className="flex gap-2 print:hidden">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy size={14} className="mr-1" /> Copy
            </Button>
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer size={14} className="mr-1" /> Print
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRegenerate}
              isLoading={isRegenerating}
            >
              <RefreshCw size={14} className="mr-1" /> Regenerate
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Trash2 size={14} className="mr-1" /> Delete
            </Button>
          </div>
        </div>

        {/* Title bar */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {result.food_preference} Diet Plan
              </h1>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(result.created_at).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {result.goal && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {result.goal}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <NutritionSummary result={result} />

        {/* Macros + Water */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MacroChart result={result} />
          </div>
          <WaterCard waterLiters={result.daily_plan.recommended_water_liters} />
        </div>

        {/* Full Meal Plan */}
        <MealPlanCard plan={result.daily_plan} />
      </motion.div>
    </DashboardLayout>
  );
}
