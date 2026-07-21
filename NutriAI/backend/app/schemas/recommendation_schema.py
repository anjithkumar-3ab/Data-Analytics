from pydantic import BaseModel, Field
from typing import List, Optional, Any
from enum import Enum
from datetime import datetime


# ==========================
# ENUMS
# ==========================

class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"


class ActivityLevel(str, Enum):
    SEDENTARY = "Sedentary"
    LIGHT = "Light"
    MODERATE = "Moderate"
    ACTIVE = "Active"
    VERY_ACTIVE = "Very Active"


class Goal(str, Enum):
    WEIGHT_LOSS = "Weight Loss"
    MAINTENANCE = "Maintenance"
    WEIGHT_GAIN = "Weight Gain"


class FoodPreference(str, Enum):
    VEGETARIAN = "Vegetarian"
    NON_VEGETARIAN = "Non-Vegetarian"
    VEGAN = "Vegan"


class MealType(str, Enum):
    BREAKFAST = "Breakfast"
    LUNCH = "Lunch"
    DINNER = "Dinner"
    SNACK = "Snack"


# ==========================
# REQUEST SCHEMA
# ==========================

class RecommendationRequest(BaseModel):
    """Request body for generating a personalized diet plan."""

    age: int = Field(..., gt=0, le=120, description="Age in years")

    gender: Gender

    height: float = Field(
        ...,
        gt=50,
        lt=250,
        description="Height in centimeters",
    )

    weight: float = Field(
        ...,
        gt=10,
        lt=300,
        description="Weight in kilograms",
    )

    activity_level: ActivityLevel

    goal: Goal

    food_preference: FoodPreference = FoodPreference.NON_VEGETARIAN

    allergies: List[str] = Field(
        default_factory=list,
        description="List of food allergies",
    )

    medical_conditions: List[str] = Field(
        default_factory=list,
        description="List of medical conditions",
    )

    budget: Optional[float] = Field(default=None, ge=0)

    meals_per_day: int = Field(default=4, ge=3, le=6)


# ==========================
# FOOD ITEM
# ==========================

class MealItem(BaseModel):
    """A single food item within a meal."""

    food_id: str
    name: str
    category: str
    quantity: str
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    fiber: float = 0
    sugar: float = 0
    sodium: float = 0


# ==========================
# MEAL
# ==========================

class Meal(BaseModel):
    """A meal composed of multiple food items."""

    meal_type: MealType
    items: List[MealItem]
    total_calories: float
    total_protein: float
    total_carbohydrates: float
    total_fat: float
    total_fiber: float


# ==========================
# DAILY PLAN
# ==========================

class DailyPlan(BaseModel):
    """Complete daily meal plan with nutritional totals."""

    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snacks: Meal
    total_daily_calories: float
    target_daily_calories: float
    total_protein: float
    target_protein: float
    total_carbohydrates: float
    target_carbohydrates: float
    total_fat: float
    target_fat: float
    total_fiber: float
    recommended_water_liters: float


# ==========================
# RESPONSE SCHEMAS
# ==========================

class RecommendationResponse(BaseModel):
    """Response returned when a diet plan is successfully generated."""

    success: bool
    message: str
    bmi: float
    bmi_category: str
    bmr: float
    tdee: float
    daily_calories: float
    target_protein: float
    target_carbohydrates: float
    target_fat: float
    daily_plan: DailyPlan
    food_preference: FoodPreference
    allergies: List[str]
    medical_conditions: List[str]
    recommendation_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class HistoryResponse(BaseModel):
    """Response for the recommendation history endpoint."""

    success: bool
    count: int
    recommendations: List[Any] = []
    message: Optional[str] = None


class SingleRecommendationResponse(BaseModel):
    """Wraps a single recommendation fetch result."""

    success: bool
    recommendation: Optional[Any] = None
    message: Optional[str] = None


class MessageResponse(BaseModel):
    """Generic message-only response (used for deletes and errors)."""

    success: bool
    message: str


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    service: str
