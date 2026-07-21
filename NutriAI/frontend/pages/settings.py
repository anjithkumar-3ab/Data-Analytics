"""
NutriAI Settings Page.

Application settings:
    - Theme customization
    - Units preferences
    - Notification settings
    - About / version info
"""

from __future__ import annotations

import streamlit as st


def show() -> None:
    """Render the Settings page."""
    st.title("⚙ Settings")
    st.markdown("Customize your NutriAI experience.")

    tab1, tab2, tab3, tab4 = st.tabs(["🎨 Theme", "📏 Units", "🔔 Notifications", "ℹ️ About"])

    # ---- Theme Tab --------------------------------------------------------
    with tab1:
        st.subheader("Application Theme")

        current_theme = st.session_state.get("theme", "Healthcare (Default)")

        theme = st.selectbox(
            "Color Theme",
            options=["Healthcare (Default)", "Light", "Dark"],
            index=0 if current_theme == "Healthcare (Default)" else
                   1 if current_theme == "Light" else 2,
            key="settings_theme",
        )

        st.session_state["theme"] = theme

        st.markdown("### Preview")
        col_a, col_b, col_c = st.columns(3)
        with col_a:
            st.metric("Primary", "#2e7d32", delta="Green 800")
        with col_b:
            st.metric("Secondary", "#1565c0", delta="Blue 800")
        with col_c:
            st.metric("Accent", "#ffc107", delta="Amber")

        st.info("⚠️ Theme changes take full effect after restarting the application.")

    # ---- Units Tab --------------------------------------------------------
    with tab2:
        st.subheader("Measurement Units")

        current_weight_unit = st.session_state.get("weight_unit", "Metric (kg)")
        current_height_unit = st.session_state.get("height_unit", "Metric (cm)")

        weight_unit = st.radio(
            "Weight Unit",
            options=["Metric (kg)", "Imperial (lbs)"],
            index=0 if current_weight_unit.startswith("Metric") else 1,
            horizontal=True,
            key="settings_weight_unit",
        )
        st.session_state["weight_unit"] = weight_unit

        height_unit = st.radio(
            "Height Unit",
            options=["Metric (cm)", "Imperial (ft/in)"],
            index=0 if current_height_unit.startswith("Metric") else 1,
            horizontal=True,
            key="settings_height_unit",
        )
        st.session_state["height_unit"] = height_unit

        st.success(f"✅ Using: {weight_unit} | {height_unit}")

    # ---- Notifications Tab ------------------------------------------------
    with tab3:
        st.subheader("Notification Preferences")

        notify_meal = st.checkbox(
            "🍽️ Meal Plan Reminders",
            value=st.session_state.get("notify_meal", True),
            key="settings_notify_meal",
        )
        st.session_state["notify_meal"] = notify_meal

        notify_water = st.checkbox(
            "💧 Water Intake Reminders",
            value=st.session_state.get("notify_water", True),
            key="settings_notify_water",
        )
        st.session_state["notify_water"] = notify_water

        notify_progress = st.checkbox(
            "📈 Weekly Progress Summary",
            value=st.session_state.get("notify_progress", False),
            key="settings_notify_progress",
        )
        st.session_state["notify_progress"] = notify_progress

        st.info(
            "📬 Notifications are stored in your session. "
            "Email/push notifications can be configured in future updates."
        )

        if st.button("💾 Save Notification Settings", use_container_width=True):
            st.toast("✅ Notification settings saved!", icon="✅")

    # ---- About Tab --------------------------------------------------------
    with tab4:
        st.subheader("About NutriAI")

        st.markdown(
            """
            **NutriAI** is an AI-powered personalized diet planning and
            recommendation system. It generates intelligent daily meal plans
            based on your health profile, dietary preferences, allergies,
            and fitness goals.

            ---

            ### 🛠️ Tech Stack

            | Layer      | Technology          |
            |------------|---------------------|
            | Frontend   | Streamlit           |
            | Backend    | FastAPI             |
            | Database   | MongoDB Atlas       |
            | Charts     | Plotly              |

            ---

            ### 📦 Version

            **NutriAI v1.0.0**

            ---

            ### 👨‍💻 Developer

            Built with ❤️ for healthier lives.

            ---

            ### 📄 License

            Proprietary. All rights reserved © 2026 NutriAI.
            """,
        )

        # ---- API Health Check ---------------------------------------------
        st.markdown("---")
        st.subheader("🔌 API Connection Status")

        if st.button("🔍 Check Backend Connection", use_container_width=True):
            with st.spinner("Checking backend..."):
                try:
                    from services.api import health_check

                    result = health_check()
                    status = result.get("status", "unknown")
                    db_status = result.get("database", "unknown")

                    if status == "healthy":
                        st.success(
                            f"✅ Backend: **{status}**  |  "
                            f"Database: **{db_status}**"
                        )
                    else:
                        st.warning(
                            f"⚠️ Backend: **{status}**  |  "
                            f"Database: **{db_status}**"
                        )
                except Exception as exc:
                    st.error(f"❌ Cannot connect to backend: {exc}")
