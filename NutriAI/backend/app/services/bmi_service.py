def calculate_bmi(height_cm: float, weight_kg: float):
    """
    Calculate BMI and BMI category.

    height_cm : Height in centimeters
    weight_kg : Weight in kilograms
    """

    height_m = height_cm / 100

    bmi = weight_kg / (height_m ** 2)

    bmi = round(bmi, 2)

    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal Weight"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"

    return {
        "bmi": bmi,
        "category": category
    }


def ideal_weight_range(height_cm: float):
    """
    Calculate ideal weight range based on healthy BMI (18.5 - 24.9).

    height_cm : Height in centimeters
    Returns (min_weight, max_weight) in kg
    """
    height_m = height_cm / 100
    min_weight = round(18.5 * (height_m ** 2), 1)
    max_weight = round(24.9 * (height_m ** 2), 1)
    return min_weight, max_weight
