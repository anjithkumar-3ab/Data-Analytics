"""
NutriAI Frontend API Service.

Centralized HTTP client for communicating with the FastAPI backend.
All Streamlit pages import their API functions from this module.
"""

from __future__ import annotations

import os
from typing import Any, Dict, List, Optional

import requests
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:8000")
TIMEOUT: int = 30  # seconds

# ---------------------------------------------------------------------------
# Low-level helpers
# ---------------------------------------------------------------------------


def _url(path: str) -> str:
    """Build a full API URL from a relative path."""
    return f"{API_BASE_URL.rstrip('/')}{path}"


def _get(path: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Send a GET request and return parsed JSON."""
    response = requests.get(_url(path), params=params, timeout=TIMEOUT)
    response.raise_for_status()
    return response.json()


def _post(path: str, json_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Send a POST request and return parsed JSON."""
    response = requests.post(_url(path), json=json_data, timeout=TIMEOUT)
    response.raise_for_status()
    return response.json()


def _delete(path: str) -> Dict[str, Any]:
    """Send a DELETE request and return parsed JSON."""
    response = requests.delete(_url(path), timeout=TIMEOUT)
    response.raise_for_status()
    return response.json()


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


def health_check() -> Dict[str, Any]:
    """Check backend health status."""
    return _get("/health")


# ---------------------------------------------------------------------------
# Health Profile
# ---------------------------------------------------------------------------


def save_profile(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create or update a health profile.

    Args:
        profile_data: Full HealthProfile payload matching the backend schema.

    Returns:
        API response dict.
    """
    return _post("/profile/", json_data=profile_data)


# ---------------------------------------------------------------------------
# Recommendation / Diet Plan
# ---------------------------------------------------------------------------


def generate_diet_plan(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a personalized diet plan.

    Args:
        request_data: RecommendationRequest payload.

    Returns:
        RecommendationResponse with BMI, BMR, TDEE, daily plan, etc.
    """
    return _post("/recommendation/generate", json_data=request_data)


def get_recommendation_history(
    limit: int = 10,
    skip: int = 0,
) -> Dict[str, Any]:
    """Fetch paginated recommendation history.

    Args:
        limit: Max records (1-100).
        skip: Records to skip.

    Returns:
        HistoryResponse with list of past recommendations.
    """
    return _get("/recommendation/history", params={"limit": limit, "skip": skip})


def get_recommendation_by_id(recommendation_id: str) -> Dict[str, Any]:
    """Fetch a single recommendation by its MongoDB ObjectId.

    Args:
        recommendation_id: 24-character hex string.

    Returns:
        SingleRecommendationResponse.
    """
    return _get(f"/recommendation/{recommendation_id}")


def delete_recommendation(recommendation_id: str) -> Dict[str, Any]:
    """Permanently delete a recommendation.

    Args:
        recommendation_id: 24-character hex string.

    Returns:
        MessageResponse.
    """
    return _delete(f"/recommendation/{recommendation_id}")


def regenerate_diet_plan(recommendation_id: str) -> Dict[str, Any]:
    """Regenerate a diet plan from an existing recommendation.

    Args:
        recommendation_id: Source recommendation ID.

    Returns:
        RecommendationResponse with new plan.
    """
    return _post(f"/recommendation/{recommendation_id}/regenerate")


# ---------------------------------------------------------------------------
# Foods
# ---------------------------------------------------------------------------


def get_all_foods(limit: int = 50) -> Dict[str, Any]:
    """Fetch all foods from the database."""
    return _get("/foods/", params={"limit": limit})


def search_foods(query: str) -> Dict[str, Any]:
    """Search foods by name."""
    return _get("/foods/search", params={"query": query})


def get_foods_by_category(category: str) -> Dict[str, Any]:
    """Get foods filtered by category."""
    return _get(f"/foods/category/{category}")


def get_food_by_id(food_id: str) -> Dict[str, Any]:
    """Get a single food by ID."""
    return _get(f"/foods/{food_id}")
