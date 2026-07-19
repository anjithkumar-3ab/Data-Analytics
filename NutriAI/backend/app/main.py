from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.profile import router as profile_router
from app.routes.food import router as food_router


# Import database so the connection is initialized
from app.database.database import db

app = FastAPI(
    title="NutriAI API",
    version="1.0.0",
    description="AI-Based Personalized Diet Planning System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to NutriAI API 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected"
    }

app.include_router(auth_router)
app = FastAPI(
    title="NutriAI API",
    version="1.0.0",
    description="AI-Based Personalized Diet Planning System"
)

app.include_router(auth_router)

from app.database.database import users_collection

@app.get("/users")
def get_users():
    users = []

    for user in users_collection.find({}, {"password": 0}):
        user["_id"] = str(user["_id"])
        users.append(user)

    return users

app.include_router(profile_router)
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(food_router)