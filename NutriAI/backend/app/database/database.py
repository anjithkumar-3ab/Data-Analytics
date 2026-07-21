from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")
DATABASE_NAME = os.getenv("DATABASE_NAME", "")

client = MongoClient(MONGODB_URI)

db = client[DATABASE_NAME]

# Collections
users_collection = db["users"]
recommendations_collection = db["recommendations"]
health_profiles_collection = db["health_profiles"]
foods_collection = db["foods"]

try:
    client.admin.command("ping")
    print("✅ MongoDB Connected Successfully!")
except Exception as e:
    print("❌ MongoDB Connection Failed")
    print(e)