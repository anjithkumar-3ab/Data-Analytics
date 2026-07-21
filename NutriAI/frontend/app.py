"""
NutriAI Streamlit Frontend — Main Entry Point.

AI-Based Personalized Diet Planning & Recommendation System.

Run with:
    streamlit run frontend/app.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st

# Ensure the frontend directory is on the Python path so that
# `from components.xxx import ...` and `from pages.xxx import ...` work.
_frontend_dir = Path(__file__).resolve().parent
if str(_frontend_dir) not in sys.path:
    sys.path.insert(0, str(_frontend_dir))

from components.sidebar import render_sidebar


# ---------------------------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------------------------

st.set_page_config(
    page_title="NutriAI — AI Diet Planner",
    page_icon="🥗",
    layout="wide",
    initial_sidebar_state="expanded",
)


# ---------------------------------------------------------------------------
# Custom CSS (Healthcare theme: blue & green)
# ---------------------------------------------------------------------------

def _inject_css() -> None:
    """Inject global CSS for the NutriAI healthcare theme."""
    st.markdown(
        """
        <style>
        /* Global font & background */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        html, body, [class*="css"] {
            font-family: 'Inter', sans-serif;
        }

        /* Sidebar styling */
        section[data-testid="stSidebar"] {
            background-color: #f5faf6;
            border-right: 2px solid #c8e6c9;
        }

        /* Buttons */
        .stButton > button {
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
        }

        .stButton > button[kind="primary"] {
            background-color: #2e7d32;
            border-color: #2e7d32;
        }

        .stButton > button[kind="primary"]:hover {
            background-color: #1b5e20;
            border-color: #1b5e20;
        }

        /* Metric cards */
        [data-testid="stMetric"] {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        [data-testid="stMetric"] label {
            color: #666 !important;
        }

        /* Headers */
        h1, h2, h3 {
            color: #1b5e20;
        }

        /* Expanders */
        .streamlit-expanderHeader {
            font-weight: 600;
            color: #2e7d32;
        }

        /* Toast / success */
        div[data-testid="stNotification"] {
            border-radius: 8px;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


# ---------------------------------------------------------------------------
# Page Router
# ---------------------------------------------------------------------------

_PAGE_MODULES: dict[str, str] = {
    "🏠 Dashboard": "pages.dashboard",
    "👤 Health Profile": "pages.profile",
    "🥗 Diet Planner": "pages.diet_planner",
    "📜 Meal History": "pages.meal_history",
    "📈 Progress": "pages.progress",
    "⚙ Settings": "pages.settings",
}


def _render_page(selected: str) -> None:
    """Dynamically import and render the selected page module.

    Args:
        selected: Sidebar navigation label.
    """
    module_name = _PAGE_MODULES.get(selected)
    if module_name is None:
        st.error(f"Unknown page: {selected}")
        return

    try:
        page = __import__(module_name, fromlist=["show"])
        page.show()  # Each page module exposes a `show()` function
    except Exception as exc:
        st.error(f"Failed to load page **{selected}**: {exc}")
        raise


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    """Application entry point."""
    _inject_css()

    # Render sidebar and get selected page
    selected_page = render_sidebar()

    # Render the selected page content
    _render_page(selected_page)


if __name__ == "__main__":
    main()
