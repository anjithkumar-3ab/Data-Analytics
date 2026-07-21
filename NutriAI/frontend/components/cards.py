"""
NutriAI Card Components.

Reusable card-style UI components for the Streamlit frontend.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

import streamlit as st


def welcome_card(name: str = "there") -> None:
    """Render a welcome greeting card.

    Args:
        name: User's name to greet.
    """
    st.markdown(
        f"""
        <div style="
            background: linear-gradient(135deg, #e8f5e9 0%, #bbdefb 100%);
            border-radius: 16px;
            padding: 1.5rem 2rem;
            margin-bottom: 1.5rem;
            border: 2px solid #2e7d32;
        ">
            <h2 style="margin: 0; color: #1b5e20; font-size: 1.5rem;">
                👋 Welcome back, <strong>{name}</strong>!
            </h2>
            <p style="margin: 0.5rem 0 0 0; color: #1565c0; font-size: 0.95rem;">
                Your personalized health journey continues. Let's make today count!
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )


def metric_card(
    label: str,
    value: str,
    delta: Optional[str] = None,
    icon: str = "",
    color: str = "#2e7d32",
) -> None:
    """Render a single metric in a styled card.

    Args:
        label: Metric label text.
        value: Main value to display.
        delta: Optional delta/change indicator.
        icon: Emoji icon prefix.
        color: Accent color for the left border.
    """
    delta_html = ""
    if delta:
        delta_html = f'<span style="font-size:0.8rem;color:#666;">{delta}</span>'

    st.markdown(
        f"""
        <div style="
            background: white;
            border-left: 4px solid {color};
            border-radius: 8px;
            padding: 1rem 1.25rem;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        ">
            <div style="font-size:0.75rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;">
                {icon} {label}
            </div>
            <div style="font-size:1.5rem;font-weight:700;color:#1b5e20;margin-top:0.25rem;">
                {value}
            </div>
            {delta_html}
        </div>
        """,
        unsafe_allow_html=True,
    )


def info_card(
    title: str,
    content: str,
    icon: str = "ℹ️",
    variant: str = "info",
) -> None:
    """Render an informational card with a title and body.

    Args:
        title: Card title.
        content: Card body text.
        icon: Emoji icon.
        variant: 'info', 'success', 'warning', or 'error'.
    """
    colors = {
        "info": ("#e3f2fd", "#1565c0"),
        "success": ("#e8f5e9", "#2e7d32"),
        "warning": ("#fff3e0", "#e65100"),
        "error": ("#ffebee", "#c62828"),
    }
    bg, border = colors.get(variant, colors["info"])

    st.markdown(
        f"""
        <div style="
            background: {bg};
            border-left: 4px solid {border};
            border-radius: 8px;
            padding: 1rem 1.25rem;
            margin: 0.75rem 0;
        ">
            <strong>{icon} {title}</strong>
            <p style="margin:0.25rem 0 0 0;font-size:0.9rem;">{content}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


def meal_card(
    meal_type: str,
    items: List[Dict[str, Any]],
    totals: Dict[str, float],
    icon: str = "🍽️",
) -> None:
    """Render a single meal card with its food items.

    Args:
        meal_type: Breakfast, Lunch, Dinner, or Snacks.
        items: List of food item dicts (name, quantity, calories).
        totals: Dict with total_calories, total_protein, etc.
    """
    with st.container():
        st.markdown(
            f"""
            <div style="
                background: white;
                border: 1.5px solid #c8e6c9;
                border-radius: 12px;
                padding: 0;
                overflow: hidden;
                margin-bottom: 0.75rem;
            ">
                <div style="
                    background: #2e7d32;
                    color: white;
                    padding: 0.5rem 1rem;
                    font-weight: 700;
                    font-size: 0.95rem;
                ">
                    {icon} {meal_type} — {totals.get('total_calories', 0):.0f} kcal
                </div>
                <div style="padding: 0.75rem 1rem;">
            """,
            unsafe_allow_html=True,
        )

        for item in items:
            name = item.get("name", "Unknown")
            qty = item.get("quantity", "")
            cal = item.get("calories", 0)
            protein = item.get("protein", 0)

            st.markdown(
                f"""
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding: 0.35rem 0;
                    border-bottom: 1px solid #f0f0f0;
                    font-size: 0.85rem;
                ">
                    <span><strong>{name}</strong> <span style="color:#888;">{qty}</span></span>
                    <span style="color:#666;">{cal:.0f} kcal | P:{protein:.1f}g</span>
                </div>
                """,
                unsafe_allow_html=True,
            )

        # Macro summary bar
        protein = totals.get("total_protein", 0)
        carbs = totals.get("total_carbohydrates", 0)
        fat = totals.get("total_fat", 0)

        st.markdown(
            f"""
                <div style="
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                    font-size: 0.75rem;
                    color: #666;
                ">
                    <span>🥩 P: {protein:.1f}g</span>
                    <span>🍞 C: {carbs:.1f}g</span>
                    <span>🧈 F: {fat:.1f}g</span>
                </div>
            </div></div>
            """,
            unsafe_allow_html=True,
        )


def health_tip_card(tip: str) -> None:
    """Render a daily health tip card.

    Args:
        tip: Health tip text.
    """
    st.markdown(
        f"""
        <div style="
            background: #fff8e1;
            border: 1.5px solid #ffc107;
            border-radius: 12px;
            padding: 1rem 1.25rem;
            margin-top: 1rem;
        ">
            <div style="font-weight:700;color:#f57f17;margin-bottom:0.25rem;">
                💡 Daily Health Tip
            </div>
            <p style="margin:0;font-size:0.9rem;color:#5d4037;">{tip}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
