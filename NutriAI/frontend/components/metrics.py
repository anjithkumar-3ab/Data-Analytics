"""
NutriAI Metrics Component.

Reusable dashboard metric display using st.metric and custom styles.
"""

from __future__ import annotations

from typing import Optional

import streamlit as st


def health_metric_row(
    metrics: list[dict],
    columns: int = 4,
) -> None:
    """Render a row of health metrics in equal-width columns.

    Each metric dict should have:
        - label: str
        - value: str
        - delta: Optional[str]
        - icon: Optional[str]
        - color: Optional[str] (hex)

    Args:
        metrics: List of metric dicts.
        columns: Number of columns in the row (2-6 recommended).
    """
    if not metrics:
        return

    cols = st.columns(columns)
    for i, metric in enumerate(metrics):
        col_idx = i % columns
        with cols[col_idx]:
            label = metric.get("label", "")
            value = metric.get("value", "--")
            delta = metric.get("delta")
            icon = metric.get("icon", "")

            display_label = f"{icon} {label}" if icon else label
            st.metric(
                label=display_label,
                value=value,
                delta=delta,
            )


def render_bmi_display(bmi: float, category: str, color: str) -> None:
    """Render a prominently styled BMI display.

    Args:
        bmi: BMI numeric value.
        category: BMI category string.
        color: Hex color for the accent.
    """
    st.markdown(
        f"""
        <div style="
            text-align: center;
            padding: 1.5rem;
            background: white;
            border-radius: 16px;
            border: 3px solid {color};
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        ">
            <div style="font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:1px;">
                Body Mass Index
            </div>
            <div style="font-size:3rem;font-weight:800;color:{color};line-height:1.2;">
                {bmi:.1f}
            </div>
            <div style="font-size:0.9rem;font-weight:600;color:{color};margin-top:0.25rem;">
                {category}
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def macro_summary_row(
    protein: float,
    protein_target: float,
    carbs: float,
    carbs_target: float,
    fat: float,
    fat_target: float,
    fiber: float = 0,
) -> None:
    """Render a row showing macronutrient progress against targets.

    Args:
        protein: Current protein (g).
        protein_target: Target protein (g).
        carbs: Current carbs (g).
        carbs_target: Target carbs (g).
        fat: Current fat (g).
        fat_target: Target fat (g).
        fiber: Current fiber (g).
    """
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        pct = _safe_pct(protein, protein_target)
        st.metric(
            "🥩 Protein",
            f"{protein:.0f}g",
            delta=f"Target: {protein_target:.0f}g ({pct:.0f}%)",
        )
        st.progress(min(pct / 100, 1.0))

    with col2:
        pct = _safe_pct(carbs, carbs_target)
        st.metric(
            "🍞 Carbs",
            f"{carbs:.0f}g",
            delta=f"Target: {carbs_target:.0f}g ({pct:.0f}%)",
        )
        st.progress(min(pct / 100, 1.0))

    with col3:
        pct = _safe_pct(fat, fat_target)
        st.metric(
            "🧈 Fat",
            f"{fat:.0f}g",
            delta=f"Target: {fat_target:.0f}g ({pct:.0f}%)",
        )
        st.progress(min(pct / 100, 1.0))

    with col4:
        st.metric(
            "🌾 Fiber",
            f"{fiber:.1f}g",
        )
        st.progress(min(fiber / 25, 1.0))


def _safe_pct(current: float, target: float) -> float:
    """Calculate percentage, guarding against division by zero.

    Args:
        current: Current value.
        target: Target value.

    Returns:
        Percentage (0-200+).
    """
    if target <= 0:
        return 0.0
    return (current / target) * 100
