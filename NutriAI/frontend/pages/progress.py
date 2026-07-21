"""
NutriAI Progress Page.

Displays health progress over time using Plotly charts:
    - Weight progress
    - BMI progress
    - Calorie tracking
    - Nutrition summary (radar)
    - Water intake
"""

from __future__ import annotations

from typing import Any, Dict, List

import streamlit as st

from components.charts import (
    bmi_progress_chart,
    calories_bar_chart,
    macro_pie_chart,
    nutrition_radar_chart,
    water_intake_chart,
    weight_progress_chart,
)
from components.cards import info_card
from services.api import get_recommendation_history
from utils.helpers import format_calories


def show() -> None:
    """Render the Progress page."""
    st.title("📈 Progress")
    st.markdown("Track your health journey over time.")

    # ---- Fetch recommendation history for progress data ------------------
    try:
        history = get_recommendation_history(limit=100)
        recommendations: List[Dict[str, Any]] = (
            history.get("recommendations", []) if history.get("success") else []
        )
    except Exception as exc:
        st.error(f"Failed to load progress data: {exc}")
        recommendations = []

    if not recommendations:
        info_card(
            title="No Progress Data Yet",
            content="Generate some meal plans from the **🥗 Diet Planner** page to start tracking your progress over time.",
            icon="📊",
            variant="info",
        )
        if st.button("Go to Diet Planner"):
            st.session_state.selected_page = "🥗 Diet Planner"
            st.rerun()
        return

    # Reverse so oldest is first for charts
    plans = list(reversed(recommendations))

    # ---- Extract data points ----------------------------------------------
    dates: List[str] = []
    weights: List[float] = []
    bmis: List[float] = []
    calories_list: List[float] = []
    protein_list: List[float] = []
    carbs_list: List[float] = []
    fat_list: List[float] = []
    fiber_list: List[float] = []

    profile = st.session_state.get("saved_profile", {})
    current_weight = profile.get("weight")

    for plan in plans:
        created = plan.get("created_at", "")
        if created:
            # Use just the date portion for cleaner x-axis
            dates.append(created[:10])

        # Weight — use profile weight for latest, otherwise estimate via BMI
        # (BMI = weight / height^2, so weight = BMI * height^2)
        height_m = (profile.get("height", 170) / 100) or 1.7
        bmi_val = plan.get("bmi", 0)
        bmis.append(bmi_val)

        # Estimate weight from BMI if we don't have actual weight
        estimated_weight = bmi_val * (height_m ** 2)
        weights.append(estimated_weight)

        daily = plan.get("daily_plan", {})
        calories_list.append(plan.get("daily_calories", 0))
        protein_list.append(daily.get("total_protein", 0))
        carbs_list.append(daily.get("total_carbohydrates", 0))
        fat_list.append(daily.get("total_fat", 0))
        fiber_list.append(daily.get("total_fiber", 0))

    # ---- Tab layout -------------------------------------------------------
    tab1, tab2, tab3 = st.tabs(["📉 Weight & BMI", "🍎 Nutrition", "💧 Water"])

    # --- Tab 1: Weight & BMI ---
    with tab1:
        col_w, col_b = st.columns(2)

        with col_w:
            target_weight = profile.get("target_weight")
            weight_progress_chart(
                dates=dates,
                weights=weights,
                target_weight=target_weight,
            )

        with col_b:
            bmi_progress_chart(
                dates=dates,
                bmi_values=bmis,
            )

        # Latest values
        if dates:
            st.info(
                f"📏 **Latest BMI:** {bmis[-1]:.1f}  |  "
                f"⚖️ **Est. Weight:** {weights[-1]:.1f} kg"
            )

    # --- Tab 2: Nutrition ---
    with tab2:
        col_c, col_m = st.columns([1, 1])

        with col_c:
            latest_cal = calories_list[-1] if calories_list else 0
            target_cal = plans[-1].get("daily_plan", {}).get("target_daily_calories", 2000)
            calories_bar_chart(
                consumed=latest_cal,
                target=target_cal,
            )
            if latest_cal:
                st.caption(
                    f"Latest plan: {format_calories(latest_cal)} of "
                    f"{format_calories(target_cal)} target"
                )

        with col_m:
            if protein_list and carbs_list and fat_list:
                macro_pie_chart(
                    protein=protein_list[-1],
                    carbs=carbs_list[-1],
                    fat=fat_list[-1],
                )

        # Radar chart showing latest vs target
        st.markdown("---")
        st.subheader("🎯 Target vs Actual (Latest Plan)")
        latest = plans[-1]
        daily = latest.get("daily_plan", {})
        nutrition_radar_chart(
            protein=daily.get("total_protein", 0),
            protein_target=daily.get("target_protein", 100),
            carbs=daily.get("total_carbohydrates", 0),
            carbs_target=daily.get("target_carbohydrates", 250),
            fat=daily.get("total_fat", 0),
            fat_target=daily.get("target_fat", 65),
            fiber=daily.get("total_fiber", 0),
            fiber_target=25,
        )

    # --- Tab 3: Water ---
    with tab3:
        water_goal = profile.get("water_intake_goal", 8)

        col_w1, col_w2 = st.columns([1, 2])

        with col_w1:
            st.markdown("### 💧 Daily Water Intake")
            glasses_drunk = st.slider(
                "Glasses consumed today",
                min_value=0,
                max_value=water_goal + 2,
                value=min(water_goal // 2, water_goal),
                key="water_slider",
            )

        with col_w2:
            water_intake_chart(
                glasses_drunk=glasses_drunk,
                glasses_goal=water_goal,
            )

        water_liters = latest.get("daily_plan", {}).get("recommended_water_liters", 2.0)
        st.info(
            f"💡 **Recommended daily intake:** {water_liters:.1f}L "
            f"(≈ {water_goal} glasses). "
            f"Try to spread water consumption evenly throughout the day."
        )
