import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../components/layout";
import { Alert } from "../components/common";
import RecommendationForm from "../components/recommendation/RecommendationForm";
import RecommendationHeader from "../components/recommendation/RecommendationHeader";
import NutritionSummary from "../components/recommendation/NutritionSummary";
import MacroChart from "../components/recommendation/MacroChart";
import WaterCard from "../components/recommendation/WaterCard";
import MealPlanCard from "../components/recommendation/MealPlanCard";
import RecommendationFooter from "../components/recommendation/RecommendationFooter";
import RecommendationSkeleton from "../components/recommendation/RecommendationSkeleton";
import RecommendationEmpty from "../components/recommendation/RecommendationEmpty";
import {
  generateRecommendation,
  regenerateRecommendation,
  deleteRecommendation,
} from "../services/recommendationService";
import type {
  RecommendationRequest,
  RecommendationResponse,
} from "../types/recommendation";
import type { AxiosError } from "axios";

/** Page-level state machine for the recommendation workflow. */
type PageState = "idle" | "loading" | "success" | "error";

/**
 * AI Diet Recommendation page.
 *
 * Orchestrates the full recommendation workflow: form submission,
 * loading skeleton, result display, regenerate, delete, and
 * copy/print actions.  Manages all async state at the page level.
 */
export default function Recommendation() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /** Ref to scroll to the form section. */
  const formRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------------------
  // Toast helper
  // ------------------------------------------------------------------
  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });
      setTimeout(() => setToast(null), 4000);
    },
    [],
  );

  // ------------------------------------------------------------------
  // Generate handler (called by the form)
  // ------------------------------------------------------------------
  const handleSubmit = useCallback(
    async (data: RecommendationRequest) => {
      setServerError(null);
      setPageState("loading");
      try {
        const res = await generateRecommendation(data);
        setResult(res);
        setPageState("success");
        showToast("success", "Your personalized diet plan is ready! 🎉");
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<{
          detail?: string;
          message?: string;
        }>;
        const msg =
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Failed to generate recommendation. Please try again.";
        setServerError(msg);
        setPageState("error");
      }
    },
    [showToast],
  );

  // ------------------------------------------------------------------
  // Regenerate handler
  // ------------------------------------------------------------------
  const handleRegenerate = useCallback(async () => {
    if (!result?.recommendation_id) {
      showToast("error", "Cannot regenerate — no saved recommendation ID.");
      return;
    }
    setIsRegenerating(true);
    try {
      const newResult = await regenerateRecommendation(
        result.recommendation_id,
      );
      setResult(newResult);
      setPageState("success");
      showToast("success", "Your diet plan has been regenerated! 🔄");
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{
        detail?: string;
        message?: string;
      }>;
      const msg =
        axiosErr.response?.data?.detail ??
        axiosErr.response?.data?.message ??
        "Failed to regenerate recommendation.";
      showToast("error", msg);
    } finally {
      setIsRegenerating(false);
    }
  }, [result, showToast]);

  // ------------------------------------------------------------------
  // Delete handler
  // ------------------------------------------------------------------
  const handleDelete = useCallback(async () => {
    const id = result?.recommendation_id;
    if (!id) {
      // No server record — just clear locally.
      setResult(null);
      setPageState("idle");
      setServerError(null);
      return;
    }
    setIsDeleting(true);
    try {
      await deleteRecommendation(id);
      setResult(null);
      setPageState("idle");
      setServerError(null);
      showToast("success", "Recommendation deleted.");
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{
        detail?: string;
        message?: string;
      }>;
      const msg =
        axiosErr.response?.data?.detail ??
        axiosErr.response?.data?.message ??
        "Failed to delete recommendation.";
      showToast("error", msg);
    } finally {
      setIsDeleting(false);
    }
  }, [result, showToast]);

  // ------------------------------------------------------------------
  // Retry — reset to idle so the user can re-submit the form
  // ------------------------------------------------------------------
  const handleRetry = useCallback(() => {
    setServerError(null);
    setPageState("idle");
  }, []);

  /** Scroll to the form (triggered from empty state CTA). */
  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Focus the first input after scroll settles
    setTimeout(() => {
      const firstInput = formRef.current?.querySelector<HTMLInputElement>(
        "input, select, textarea",
      );
      firstInput?.focus();
    }, 400);
  }, []);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <DashboardLayout>
      {/* Floating toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -24, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -24, x: "-50%" }}
            className="fixed left-1/2 top-20 z-50 w-full max-w-sm"
          >
            <Alert
              variant={toast.type === "success" ? "success" : "error"}
              className="shadow-lg"
            >
              {toast.message}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl space-y-8 pb-16"
      >
        {/* ---- Page heading ---- */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            🤖 AI Diet Recommendation
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate a personalized meal plan based on your health profile and
            dietary preferences.
          </p>
        </div>

        {/* ---- Form (always visible) ---- */}
        <div ref={formRef}>
          <RecommendationForm
            onSubmit={handleSubmit}
            isSubmitting={pageState === "loading"}
            serverError={serverError}
          />
        </div>

        {/* ---- Results area ---- */}
        <AnimatePresence mode="wait">
          {pageState === "loading" && (
            <RecommendationSkeleton key="skeleton" />
          )}

          {pageState === "error" && serverError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <Alert variant="error" title="Generation Failed">
                {serverError}
              </Alert>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                aria-label="Retry generating recommendation"
              >
                🔄 Retry
              </button>
            </motion.div>
          )}

          {pageState === "success" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header badge */}
              <RecommendationHeader result={result} />

              {/* Health metrics */}
              <NutritionSummary result={result} />

              {/* Macros + Water side-by-side on large screens */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <MacroChart result={result} />
                </div>
                <WaterCard
                  waterLiters={result.daily_plan.recommended_water_liters}
                />
              </div>

              {/* Meal plan */}
              <MealPlanCard plan={result.daily_plan} />

              {/* Actions footer */}
              <RecommendationFooter
                result={result}
                onRegenerate={handleRegenerate}
                onDelete={handleDelete}
                isRegenerating={isRegenerating}
                isDeleting={isDeleting}
              />
            </motion.div>
          )}

          {pageState === "idle" && !result && (
            <RecommendationEmpty key="empty" onGenerate={scrollToForm} />
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}
