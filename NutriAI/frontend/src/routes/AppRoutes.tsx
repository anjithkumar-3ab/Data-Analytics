import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/ProfilePage";
import Recommendation from "../pages/Recommendation";
import HistoryPage from "../pages/HistoryPage";
import RecommendationDetails from "../pages/RecommendationDetails";
import WeeklyPlanner from "../pages/WeeklyPlanner";
import AnalyticsPage from "../pages/AnalyticsPage";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";
import PowerBi from "../pages/PowerBi";
import Settings from "../pages/Settings";

/** Top-level route tree for the NutriAI application. */
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.RECOMMENDATION} element={<Recommendation />} />
        <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
        <Route path="/history/:id" element={<RecommendationDetails />} />
        <Route path={ROUTES.WEEKLY_PLANNER} element={<WeeklyPlanner />} />
        <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
        <Route path={ROUTES.POWERBI} element={<PowerBi />} />
        <Route path={ROUTES.ADMIN} element={<Admin />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
