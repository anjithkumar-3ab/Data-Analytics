from app.database.database import db
from app.services.bmi_service import calculate_bmi
from app.services.bmr_service import (
    calculate_bmr,
    calculate_tdee,
    calorie_goal
)
from app.services.macro_service import calculate_macros



profiles = db["health_profiles"]


def save_profile(profile):

    data = profile.model_dump()

    bmi_result = calculate_bmi(
        profile.height,
        profile.weight
    )

    data["bmi"] = bmi_result["bmi"]
    data["bmi_category"] = bmi_result["category"]

    result = profiles.insert_one(data)

    bmr = calculate_bmr(
    profile.age,
    profile.gender,
    profile.height,
    profile.weight
    )

    tdee = calculate_tdee(
        bmr,
        profile.activity_level
    )

    daily_calories = calorie_goal(
        tdee,
        profile.goal
    )

    macros = calculate_macros(
    daily_calories,
    profile.goal
)

    data["protein"] = macros["protein"]
    data["carbohydrates"] = macros["carbohydrates"]
    data["fat"] = macros["fat"]

    data["bmr"] = bmr
    data["tdee"] = tdee
    data["daily_calories"] = daily_calories

    return {
    "success": True,
    "message": "Health profile saved successfully.",
    "bmi": bmi_result["bmi"],
    "category": bmi_result["category"],
    "bmr": bmr,
    "tdee": tdee,
    "daily_calories": daily_calories,
    "id": str(result.inserted_id),
    "protein": macros["protein"],
    "carbohydrates": macros["carbohydrates"],
    "fat": macros["fat"],
    }