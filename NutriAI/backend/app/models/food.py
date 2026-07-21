from pydantic import BaseModel
from typing import Optional


class Food(BaseModel):
    name: str
    category: Optional[str] = None
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    fiber: Optional[float] = 0
    sugar: Optional[float] = 0
    sodium: Optional[float] = 0