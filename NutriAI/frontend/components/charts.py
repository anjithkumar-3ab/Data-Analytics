"""
NutriAI Chart Components.

Reusable Plotly chart wrappers for the Streamlit frontend.
Used primarily on the Progress and Dashboard pages.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

import plotly.express as px
import plotly.graph_objects as go
import streamlit as st


# ---------------------------------------------------------------------------
# Color palette
# ---------------------------------------------------------------------------

NUTRI_GREEN = "#2e7d32"
NUTRI_BLUE = "#1565c0"
NUTRI_ORANGE = "#e65100"
NUTRI_RED = "#c62828"
NUTRI_LIGHT_GREEN = "#a5d6a7"


# ---------------------------------------------------------------------------
# Weight Progress Chart
# ---------------------------------------------------------------------------


def weight_progress_chart(
    dates: List[str],
    weights: List[float],
    target_weight: Optional[float] = None,
    height: int = 350,
) -> None:
    """Render a line chart showing weight over time.

    Args:
        dates: List of date strings (ISO format).
        weights: List of weight values in kg.
        target_weight: Optional target weight line.
        height: Chart height in pixels.
    """
    if not dates or not weights:
        st.info("No weight data available yet. Start tracking to see progress!")
        return

    fig = go.Figure()

    fig.add_trace(
        go.Scatter(
            x=dates,
            y=weights,
            mode="lines+markers",
            name="Weight",
            line=dict(color=NUTRI_GREEN, width=3),
            marker=dict(size=6, color=NUTRI_GREEN),
            fill="tozeroy",
            fillcolor="rgba(46,125,50,0.1)",
        )
    )

    if target_weight is not None:
        fig.add_trace(
            go.Scatter(
                x=[dates[0], dates[-1]],
                y=[target_weight, target_weight],
                mode="lines",
                name="Target",
                line=dict(color=NUTRI_ORANGE, width=2, dash="dash"),
            )
        )

    fig.update_layout(
        title="Weight Progress",
        xaxis_title="Date",
        yaxis_title="Weight (kg)",
        template="plotly_white",
        height=height,
        margin=dict(l=40, r=20, t=40, b=40),
        hovermode="x unified",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    )

    st.plotly_chart(fig, use_container_width=True)


# ---------------------------------------------------------------------------
# BMI Progress Chart
# ---------------------------------------------------------------------------


def bmi_progress_chart(
    dates: List[str],
    bmi_values: List[float],
    height: int = 350,
) -> None:
    """Render a line chart showing BMI over time with category zones.

    Args:
        dates: List of date strings.
        bmi_values: List of BMI values.
        height: Chart height in pixels.
    """
    if not dates or not bmi_values:
        st.info("No BMI data available yet.")
        return

    fig = go.Figure()

    # Zone rectangles (background)
    zones = [
        (0, 18.5, "#3498db", "Underweight"),
        (18.5, 25, "#27ae60", "Normal"),
        (25, 30, "#f39c12", "Overweight"),
        (30, 45, "#e74c3c", "Obese"),
    ]

    for y0, y1, color, label in zones:
        fig.add_hrect(
            y0=y0,
            y1=y1,
            fillcolor=color,
            opacity=0.08,
            layer="below",
            line_width=0,
            annotation_text=label,
            annotation_position="top left",
        )

    fig.add_trace(
        go.Scatter(
            x=dates,
            y=bmi_values,
            mode="lines+markers",
            name="BMI",
            line=dict(color=NUTRI_BLUE, width=3),
            marker=dict(size=6, color=NUTRI_BLUE),
        )
    )

    fig.update_layout(
        title="BMI Progress",
        xaxis_title="Date",
        yaxis_title="BMI",
        template="plotly_white",
        height=height,
        margin=dict(l=40, r=20, t=40, b=40),
        hovermode="x unified",
    )

    st.plotly_chart(fig, use_container_width=True)


# ---------------------------------------------------------------------------
# Macro Distribution Pie Chart
# ---------------------------------------------------------------------------


def macro_pie_chart(
    protein: float,
    carbs: float,
    fat: float,
    height: int = 300,
) -> None:
    """Render a donut chart showing macronutrient distribution.

    Args:
        protein: Protein in grams.
        carbs: Carbohydrates in grams.
        fat: Fat in grams.
        height: Chart height in pixels.
    """
    labels = ["Protein", "Carbohydrates", "Fat"]
    values = [protein, carbs, fat]
    colors = [NUTRI_BLUE, NUTRI_GREEN, NUTRI_ORANGE]

    fig = go.Figure(
        data=[
            go.Pie(
                labels=labels,
                values=values,
                hole=0.55,
                marker=dict(colors=colors, line=dict(color="white", width=2)),
                textinfo="label+percent",
                hovertemplate="%{label}: %{value:.1f}g<br>%{percent}",
            )
        ]
    )

    fig.update_layout(
        title="Macro Distribution",
        template="plotly_white",
        height=height,
        margin=dict(l=20, r=20, t=40, b=20),
        showlegend=False,
    )

    st.plotly_chart(fig, use_container_width=True)


# ---------------------------------------------------------------------------
# Calories Bar Chart
# ---------------------------------------------------------------------------


def calories_bar_chart(
    consumed: float,
    target: float,
    height: int = 250,
) -> None:
    """Render a gauge-style bar chart for daily calories.

    Args:
        consumed: Calories consumed.
        target: Daily target calories.
        height: Chart height in pixels.
    """
    pct = min((consumed / target) * 100, 100) if target > 0 else 0
    remaining = max(target - consumed, 0)

    color = NUTRI_GREEN if pct <= 90 else NUTRI_ORANGE if pct <= 100 else NUTRI_RED

    fig = go.Figure(
        data=[
            go.Bar(
                x=[consumed],
                y=["Calories"],
                orientation="h",
                marker=dict(
                    color=color,
                    line=dict(color="#1b5e20" if pct <= 90 else "#bf360c", width=1.5),
                ),
                text=f"{consumed:.0f} / {target:.0f} kcal ({pct:.0f}%)",
                textposition="inside",
                insidetextanchor="middle",
                textfont=dict(color="white", size=13),
                name="Consumed",
            ),
            go.Bar(
                x=[remaining],
                y=["Calories"],
                orientation="h",
                marker=dict(color="rgba(0,0,0,0.05)", line=dict(color="#ccc", width=1)),
                name="Remaining",
            ),
        ]
    )

    fig.update_layout(
        barmode="stack",
        template="plotly_white",
        height=height,
        margin=dict(l=20, r=20, t=20, b=20),
        showlegend=False,
        xaxis=dict(visible=False, range=[0, target * 1.1]),
        yaxis=dict(visible=False),
    )

    st.plotly_chart(fig, use_container_width=True)


# ---------------------------------------------------------------------------
# Water Intake Chart
# ---------------------------------------------------------------------------


def water_intake_chart(
    glasses_drunk: int,
    glasses_goal: int,
    height: int = 200,
) -> None:
    """Render a horizontal progress bar for water intake.

    Args:
        glasses_drunk: Glasses consumed today.
        glasses_goal: Daily goal in glasses.
        height: Chart height in pixels.
    """
    pct = min((glasses_drunk / glasses_goal) * 100, 100) if glasses_goal > 0 else 0
    remaining = max(glasses_goal - glasses_drunk, 0)

    fig = go.Figure(
        data=[
            go.Bar(
                x=[glasses_drunk],
                y=["Water"],
                orientation="h",
                marker=dict(color="#2196f3", line=dict(color="#1565c0", width=1.5)),
                text=f"{glasses_drunk}/{glasses_goal} glasses ({pct:.0f}%)",
                textposition="inside",
                insidetextanchor="middle",
                textfont=dict(color="white", size=12),
                name="Consumed",
            ),
            go.Bar(
                x=[remaining],
                y=["Water"],
                orientation="h",
                marker=dict(color="rgba(33,150,243,0.1)", line=dict(color="#90caf9", width=1)),
                name="Remaining",
            ),
        ]
    )

    fig.update_layout(
        barmode="stack",
        template="plotly_white",
        height=height,
        margin=dict(l=20, r=20, t=20, b=20),
        showlegend=False,
        xaxis=dict(visible=False, range=[0, glasses_goal * 1.1]),
        yaxis=dict(visible=False),
    )

    st.plotly_chart(fig, use_container_width=True)


# ---------------------------------------------------------------------------
# Nutrition Summary Radar / Polar Chart
# ---------------------------------------------------------------------------


def nutrition_radar_chart(
    protein: float,
    protein_target: float,
    carbs: float,
    carbs_target: float,
    fat: float,
    fat_target: float,
    fiber: float = 0,
    fiber_target: float = 25,
    height: int = 350,
) -> None:
    """Render a radar/polar chart comparing actual vs target nutrition.

    Args:
        protein: Consumed protein (g).
        protein_target: Target protein (g).
        carbs: Consumed carbs (g).
        carbs_target: Target carbs (g).
        fat: Consumed fat (g).
        fat_target: Target fat (g).
        fiber: Consumed fiber (g).
        fiber_target: Target fiber (g).
        height: Chart height in pixels.
    """
    categories = ["Protein", "Carbs", "Fat", "Fiber"]

    # Normalise to percentage
    actual = [
        min(protein / protein_target * 100, 120) if protein_target > 0 else 0,
        min(carbs / carbs_target * 100, 120) if carbs_target > 0 else 0,
        min(fat / fat_target * 100, 120) if fat_target > 0 else 0,
        min(fiber / fiber_target * 100, 120) if fiber_target > 0 else 0,
    ]

    target_line = [100] * 4

    fig = go.Figure()

    fig.add_trace(
        go.Scatterpolar(
            r=actual,
            theta=categories,
            fill="toself",
            name="Actual",
            line=dict(color=NUTRI_GREEN, width=2),
            fillcolor="rgba(46,125,50,0.2)",
        )
    )

    fig.add_trace(
        go.Scatterpolar(
            r=target_line,
            theta=categories,
            fill="none",
            name="Target (100%)",
            line=dict(color="gray", width=1.5, dash="dash"),
        )
    )

    fig.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 120], ticksuffix="%"),
        ),
        template="plotly_white",
        height=height,
        margin=dict(l=40, r=40, t=30, b=30),
        showlegend=True,
        legend=dict(orientation="h", y=-0.1),
    )

    st.plotly_chart(fig, use_container_width=True)
