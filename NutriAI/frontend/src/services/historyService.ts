/**
 * History module service layer.
 *
 * Wraps the recommendation API with additional client-side operations
 * such as favorite toggling (persisted in localStorage).
 */
import { fetchHistory as apiFetchHistory } from "./recommendationService";
import type { HistoryResponse } from "../types/recommendation";
import type { HistoryItem } from "../types/history";

// ------------------------------------------------------------------
// LocalStorage favorites management
// ------------------------------------------------------------------

const FAVORITES_KEY = "nutriai_favorites";

/** Read the set of favorited recommendation IDs from localStorage. */
function getFavoriteIds(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

/** Persist a set of favorite IDs back to localStorage. */
function setFavoriteIds(ids: Set<string>): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
}

/** Toggle a single recommendation ID in/out of favorites. Returns the new state. */
export function toggleFavorite(id: string): boolean {
  const ids = getFavoriteIds();
  if (ids.has(id)) {
    ids.delete(id);
    setFavoriteIds(ids);
    return false; // now unfavorited
  }
  ids.add(id);
  setFavoriteIds(ids);
  return true; // now favorited
}

/** Check if a single ID is favorited. */
export function isFavorite(id: string): boolean {
  return getFavoriteIds().has(id);
}

/** Generate a human-readable display name from a recommendation. */
export function generateDisplayName(items: {
  goal?: string;
  food_preference?: string;
  created_at?: string;
}): string {
  const goal = items.goal ?? "";
  const pref = items.food_preference ?? "";
  const date = items.created_at
    ? new Date(items.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "";
  const parts = [goal, pref, date].filter(Boolean);
  return parts.join(" · ") || "Meal Plan";
}

// ------------------------------------------------------------------
// API wrapper
// ------------------------------------------------------------------

/**
 * Fetch paginated history and enrich each item with client-side
 * display name and favorite status.
 */
export async function fetchEnrichedHistory(
  limit = 10,
  skip = 0,
): Promise<{ items: HistoryItem[]; count: number }> {
  const response: HistoryResponse = await apiFetchHistory(limit, skip);
  const favIds = getFavoriteIds();
  const items: HistoryItem[] = (response.recommendations ?? []).map((rec) => ({
    ...rec,
    displayName: generateDisplayName(rec),
    isFavorite: favIds.has(rec.recommendation_id ?? ""),
  }));
  return { items, count: response.count };
}
