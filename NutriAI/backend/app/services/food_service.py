from app.database.database import db
from bson import ObjectId


food_collection = db["foods"]


def serialize(food):
    food["_id"] = str(food["_id"])
    return food


def get_all_foods(limit: int = 50):
    foods = food_collection.find().limit(limit)
    return [serialize(food) for food in foods]


def search_foods(query: str):
    foods = food_collection.find(
        {
            "name": {
                "$regex": query,
                "$options": "i"
            }
        }
    )

    return [serialize(food) for food in foods]


def get_food_by_id(food_id: str):
    food = food_collection.find_one({"_id": ObjectId(food_id)})
    if food:
        return serialize(food)
    return None


def get_foods_by_category(category: str):
    foods = food_collection.find(
        {
            "category": {
                "$regex": f"^{category}$",
                "$options": "i"
            }
        }
    )

    return [serialize(food) for food in foods]