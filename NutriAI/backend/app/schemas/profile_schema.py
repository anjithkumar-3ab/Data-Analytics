from pydantic import BaseModel, Field
from typing import Optional, Literal, List


class HealthProfile(BaseModel):
    # ── Personal Information ──
    full_name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., gt=0, lt=120)
    gender: Literal["Male", "Female"]
    date_of_birth: Optional[str] = None  # YYYY-MM-DD
    height: float = Field(..., gt=0)
    weight: float = Field(..., gt=0)
    target_weight: Optional[float] = Field(None, gt=0)

    # ── Lifestyle ──
    activity_level: Literal[
        "Sedentary",
        "Lightly Active",
        "Moderately Active",
        "Very Active",
        "Athlete",
    ]

    # ── Fitness Goal ──
    goal: Literal[
        "Lose Weight",
        "Maintain Weight",
        "Gain Weight",
        "Muscle Gain",
        "Healthy Lifestyle",
    ]

    # ── Food Preferences ──
    food_preference: Literal[
        "Vegetarian",
        "Non Vegetarian",
        "Vegan",
        "Eggetarian",
        "Jain",
    ]

    # ── Allergies (multi-select) ──
    allergies: List[str] = Field(default_factory=list)

    # ── Medical Conditions (multi-select) ──
    medical_conditions: List[str] = Field(default_factory=list)

    # ── Exclude Ingredients (multi-select) ──
    exclude_ingredients: List[str] = Field(default_factory=list)

    # ── Daily Habits ──
    water_intake_goal: Optional[int] = Field(None, ge=1, le=20)  # glasses per day
    meals_per_day: Optional[int] = Field(None, ge=1, le=10)
    sleep_hours: Optional[float] = Field(None, ge=0, le=24)
    wake_up_time: Optional[str] = None  # HH:MM
    bed_time: Optional[str] = None  # HH:MM
