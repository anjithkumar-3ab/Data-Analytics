"""
NutriAI Dashboard Page.

Displays:
    - Welcome card
    - Health metrics (weight, BMI, calories, water)
    - Today's nutrition summary
    - Today's meal plan preview
    - Quick actions
    - Daily health tip
"""

from __future__ import annotations

import streamlit as st

from components.cards import (
    health_tip_card,
    info_card,
    metric_card,
    welcome_card,
)
from components.metrics import health_metric_row
from services.api import get_recommendation_history
from utils.helpers import (
    daily_health_tip,
    format_bmi_category,
    format_calories,
    bmi_category_color,
)


def show() -> None:
    """Render the Dashboard page."""
    st.title("🏠 Dashboard")
    st.markdown("Your health at a glance.")

    # Welcome card
    profile = st.session_state.get("saved_profile", {})
    name = profile.get("full_name", "there")
    welcome_card(name)

    # ---- Health Metrics Row -----------------------------------------------
    st.subheader("📊 Health Overview")

    weight = profile.get("weight")
    target_weight = profile.get("target_weight")
    height = profile.get("height")

    # Calculate BMI if we have data
    bmi = None
    bmi_category = "--"
    bmi_color = "#888"
    if height and weight and height > 0:
        bmi = weight / ((height / 100) ** 2)
        bmi_category = format_bmi_category(bmi)
        bmi_color = bmi_category_color(bmi)

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        metric_card(
            label="Current Weight",
            value=f"{weight:.1f} kg" if weight else "-- kg",
            icon="⚖️",
            color="#2e7d32",
        )

    with col2:
        metric_card(
            label="Target Weight",
            value=f"{target_weight:.1f} kg" if target_weight else "-- kg",
            icon="🎯",
            color="#1565c0",
        )

    with col3:
        metric_card(
            label="BMI",
            value=f"{bmi:.1f}" if bmi else "--",
            delta=bmi_category,
            icon="📏",
            color=bmi_color,
        )

    with col4:
        water_goal = profile.get("water_intake_goal", 8)
        metric_card(
            label="Water Goal",
            value=f"{water_goal} glasses",
            icon="💧",
            color="#2196f3",
        )

    # ---- Today's Nutrition (from latest recommendation) -------------------
    st.markdown("---")
    st.subheader("🥙 Today's Nutrition")

    try:
        history = get_recommendation_history(limit=1)
        latest_plan = None
        if history.get("success") and history.get("recommendations"):
            latest_plan = history["recommendations"][0]
    except Exception:
        latest_plan = None

    if latest_plan:
        daily = latest_plan.get("daily_plan", {})
        total_cal = latest_plan.get("daily_calories", 2000)
        target_cal = daily.get("target_daily_calories", total_cal)

        col_a, col_b, col_c, col_d = st.columns(4)
        with col_a:
            st.metric("🎯 Daily Calories", format_calories(total_cal),
                      delta=f"Target: {format_calories(target_cal)}")
        with col_b:
            protein = daily.get("total_protein", 0)
            target_p = daily.get("target_protein", 100)
            st.metric("🥩 Protein", f"{protein:.1f}g",
                      delta=f"Target: {target_p:.1f}g")
        with col_c:
            carbs = daily.get("total_carbohydrates", 0)
            target_c = daily.get("target_carbohydrates", 250)
            st.metric("🍞 Carbs", f"{carbs:.1f}g",
                      delta=f"Target: {target_c:.1f}g")
        with col_d:
            fat = daily.get("total_fat", 0)
            target_f = daily.get("target_fat", 65)
            st.metric("🧈 Fat", f"{fat:.1f}g",
                      delta=f"Target: {target_f:.1f}g")

        # BMI info
        user_bmi = latest_plan.get("bmi", bmi)
        user_bmi_cat = latest_plan.get("bmi_category", bmi_category)

        st.info(
            f"📏 **BMI:** {user_bmi:.1f} ({user_bmi_cat}) | "
            f"🔥 **BMR:** {latest_plan.get('bmr', '--')} kcal | "
            f"⚡ **TDEE:** {latest_plan.get('tdee', '--')} kcal"
        )
    else:
        info_card(
            title="No Meal Plan Yet",
            content="Generate your first personalized diet plan from the **🥗 Diet Planner** page.",
            icon="🥗",
            variant="info",
        )

    # ---- Quick Actions ----------------------------------------------------
    st.markdown("---")
    st.subheader("⚡ Quick Actions")

    qcol1, qcol2, qcol3 = st.columns(3)
    with qcol1:
        if st.button("🥗 Generate Diet Plan", use_container_width=True, type="primary"):
            st.session_state.selected_page = "🥗 Diet Planner"
            st.rerun()
    with qcol2:
        if st.button("👤 Update Profile", use_container_width=True):
            st.session_state.selected_page = "👤 Health Profile"
            st.rerun()
    with qcol3:
        if st.button("📈 View Progress", use_container_width=True):
            st.session_state.selected_page = "📈 Progress"
            st.rerun()

    # ---- Daily Health Tip -------------------------------------------------
    health_tip_card(daily_health_tip())
