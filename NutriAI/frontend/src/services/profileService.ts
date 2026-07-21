import api from "./api";
import type { HealthProfileRequest, HealthProfileResponse } from "../types/profile";

/**
 * Create or update the authenticated user's health profile.
 * Backend endpoint: POST /profile/
 */
export async function saveHealthProfile(
  data: HealthProfileRequest,
): Promise<HealthProfileResponse> {
  const response = await api.post<HealthProfileResponse>("/profile/", data);
  return response.data;
}

/**
 * Placeholder for GET /profile — the backend does not yet expose this
 * endpoint. When available, update this function accordingly.
 */
export async function fetchHealthProfile(): Promise<HealthProfileResponse | null> {
  try {
    const response = await api.get<HealthProfileResponse>("/profile/");
    return response.data;
  } catch {
    // Backend may not have GET yet; return null silently
    return null;
  }
}
