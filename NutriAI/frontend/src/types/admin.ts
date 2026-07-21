/**
 * TypeScript types for the Admin Panel module.
 * Mirrors existing backend data shapes and extends for admin-specific views.
 */

// --------------- User Management ---------------

/** User as seen from the admin panel (extends auth User). */
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive" | "Suspended";
  created_at: string;
  last_login?: string;
}

export interface AdminUserUpdatePayload {
  name?: string;
  role?: "Admin" | "User";
  status?: "Active" | "Inactive" | "Suspended";
}

// --------------- Food Management ---------------

export interface AdminFood {
  _id: string;
  name: string;
  category: string;
  meal_type: string;
  food_preference: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface AdminFoodPayload {
  name: string;
  category: string;
  meal_type: string;
  food_preference: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

// --------------- Recommendation Management ---------------

export interface AdminRecommendation {
  _id: string;
  user_email?: string;
  goal: string;
  daily_calories: number;
  bmi: number;
  bmi_category: string;
  created_at: string;
  status: "Generated" | "Viewed" | "Regenerated";
}

// --------------- Category Management ---------------

export interface AdminCategory {
  _id: string;
  name: string;
  type: "food" | "diet" | "goal" | "activity";
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AdminCategoryPayload {
  name: string;
  type: "food" | "diet" | "goal" | "activity";
  description?: string;
  is_active?: boolean;
}

// --------------- Dashboard Stats ---------------

export interface DashboardStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_foods: number;
  food_categories: number;
  recommendations_total: number;
  recommendations_today: number;
  recommendations_weekly: number;
  recommendations_monthly: number;
  average_calories: number;
  system_status: "healthy" | "degraded" | "down";
}

// --------------- System Log ---------------

export type LogLevel = "info" | "warning" | "error" | "debug";
export type LogEventType = "login" | "error" | "warning" | "api_request" | "recommendation_generation";

export interface SystemLogEntry {
  _id: string;
  event_type: LogEventType;
  level: LogLevel;
  message: string;
  user_email?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// --------------- Settings ---------------

export interface AdminSettings {
  app_name: string;
  theme: "light" | "dark" | "system";
  jwt_expiration_minutes: number;
  recommendation_limit_per_day: number;
  maintenance_mode: boolean;
}

// --------------- Admin Filters & Pagination ---------------

export interface AdminFilters {
  search: string;
  role?: string;
  status?: string;
  category?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export const DEFAULT_ADMIN_PAGINATION: AdminPagination = {
  page: 1,
  limit: 10,
  total: 0,
  total_pages: 0,
};

export const DEFAULT_ADMIN_FILTERS: AdminFilters = {
  search: "",
  role: "",
  status: "",
  category: "",
  date_from: "",
  date_to: "",
  sort_by: "created_at",
  sort_order: "desc",
};

// --------------- Tab / Section types ---------------

export type AdminSection =
  | "dashboard"
  | "users"
  | "foods"
  | "recommendations"
  | "categories"
  | "analytics"
  | "settings"
  | "logs";

export interface AdminNavItem {
  id: AdminSection;
  label: string;
  icon: string; // Lucide icon name
}
