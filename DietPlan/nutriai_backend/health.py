from dataclasses import dataclass

@dataclass
class HealthResult:
    bmi: float
    bmr: float
    tdee: float

class HealthCalculator:
    @staticmethod
    def calculate_bmi(weight_kg: float, height_cm: float) -> float:
        height_m = height_cm / 100.0
        return weight_kg / (height_m * height_m)

    @staticmethod
    def calculate_bmr(weight_kg: float, height_cm: float, age: int, sex: str) -> float:
        if sex.lower() == 'male':
            return 88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age)
        return 447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age)

    @staticmethod
    def calculate_tdee(bmr: float, activity_level: str) -> float:
        factors = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9,
        }
        return bmr * factors.get(activity_level.lower(), 1.2)

    @staticmethod
    def calculate_all(weight_kg: float, height_cm: float, age: int, sex: str, activity_level: str) -> HealthResult:
        bmi = HealthCalculator.calculate_bmi(weight_kg, height_cm)
        bmr = HealthCalculator.calculate_bmr(weight_kg, height_cm, age, sex)
        tdee = HealthCalculator.calculate_tdee(bmr, activity_level)
        return HealthResult(bmi=bmi, bmr=bmr, tdee=tdee)
