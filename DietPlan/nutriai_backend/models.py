from sqlalchemy import Column, Integer, String, Float, Text, Enum, Date, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from .db import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(128), unique=True, nullable=False)
    email = Column(String(256), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    role = Column(Enum('user', 'admin'), nullable=False, default='user')
    age = Column(Integer)
    sex = Column(Enum('male', 'female', 'other'))
    height_cm = Column(Float)
    weight_kg = Column(Float)
    activity_level = Column(String(64))
    goal = Column(String(64))

    diet_plans = relationship('DietPlan', back_populates='user')
    progress_history = relationship('ProgressHistory', back_populates='user')
    admin_logs = relationship('AdminLog', back_populates='admin')

class Food(Base):
    __tablename__ = 'foods'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(256), nullable=False)
    category = Column(String(128))
    calories = Column(Float)
    protein_g = Column(Float)
    carbs_g = Column(Float)
    fats_g = Column(Float)
    fiber_g = Column(Float)
    sodium_mg = Column(Float)

class DietPlan(Base):
    __tablename__ = 'diet_plans'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    diet_category = Column(String(128))
    calories_target = Column(Float)
    protein_target = Column(Float)
    carbs_target = Column(Float)
    fats_target = Column(Float)
    plan_json = Column(Text)

    user = relationship('User', back_populates='diet_plans')

class ProgressHistory(Base):
    __tablename__ = 'progress_history'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(Date, nullable=False)
    weight_kg = Column(Float)
    bmi = Column(Float)
    calories_consumed = Column(Float)
    notes = Column(Text)

    user = relationship('User', back_populates='progress_history')

class AdminLog(Base):
    __tablename__ = 'admin_logs'

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    action = Column(String(256))
    details = Column(Text)

    admin = relationship('User', back_populates='admin_logs')
