from fastapi import APIRouter, HTTPException
from app.services.food_service import (
    get_all_foods,
    search_foods,
    get_food_by_id,
    get_foods_by_category,
)

router = APIRouter(prefix="/foods", tags=["Foods"])


@router.get("/")
def all_foods(limit: int = 50):
    return get_all_foods(limit)


@router.get("/search")
def search(query: str):
    return search_foods(query)


@router.get("/category/{category}")
def category(category: str):
    return get_foods_by_category(category)


@router.get("/{food_id}")
def food(food_id: str):
    result = get_food_by_id(food_id)

    if result is None:
        raise HTTPException(status_code=404, detail="Food not found")

    return result