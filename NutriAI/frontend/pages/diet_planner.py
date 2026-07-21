"""
NutriAI Diet Planner Page.

Allows the user to:
    - Review their health profile
    - Choose meal preferences
    - Generate a personalized diet plan
    - View the generated meal plan with loading spinner
"""

from __future__ import annotations

import streamlit as st

from components.cards import info_card, meal_card
from components.forms import render_meal_preferences
from components.metrics import (
    health_metric_row,
    macro_summary_row,
    render_bmi_display,
)
from services.api import generate_diet_plan as api_generate
from utils.helpers import (
    bmi_category_color,
    format_bmi_category,
    format_calories,
    profile_to_request,
)


def show() -> None:
    """Render the Diet Planner page."""
    st.title("🥗 Diet Planner")
    st.markdown("Review your profile, set preferences, and generate a personalized meal plan.")

    # Load profile
    profile = st.session_state.get("saved_profile", {})

    if not profile:
        info_card(
            title="No Profile Found",
            content="Please complete your **👤 Health Profile** first so we can generate a personalized diet plan for you.",
            icon="⚠️",
            variant="warning",
        )
        if st.button("Go to Health Profile"):
            st.session_state.selected_page = "👤 Health Profile"
            st.rerun()
        return

    # ---- Profile Summary (expander) ---------------------------------------
    with st.expander("📋 Your Health Profile Summary", expanded=False):
        col_a, col_b = st.columns(2)
        with col_a:
            st.write(f"**Name:** {profile.get('full_name', '--')}")
            st.write(f"**Age:** {profile.get('age', '--')} | **Gender:** {profile.get('gender', '--')}")
            st.write(f"**Height:** {profile.get('height', '--')} cm")
            st.write(f"**Weight:** {profile.get('weight', '--')} kg → Target: {profile.get('target_weight', '--')} kg")
        with col_b:
            st.write(f"**Activity:** {profile.get('activity_level', '--')}")
            st.write(f"**Goal:** {profile.get('goal', '--')}")
            st.write(f"**Food Pref:** {profile.get('food_preference', '--')}")
            st.write(f"**Allergies:** {', '.join(profile.get('allergies', [])) or 'None'}")
            st.write(f"**Medical:** {', '.join(profile.get('medical_conditions', [])) or 'None'}")

    st.markdown("---")

    # ---- Meal Preferences -------------------------------------------------
    st.subheader("🍽️ Customize Your Preferences")
    preferences = render_meal_preferences(defaults=profile)

    # ---- Generate Button --------------------------------------------------
    st.markdown("---")

    if st.button("🚀 Generate Personalized Diet Plan", type="primary", use_container_width=True):
        with st.spinner("🧠 Our AI is crafting your personalized meal plan..."):
            try:
                # Build request payload from profile + preferences
                request_data = profile_to_request(profile)

                # Override with any user adjustments
                if preferences.get("food_preference"):
                    # Map back to recommendation schema format
                    food_map = {
                        "Vegetarian": "Vegetarian",
                        "Non Vegetarian": "Non-Vegetarian",
                        "Vegan": "Vegan",
                        "Eggetarian": "Vegetarian",
                        "Jain": "Vegetarian",
                    }
                    request_data["food_preference"] = food_map.get(
                        preferences["food_preference"], "Non-Vegetarian"
                    )
                if preferences.get("meals_per_day"):
                    request_data["meals_per_day"] = preferences["meals_per_day"]
                if preferences.get("allergies"):
                    request_data["allergies"] = list(set(
                        request_data.get("allergies", []) + preferences["allergies"]
                    ))

                result = api_generate(request_data)

                if result.get("success"):
                    st.session_state["last_diet_plan"] = result
                    st.toast("✅ Diet plan generated successfully!", icon="✅")
                    st.balloons()
                else:
                    st.error(f"Generation failed: {result.get('message', 'Unknown error')}")
            except Exception as exc:
                st.error(f"Failed to generate diet plan: {exc}")

    # ---- Display Last Diet Plan -------------------------------------------
    plan = st.session_state.get("last_diet_plan")
    if plan:
        st.markdown("---")
        st.header("📋 Your Personalized Meal Plan")

        # Health metrics from the response
        bmi_val = plan.get("bmi", 0)
        bmi_cat = plan.get("bmi_category", "--")
        bmi_col = bmi_category_color(bmi_val)

        col1, col2 = st.columns([1, 2])
        with col1:
            render_bmi_display(bmi_val, bmi_cat, bmi_col)

        with col2:
            metrics = [
                {"label": "BMR", "value": f"{plan.get('bmr', '--')} kcal", "icon": "🔥"},
                {"label": "TDEE", "value": f"{plan.get('tdee', '--')} kcal", "icon": "⚡"},
                {"label": "Daily Calories", "value": format_calories(plan.get('daily_calories', 0)), "icon": "🎯"},
                {"label": "Water", "value": f"{plan.get('daily_plan', {}).get('recommended_water_liters', 2)}L", "icon": "💧"},
            ]
            health_metric_row(metrics, columns=2)

        # Macro summary
        daily = plan.get("daily_plan", {})
        st.markdown("---")
        st.subheader("📊 Macronutrient Breakdown")
        macro_summary_row(
            protein=daily.get("total_protein", 0),
            protein_target=daily.get("target_protein", 100),
            carbs=daily.get("total_carbohydrates", 0),
            carbs_target=daily.get("target_carbohydrates", 250),
            fat=daily.get("total_fat", 0),
            fat_target=daily.get("target_fat", 65),
            fiber=daily.get("total_fiber", 0),
        )

        # Meals
        st.markdown("---")
        st.subheader("🍽️ Daily Meal Plan")

        meals = [
            ("Breakfast", daily.get("breakfast", {}), "🌅"),
            ("Lunch", daily.get("lunch", {}), "☀️"),
            ("Dinner", daily.get("dinner", {}), "🌙"),
            ("Snacks", daily.get("snacks", {}), "🍪"),
        ]

        for meal_name, meal_data, icon in meals:
            if meal_data:
                items = meal_data.get("items", [])
                totals = {
                    "total_calories": meal_data.get("total_calories", 0),
                    "total_protein": meal_data.get("total_protein", 0),
                    "total_carbohydrates": meal_data.get("total_carbohydrates", 0),
                    "total_fat": meal_data.get("total_fat", 0),
                }
                meal_card(meal_name, items, totals, icon=icon)

        # Regenerate option
        st.markdown("---")
        reco_id = plan.get("recommendation_id")
        if reco_id:
            col_reg, _ = st.columns([1, 3])
            with col_reg:
                if st.button("🔄 Regenerate Plan", use_container_width=True):
                    with st.spinner("Regenerating..."):
                        try:
                            from services.api import regenerate_diet_plan
                            new_plan = regenerate_diet_plan(reco_id)
                            if new_plan.get("success"):
                                st.session_state["last_diet_plan"] = new_plan
                                st.toast("✅ Plan regenerated!", icon="✅")
                                st.rerun()
                            else:
                                st.error(new_plan.get("message", "Regeneration failed"))
                        except Exception as exc:
                            st.error(f"Regeneration failed: {exc}")
