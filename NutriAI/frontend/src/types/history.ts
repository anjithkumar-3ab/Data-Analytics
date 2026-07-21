/**
 * Types for the Recommendation History module.
 */
import type { RecommendationResponse, Goal, FoodPreference } from "./recommendation";

// --------------- Search & Filters ---------------

export type SortOption =
  | "newest"
  | "oldest"
  | "calories-high"
  | "calories-low"
  | "goal"
  | "name-asc"
  | "name-desc";

export interface FilterState {
  search: string;
  dateFrom: string;
  dateTo: string;
  goal: Goal | "";
  caloriesMin: string;
  caloriesMax: string;
  foodPreference: FoodPreference | "";
  favoritesOnly: boolean;
  sort: SortOption;
}

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  dateFrom: "",
  dateTo: "",
  goal: "",
  caloriesMin: "",
  caloriesMax: "",
  foodPreference: "",
  favoritesOnly: false,
  sort: "newest",
};

// --------------- Pagination ---------------

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export const DEFAULT_PAGINATION: PaginationState = {
  page: 1,
  limit: 10,
  total: 0,
};

// --------------- Enhanced Recommendation ---------------

/** Extended recommendation with client-side fields like favorite and name. */
export interface HistoryItem extends RecommendationResponse {
  /** Client-generated display name. */
  displayName: string;
  /** Whether the user has favorited this item (localStorage). */
  isFavorite: boolean;
}

// --------------- Detail View ---------------

export type DetailTab = "overview" | "breakfast" | "lunch" | "dinner" | "snacks";
