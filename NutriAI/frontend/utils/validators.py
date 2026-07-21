"""
NutriAI Form Validators.

Validation functions for health profile form fields used across
the Streamlit frontend.
"""

from __future__ import annotations

from typing import List, Optional


def validate_required(value: str, field_name: str) -> Optional[str]:
    """Check that a required string field is not empty.

    Args:
        value: Input value.
        field_name: Human-readable field name for error message.

    Returns:
        Error message string, or None if valid.
    """
    if not value or not value.strip():
        return f"{field_name} is required."
    return None


def validate_age(age: int) -> Optional[str]:
    """Validate age is within a realistic range.

    Args:
        age: Age in years.

    Returns:
        Error message or None.
    """
    if age < 1 or age > 120:
        return "Age must be between 1 and 120."
    return None


def validate_height(height: float) -> Optional[str]:
    """Validate height in centimeters.

    Args:
        height: Height in cm.

    Returns:
        Error message or None.
    """
    if height <= 0:
        return "Height must be greater than 0."
    if height < 50 or height > 250:
        return "Height must be between 50 and 250 cm."
    return None


def validate_weight(weight: float) -> Optional[str]:
    """Validate weight in kilograms.

    Args:
        weight: Weight in kg.

    Returns:
        Error message or None.
    """
    if weight <= 0:
        return "Weight must be greater than 0."
    if weight < 10 or weight > 300:
        return "Weight must be between 10 and 300 kg."
    return None


def validate_target_weight(
    target: Optional[float],
    current: float,
) -> Optional[str]:
    """Validate target weight is positive if provided.

    Args:
        target: Target weight in kg (optional).
        current: Current weight in kg.

    Returns:
        Error message or None.
    """
    if target is None:
        return None
    if target <= 0:
        return "Target weight must be greater than 0."
    return None


def validate_meals_per_day(meals: int) -> Optional[str]:
    """Validate meals per day count.

    Args:
        meals: Number of meals.

    Returns:
        Error message or None.
    """
    if meals < 1 or meals > 10:
        return "Meals per day must be between 1 and 10."
    return None


def validate_water_goal(glasses: int) -> Optional[str]:
    """Validate water intake goal in glasses.

    Args:
        glasses: Glasses of water per day.

    Returns:
        Error message or None.
    """
    if glasses < 1 or glasses > 20:
        return "Water goal must be between 1 and 20 glasses."
    return None


def validate_sleep_hours(hours: float) -> Optional[str]:
    """Validate sleep hours.

    Args:
        hours: Hours of sleep.

    Returns:
        Error message or None.
    """
    if hours < 0 or hours > 24:
        return "Sleep hours must be between 0 and 24."
    return None


def validate_profile_form(profile: dict) -> List[str]:
    """Run all validations on a profile dictionary.

    Args:
        profile: Dictionary of form field values.

    Returns:
        List of error message strings. Empty list means valid.
    """
    errors: List[str] = []

    # Required fields
    checks = [
        (validate_required(profile.get("full_name", ""), "Full Name")),
        (validate_age(profile.get("age", 0))),
        (validate_height(profile.get("height", 0))),
        (validate_weight(profile.get("weight", 0))),
        (validate_target_weight(
            profile.get("target_weight"),
            profile.get("weight", 0),
        )),
        (validate_meals_per_day(profile.get("meals_per_day", 3))),
        (validate_water_goal(profile.get("water_intake_goal", 8))),
        (validate_sleep_hours(profile.get("sleep_hours", 7))),
    ]

    for error in checks:
        if error:
            errors.append(error)

    return errors
