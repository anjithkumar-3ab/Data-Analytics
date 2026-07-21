"""
Recommendation API Router.

Exposes endpoints for generating, retrieving, and managing personalized
diet plan recommendations.
"""
import logging
from typing import Any

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.schemas.recommendation_schema import (
    HealthResponse,
    HistoryResponse,
    MessageResponse,
    RecommendationRequest,
    RecommendationResponse,
    SingleRecommendationResponse,
)
from app.services.recommendation_service import (
    delete_recommendation,
    generate_diet_plan,
    get_recommendation_by_id,
    get_recommendation_history,
    regenerate_recommendation,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendation"],
)


# ---------------------------------------------------------------------------
# Dependency helpers
# ---------------------------------------------------------------------------

def _validate_object_id(recommendation_id: str) -> ObjectId:
    """
    Validate and convert a string to a MongoDB ObjectId.

    Args:
        recommendation_id: 24-character hex string.

    Returns:
        Validated ``bson.ObjectId`` instance.

    Raises:
        HTTPException(400): If the string is not a valid ObjectId.
    """
    try:
        return ObjectId(recommendation_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{recommendation_id}' is not a valid recommendation ID.",
        )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post(
    "/generate",
    response_model=RecommendationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate a personalized diet plan",
    description=(
        "Accepts user health metrics, activity level, dietary preferences, "
        "and goals. Returns a full daily meal plan with macro targets, "
        "BMI analysis, and stores the result for future retrieval."
    ),
)
async def generate_recommendation(
    request: RecommendationRequest,
) -> Any:
    """
    Generate a new personalized diet plan recommendation.

    Args:
        request: User health and preference data.

    Returns:
        RecommendationResponse with health metrics and daily meal plan.
    """
    logger.info("Generating diet plan for request: %s", request.model_dump())
    result = generate_diet_plan(request)
    logger.info("Diet plan generated successfully")
    return result


@router.get(
    "/history",
    response_model=HistoryResponse,
    summary="Retrieve recommendation history",
    description=(
        "Returns previously generated diet plan recommendations ordered "
        "by creation date (newest first). Supports pagination via ``limit`` "
        "and ``skip`` query parameters."
    ),
)
async def get_history(
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Maximum number of recommendations to return.",
    ),
    skip: int = Query(
        default=0,
        ge=0,
        description="Number of recommendations to skip for pagination.",
    ),
) -> Any:
    """
    List past recommendations with pagination.

    Args:
        limit: Max records to return (1–100).
        skip: Records to offset.

    Returns:
        HistoryResponse containing list of recommendations.
    """
    logger.info("Fetching recommendation history (limit=%d, skip=%d)", limit, skip)
    return get_recommendation_history(limit=limit, skip=skip)


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Recommendation service health check",
)
async def health_check() -> dict:
    """
    Lightweight liveness probe for the recommendation service.

    Returns:
        Health status with service identifier.
    """
    return {"status": "healthy", "service": "Recommendation API"}


@router.get(
    "/{recommendation_id}",
    response_model=SingleRecommendationResponse,
    summary="Retrieve a single recommendation",
    description=(
        "Looks up a diet plan by its unique MongoDB ObjectId. Returns "
        "``404`` when no document matches the given ID."
    ),
)
async def get_recommendation(
    recommendation_id: str,
) -> Any:
    """
    Fetch a specific recommendation.

    Args:
        recommendation_id: 24-character MongoDB ObjectId.

    Returns:
        SingleRecommendationResponse with the full recommendation.

    Raises:
        HTTPException(404): If the recommendation does not exist.
        HTTPException(400): If ``recommendation_id`` is malformed.
    """
    _validate_object_id(recommendation_id)
    logger.info("Fetching recommendation: %s", recommendation_id)

    result = get_recommendation_by_id(recommendation_id)

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("message", "Recommendation not found"),
        )

    return result


@router.delete(
    "/{recommendation_id}",
    response_model=MessageResponse,
    summary="Delete a recommendation",
    description=(
        "Permanently removes a diet plan recommendation from the database. "
        "Returns a confirmation message on success."
    ),
)
async def delete_recommendation_endpoint(
    recommendation_id: str,
) -> Any:
    """
    Delete a recommendation by ID.

    Args:
        recommendation_id: 24-character MongoDB ObjectId.

    Returns:
        MessageResponse confirming deletion.

    Raises:
        HTTPException(404): If no document matches the given ID.
        HTTPException(400): If ``recommendation_id`` is malformed.
    """
    _validate_object_id(recommendation_id)
    logger.info("Deleting recommendation: %s", recommendation_id)

    result = delete_recommendation(recommendation_id)

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("message", "Recommendation not found"),
        )

    return result


@router.post(
    "/{recommendation_id}/regenerate",
    response_model=RecommendationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Regenerate a diet plan from an existing recommendation",
    description=(
        "Uses the original user profile stored in a previous recommendation "
        "to generate a brand-new diet plan. The original recommendation is "
        "preserved; the result is saved as a separate document."
    ),
)
async def regenerate(
    recommendation_id: str,
) -> Any:
    """
    Regenerate a diet plan using parameters from an existing recommendation.

    Args:
        recommendation_id: 24-character MongoDB ObjectId of the source.

    Returns:
        RecommendationResponse with the newly generated plan.

    Raises:
        HTTPException(404): If the source recommendation does not exist.
        HTTPException(400): If ``recommendation_id`` is malformed or
            the original request parameters are missing.
    """
    _validate_object_id(recommendation_id)
    logger.info("Regenerating diet plan from: %s", recommendation_id)

    result = regenerate_recommendation(recommendation_id)

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("message", "Failed to regenerate recommendation"),
        )

    return result
