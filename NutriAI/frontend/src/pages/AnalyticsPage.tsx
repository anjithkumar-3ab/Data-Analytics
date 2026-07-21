import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../components/layout";
import { Alert } from "../components/common";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import SummaryCards from "../components/analytics/SummaryCards";
import CaloriesChart from "../components/analytics/CaloriesChart";
import MacroDistributionChart from "../components/analytics/MacroDistributionChart";
import BMIProgressChart from "../components/analytics/BMIProgressChart";
import WaterIntakeChart from "../components/analytics/WaterIntakeChart";
import NutritionRadarChart from "../components/analytics/NutritionRadarChart";
import HealthInsights from "../components/analytics/HealthInsights";
import AnalyticsSkeleton from "../components/analytics/AnalyticsSkeleton";
import AnalyticsEmpty from "../components/analytics/AnalyticsEmpty";
import { fetchAnalytics } from "../services/analyticsService";
import type { AnalyticsData, TimePeriod } from "../types/analytics";
import type { AxiosError } from "axios";

/** Analytics Dashboard page — visualizes nutrition trends and health insights. */
export default function AnalyticsPage() {
  const [period, setPeriod] = useState<TimePeriod>("30days");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAnalytics();
      // Client-side filtering by period
      const cutoff = new Date();
      switch (period) {
        case "today": cutoff.setDate(cutoff.getDate() - 1); break;
        case "7days": cutoff.setDate(cutoff.getDate() - 7); break;
        case "30days": cutoff.setDate(cutoff.getDate() - 30); break;
        case "3months": cutoff.setMonth(cutoff.getMonth() - 3); break;
        case "1year": cutoff.setFullYear(cutoff.getFullYear() - 1); break;
        case "custom": break; // no-op for custom range
      }
      const cutoffTime = cutoff.getTime();
      result.caloriesHistory = result.caloriesHistory.filter(
        (e) => new Date(e.date).getTime() >= cutoffTime,
      );
      result.bmiHistory = result.bmiHistory.filter(
        (e) => new Date(e.date).getTime() >= cutoffTime,
      );
      result.waterHistory = result.waterHistory.filter(
        (e) => new Date(e.date).getTime() >= cutoffTime,
      );
      setData(result);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      setError(axiosErr.response?.data?.detail ?? "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const hasNoData = data && data.recommendations.length === 0;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl space-y-6 pb-16"
      >
        <AnalyticsHeader period={period} onPeriodChange={setPeriod} />

        {loading ? (
          <AnalyticsSkeleton />
        ) : error ? (
          <div className="space-y-3">
            <Alert variant="error">{error}</Alert>
            <button
              onClick={loadData}
              className="text-sm font-medium text-green-600 hover:underline"
            >
              🔄 Retry
            </button>
          </div>
        ) : hasNoData ? (
          <AnalyticsEmpty />
        ) : (
          data && (
            <>
              {/* Summary cards */}
              <SummaryCards summary={data.summary} />

              {/* Charts row 1: Calories + Macro */}
              <div className="grid gap-6 lg:grid-cols-2">
                <CaloriesChart data={data.caloriesHistory} />
                <MacroDistributionChart data={data.macroDistribution} />
              </div>

              {/* Charts row 2: BMI + Water + Radar */}
              <div className="grid gap-6 lg:grid-cols-3">
                <BMIProgressChart data={data.bmiHistory} />
                <WaterIntakeChart data={data.waterHistory} />
                <NutritionRadarChart data={data.radarData} />
              </div>

              {/* Insights */}
              <HealthInsights insights={data.insights} />
            </>
          )
        )}
      </motion.div>
    </DashboardLayout>
  );
}
