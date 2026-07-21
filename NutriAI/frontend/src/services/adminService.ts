/**
 * Admin Panel API service – wraps all admin-related backend calls.
 * Uses the pre-configured Axios instance (api.ts) which auto-attaches JWT.
 */
import api from "./api";
import type {
  AdminUser,
  AdminUserUpdatePayload,
  AdminFood,
  AdminFoodPayload,
  AdminRecommendation,
  AdminCategory,
  AdminCategoryPayload,
  DashboardStats,
  SystemLogEntry,
  AdminSettings,
} from "../types/admin";

// --------------- Dashboard ---------------

/** Fetch aggregated dashboard statistics. */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/admin/dashboard");
  return data;
}

// --------------- Users ---------------

/** Fetch all users with optional query params for search/filter/pagination. */
export async function fetchUsers(
  params: Record<string, string | number | undefined>,
): Promise<{ users: AdminUser[]; total: number; page: number; limit: number }> {
  const { data } = await api.get("/admin/users", { params });
  return data;
}

/** Get a single user by ID. */
export async function fetchUserById(userId: string): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>(`/admin/users/${userId}`);
  return data;
}

/** Update a user (role, status, name). */
export async function updateUser(
  userId: string,
  payload: AdminUserUpdatePayload,
): Promise<AdminUser> {
  const { data } = await api.put<AdminUser>(`/admin/users/${userId}`, payload);
  return data;
}

/** Delete a user permanently. */
export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
}

/** Deactivate a user (set status to Inactive). */
export async function deactivateUser(
  userId: string,
): Promise<AdminUser> {
  const { data } = await api.patch<AdminUser>(`/admin/users/${userId}/deactivate`);
  return data;
}

/** Activate a user (set status to Active). */
export async function activateUser(
  userId: string,
): Promise<AdminUser> {
  const { data } = await api.patch<AdminUser>(`/admin/users/${userId}/activate`);
  return data;
}

// --------------- Foods ---------------

/** Fetch all foods (admin view). */
export async function fetchFoods(
  params: Record<string, string | number | undefined>,
): Promise<{ foods: AdminFood[]; total: number; page: number; limit: number }> {
  const { data } = await api.get("/admin/foods", { params });
  return data;
}

/** Add a new food item. */
export async function createFood(payload: AdminFoodPayload): Promise<AdminFood> {
  const { data } = await api.post<AdminFood>("/admin/foods", payload);
  return data;
}

/** Update an existing food item. */
export async function updateFood(
  foodId: string,
  payload: Partial<AdminFoodPayload>,
): Promise<AdminFood> {
  const { data } = await api.put<AdminFood>(`/admin/foods/${foodId}`, payload);
  return data;
}

/** Delete a food item. */
export async function deleteFood(
  foodId: string,
): Promise<{ success: boolean; message: string }> {
  const { data } = await api.delete(`/admin/foods/${foodId}`);
  return data;
}

// --------------- Recommendations ---------------

/** Fetch recommendations (admin view). */
export async function fetchRecommendations(
  params: Record<string, string | number | undefined>,
): Promise<{ recommendations: AdminRecommendation[]; total: number; page: number; limit: number }> {
  const { data } = await api.get("/admin/recommendations", { params });
  return data;
}

/** Delete a recommendation. */
export async function deleteRecommendationAdmin(
  recommendationId: string,
): Promise<{ success: boolean; message: string }> {
  const { data } = await api.delete(`/admin/recommendations/${recommendationId}`);
  return data;
}

/** Regenerate a recommendation. */
export async function regenerateRecommendation(
  recommendationId: string,
): Promise<AdminRecommendation> {
  const { data } = await api.post<AdminRecommendation>(
    `/admin/recommendations/${recommendationId}/regenerate`,
  );
  return data;
}

// --------------- Categories ---------------

/** Fetch all categories. */
export async function fetchCategories(
  params: Record<string, string | number | undefined>,
): Promise<{ categories: AdminCategory[]; total: number }> {
  const { data } = await api.get("/admin/categories", { params });
  return data;
}

/** Create a new category. */
export async function createCategory(
  payload: AdminCategoryPayload,
): Promise<AdminCategory> {
  const { data } = await api.post<AdminCategory>("/admin/categories", payload);
  return data;
}

/** Update a category. */
export async function updateCategory(
  categoryId: string,
  payload: Partial<AdminCategoryPayload>,
): Promise<AdminCategory> {
  const { data } = await api.put<AdminCategory>(`/admin/categories/${categoryId}`, payload);
  return data;
}

/** Delete a category. */
export async function deleteCategory(
  categoryId: string,
): Promise<{ success: boolean; message: string }> {
  const { data } = await api.delete(`/admin/categories/${categoryId}`);
  return data;
}

// --------------- Logs ---------------

/** Fetch system logs with filters. */
export async function fetchLogs(
  params: Record<string, string | number | undefined>,
): Promise<{ logs: SystemLogEntry[]; total: number; page: number; limit: number }> {
  const { data } = await api.get("/admin/logs", { params });
  return data;
}

// --------------- Settings ---------------

/** Fetch current admin settings. */
export async function fetchSettings(): Promise<AdminSettings> {
  const { data } = await api.get<AdminSettings>("/admin/settings");
  return data;
}

/** Update admin settings. */
export async function updateSettings(
  payload: Partial<AdminSettings>,
): Promise<AdminSettings> {
  const { data } = await api.put<AdminSettings>("/admin/settings", payload);
  return data;
}

// --------------- Analytics (Admin) ---------------

/** Fetch admin-level analytics data. */
export async function fetchAdminAnalytics(params?: {
  period?: string;
}): Promise<Record<string, unknown>> {
  const { data } = await api.get("/admin/analytics", { params });
  return data;
}
