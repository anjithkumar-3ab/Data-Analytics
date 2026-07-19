def calculate_macros(calories, goal):
    """
    Calculate daily macronutrients.

    Protein = 4 kcal/g
    Carbs   = 4 kcal/g
    Fat     = 9 kcal/g
    """

    if goal == "Weight Loss":
        protein_ratio = 0.35
        carbs_ratio = 0.35
        fat_ratio = 0.30

    elif goal == "Weight Gain":
        protein_ratio = 0.25
        carbs_ratio = 0.50
        fat_ratio = 0.25

    else:
        protein_ratio = 0.30
        carbs_ratio = 0.45
        fat_ratio = 0.25

    protein = round((calories * protein_ratio) / 4, 1)
    carbs = round((calories * carbs_ratio) / 4, 1)
    fat = round((calories * fat_ratio) / 9, 1)

    return {
        "protein": protein,
        "carbohydrates": carbs,
        "fat": fat
    }