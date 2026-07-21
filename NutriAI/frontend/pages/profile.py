"""
NutriAI Health Profile Page.

Interactive form using Streamlit widgets for capturing:
    - Personal information
    - Body measurements
    - Lifestyle & goals
    - Dietary restrictions
    - Daily habits

Includes Save Profile and Reset buttons.
"""

from __future__ import annotations

import streamlit as st

from components.forms import render_profile_form
from services.api import save_profile as api_save_profile
from utils.validators import validate_profile_form


def show() -> None:
    """Render the Health Profile page."""
    st.title("👤 Health Profile")
    st.markdown("Tell us about yourself so we can personalise your diet plan.")

    # Load existing profile from session state (if any)
    saved = st.session_state.get("saved_profile", {})

    with st.form("health_profile_form"):
        profile_data = render_profile_form(defaults=saved)

        col_btn1, col_btn2, col_btn3 = st.columns([1, 1, 3])
        with col_btn1:
            submitted = st.form_submit_button(
                "💾 Save Profile",
                type="primary",
                use_container_width=True,
            )
        with col_btn2:
            reset = st.form_submit_button(
                "🔄 Reset",
                use_container_width=True,
            )

    # ---- Handle form submission -------------------------------------------
    if submitted:
        errors = validate_profile_form(profile_data)

        if errors:
            for err in errors:
                st.error(err)
        else:
            with st.spinner("Saving your profile..."):
                try:
                    result = api_save_profile(profile_data)
                    st.session_state["saved_profile"] = profile_data
                    st.toast("✅ Profile saved successfully!", icon="✅")
                    st.success("Your health profile has been saved.")
                except Exception as exc:
                    st.error(f"Failed to save profile: {exc}")

    # ---- Handle reset -----------------------------------------------------
    if reset:
        st.session_state.pop("saved_profile", None)
        st.rerun()

    # ---- Show saved profile summary (collapsible) -------------------------
    if saved:
        st.markdown("---")
        with st.expander("📋 View Saved Profile Details", expanded=False):
            col_a, col_b = st.columns(2)

            with col_a:
                st.markdown("**Personal Info**")
                st.write(f"- Name: {saved.get('full_name', '--')}")
                st.write(f"- Age: {saved.get('age', '--')}")
                st.write(f"- Gender: {saved.get('gender', '--')}")

                st.markdown("**Body Measurements**")
                st.write(f"- Height: {saved.get('height', '--')} cm")
                st.write(f"- Weight: {saved.get('weight', '--')} kg")
                st.write(f"- Target: {saved.get('target_weight', '--')} kg")

            with col_b:
                st.markdown("**Lifestyle**")
                st.write(f"- Activity: {saved.get('activity_level', '--')}")
                st.write(f"- Goal: {saved.get('goal', '--')}")
                st.write(f"- Food Pref: {saved.get('food_preference', '--')}")

                st.markdown("**Dietary Restrictions**")
                allergies = saved.get("allergies", [])
                medical = saved.get("medical_conditions", [])
                exclude = saved.get("exclude_ingredients", [])
                st.write(f"- Allergies: {', '.join(allergies) if allergies else 'None'}")
                st.write(f"- Medical: {', '.join(medical) if medical else 'None'}")
                st.write(f"- Exclude: {', '.join(exclude) if exclude else 'None'}")

                st.markdown("**Daily Habits**")
                st.write(f"- Meals: {saved.get('meals_per_day', '--')}")
                st.write(f"- Water: {saved.get('water_intake_goal', '--')} glasses")
                st.write(f"- Sleep: {saved.get('sleep_hours', '--')} hours")
