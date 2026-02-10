"""
Pydantic schemas
"""
from app.schemas.auth import UserRegister, UserLogin, Token, TokenData
from app.schemas.user import UserBase, UserCreate, UserUpdate, UserResponse
from app.schemas.character import CharacterBase, CharacterCreate, CharacterUpdate, CharacterResponse
from app.schemas.diet import DietLogBase, DietLogCreate, DietLogUpdate, DietLogResponse
from app.schemas.exercise import ExerciseLogBase, ExerciseLogCreate, ExerciseLogUpdate, ExerciseLogResponse
from app.schemas.sleep import SleepLogBase, SleepLogCreate, SleepLogUpdate, SleepLogResponse
from app.schemas.workplace import WorkplaceEventBase, WorkplaceEventCreate, WorkplaceEventResponse
from app.schemas.work import WorkLogCreate, WorkLogResponse, WorkStats, HealthRecalculateResponse

__all__ = [
    "UserRegister",
    "UserLogin",
    "Token",
    "TokenData",
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "CharacterBase",
    "CharacterCreate",
    "CharacterUpdate",
    "CharacterResponse",
    "DietLogBase",
    "DietLogCreate",
    "DietLogUpdate",
    "DietLogResponse",
    "ExerciseLogBase",
    "ExerciseLogCreate",
    "ExerciseLogUpdate",
    "ExerciseLogResponse",
    "SleepLogBase",
    "SleepLogCreate",
    "SleepLogUpdate",
    "SleepLogResponse",
    "WorkplaceEventBase",
    "WorkplaceEventCreate",
    "WorkplaceEventResponse",
    "WorkLogCreate",
    "WorkLogResponse",
    "WorkStats",
    "HealthRecalculateResponse",
]