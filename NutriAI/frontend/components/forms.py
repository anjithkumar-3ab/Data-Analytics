"""
NutriAI Form Components.

Reusable form widgets and input helpers for the Streamlit frontend.
Used primarily on the Health Profile and Settings pages.
"""

from __future__ import annotations

from typing import Any, Callable, Dict, List, Optional

import streamlit as st


# ---------------------------------------------------------------------------
# Constants for dropdowns / multi-selects
# ---------------------------------------------------------------------------

ACTIVITY_LEVELS: List[str] = [
    "Sedentary",
    "Lightly Active",
    "Moderately Active",
    "Very Active",
    "Athlete",
]

GOALS: List[str] = [
    "Lose Weight",
    "Maintain Weight",
    "Gain Weight",
    "Muscle Gain",
    "Healthy Lifestyle",
]

FOOD_PREFERENCES: List[str] = [
    "Vegetarian",
    "Non Vegetarian",
    "Vegan",
    "Eggetarian",
    "Jain",
]

COMMON_ALLERGIES: List[str] = [
    "Dairy",
    "Gluten",
    "Peanuts",
    "Tree Nuts",
    "Shellfish",
    "Eggs",
    "Soy",
    "Fish",
    "Sesame",
    "Mustard",
    "Corn",
    "Lactose",
]

COMMON_MEDICAL_CONDITIONS: List[str] = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Thyroid",
    "PCOD / PCOS",
    "IBS",
    "Acid Reflux",
    "High Cholesterol",
    "Anemia",
    "Kidney Disease",
    "Gout",
    "Celiac Disease",
]

COMMON_EXCLUDE_INGREDIENTS: List[str] = [
    "Mushroom",
    "Brinjal",
    "Okra",
    "Coconut",
    "Garlic",
    "Onion",
    "Tomato",
    "Potato",
    "Rice",
    "Wheat",
    "Paneer",
    "Cheese",
    "Red Meat",
    "Seafood",
    "Sugar",
]

# ---------------------------------------------------------------------------
# Profile Form
# ---------------------------------------------------------------------------


def render_profile_form(
    defaults: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Render the complete Health Profile form.

    Args:
        defaults: Existing profile values to pre-populate fields.

    Returns:
        Dict of all form field values.
    """
    if defaults is None:
        defaults = {}

    profile_data: Dict[str, Any] = {}

    # ---- Personal Information ---------------------------------------------
    st.subheader("🧑 Personal Information")

    col1, col2 = st.columns(2)
    with col1:
        profile_data["full_name"] = st.text_input(
            "Full Name *",
            value=defaults.get("full_name", ""),
            placeholder="Enter your full name",
            key="form_full_name",
        )
        profile_data["age"] = st.number_input(
            "Age *",
            min_value=1,
            max_value=120,
            value=defaults.get("age", 25),
            key="form_age",
        )
    with col2:
        profile_data["gender"] = st.radio(
            "Gender *",
            options=["Male", "Female"],
            index=0 if defaults.get("gender", "Male") == "Male" else 1,
            horizontal=True,
            key="form_gender",
        )

    # ---- Body Measurements -------------------------------------------------
    st.subheader("📏 Body Measurements")

    col3, col4, col5 = st.columns(3)
    with col3:
        profile_data["height"] = st.number_input(
            "Height (cm) *",
            min_value=50.0,
            max_value=250.0,
            value=float(defaults.get("height", 170.0)),
            step=0.1,
            key="form_height",
        )
    with col4:
        profile_data["weight"] = st.number_input(
            "Weight (kg) *",
            min_value=10.0,
            max_value=300.0,
            value=float(defaults.get("weight", 70.0)),
            step=0.1,
            key="form_weight",
        )
    with col5:
        profile_data["target_weight"] = st.number_input(
            "Target Weight (kg)",
            min_value=10.0,
            max_value=300.0,
            value=float(defaults.get("target_weight", 70.0)),
            step=0.1,
            key="form_target_weight",
        )

    # ---- Lifestyle & Goals -------------------------------------------------
    st.subheader("🎯 Lifestyle & Goals")

    col6, col7 = st.columns(2)
    with col6:
        profile_data["activity_level"] = st.selectbox(
            "Activity Level *",
            options=ACTIVITY_LEVELS,
            index=_safe_index(
                ACTIVITY_LEVELS,
                defaults.get("activity_level", "Sedentary"),
            ),
            key="form_activity_level",
        )
        profile_data["goal"] = st.selectbox(
            "Fitness Goal *",
            options=GOALS,
            index=_safe_index(GOALS, defaults.get("goal", "Healthy Lifestyle")),
            key="form_goal",
        )
    with col7:
        profile_data["food_preference"] = st.selectbox(
            "Food Preference *",
            options=FOOD_PREFERENCES,
            index=_safe_index(
                FOOD_PREFERENCES,
                defaults.get("food_preference", "Non Vegetarian"),
            ),
            key="form_food_pref",
        )

    # ---- Dietary Restrictions ------------------------------------------------
    st.subheader("⚠️ Dietary Restrictions")

    profile_data["allergies"] = st.multiselect(
        "Food Allergies",
        options=COMMON_ALLERGIES,
        default=defaults.get("allergies", []),
        key="form_allergies",
    )

    profile_data["medical_conditions"] = st.multiselect(
        "Medical Conditions",
        options=COMMON_MEDICAL_CONDITIONS,
        default=defaults.get("medical_conditions", []),
        key="form_medical",
    )

    profile_data["exclude_ingredients"] = st.multiselect(
        "Exclude Ingredients",
        options=COMMON_EXCLUDE_INGREDIENTS,
        default=defaults.get("exclude_ingredients", []),
        key="form_exclude",
    )

    # ---- Daily Habits --------------------------------------------------------
    st.subheader("🌅 Daily Habits")

    col8, col9, col10 = st.columns(3)
    with col8:
        profile_data["meals_per_day"] = st.number_input(
            "Meals Per Day",
            min_value=1,
            max_value=10,
            value=defaults.get("meals_per_day", 4),
            key="form_meals",
        )
    with col9:
        profile_data["water_intake_goal"] = st.number_input(
            "Water Goal (glasses)",
            min_value=1,
            max_value=20,
            value=defaults.get("water_intake_goal", 8),
            key="form_water",
        )
    with col10:
        profile_data["sleep_hours"] = st.number_input(
            "Sleep (hours)",
            min_value=0.0,
            max_value=24.0,
            value=float(defaults.get("sleep_hours", 7.0)),
            step=0.5,
            key="form_sleep",
        )

    return profile_data


# ---------------------------------------------------------------------------
# Diet Planner Preferences
# ---------------------------------------------------------------------------


def render_meal_preferences(defaults: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Render a compact meal preference form for the Diet Planner.

    Args:
        defaults: Existing preference values.

    Returns:
        Dict with preference selections.
    """
    if defaults is None:
        defaults = {}

    preferences: Dict[str, Any] = {}

    st.markdown("### 🍽️ Meal Preferences")

    col1, col2 = st.columns(2)
    with col1:
        preferences["food_preference"] = st.selectbox(
            "Food Preference",
            options=FOOD_PREFERENCES,
            index=_safe_index(
                FOOD_PREFERENCES,
                defaults.get("food_preference", "Non Vegetarian"),
            ),
            key="dp_food_pref",
        )
    with col2:
        preferences["meals_per_day"] = st.slider(
            "Meals Per Day",
            min_value=3,
            max_value=6,
            value=defaults.get("meals_per_day", 4),
            key="dp_meals",
        )

    preferences["allergies"] = st.multiselect(
        "Allergies to Exclude",
        options=COMMON_ALLERGIES,
        default=defaults.get("allergies", []),
        key="dp_allergies",
    )

    return preferences


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _safe_index(options: List[str], value: str) -> int:
    """Return the index of a value in a list, defaulting to 0.

    Args:
        options: List of options.
        value: Value to find.

    Returns:
        Index of value, or 0 if not found.
    """
    try:
        return options.index(value)
    except ValueError:
        return 0
