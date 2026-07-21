import os
import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")
DATABASE_NAME = os.getenv("DATABASE_NAME", "")

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

collection = db["foods"]

csv_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "processed",
    "foods_clean.csv"
)

csv_path = os.path.abspath(csv_path)

print(f"Loading: {csv_path}")

df = pd.read_csv(csv_path)

records = df.to_dict(orient="records")

collection.delete_many({})

if records:
    collection.insert_many(records)

print(f"✅ Imported {len(records)} food records into MongoDB Atlas.")