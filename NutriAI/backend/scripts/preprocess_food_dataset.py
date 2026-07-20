import os
import glob
import pandas as pd


# ======================================================
# PROJECT PATHS
# ======================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

RAW_FOLDER = os.path.join(BASE_DIR, "data", "raw")
PROCESSED_FOLDER = os.path.join(BASE_DIR, "data", "processed")

os.makedirs(PROCESSED_FOLDER, exist_ok=True)

csv_files = glob.glob(os.path.join(RAW_FOLDER, "*.csv"))

if len(csv_files) == 0:
    raise FileNotFoundError(
        f"\nNo CSV file found in:\n{RAW_FOLDER}\n\n"
        "Please copy Food.csv into the raw folder."
    )

RAW_FILE = csv_files[0]

OUTPUT_FILE = os.path.join(
    PROCESSED_FOLDER,
    "foods_clean.csv"
)

print("=" * 60)
print("NutriAI Food Dataset Preprocessing")
print("=" * 60)

print("\nReading file:")
print(RAW_FILE)

# ======================================================
# LOAD DATASET
# ======================================================

df = pd.read_csv(RAW_FILE)

print(f"\nRows    : {len(df)}")
print(f"Columns : {len(df.columns)}")

# ======================================================
# REMOVE DUPLICATES
# ======================================================

before = len(df)

df.drop_duplicates(inplace=True)

after = len(df)

print(f"\nDuplicates Removed : {before-after}")

# ======================================================
# REMOVE EMPTY ROWS
# ======================================================

df.dropna(how="all", inplace=True)

# ======================================================
# RENAME COLUMNS
# ======================================================

rename_columns = {

    "food": "food_name",

    "Caloric Value": "calories",

    "Protein": "protein",

    "Carbohydrates": "carbohydrates",

    "Fat": "fat",

    "Dietary Fiber": "fiber",

    "Sugars": "sugar",

    "Sodium": "sodium",

    "Calcium": "calcium",

    "Iron": "iron",

    "Potassium": "potassium",

    "Nutrition Density": "nutrition_density"

}

df.rename(columns=rename_columns, inplace=True)

# ======================================================
# KEEP REQUIRED COLUMNS
# ======================================================

required_columns = [

    "food_name",

    "calories",

    "protein",

    "carbohydrates",

    "fat",

    "fiber",

    "sugar",

    "sodium",

    "calcium",

    "iron",

    "potassium",

    "nutrition_density"

]

df = df[required_columns]

# ======================================================
# CONVERT TO NUMERIC
# ======================================================

numeric_columns = [

    "calories",

    "protein",

    "carbohydrates",

    "fat",

    "fiber",

    "sugar",

    "sodium",

    "calcium",

    "iron",

    "potassium",

    "nutrition_density"

]

for col in numeric_columns:

    df[col] = pd.to_numeric(df[col], errors="coerce")

df[numeric_columns] = df[numeric_columns].fillna(0)

# ======================================================
# CLEAN FOOD NAME
# ======================================================

df["food_name"] = (

    df["food_name"]

    .astype(str)

    .str.strip()

    .str.title()

)

# ======================================================
# DEFAULT VALUES
# ======================================================

df["meal_type"] = "Lunch"

df["food_preference"] = "Vegetarian"

df["cuisine"] = "International"

df["allergens"] = "None"

df["serving_size"] = "100 g"

# ======================================================
# KEYWORDS
# ======================================================

breakfast_keywords = [

    "Egg",

    "Bread",

    "Milk",

    "Oats",

    "Corn Flakes",

    "Cereal",

    "Yogurt",

    "Cheese",

    "Butter"

]

snack_keywords = [

    "Apple",

    "Banana",

    "Orange",

    "Grapes",

    "Peanut",

    "Almond",

    "Cashew",

    "Walnut"

]

nonveg_keywords = [

    "Chicken",

    "Fish",

    "Egg",

    "Beef",

    "Pork",

    "Turkey",

    "Shrimp",

    "Crab",

    "Lamb",

    "Mutton"

]

allergen_keywords = {

    "Milk": "Milk",

    "Cheese": "Milk",

    "Butter": "Milk",

    "Yogurt": "Milk",

    "Peanut": "Peanuts",

    "Almond": "Tree Nuts",

    "Cashew": "Tree Nuts",

    "Walnut": "Tree Nuts",

    "Wheat": "Gluten",

    "Bread": "Gluten",

    "Egg": "Egg",

    "Soy": "Soy"

}

# ======================================================
# CLASSIFICATION
# ======================================================

for idx, row in df.iterrows():

    food = row["food_name"]

    # Meal Type

    if any(word in food for word in breakfast_keywords):

        df.at[idx, "meal_type"] = "Breakfast"

    elif any(word in food for word in snack_keywords):

        df.at[idx, "meal_type"] = "Snack"

    else:

        df.at[idx, "meal_type"] = "Lunch"

    # Food Preference

    if any(word in food for word in nonveg_keywords):

        df.at[idx, "food_preference"] = "Non-Vegetarian"

    else:

        df.at[idx, "food_preference"] = "Vegetarian"

    # Allergens

    found = []

    for key, value in allergen_keywords.items():

        if key in food:

            found.append(value)

    if found:

        df.at[idx, "allergens"] = ", ".join(sorted(set(found)))

# ======================================================
# SORT
# ======================================================

df.sort_values("food_name", inplace=True)

df.reset_index(drop=True, inplace=True)

# ======================================================
# EXPORT
# ======================================================

df.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\n" + "=" * 60)

print("Preprocessing Completed Successfully")

print("=" * 60)

print(f"Rows              : {len(df)}")

print(f"Columns           : {len(df.columns)}")

print(f"Output File       : {OUTPUT_FILE}")

print("=" * 60)