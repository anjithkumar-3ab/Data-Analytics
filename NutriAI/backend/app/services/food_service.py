from app.database.database import db

foods = db["foods"]


def add_food(food):
    data = food.model_dump()

    result = foods.insert_one(data)

    return {
        "success": True,
        "message": "Food added successfully.",
        "id": str(result.inserted_id)
    }