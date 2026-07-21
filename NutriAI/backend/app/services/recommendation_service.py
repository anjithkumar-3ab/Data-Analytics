"""
Production-ready recommendation service that generates personalized diet plans.
Integrates health calculations, food filtering, and meal planning.
"""
import logging
from datetime import datetime

from bson import ObjectId

from app.database.database import recommendations_collection
from app.schemas.recommendation_schema import RecommendationRequest
from app.services.bmi_service import calculate_bmi
from app.services.bmr_service import calculate_bmr, calculate_tdee, calorie_goal
from app.services.macro_service import calculate_macros
from app.services.meal_plan_service import create_daily_meal_plan

logger = logging.getLogger(__name__)


def generate_diet_plan(request: RecommendationRequest) -> dict:
    """
    Generate a complete, personalized diet plan with meal recommendations.

    This service:
    1. Calculates health metrics (BMI, BMR, TDEE)
    2. Determines calorie and macro targets
    3. Creates intelligent meal plans respecting dietary restrictions
    4. Saves recommendation to database for history tracking

    Args:
        request: RecommendationRequest with user health and preference data.

    Returns:
        dict: Complete recommendation with health metrics and meal plan.
    """
    # Step 1: Calculate health metrics
    bmi_result = calculate_bmi(request.height, request.weight)
    bmr = calculate_bmr(
        request.age, request.gender.value, request.height, request.weight
    )
    tdee = calculate_tdee(bmr, request.activity_level.value)
    daily_calories = calorie_goal(tdee, request.goal.value)
    macros = calculate_macros(daily_calories, request.goal.value)

    # Step 2: Create daily meal plan with food recommendations
    daily_plan = create_daily_meal_plan(
        daily_calories=daily_calories,
        target_protein=macros["protein"],
        target_carbs=macros["carbohydrates"],
        target_fat=macros["fat"],
        weight_kg=request.weight,
        preference=request.food_preference.value,
        allergies=request.allergies if request.allergies else None,
        medical_conditions=request.medical_conditions if request.medical_conditions else None,
    )

    # Step 3: Build response object
    response_data = {
        "success": True,
        "message": "Personalized diet plan generated successfully",
        "bmi": bmi_result["bmi"],
        "bmi_category": bmi_result["category"],
        "bmr": bmr,
        "tdee": tdee,
        "daily_calories": daily_calories,
        "target_protein": macros["protein"],
        "target_carbohydrates": macros["carbohydrates"],
        "target_fat": macros["fat"],
        "daily_plan": daily_plan.model_dump(),
        "food_preference": request.food_preference.value,
        "allergies": request.allergies,
        "medical_conditions": request.medical_conditions,
        "created_at": datetime.utcnow(),
        "request_params": {
            "age": request.age,
            "gender": request.gender.value,
            "height": request.height,
            "weight": request.weight,
            "activity_level": request.activity_level.value,
            "goal": request.goal.value,
            "food_preference": request.food_preference.value,
            "allergies": request.allergies,
            "medical_conditions": request.medical_conditions,
            "budget": request.budget,
            "meals_per_day": request.meals_per_day,
        },
    }

    # Step 4: Save recommendation to database
    try:
        result = recommendations_collection.insert_one(response_data)
        response_data["recommendation_id"] = str(result.inserted_id)
        logger.info(
            "Recommendation saved with ID: %s", response_data["recommendation_id"]
        )
    except Exception:
        logger.exception("Failed to save recommendation to database")
        response_data["recommendation_id"] = None

    return response_data


def get_recommendation_history(limit: int = 10, skip: int = 0) -> dict:
    """
    Retrieve recommendation history with pagination.

    Args:
        limit: Maximum number of recommendations to return (1–100).
        skip: Number of recommendations to skip for pagination.

    Returns:
        dict: Paginated list of past recommendations with count.
    """
    try:
        cursor = (
            recommendations_collection.find()
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        recommendations = list(cursor)

        # Serialize MongoDB documents
        for rec in recommendations:
            rec["_id"] = str(rec["_id"])
            if isinstance(rec.get("created_at"), datetime):
                rec["created_at"] = rec["created_at"].isoformat()
            if "recommendation_id" not in rec:
                rec["recommendation_id"] = rec["_id"]

        return {
            "success": True,
            "count": len(recommendations),
            "recommendations": recommendations,
        }
    except Exception:
        logger.exception("Failed to retrieve recommendation history")
        return {
            "success": False,
            "message": "Failed to retrieve recommendation history",
            "count": 0,
            "recommendations": [],
        }


def get_recommendation_by_id(recommendation_id: str) -> dict:
    """
    Retrieve a specific recommendation by its MongoDB ObjectId.

    Args:
        recommendation_id: MongoDB ObjectId as a 24-character hex string.

    Returns:
        dict: Recommendation details, or an error dict if not found.
    """
    try:
        rec = recommendations_collection.find_one(
            {"_id": ObjectId(recommendation_id)}
        )

        if not rec:
            return {"success": False, "message": "Recommendation not found"}

        rec["_id"] = str(rec["_id"])
        if isinstance(rec.get("created_at"), datetime):
            rec["created_at"] = rec["created_at"].isoformat()
        if "recommendation_id" not in rec:
            rec["recommendation_id"] = rec["_id"]

        return {"success": True, "recommendation": rec}
    except Exception:
        logger.exception(
            "Failed to retrieve recommendation: %s", recommendation_id
        )
        return {
            "success": False,
            "message": "Failed to retrieve recommendation",
        }


def delete_recommendation(recommendation_id: str) -> dict:
    """
    Delete a recommendation document from the database.

    Args:
        recommendation_id: MongoDB ObjectId as a 24-character hex string.

    Returns:
        dict: Success confirmation or error message.
    """
    try:
        result = recommendations_collection.delete_one(
            {"_id": ObjectId(recommendation_id)}
        )

        if result.deleted_count == 0:
            return {"success": False, "message": "Recommendation not found"}

        logger.info("Recommendation %s deleted successfully", recommendation_id)
        return {"success": True, "message": "Recommendation deleted successfully"}
    except Exception:
        logger.exception(
            "Failed to delete recommendation: %s", recommendation_id
        )
        return {
            "success": False,
            "message": "Failed to delete recommendation",
        }


def regenerate_recommendation(recommendation_id: str) -> dict:
    """
    Regenerate a diet plan using the original parameters of an existing
    recommendation.

    Retrieves the stored request parameters, runs the full generation
    pipeline, and saves the result as a brand-new recommendation. The
    original recommendation is left untouched.

    Args:
        recommendation_id: MongoDB ObjectId of the source recommendation.

    Returns:
        dict: Newly generated recommendation, or an error dict.
    """
    try:
        existing = recommendations_collection.find_one(
            {"_id": ObjectId(recommendation_id)}
        )

        if not existing:
            return {"success": False, "message": "Recommendation not found"}

        params = existing.get("request_params")
        if not params:
            return {
                "success": False,
                "message": (
                    "Original request parameters not found in this "
                    "recommendation. Cannot regenerate."
                ),
            }

        request = RecommendationRequest(**params)
        logger.info(
            "Regenerating diet plan from recommendation: %s", recommendation_id
        )
        return generate_diet_plan(request)

    except Exception:
        logger.exception(
            "Failed to regenerate recommendation: %s", recommendation_id
        )
        return {
            "success": False,
            "message": "Failed to regenerate recommendation",
        }
