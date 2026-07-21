import api from "./api";
import type {
  RecommendationRequest,
  RecommendationResponse,
  HistoryResponse,
  SingleRecommendationResponse,
  MessageResponse,
} from "../types/recommendation";

/** Generate a new personalized diet plan. */
export async function generateRecommendation(
  data: RecommendationRequest,
): Promise<RecommendationResponse> {
  const response = await api.post<RecommendationResponse>(
    "/recommendation/generate",
    data,
  );
  return response.data;
}

/** Fetch paginated recommendation history. */
export async function fetchHistory(
  limit = 10,
  skip = 0,
): Promise<HistoryResponse> {
  const response = await api.get<HistoryResponse>("/recommendation/history", {
    params: { limit, skip },
  });
  return response.data;
}

/** Retrieve a single recommendation by ID. */
export async function fetchRecommendation(
  id: string,
): Promise<SingleRecommendationResponse> {
  const response = await api.get<SingleRecommendationResponse>(
    `/recommendation/${id}`,
  );
  return response.data;
}

/** Delete a recommendation by ID. */
export async function deleteRecommendation(
  id: string,
): Promise<MessageResponse> {
  const response = await api.delete<MessageResponse>(
    `/recommendation/${id}`,
  );
  return response.data;
}

/** Regenerate a diet plan from an existing recommendation. */
export async function regenerateRecommendation(
  id: string,
): Promise<RecommendationResponse> {
  const response = await api.post<RecommendationResponse>(
    `/recommendation/${id}/regenerate`,
  );
  return response.data;
}
