"""
NutriAI Utility Helpers.

Shared helper functions used across Streamlit pages and components.
"""

from __future__ import annotations

import hashlib
from datetime import datetime
from typing import Any, Dict, List, Optional


# ---------------------------------------------------------------------------
# Session State helpers
# ---------------------------------------------------------------------------


def init_session_key(key: str, default: Any = None) -> None:
    """Initialize a session state key if it doesn't exist.

    Args:
        key: Session state key name.
        default: Default value to set.
    """
    import streamlit as st

    if key not in st.session_state:
        st.session_state[key] = default


def get_session(key: str, default: Any = None) -> Any:
    """Safely retrieve a session state value.

    Args:
        key: Session state key name.
        default: Fallback value if key doesn't exist.

    Returns:
        Stored value or default.
    """
    import streamlit as st

    return st.session_state.get(key, default)


# ---------------------------------------------------------------------------
# Formatting
# ---------------------------------------------------------------------------


def format_calories(value: float) -> str:
    """Format a calorie number with a comma separator.

    Args:
        value: Calorie count.

    Returns:
        Formatted string like "2,000 kcal".
    """
    return f"{value:,.0f} kcal"


def format_grams(value: float) -> str:
    """Format a gram value to one decimal place.

    Args:
        value: Grams.

    Returns:
        Formatted string like "45.2 g".
    """
    return f"{value:.1f} g"


def format_date(iso_string: str) -> str:
    """Convert an ISO datetime string to a readable format.

    Args:
        iso_string: ISO 8601 datetime string.

    Returns:
        Formatted string like "21 Jul 2026, 2:30 PM".
    """
    try:
        dt = datetime.fromisoformat(iso_string.replace("Z", "+00:00"))
        return dt.strftime("%d %b %Y, %I:%M %p")
    except (ValueError, AttributeError):
        return iso_string


def format_bmi_category(bmi: float) -> str:
    """Return the WHO BMI category for a given BMI value.

    Args:
        bmi: Body Mass Index value.

    Returns:
        Category string.
    """
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal Weight"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"


# ---------------------------------------------------------------------------
# Color mapping
# ---------------------------------------------------------------------------


def bmi_category_color(bmi: float) -> str:
    """Return a hex color code for a BMI category.

    Args:
        bmi: Body Mass Index value.

    Returns:
        Hex color string.
    """
    if bmi < 18.5:
        return "#3498db"  # blue
    elif bmi < 25:
        return "#27ae60"  # green
    elif bmi < 30:
        return "#f39c12"  # orange
    else:
        return "#e74c3c"  # red


# ---------------------------------------------------------------------------
# Daily health tips
# ---------------------------------------------------------------------------

_HEALTH_TIPS: List[str] = [
    "Drink a glass of water before each meal to help control appetite.",
    "Aim for at least 7–8 hours of quality sleep each night.",
    "Include protein with every meal to maintain muscle mass.",
    "Walk for 30 minutes daily to boost cardiovascular health.",
    "Eat at least 5 portions of fruits and vegetables every day.",
    "Limit added sugar to less than 10% of your daily calories.",
    "Practice mindful eating—chew slowly and savour each bite.",
    "Choose whole grains over refined carbohydrates.",
    "Stay hydrated—dehydration often masquerades as hunger.",
    "Plan your meals ahead of time to avoid impulsive eating.",
    "Include healthy fats like nuts, seeds, and olive oil.",
    "Don't skip breakfast—it kick-starts your metabolism.",
    "Eat the rainbow: variety of colours means variety of nutrients.",
    "Reduce sodium intake by seasoning with herbs and spices.",
    "Take short breaks to stretch if you sit for long hours.",
]


def daily_health_tip() -> str:
    """Return a deterministic daily health tip based on today's date.

    Returns:
        A health tip string.
    """
    today = datetime.utcnow().strftime("%Y-%m-%d")
    index = int(hashlib.md5(today.encode()).hexdigest(), 16) % len(_HEALTH_TIPS)
    return _HEALTH_TIPS[index]


# ---------------------------------------------------------------------------
# Mapping from profile to recommendation request
# ---------------------------------------------------------------------------


def profile_to_request(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a full HealthProfile dict to a RecommendationRequest dict.

    The backend schemas use slightly different enum values for
    activity_level, goal, and food_preference. This helper normalises
    them.

    Args:
        profile: HealthProfile dictionary.

    Returns:
        RecommendationRequest dictionary.
    """
    # Activity level mapping
    activity_map = {
        "Sedentary": "Sedentary",
        "Lightly Active": "Light",
        "Moderately Active": "Moderate",
        "Very Active": "Active",
        "Athlete": "Very Active",
    }

    # Goal mapping
    goal_map = {
        "Lose Weight": "Weight Loss",
        "Maintain Weight": "Maintenance",
        "Gain Weight": "Weight Gain",
        "Muscle Gain": "Weight Gain",
        "Healthy Lifestyle": "Maintenance",
    }

    # Food preference mapping
    food_map = {
        "Vegetarian": "Vegetarian",
        "Non Vegetarian": "Non-Vegetarian",
        "Vegan": "Vegan",
        "Eggetarian": "Vegetarian",
        "Jain": "Vegetarian",
    }

    return {
        "age": profile.get("age", 25),
        "gender": profile.get("gender", "Male"),
        "height": profile.get("height", 170),
        "weight": profile.get("weight", 70),
        "activity_level": activity_map.get(
            profile.get("activity_level", "Sedentary"), "Sedentary"
        ),
        "goal": goal_map.get(profile.get("goal", "Maintain Weight"), "Maintenance"),
        "food_preference": food_map.get(
            profile.get("food_preference", "Non Vegetarian"), "Non-Vegetarian"
        ),
        "allergies": profile.get("allergies", []),
        "medical_conditions": profile.get("medical_conditions", []),
        "meals_per_day": profile.get("meals_per_day", 4),
    }
