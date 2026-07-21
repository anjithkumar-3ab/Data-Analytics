"""
Food filtering service for dietary restrictions, allergies, and medical conditions.

Provides intelligent, reusable food filtering functions for the NutriAI
recommendation engine. All functions operate on the MongoDB ``foods`` collection
and return sanitized dictionaries suitable for API responses.

Field Mapping (CSV → MongoDB → Output):
    - ``food_name`` → stored as-is → ``name``
    - ``food_preference`` → ``food_preference`` → ``food_preference``
    - ``meal_type`` → ``meal_type`` → ``meal_type``
    - ``allergens`` → ``allergens`` → ``allergens``
    - ``calories``, ``protein``, ``carbohydrates``, ``fat``, ``fiber``,
      ``sugar``, ``sodium`` → kept as-is
"""

from __future__ import annotations

import logging
import random
from typing import Any, Dict, List, Optional

from pymongo.errors import PyMongoError

from app.database.database import foods_collection

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Preference-to-MongoDB-query mapping (uses the ``food_preference`` field).
PREFERENCE_FILTER_MAP: Dict[str, Dict[str, Any]] = {
    "Vegetarian": {"food_preference": "Vegetarian"},
    "Non-Vegetarian": {"food_preference": "Non-Vegetarian"},
    "Vegan": {"food_preference": "Vegan"},
}

# Allergen keywords that may appear in the ``allergens`` field.
# For each user-reported allergy we build a negative regex so foods whose
# ``allergens`` string contains the keyword are excluded.
ALLERGEN_KEYWORD_MAP: Dict[str, List[str]] = {
    "peanut": ["Peanut"],
    "milk": ["Milk"],
    "soy": ["Soy"],
    "egg": ["Egg"],
    "gluten": ["Gluten"],
    "fish": ["Fish"],
    "shellfish": ["Shellfish"],
    "tree nuts": ["Tree Nuts"],
}

# Medical-condition → nutritional thresholds applied as MongoDB range filters.
# Multiple conditions are combined with ``$or`` (any condition restricts).
MEDICAL_CONDITION_FILTERS: Dict[str, Dict[str, Any]] = {
    "diabetes": {"sugar": {"$lte": 10.0}},
    "hypertension": {"sodium": {"$lte": 0.5}},
    "kidney disease": {
        "$and": [
            {"sodium": {"$lte": 0.5}},
            {"protein": {"$lte": 30.0}},
        ]
    },
    "heart disease": {
        "$and": [
            {"fat": {"$lte": 15.0}},
            {"sodium": {"$lte": 0.5}},
        ]
    },
    "obesity": {"calories": {"$lte": 300.0}},
}

# Valid sort fields and their MongoDB column names.
SORT_FIELD_MAP: Dict[str, str] = {
    "calories": "calories",
    "protein": "protein",
    "carbohydrates": "carbohydrates",
    "fat": "fat",
    "fiber": "fiber",
    "alphabetical": "food_name",
}

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _serialize_food(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Normalise a raw MongoDB document into the standard output shape.

    Args:
        doc: Raw document from the ``foods`` collection.

    Returns:
        Dictionary with ``_id`` converted to string, ``food_name`` aliased to
        ``name``, and all other fields preserved.
    """
    if not doc:
        return {}

    serialized: Dict[str, Any] = {k: v for k, v in doc.items()}
    serialized["_id"] = str(serialized.get("_id", ""))
    # Alias food_name → name so callers can use ``food["name"]``.
    if "food_name" in serialized:
        serialized["name"] = serialized.pop("food_name")
    return serialized


def _safe_find(
    query: Dict[str, Any],
    projection: Optional[Dict[str, Any]] = None,
    sort: Optional[List[tuple]] = None,
    skip: int = 0,
    limit: int = 0,
) -> List[Dict[str, Any]]:
    """Execute a MongoDB find with uniform error handling.

    Args:
        query: MongoDB filter document.
        projection: Fields to include / exclude.
        sort: List of (field, direction) tuples.
        skip: Documents to skip (pagination).
        limit: Maximum documents to return.

    Returns:
        List of serialised food dicts (empty list on error).
    """
    try:
        cursor = foods_collection.find(query, projection)
        if sort:
            cursor = cursor.sort(sort)
        if skip:
            cursor = cursor.skip(skip)
        if limit:
            cursor = cursor.limit(limit)
        return [_serialize_food(doc) for doc in cursor]
    except PyMongoError as exc:
        logger.error("MongoDB query failed: %s", exc)
        return []


# ---------------------------------------------------------------------------
# Public API – individual filter builders
# ---------------------------------------------------------------------------


def get_foods(
    page: int = 1,
    per_page: int = 50,
    sort_by: Optional[str] = None,
    sort_order: str = "asc",
) -> List[Dict[str, Any]]:
    """Return all foods with optional pagination and sorting.

    Args:
        page: Page number (1-indexed).
        per_page: Number of items per page (clamped to 1–200).
        sort_by: Field name to sort by (see ``SORT_FIELD_MAP``).  If *None*,
            natural MongoDB order is used.
        sort_order: ``"asc"`` or ``"desc"``.

    Returns:
        List of food dictionaries for the requested page.
    """
    per_page = max(1, min(per_page, 200))
    skip = (max(1, page) - 1) * per_page

    sort_list: Optional[List[tuple]] = None
    if sort_by and sort_by in SORT_FIELD_MAP:
        direction = 1 if sort_order.lower() == "asc" else -1
        sort_list = [(SORT_FIELD_MAP[sort_by], direction)]

    return _safe_find({}, sort=sort_list, skip=skip, limit=per_page)


def filter_by_preference(preference: str) -> Dict[str, Any]:
    """Build a MongoDB filter for a dietary preference.

    Args:
        preference: One of ``"Vegetarian"``, ``"Non-Vegetarian"``, or
            ``"Vegan"``.  Case-insensitive.

    Returns:
        MongoDB query document.  An empty dict means no restriction (unknown
        preference defaults to no filter).
    """
    key = preference.strip().title()
    return PREFERENCE_FILTER_MAP.get(key, {})


def filter_by_meal_type(meal_type: str) -> Dict[str, Any]:
    """Build a MongoDB filter for a meal type.

    Args:
        meal_type: One of ``"Breakfast"``, ``"Lunch"``, ``"Dinner"``, or
            ``"Snack"``.  Case-insensitive.

    Returns:
        MongoDB query document.  An empty dict means no restriction (unknown
        meal type defaults to no filter).
    """
    valid = {"Breakfast", "Lunch", "Dinner", "Snack"}
    key = meal_type.strip().title()
    if key in valid:
        return {"meal_type": key}
    logger.warning("Unknown meal_type '%s' – no meal-type filter applied.", meal_type)
    return {}


def filter_by_allergies(allergies: Optional[List[str]]) -> Dict[str, Any]:
    """Build a MongoDB filter that **excludes** foods containing any of the
    supplied allergens.

    Args:
        allergies: List of allergen strings (e.g. ``["Peanut", "Milk"]``).
            Matching is case-insensitive and partial (substring).

    Returns:
        MongoDB query document using ``$not`` / ``$regex`` to exclude matching
        foods.  An empty dict when *allergies* is ``None`` or empty.
    """
    if not allergies:
        return {}

    exclusion_patterns: List[str] = []
    for allergy in allergies:
        keywords = ALLERGEN_KEYWORD_MAP.get(allergy.strip().lower(), [allergy.strip()])
        exclusion_patterns.extend(keywords)

    if not exclusion_patterns:
        return {}

    # Build a regex alternation, e.g. "Peanut|Milk|Egg"
    pattern = "|".join(exclusion_patterns)
    return {"allergens": {"$not": {"$regex": pattern, "$options": "i"}}}


def filter_by_medical_conditions(
    conditions: Optional[List[str]],
) -> Dict[str, Any]:
    """Build a MongoDB filter based on medical-condition nutritional limits.

    Supported conditions (case-insensitive):
        - Diabetes       – sugar ≤ 10 g
        - Hypertension   – sodium ≤ 0.5 mg
        - Kidney Disease – sodium ≤ 0.5 mg AND protein ≤ 30 g
        - Heart Disease  – fat ≤ 15 g AND sodium ≤ 0.5 mg
        - Obesity        – calories ≤ 300 kcal

    Args:
        conditions: List of condition name strings.

    Returns:
        MongoDB query document.  When multiple conditions are supplied they
        are combined with ``$and``.
    """
    if not conditions:
        return {}

    filters: List[Dict[str, Any]] = []
    for condition in conditions:
        key = condition.strip().lower()
        cond_filter = MEDICAL_CONDITION_FILTERS.get(key)
        if cond_filter:
            filters.append(cond_filter)
        else:
            logger.warning(
                "Unknown medical condition '%s' – ignoring.", condition
            )

    if not filters:
        return {}
    if len(filters) == 1:
        return filters[0]
    return {"$and": filters}


def filter_by_budget(max_cost: Optional[float]) -> Dict[str, Any]:
    """Build a MongoDB filter for foods under a maximum cost.

    Note:
        The current dataset does **not** include a ``cost`` field.  This
        filter is a forward-looking stub that will be effective once cost
        data is added to the collection.

    Args:
        max_cost: Maximum cost per serving.  If *None* or 0, no filter is
            applied.

    Returns:
        MongoDB query document or empty dict.
    """
    if max_cost is not None and max_cost > 0:
        return {"cost": {"$lte": max_cost}}
    return {}


def filter_by_calorie_range(
    min_calories: Optional[float],
    max_calories: Optional[float],
) -> Dict[str, Any]:
    """Build a MongoDB filter for a calorie range (inclusive).

    Args:
        min_calories: Lower bound (kcal).  If *None*, no lower limit.
        max_calories: Upper bound (kcal).  If *None*, no upper limit.

    Returns:
        MongoDB query document using ``$gte`` / ``$lte``, or empty dict if
        both bounds are *None*.
    """
    if min_calories is None and max_calories is None:
        return {}

    cal_filter: Dict[str, Any] = {}
    if min_calories is not None:
        cal_filter["$gte"] = min_calories
    if max_calories is not None:
        cal_filter["$lte"] = max_calories

    return {"calories": cal_filter}


def search_foods(query: str) -> List[Dict[str, Any]]:
    """Full-text-style search across food name, cuisine, and allergens fields.

    Uses case-insensitive regex matching.  Results are capped at 100 to avoid
    overly broad responses.

    Args:
        query: Search string (minimum 1 character).

    Returns:
        List of matching food dicts (empty list when query is blank or on
        error).
    """
    q = query.strip()
    if not q:
        return []

    pattern = {"$regex": q, "$options": "i"}
    search_filter = {
        "$or": [
            {"food_name": pattern},
            {"cuisine": pattern},
            {"allergens": pattern},
        ]
    }
    return _safe_find(search_filter, limit=100)


def sort_foods(
    foods: List[Dict[str, Any]],
    sort_by: str = "alphabetical",
    sort_order: str = "asc",
) -> List[Dict[str, Any]]:
    """Sort an in-memory list of food dictionaries.

    Use this when you already have a result set and want to re-sort it
    without another database round-trip.

    Args:
        foods: List of food dictionaries (must contain the fields referenced
            by *sort_by*).
        sort_by: One of ``calories``, ``protein``, ``carbohydrates``, ``fat``,
            ``fiber``, ``alphabetical`` (default).
        sort_order: ``"asc"`` or ``"desc"``.

    Returns:
        New list sorted according to the requested field and direction.
    """
    if not foods:
        return []

    reverse = sort_order.lower() == "desc"
    field = SORT_FIELD_MAP.get(sort_by, "food_name")

    if field == "food_name":
        # Sort by the aliased ``name`` key that _serialize_food produces.
        return sorted(
            foods,
            key=lambda f: str(f.get("name", "")).lower(),
            reverse=reverse,
        )

    return sorted(
        foods,
        key=lambda f: float(f.get(field, 0) or 0),
        reverse=reverse,
    )


# ---------------------------------------------------------------------------
# Combined query helpers
# ---------------------------------------------------------------------------


def _combine_filters(*filters: Dict[str, Any]) -> Dict[str, Any]:
    """Combine multiple MongoDB filter dicts with ``$and`` logic.

    Empty / ``{}`` filters are ignored.

    Args:
        *filters: Variable number of filter dicts.

    Returns:
        A single MongoDB query document.
    """
    non_empty = [f for f in filters if f]
    if not non_empty:
        return {}
    if len(non_empty) == 1:
        return non_empty[0]
    return {"$and": non_empty}


# ---------------------------------------------------------------------------
# Main entry-point for the recommendation engine
# ---------------------------------------------------------------------------


def get_foods_for_meal_type(
    meal_type: str,
    preference: str,
    allergies: Optional[str] = None,
    medical_conditions: Optional[str] = None,
    budget: Optional[float] = None,
    minimum_calories: Optional[float] = None,
    maximum_calories: Optional[float] = None,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """Return a filtered, shuffled list of foods suitable for a given meal.

    This is the **primary function** used by the recommendation engine.  It
    reads foods from MongoDB, applies all relevant filters, shuffles the
    result to increase variety, and returns a clean list of dictionaries.

    Args:
        meal_type: ``"Breakfast"``, ``"Lunch"``, ``"Dinner"``, or
            ``"Snack"``.
        preference: ``"Vegetarian"``, ``"Non-Vegetarian"``, or ``"Vegan"``.
        allergies: Comma-separated allergy string (e.g.
            ``"Peanut,Milk,Gluten"``).  Pass *None* or ``""`` to skip.
        medical_conditions: Comma-separated condition string (e.g.
            ``"Diabetes,Hypertension"``).  Pass *None* or ``""`` to skip.
        budget: Maximum cost per food item (forward-looking – ignored if
            dataset has no ``cost`` field).
        minimum_calories: Inclusive lower calorie bound.
        maximum_calories: Inclusive upper calorie bound.
        limit: Maximum number of foods to return (default 10).

    Returns:
        List of food dictionaries, each containing at least ``_id``,
        ``name``, ``calories``, ``protein``, ``carbohydrates``, ``fat``,
        ``fiber``, ``food_preference``, ``meal_type``, ``allergens``.
        Returns an empty list on error or when no foods match.
    """
    # --- Parse string inputs into lists -----------------------------------
    allergy_list: Optional[List[str]] = None
    if allergies:
        allergy_list = [a.strip() for a in allergies.split(",") if a.strip()]

    condition_list: Optional[List[str]] = None
    if medical_conditions:
        condition_list = [
            c.strip() for c in medical_conditions.split(",") if c.strip()
        ]

    # --- Build individual filters -----------------------------------------
    pref_filter = filter_by_preference(preference)
    meal_filter = filter_by_meal_type(meal_type)
    allergy_filter = filter_by_allergies(allergy_list)
    condition_filter = filter_by_medical_conditions(condition_list)
    budget_filter = filter_by_budget(budget)
    calorie_filter = filter_by_calorie_range(minimum_calories, maximum_calories)

    # --- Combine and query ------------------------------------------------
    combined = _combine_filters(
        pref_filter,
        meal_filter,
        allergy_filter,
        condition_filter,
        budget_filter,
        calorie_filter,
    )

    logger.debug("get_foods_for_meal_type combined filter: %s", combined)

    # Fetch more than *limit* so we can shuffle without reducing variety.
    fetch_limit = max(limit * 3, 30)
    foods = _safe_find(combined, limit=fetch_limit)

    if not foods:
        logger.info(
            "No foods matched filters – meal_type=%s preference=%s",
            meal_type,
            preference,
        )
        return []

    # Shuffle to increase variety across calls.
    random.shuffle(foods)

    return foods[:limit]
