"""
NutriAI Sidebar Navigation Component.

Renders the application sidebar with navigation links and branding.
"""

from __future__ import annotations

import streamlit as st


# ---------------------------------------------------------------------------
# Page configuration map
# ---------------------------------------------------------------------------

PAGES: dict[str, dict] = {
    "🏠 Dashboard": {
        "page": "pages/dashboard.py",
        "icon": "🏠",
    },
    "👤 Health Profile": {
        "page": "pages/profile.py",
        "icon": "👤",
    },
    "🥗 Diet Planner": {
        "page": "pages/diet_planner.py",
        "icon": "🥗",
    },
    "📜 Meal History": {
        "page": "pages/meal_history.py",
        "icon": "📜",
    },
    "📈 Progress": {
        "page": "pages/progress.py",
        "icon": "📈",
    },
    "⚙ Settings": {
        "page": "pages/settings.py",
        "icon": "⚙",
    },
}


def render_sidebar() -> str:
    """Render the NutriAI sidebar navigation.

    Returns:
        The label of the currently selected page.
    """
    with st.sidebar:
        _render_branding()
        st.markdown("---")
        return _render_navigation()


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _render_branding() -> None:
    """Render the NutriAI branding header."""
    st.markdown(
        """
        <div style="text-align: center; padding: 1rem 0;">
            <h1 style="
                color: #2e7d32;
                font-size: 1.8rem;
                margin: 0;
                font-weight: 800;
            ">🥗 NutriAI</h1>
            <p style="
                color: #1976d2;
                font-size: 0.8rem;
                margin: 0.25rem 0 0 0;
            ">AI-Powered Diet Planning</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _render_navigation() -> str:
    """Render the navigation buttons and return the selected page.

    Returns:
        Selected page label.
    """
    # Initialize selected page in session state
    if "selected_page" not in st.session_state:
        st.session_state.selected_page = "🏠 Dashboard"

    selected = st.session_state.selected_page

    # Navigation buttons styled as a vertical button group
    for label, info in PAGES.items():
        is_active = selected == label

        # Dynamic styling based on active state
        bg = "#e8f5e9" if is_active else "transparent"
        border = "3px solid #2e7d32" if is_active else "1px solid transparent"
        text_color = "#1b5e20" if is_active else "#333333"
        weight = "700" if is_active else "400"

        button_html = f"""
        <div style="
            background: {bg};
            border-left: {border};
            padding: 0.6rem 0.75rem;
            margin: 0.15rem 0;
            border-radius: 0 8px 8px 0;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: {weight};
            color: {text_color};
            font-size: 0.95rem;
        " onclick="console.log('{label}')">
            {info['icon']} {label}
        </div>
        """

        # Use Streamlit button for reliable interaction
        if st.sidebar.button(
            f"{info['icon']}  {label}",
            key=f"nav_{label}",
            use_container_width=True,
            type="primary" if is_active else "secondary",
        ):
            st.session_state.selected_page = label
            st.rerun()

    st.markdown("---")

    # App info footer
    st.markdown(
        """
        <div style="
            text-align: center;
            font-size: 0.7rem;
            color: #999;
            padding: 0.5rem;
        ">
            NutriAI v1.0.0<br>
            © 2026 NutriAI
        </div>
        """,
        unsafe_allow_html=True,
    )

    return st.session_state.selected_page
