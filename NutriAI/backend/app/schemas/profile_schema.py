from pydantic import BaseModel, Field
from typing import Optional, Literal


class HealthProfile(BaseModel):
    age: int = Field(..., gt=0, lt=120)
    gender: Literal["Male", "Female"]
    height: float = Field(..., gt=0)
    weight: float = Field(..., gt=0)

    activity_level: Literal[
        "Sedentary",
        "Light",
        "Moderate",
        "Active",
        "Very Active"
    ]

    goal: Literal[
        "Weight Loss",
        "Weight Gain",
        "Maintain Weight"
    ]

    food_preference: Literal[
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan"
    ]

    allergies: Optional[str] = None
    medical_conditions: Optional[str] = None