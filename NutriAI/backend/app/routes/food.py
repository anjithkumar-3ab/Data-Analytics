from fastapi import APIRouter

from app.schemas.food_schema import Food
from app.services.food_service import add_food

router = APIRouter(
    prefix="/foods",
    tags=["Food Database"]
)


@router.post("/")
def create_food(food: Food):
    return add_food(food)