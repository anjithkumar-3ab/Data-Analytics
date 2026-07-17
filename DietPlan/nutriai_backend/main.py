import json
from datetime import timedelta

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .auth import AuthService
from .config import settings
from .db import SessionLocal
from .health import HealthCalculator
from .models import User, DietPlan, Food
from .recommender import Recommender
from .security import SecurityService

app = FastAPI(title='NutriAI Backend')
recommender = Recommender()
security = SecurityService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/login')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = security.decode_access_token(token)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid authentication credentials') from exc
    user_id = payload.get('user_id')
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid authentication credentials')
    user = db.query(User).filter_by(id=user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Admin privileges required')
    return current_user

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = 'user'

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    id: int
    username: str
    role: str

class HealthRequest(BaseModel):
    weight_kg: float
    height_cm: float
    age: int
    sex: str
    activity_level: str

class RecommendationRequest(BaseModel):
    weight_kg: float
    height_cm: float
    age: int
    sex: str
    activity_level: str

class FoodRequest(BaseModel):
    name: str
    category: str | None = None
    calories: float | None = None
    protein_g: float | None = None
    carbs_g: float | None = None
    fats_g: float | None = None
    fiber_g: float | None = None
    sodium_mg: float | None = None

class ProfileUpdateRequest(BaseModel):
    age: int | None = None
    sex: str | None = None
    height_cm: float | None = None
    weight_kg: float | None = None
    activity_level: str | None = None
    goal: str | None = None

@app.get('/')
def root():
    return {'message': 'NutriAI backend is running'}

@app.get('/auth/me')
def read_current_user(current_user: User = Depends(get_current_user)):
    return {
        'id': current_user.id,
        'username': current_user.username,
        'email': current_user.email,
        'role': current_user.role,
        'age': current_user.age,
        'sex': current_user.sex,
        'height_cm': current_user.height_cm,
        'weight_kg': current_user.weight_kg,
        'activity_level': current_user.activity_level,
        'goal': current_user.goal,
    }

@app.get('/admin/users')
def list_users(admin_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'age': user.age,
            'sex': user.sex,
            'height_cm': user.height_cm,
            'weight_kg': user.weight_kg,
            'activity_level': user.activity_level,
            'goal': user.goal,
        }
        for user in users
    ]

@app.get('/admin/foods')
def list_foods(admin_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    foods = db.query(Food).all()
    return [
        {
            'id': food.id,
            'name': food.name,
            'category': food.category,
            'calories': food.calories,
            'protein_g': food.protein_g,
            'carbs_g': food.carbs_g,
            'fats_g': food.fats_g,
            'fiber_g': food.fiber_g,
            'sodium_mg': food.sodium_mg,
        }
        for food in foods
    ]

@app.post('/admin/foods')
def create_food(request: FoodRequest, admin_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    food = Food(
        name=request.name,
        category=request.category,
        calories=request.calories,
        protein_g=request.protein_g,
        carbs_g=request.carbs_g,
        fats_g=request.fats_g,
        fiber_g=request.fiber_g,
        sodium_mg=request.sodium_mg,
    )
    db.add(food)
    db.commit()
    db.refresh(food)
    return {
        'id': food.id,
        'name': food.name,
        'category': food.category,
        'calories': food.calories,
        'protein_g': food.protein_g,
        'carbs_g': food.carbs_g,
        'fats_g': food.fats_g,
        'fiber_g': food.fiber_g,
        'sodium_mg': food.sodium_mg,
    }

@app.get('/users/{user_id}')
def get_user_profile(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.id != user_id and current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Not authorized to view this profile')
    user = db.query(User).filter_by(id=user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'age': user.age,
        'sex': user.sex,
        'height_cm': user.height_cm,
        'weight_kg': user.weight_kg,
        'activity_level': user.activity_level,
        'goal': user.goal,
    }

@app.put('/users/{user_id}')
def update_user_profile(user_id: int, request: ProfileUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.id != user_id and current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Not authorized to update this profile')
    user = db.query(User).filter_by(id=user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    user = db.query(User).filter_by(id=user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    update_data = request.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'age': user.age,
        'sex': user.sex,
        'height_cm': user.height_cm,
        'weight_kg': user.weight_kg,
        'activity_level': user.activity_level,
        'goal': user.goal,
    }

@app.get('/users/{user_id}/diet_plans')
def get_user_diet_plans(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.id != user_id and current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Not authorized to view this history')
    user = db.query(User).filter_by(id=user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    diet_plans = (
        db.query(DietPlan)
        .filter_by(user_id=user_id)
        .order_by(DietPlan.id.desc())
        .all()
    )
    return [
        {
            'id': plan.id,
            'diet_category': plan.diet_category,
            'calories_target': plan.calories_target,
            'plan': json.loads(plan.plan_json or '{}'),
        }
        for plan in diet_plans
    ]

@app.post('/auth/register', response_model=TokenResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        or_(User.username == request.username, User.email == request.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail='Username or email already exists')

    auth = AuthService()
    user = auth.register_user(db, request.username, request.email, request.password, request.role)
    access_token = security.create_access_token({'user_id': user.id})
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'id': user.id,
        'username': user.username,
        'role': user.role,
    }

@app.post('/auth/login', response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    auth = AuthService()
    user = auth.authenticate(db, request.username, request.password)
    if user is None:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    access_token = security.create_access_token({'user_id': user.id})
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'id': user.id,
        'username': user.username,
        'role': user.role,
    }

@app.post('/health')
def calculate_health(request: HealthRequest, current_user: User = Depends(get_current_user)):
    result = HealthCalculator.calculate_all(request.weight_kg, request.height_cm, request.age, request.sex, request.activity_level)
    return {
        'bmi': result.bmi,
        'bmr': result.bmr,
        'tdee': result.tdee,
    }

@app.post('/recommendation')
def get_recommendation(request: RecommendationRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = HealthCalculator.calculate_all(request.weight_kg, request.height_cm, request.age, request.sex, request.activity_level)
    category = recommender.predict_diet_category([request.age, request.weight_kg, request.height_cm, result.bmi, result.tdee])
    plan = recommender.generate_plan(current_user.id, category, result.tdee)

    diet_plan = DietPlan(
        user_id=current_user.id,
        diet_category=category,
        calories_target=result.tdee,
        plan_json=json.dumps(plan),
    )
    db.add(diet_plan)
    db.commit()
    db.refresh(diet_plan)

    return {
        'diet_plan_id': diet_plan.id,
        'diet_category': category,
        'health': {
            'bmi': result.bmi,
            'bmr': result.bmr,
            'tdee': result.tdee,
        },
        'plan': plan,
    }
