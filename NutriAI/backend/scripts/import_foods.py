import os
import pandas as pd
from pymongo import MongoClient

# -----------------------------
# MongoDB Connection
# -----------------------------
client = MongoClient("mongodb://127.0.0.1:27017")

db = client["nutriai"]

foods_collection = db["foods"]

# -----------------------------
# File Path
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSV_FILE = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "foods_clean.csv"
)

print(f"Reading: {CSV_FILE}")

# -----------------------------
# Load CSV
# -----------------------------
df = pd.read_csv(CSV_FILE)

print(f"Rows Found: {len(df)}")

# -----------------------------
# Remove Existing Data
# -----------------------------
foods_collection.delete_many({})

print("Old data removed.")

# -----------------------------
# Insert New Data
# -----------------------------
foods_collection.insert_many(
    df.to_dict(orient="records")
)

print(f"Successfully imported {len(df)} foods.")