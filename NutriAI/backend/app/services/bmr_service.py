def calculate_bmr(age, gender, height, weight):
    """
    Mifflin-St Jeor Equation
    height -> cm
    weight -> kg
    """

    if gender == "Male":
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161

    return round(bmr, 2)


def calculate_tdee(bmr, activity_level):

    activity = {
        "Sedentary": 1.2,
        "Lightly Active": 1.375,
        "Moderately Active": 1.55,
        "Very Active": 1.725,
        "Athlete": 1.9,
    }

    return round(bmr * activity[activity_level], 2)


def calorie_goal(tdee, goal):

    if goal == "Lose Weight":
        return round(tdee - 500, 2)

    elif goal == "Gain Weight" or goal == "Muscle Gain":
        return round(tdee + 500, 2)

    return round(tdee, 2)
