"""
Intelligent meal planning service for creating complete daily nutrition plans.

Uses a **scoring-based selection algorithm** (not random selection) to choose
optimal foods for each meal while respecting dietary restrictions, allergies,
and medical conditions.  Integrates directly with
:mod:`app.services.food_filter_service` and
:mod:`app.schemas.recommendation_schema`.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Set, Tuple

from app.schemas.recommendation_schema import DailyPlan, Meal, MealItem, MealType
from app.services.food_filter_service import get_foods_for_meal_type

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Calorie distribution across meals (fraction of daily calories).
CALORIE_DISTRIBUTION: Dict[str, float] = {
    "Breakfast": 0.25,
    "Lunch": 0.35,
    "Dinner": 0.30,
    "Snack": 0.10,
}

# Number of food items selected for each meal.
DEFAULT_ITEMS_PER_MEAL: int = 2

# Water intake coefficient (ml of water per kg of body weight).
WATER_ML_PER_KG: float = 35.0

# ---------------------------------------------------------------------------
# Scoring weights (base values applied to all foods)
# ---------------------------------------------------------------------------

# fmt: off
SCORE_WEIGHTS: Dict[str, float] = {
    "calorie_proximity": 10.0,   # penalty per unit of calorie deviation
    "protein_proximity": 10.0,   # penalty per unit of protein deviation
    "carbs_proximity":    8.0,   # penalty per unit of carb deviation
    "fat_proximity":       6.0,   # penalty per unit of fat deviation
    "protein_bonus":      -5.0,   # bonus per gram of protein (negative = better)
    "sugar_penalty":       0.08,  # penalty per gram of sugar
    "sodium_penalty":      0.005, # penalty per mg of sodium
    "fiber_bonus":        -2.0,   # bonus per gram of fiber (negative = better)
}
# fmt: on

# Medical-condition → additional score modifiers applied additively.
# Each key maps to attributes that **override or augment** SCORE_WEIGHTS
# for the matching condition.
CONDITION_SCORE_MODIFIERS: Dict[str, Dict[str, float]] = {
    "diabetes": {
        "sugar_penalty": 1.0,  # heavy penalty per gram of sugar
    },
    "hypertension": {
        "sodium_penalty": 0.05,  # heavy penalty per mg of sodium
    },
    "heart disease": {
        "fat_proximity": 12.0,  # stricter fat matching
    },
    "kidney disease": {
        "protein_proximity": 15.0,  # stricter protein matching
        "sodium_penalty": 0.03,
    },
    "obesity": {
        "calorie_proximity": 15.0,  # stricter calorie matching
    },
}

# Meal-type → macro distribution (fraction of meal calories).
# These guides help compute per-item macro targets.
MEAL_MACRO_RATIOS: Dict[str, Dict[str, float]] = {
    "Breakfast": {"protein": 0.15, "carbs": 0.55, "fat": 0.30},
    "Lunch":     {"protein": 0.25, "carbs": 0.45, "fat": 0.30},
    "Dinner":    {"protein": 0.30, "carbs": 0.40, "fat": 0.30},
    "Snack":     {"protein": 0.15, "carbs": 0.60, "fat": 0.25},
}


# ---------------------------------------------------------------------------
# Helper: food → MealItem
# ---------------------------------------------------------------------------

def _food_to_meal_item(food: Dict[str, Any]) -> MealItem:
    """Convert a food dictionary (from the filter service) into a MealItem.

    Args:
        food: Dictionary with keys ``_id``, ``name``, ``category``,
            ``calories``, ``protein``, ``carbohydrates``, ``fat``,
            ``fiber``, ``sugar``, ``sodium``.

    Returns:
        A fully-populated :class:`MealItem`.
    """
    return MealItem(
        food_id=str(food.get("_id", "")),
        name=str(food.get("name", "Unknown Food")),
        category=str(food.get("category", "")),
        quantity="100g",
        calories=float(food.get("calories", 0) or 0),
        protein=float(food.get("protein", 0) or 0),
        carbohydrates=float(food.get("carbohydrates", 0) or 0),
        fat=float(food.get("fat", 0) or 0),
        fiber=float(food.get("fiber", 0) or 0),
        sugar=float(food.get("sugar", 0) or 0),
        sodium=float(food.get("sodium", 0) or 0),
    )


# ---------------------------------------------------------------------------
# Scoring engine
# ---------------------------------------------------------------------------

def _compute_per_item_targets(
    meal_calories: float,
    meal_protein: float,
    meal_carbs: float,
    meal_fat: float,
    items_per_meal: int = DEFAULT_ITEMS_PER_MEAL,
) -> Tuple[float, float, float, float]:
    """Divide meal-level targets by the number of items to get per-food targets.

    Args:
        meal_calories: Total calories allocated to the meal.
        meal_protein: Total protein (g) allocated.
        meal_carbs: Total carbohydrates (g) allocated.
        meal_fat: Total fat (g) allocated.
        items_per_meal: How many food items will be selected.

    Returns:
        (per_item_cal, per_item_prot, per_item_carb, per_item_fat)
    """
    n = max(items_per_meal, 1)
    return (meal_calories / n, meal_protein / n, meal_carbs / n, meal_fat / n)


def _build_effective_weights(
    medical_conditions: Optional[List[str]],
) -> Dict[str, float]:
    """Merge base score weights with condition-specific modifiers.

    Args:
        medical_conditions: List of condition names (case-insensitive).

    Returns:
        A dictionary of effective scoring weights.
    """
    weights = dict(SCORE_WEIGHTS)
    if not medical_conditions:
        return weights

    for condition in medical_conditions:
        mods = CONDITION_SCORE_MODIFIERS.get(condition.strip().lower())
        if mods:
            weights.update(mods)
        else:
            logger.debug("No score modifier for condition: %s", condition)
    return weights


def _score_food(
    food: Dict[str, Any],
    per_item_cal: float,
    per_item_prot: float,
    per_item_carb: float,
    per_item_fat: float,
    weights: Dict[str, float],
) -> float:
    """Assign a numeric score to a food (lower is better).

    The score combines:
    - Proximity to per-item macro targets
    - Protein / fiber bonuses (higher nutrient → lower score)
    - Sugar / sodium penalties (higher → higher score)

    Args:
        food: Food dictionary from the filter service.
        per_item_cal: Target calories for one item in this meal.
        per_item_prot: Target protein (g).
        per_item_carb: Target carbohydrates (g).
        per_item_fat: Target fat (g).
        weights: Effective score weights (base + medical modifiers).

    Returns:
        A floating-point score where **lower = better fit**.
    """
    cal = float(food.get("calories", 0) or 0)
    prot = float(food.get("protein", 0) or 0)
    carb = float(food.get("carbohydrates", 0) or 0)
    fat = float(food.get("fat", 0) or 0)
    sugar = float(food.get("sugar", 0) or 0)
    sodium = float(food.get("sodium", 0) or 0)
    fiber = float(food.get("fiber", 0) or 0)

    score = 0.0

    # Proximity penalties — how far is this food from the ideal per-item macro?
    score += weights.get("calorie_proximity", 10) * abs(cal - per_item_cal) / max(per_item_cal, 1)
    score += weights.get("protein_proximity", 10) * abs(prot - per_item_prot) / max(per_item_prot, 1)
    score += weights.get("carbs_proximity", 8) * abs(carb - per_item_carb) / max(per_item_carb, 1)
    score += weights.get("fat_proximity", 6) * abs(fat - per_item_fat) / max(per_item_fat, 1)

    # Protein bonus — negative weight means higher protein reduces score.
    score += weights.get("protein_bonus", -5) * prot / max(per_item_prot, 1)

    # Fiber bonus — more fiber is generally desirable.
    score += weights.get("fiber_bonus", -2) * fiber / 10.0

    # Sugar penalty — higher sugar raises score.
    score += weights.get("sugar_penalty", 0.08) * sugar

    # Sodium penalty — higher sodium raises score.
    score += weights.get("sodium_penalty", 0.005) * sodium

    return score


# ---------------------------------------------------------------------------
# Food selection
# ---------------------------------------------------------------------------

def _select_best_foods(
    foods: List[Dict[str, Any]],
    per_item_cal: float,
    per_item_prot: float,
    per_item_carb: float,
    per_item_fat: float,
    weights: Dict[str, float],
    used_ids: Set[str],
    items_per_meal: int = DEFAULT_ITEMS_PER_MEAL,
) -> List[MealItem]:
    """Score all candidate foods and return the top N as MealItems.

    Foods whose ``_id`` appears in *used_ids* are skipped so the same food
    is never selected twice across meals.

    Args:
        foods: Candidate food dictionaries.
        per_item_cal: Target calories per item.
        per_item_prot: Target protein (g) per item.
        per_item_carb: Target carbs (g) per item.
        per_item_fat: Target fat (g) per item.
        weights: Effective score weights.
        used_ids: Set of food IDs already used in this daily plan.
        items_per_meal: How many items to select.

    Returns:
        List of :class:`MealItem` instances sorted best-first.
    """
    if not foods:
        return []

    scored: List[Tuple[float, Dict[str, Any]]] = []
    for food in foods:
        food_id = str(food.get("_id", ""))
        # Skip foods already used in another meal.
        if food_id and food_id in used_ids:
            continue
        s = _score_food(food, per_item_cal, per_item_prot, per_item_carb, per_item_fat, weights)
        scored.append((s, food))

    if not scored:
        return []

    # Sort by score ascending (lower is better).
    scored.sort(key=lambda pair: pair[0])

    selected: List[MealItem] = []
    for _, food in scored[:items_per_meal]:
        meal_item = _food_to_meal_item(food)
        selected.append(meal_item)
        used_ids.add(meal_item.food_id)

    return selected


# ---------------------------------------------------------------------------
# Fallback food fetching
# ---------------------------------------------------------------------------

def _fetch_candidates(
    meal_type: str,
    preference: str,
    allergies: Optional[List[str]],
    medical_conditions: Optional[List[str]],
    budget: Optional[float],
) -> List[Dict[str, Any]]:
    """Fetch candidate foods for a meal type, with fallback logic.

    If no foods match the requested meal type, a broader search is attempted.
    If that still returns nothing, a warning is logged and an empty list is
    returned.

    Args:
        meal_type: ``"Breakfast"``, ``"Lunch"``, ``"Dinner"``, or ``"Snack"``.
        preference: Food preference string.
        allergies: List of allergies (or ``None``).
        medical_conditions: List of medical conditions (or ``None``).
        budget: Optional max budget per food item.

    Returns:
        List of food dictionaries (empty when nothing matches).
    """
    allergies_str = ",".join(allergies) if allergies else None
    conditions_str = ",".join(medical_conditions) if medical_conditions else None

    foods = get_foods_for_meal_type(
        meal_type=meal_type,
        preference=preference,
        allergies=allergies_str,
        medical_conditions=conditions_str,
        budget=budget,
        limit=30,
    )

    if not foods:
        logger.warning(
            "No foods for meal_type='%s', trying fallback to 'Lunch'", meal_type
        )
        foods = get_foods_for_meal_type(
            meal_type="Lunch",
            preference=preference,
            allergies=allergies_str,
            medical_conditions=conditions_str,
            budget=budget,
            limit=30,
        )

    if not foods:
        logger.warning(
            "No foods available for meal_type='%s' after fallback", meal_type
        )

    return foods


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def select_meal_items(
    meal_type: str,
    target_calories: float,
    target_protein: float,
    target_carbs: float,
    target_fat: float,
    preference: str,
    allergies: Optional[List[str]] = None,
    medical_conditions: Optional[List[str]] = None,
    items_per_meal: int = DEFAULT_ITEMS_PER_MEAL,
    used_ids: Optional[Set[str]] = None,
    budget: Optional[float] = None,
) -> Tuple[List[MealItem], float, float, float, float, float]:
    """Select food items for a single meal using a scoring algorithm.

    Args:
        meal_type: ``"Breakfast"``, ``"Lunch"``, ``"Dinner"``, or ``"Snack"``.
        target_calories: Calorie budget for this meal.
        target_protein: Protein target (g) for this meal.
        target_carbs: Carbohydrate target (g).
        target_fat: Fat target (g).
        preference: Food preference string.
        allergies: List of allergy names (or ``None``).
        medical_conditions: List of condition names (or ``None``).
        items_per_meal: How many food items to include.
        used_ids: Set of food IDs already consumed today (mutated in-place).
        budget: Optional max food cost.

    Returns:
        Tuple of ``(meal_items, actual_cal, actual_prot, actual_carb,
        actual_fat, actual_fiber)``.
    """
    if used_ids is None:
        used_ids = set()

    # Fetch candidate foods from the filter service.
    candidates = _fetch_candidates(
        meal_type=meal_type,
        preference=preference,
        allergies=allergies,
        medical_conditions=medical_conditions,
        budget=budget,
    )

    if not candidates:
        logger.info("No candidates for %s — returning empty meal.", meal_type)
        return [], 0.0, 0.0, 0.0, 0.0, 0.0

    # Compute per-item macro targets.
    per_cal, per_prot, per_carb, per_fat = _compute_per_item_targets(
        target_calories, target_protein, target_carbs, target_fat, items_per_meal
    )

    # Effective weights (base + medical-condition modifiers).
    weights = _build_effective_weights(medical_conditions)

    # Score and select best foods.
    items = _select_best_foods(
        foods=candidates,
        per_item_cal=per_cal,
        per_item_prot=per_prot,
        per_item_carb=per_carb,
        per_item_fat=per_fat,
        weights=weights,
        used_ids=used_ids,
        items_per_meal=items_per_meal,
    )

    # Accumulate totals.
    actual_cal = sum(it.calories for it in items)
    actual_prot = sum(it.protein for it in items)
    actual_carb = sum(it.carbohydrates for it in items)
    actual_fat = sum(it.fat for it in items)
    actual_fiber = sum(it.fiber for it in items)

    return items, actual_cal, actual_prot, actual_carb, actual_fat, actual_fiber


def create_daily_meal_plan(
    daily_calories: float,
    target_protein: float,
    target_carbs: float,
    target_fat: float,
    weight_kg: float,
    preference: str,
    allergies: Optional[List[str]] = None,
    medical_conditions: Optional[List[str]] = None,
    budget: Optional[float] = None,
    meals_per_day: int = 4,
) -> DailyPlan:
    """Create a complete daily meal plan across breakfast, lunch, dinner, and
    snacks.

    Each meal's foods are chosen by a scoring algorithm that balances
    macro-target proximity, protein/fiber preferences, and sugar/sodium
    penalties.  Medical conditions dynamically adjust the scoring weights
    (e.g. stricter sugar penalties for diabetes).

    Args:
        daily_calories: Total daily calorie target.
        target_protein: Daily protein target (g).
        target_carbs: Daily carbohydrate target (g).
        target_fat: Daily fat target (g).
        weight_kg: User body weight in kg (used for water recommendation).
        preference: Food preference string (e.g. ``"Vegetarian"``).
        allergies: List of allergy names, or ``None``.
        medical_conditions: List of medical condition names, or ``None``.
        budget: Optional maximum cost per food item (forward-looking).
        meals_per_day: Number of meals to plan (3–6).  Defaults to 4.

    Returns:
        A fully-populated :class:`DailyPlan` with meals and nutritional
        breakdown.

    Raises:
        ValueError: If *meals_per_day* is outside the supported range.
    """
    if meals_per_day < 3 or meals_per_day > 6:
        raise ValueError("meals_per_day must be between 3 and 6")

    # Track food IDs across meals to avoid duplicates.
    used_ids: Set[str] = set()

    meal_data: Dict[str, Meal] = {}
    total_calories = 0.0
    total_protein = 0.0
    total_carbs = 0.0
    total_fat = 0.0
    total_fiber = 0.0

    # Generate meals in the standard order: Breakfast → Lunch → Dinner → Snack.
    for meal_type, calorie_ratio in CALORIE_DISTRIBUTION.items():
        meal_calories = daily_calories * calorie_ratio
        meal_protein = target_protein * calorie_ratio
        meal_carbs = target_carbs * calorie_ratio
        meal_fat = target_fat * calorie_ratio

        items, actual_cal, actual_prot, actual_carb, actual_fat, actual_fiber = select_meal_items(
            meal_type=meal_type,
            target_calories=meal_calories,
            target_protein=meal_protein,
            target_carbs=meal_carbs,
            target_fat=meal_fat,
            preference=preference,
            allergies=allergies,
            medical_conditions=medical_conditions,
            items_per_meal=DEFAULT_ITEMS_PER_MEAL,
            used_ids=used_ids,
            budget=budget,
        )

        meal = Meal(
            meal_type=MealType(meal_type),
            items=items,
            total_calories=round(actual_cal, 1),
            total_protein=round(actual_prot, 1),
            total_carbohydrates=round(actual_carb, 1),
            total_fat=round(actual_fat, 1),
            total_fiber=round(actual_fiber, 1),
        )

        field_name = meal_type.lower() if meal_type != "Snack" else "snacks"
        meal_data[field_name] = meal

        total_calories += actual_cal
        total_protein += actual_prot
        total_carbs += actual_carb
        total_fat += actual_fat
        total_fiber += actual_fiber

    # Water recommendation: 35 ml per kg of body weight, converted to litres.
    recommended_water = round(weight_kg * WATER_ML_PER_KG / 1000.0, 1)

    daily_plan = DailyPlan(
        breakfast=meal_data["breakfast"],
        lunch=meal_data["lunch"],
        dinner=meal_data["dinner"],
        snacks=meal_data["snacks"],
        total_daily_calories=round(total_calories, 1),
        target_daily_calories=daily_calories,
        total_protein=round(total_protein, 1),
        target_protein=target_protein,
        total_carbohydrates=round(total_carbs, 1),
        target_carbohydrates=target_carbs,
        total_fat=round(total_fat, 1),
        target_fat=target_fat,
        total_fiber=round(total_fiber, 1),
        recommended_water_liters=recommended_water,
    )

    logger.info(
        "Daily plan created: %.0f kcal (target %.0f), water %.1f L",
        total_calories,
        daily_calories,
        recommended_water,
    )

    return daily_plan
