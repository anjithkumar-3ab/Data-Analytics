import csv
import json
import os
from pathlib import Path
from typing import Any, Dict, List

from dotenv import load_dotenv
from pymongo import MongoClient


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

MONGODB_URI = os.getenv("MONGODB_URI", "")
DATABASE_NAME = os.getenv("DATABASE_NAME", "")

if not MONGODB_URI or not DATABASE_NAME:
    raise RuntimeError("Set MONGODB_URI and DATABASE_NAME before running this export script")

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
db = client[DATABASE_NAME]


def serialize_value(value: Any) -> Any:
    if isinstance(value, (dict, list)):
        return json.dumps(value, default=str)
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return value


def normalize_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    normalized = {}
    for key, value in doc.items():
        if key == "_id":
            normalized["_id"] = str(value)
        else:
            normalized[key] = serialize_value(value)
    return normalized


def write_csv(path: Path, rows: List[Dict[str, Any]]) -> None:
    if not rows:
        with path.open("w", encoding="utf-8", newline="") as handle:
            handle.write("")
        return

    fieldnames = list(rows[0].keys())
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def export_users() -> List[Dict[str, Any]]:
    docs = list(db["users"].find({}))
    rows = []
    for doc in docs:
        row = normalize_doc(doc)
        row.setdefault("created_at", "")
        rows.append(row)
    return rows


def export_profiles() -> List[Dict[str, Any]]:
    docs = list(db["health_profiles"].find({}))
    rows = []
    for doc in docs:
        row = normalize_doc(doc)
        rows.append(row)
    return rows


def export_foods() -> List[Dict[str, Any]]:
    docs = list(db["foods"].find({}))
    rows = []
    for doc in docs:
        row = normalize_doc(doc)
        if "name" not in row and "food_name" in row:
            row["name"] = row["food_name"]
        rows.append(row)
    return rows


def export_recommendations() -> List[Dict[str, Any]]:
    docs = list(db["recommendations"].find({}))
    rows = []
    for doc in docs:
        row = normalize_doc(doc)
        daily_plan = doc.get("daily_plan") or {}
        request_params = doc.get("request_params") or {}
        row["goal"] = request_params.get("goal", "")
        row["diet_type"] = doc.get("food_preference", "")
        row["activity_level"] = request_params.get("activity_level", "")
        row["daily_plan_total_daily_calories"] = daily_plan.get("total_daily_calories", "")
        row["daily_plan_target_daily_calories"] = daily_plan.get("target_daily_calories", "")
        row["daily_plan_total_protein"] = daily_plan.get("total_protein", "")
        row["daily_plan_target_protein"] = daily_plan.get("target_protein", "")
        row["daily_plan_total_carbohydrates"] = daily_plan.get("total_carbohydrates", "")
        row["daily_plan_target_carbohydrates"] = daily_plan.get("target_carbohydrates", "")
        row["daily_plan_total_fat"] = daily_plan.get("total_fat", "")
        row["daily_plan_target_fat"] = daily_plan.get("target_fat", "")
        row["daily_plan_recommended_water_liters"] = daily_plan.get("recommended_water_liters", "")
        rows.append(row)
    return rows


def export_meals(recommendations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    meals = []
    for recommendation in recommendations:
        daily_plan = json.loads(recommendation.get("daily_plan", "{}") or "{}") if isinstance(recommendation.get("daily_plan"), str) else recommendation.get("daily_plan", {})
        if not daily_plan:
            continue
        for meal_name in ["breakfast", "lunch", "dinner", "snacks"]:
            meal_doc = daily_plan.get(meal_name)
            if not meal_doc:
                continue
            meals.append(
                {
                    "recommendation_id": recommendation.get("_id", ""),
                    "meal_type": meal_name,
                    "meal_label": meal_doc.get("meal_type", ""),
                    "total_calories": meal_doc.get("total_calories", ""),
                    "total_protein": meal_doc.get("total_protein", ""),
                    "total_carbohydrates": meal_doc.get("total_carbohydrates", ""),
                    "total_fat": meal_doc.get("total_fat", ""),
                    "total_fiber": meal_doc.get("total_fiber", ""),
                    "items": json.dumps(meal_doc.get("items", []), default=str),
                }
            )
    return meals


def export_nutrition(recommendations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    nutrition_rows = []
    for recommendation in recommendations:
        daily_plan = json.loads(recommendation.get("daily_plan", "{}") or "{}") if isinstance(recommendation.get("daily_plan"), str) else recommendation.get("daily_plan", {})
        nutrition_rows.append(
            {
                "recommendation_id": recommendation.get("_id", ""),
                "date": recommendation.get("created_at", ""),
                "calories": daily_plan.get("total_daily_calories", ""),
                "protein": daily_plan.get("total_protein", ""),
                "fat": daily_plan.get("total_fat", ""),
                "carbohydrates": daily_plan.get("total_carbohydrates", ""),
                "fiber": daily_plan.get("total_fiber", ""),
                "water_intake": daily_plan.get("recommended_water_liters", ""),
                "goal": recommendation.get("goal", ""),
                "diet_type": recommendation.get("diet_type", ""),
            }
        )
    return nutrition_rows


def export_daily_progress(profiles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows = []
    for profile in profiles:
        rows.append(
            {
                "profile_id": profile.get("_id", ""),
                "date": profile.get("created_at", ""),
                "weight": profile.get("weight", ""),
                "height": profile.get("height", ""),
                "bmi": profile.get("bmi", ""),
                "bmr": profile.get("bmr", ""),
                "tdee": profile.get("tdee", ""),
                "daily_calories": profile.get("daily_calories", ""),
                "protein": profile.get("protein", ""),
                "fat": profile.get("fat", ""),
                "carbohydrates": profile.get("carbohydrates", ""),
                "water_intake": profile.get("water_intake", ""),
                "goal": profile.get("goal", ""),
                "activity_level": profile.get("activity_level", ""),
            }
        )
    return rows


def main() -> None:
    users = export_users()
    profiles = export_profiles()
    foods = export_foods()
    recommendations = export_recommendations()
    meals = export_meals(recommendations)
    nutrition = export_nutrition(recommendations)
    daily_progress = export_daily_progress(profiles)

    write_csv(DATA_DIR / "Users.csv", users)
    write_csv(DATA_DIR / "Profiles.csv", profiles)
    write_csv(DATA_DIR / "Foods.csv", foods)
    write_csv(DATA_DIR / "Recommendations.csv", recommendations)
    write_csv(DATA_DIR / "Meals.csv", meals)
    write_csv(DATA_DIR / "Nutrition.csv", nutrition)
    write_csv(DATA_DIR / "DailyProgress.csv", daily_progress)

    print(f"Exported Power BI-ready CSV datasets to {DATA_DIR}")


if __name__ == "__main__":
    main()
