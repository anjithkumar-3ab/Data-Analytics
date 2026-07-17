import json
from typing import Any
import joblib

MODEL_PATH = 'models/diet_model.pkl'

class Recommender:
    def __init__(self, model_path: str = MODEL_PATH):
        self.model = None
        self.model_path = model_path
        self.load_model()

    def load_model(self) -> None:
        try:
            self.model = joblib.load(self.model_path)
        except FileNotFoundError:
            self.model = None

    def predict_diet_category(self, features: list[float]) -> str:
        if self.model is None:
            return 'balanced'
        return str(self.model.predict([features])[0])

    def generate_plan(self, user_id: int, category: str, calories: float) -> dict[str, Any]:
        return {
            'user_id': user_id,
            'category': category,
            'calories': calories,
            'meals': [
                {'name': 'Breakfast', 'items': ['Oats', 'Eggs', 'Banana']},
                {'name': 'Lunch', 'items': ['Grilled Chicken', 'Quinoa', 'Vegetables']},
                {'name': 'Dinner', 'items': ['Salmon', 'Brown Rice', 'Broccoli']},
            ],
        }
