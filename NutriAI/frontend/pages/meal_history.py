"""
NutriAI Meal History Page.

Displays previous meal plans with search and date filtering.
Allows viewing details and deleting old recommendations.
"""

from __future__ import annotations

import streamlit as st

from components.cards import info_card, meal_card
from services.api import (
    delete_recommendation,
    get_recommendation_by_id,
    get_recommendation_history,
)
from utils.helpers import format_calories, format_date


def show() -> None:
    """Render the Meal History page."""
    st.title("📜 Meal History")
    st.markdown("Browse and manage your previously generated meal plans.")

    # ---- Fetch history ----------------------------------------------------
    try:
        history = get_recommendation_history(limit=50)
    except Exception as exc:
        st.error(f"Failed to load meal history: {exc}")
        return

    recommendations = history.get("recommendations", [])

    if not recommendations:
        info_card(
            title="No Meal Plans Yet",
            content="You haven't generated any meal plans yet. Head over to the **🥗 Diet Planner** to create your first one!",
            icon="🍽️",
            variant="info",
        )
        if st.button("Go to Diet Planner"):
            st.session_state.selected_page = "🥗 Diet Planner"
            st.rerun()
        return

    # ---- Search and Filter -------------------------------------------------
    col_search, col_filter = st.columns([2, 1])

    with col_search:
        search_term = st.text_input(
            "🔍 Search plans",
            placeholder="Search by food preference, goal...",
            key="history_search",
        )

    with col_filter:
        sort_order = st.selectbox(
            "Sort by",
            options=["Newest First", "Oldest First"],
            key="history_sort",
        )

    # ---- Filter and sort --------------------------------------------------
    filtered = recommendations

    if search_term:
        term = search_term.lower()
        filtered = [
            r
            for r in filtered
            if term in str(r.get("food_preference", "")).lower()
            or term in str(r.get("goal", "")).lower()
            or term in str(r.get("bmi_category", "")).lower()
        ]

    if sort_order == "Oldest First":
        filtered = list(reversed(filtered))

    st.markdown(f"*Showing {len(filtered)} of {len(recommendations)} plans*")

    # ---- Display plans ----------------------------------------------------
    if not filtered:
        st.info("No plans match your search criteria.")
        return

    for i, plan in enumerate(filtered):
        with st.container():
            _render_plan_card(plan, index=i)


def _render_plan_card(plan: dict, index: int) -> None:
    """Render a single meal history card with expandable details.

    Args:
        plan: Recommendation dict from the API.
        index: Unique index for Streamlit keying.
    """
    plan_id = plan.get("recommendation_id", str(index))
    created = plan.get("created_at", "")
    bmi = plan.get("bmi", 0)
    bmi_cat = plan.get("bmi_category", "--")
    calories = plan.get("daily_calories", 0)
    food_pref = plan.get("food_preference", "--")
    goal = plan.get("goal", "")

    # Header row
    col_main, col_action = st.columns([4, 1])

    with col_main:
        st.markdown(
            f"""
            <div style="
                background: white;
                border: 1.5px solid #c8e6c9;
                border-radius: 10px;
                padding: 0.75rem 1rem;
                margin-bottom: 0.25rem;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="font-size:1rem;">{food_pref} Meal Plan</strong>
                        <span style="color:#888; font-size:0.8rem; margin-left:0.5rem;">
                            {format_date(created)}
                        </span>
                    </div>
                    <div style="color:#2e7d32; font-weight:700;">
                        {format_calories(calories)}
                    </div>
                </div>
                <div style="font-size:0.8rem; color:#666; margin-top:0.25rem;">
                    BMI: {bmi:.1f} ({bmi_cat}) | Goal: {goal}
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    with col_action:
        if st.button("🗑️ Delete", key=f"del_{plan_id}_{index}"):
            try:
                result = delete_recommendation(plan_id)
                if result.get("success"):
                    st.toast("✅ Plan deleted!", icon="🗑️")
                    st.rerun()
                else:
                    st.error(result.get("message", "Delete failed"))
            except Exception as exc:
                st.error(f"Delete failed: {exc}")

    # Expandable detail
    with st.expander(f"View Details", expanded=False):
        daily = plan.get("daily_plan", {})

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

        # Regenerate from this plan
        if plan_id:
            if st.button("🔄 Regenerate from this plan", key=f"regen_{plan_id}_{index}"):
                with st.spinner("Regenerating..."):
                    try:
                        from services.api import regenerate_diet_plan
                        new_plan = regenerate_diet_plan(plan_id)
                        if new_plan.get("success"):
                            st.session_state["last_diet_plan"] = new_plan
                            st.toast("✅ Plan regenerated!", icon="✅")
                            st.rerun()
                        else:
                            st.error(new_plan.get("message", "Regeneration failed"))
                    except Exception as exc:
                        st.error(f"Regeneration failed: {exc}")
