"""
AI Assistant API routes (Gemini + USDA)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, Character, DietLog, ExerciseLog, SleepLog
from app.services.auth import get_current_user
from app.services.gemini import gemini_service
from app.services.usda import usda_service

router = APIRouter(prefix="/api/assistant", tags=["AI Assistant"])


class HealthAdviceRequest(BaseModel):
    """Request schema for health advice"""
    query: str | None = None
    days: int = 7


class FoodSearchRequest(BaseModel):
    """Request schema for food search"""
    query: str
    page_size: int = 10


class PearlChatRequest(BaseModel):
    """Request schema for Pearl chat"""
    message: str
    conversation_history: list | None = None


@router.post("/pearl/chat")
async def chat_with_pearl(
    request: PearlChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Chat with Pearl AI assistant"""
    # Get character state for context
    character = db.query(Character).filter(Character.user_id == current_user.id).first()
    character_state = None
    if character:
        character_state = {
            "stamina": character.stamina,
            "energy": character.energy,
            "nutrition": character.nutrition,
            "mood": character.mood,
            "stress": character.stress
        }

    # Get recent logs (last 7 days)
    start_date = datetime.utcnow() - timedelta(days=7)
    recent_logs = None

    if character:
        diet_logs = db.query(DietLog).filter(
            DietLog.user_id == current_user.id,
            DietLog.logged_at >= start_date
        ).all()

        exercise_logs = db.query(ExerciseLog).filter(
            ExerciseLog.user_id == current_user.id,
            ExerciseLog.logged_at >= start_date
        ).all()

        sleep_logs = db.query(SleepLog).filter(
            SleepLog.user_id == current_user.id,
            SleepLog.logged_at >= start_date
        ).all()

        recent_logs = {
            "diet": [{"calories": log.calories} for log in diet_logs],
            "exercise": [{"duration_minutes": log.duration_minutes} for log in exercise_logs],
            "sleep": [{"duration_hours": log.duration_hours} for log in sleep_logs]
        }

    # Chat with Pearl
    response = gemini_service.pearl_chat(
        user_message=request.message,
        character_state=character_state,
        recent_logs=recent_logs,
        conversation_history=request.conversation_history
    )

    return {"response": response}


@router.post("/advice")
async def get_health_advice(
    request: HealthAdviceRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get personalized health advice from Gemini AI"""
    # Get character state
    character = db.query(Character).filter(Character.user_id == current_user.id).first()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    character_state = {
        "stamina": character.stamina,
        "energy": character.energy,
        "nutrition": character.nutrition,
        "mood": character.mood,
        "stress": character.stress
    }

    # Get recent logs
    start_date = datetime.utcnow() - timedelta(days=request.days)

    diet_logs = db.query(DietLog).filter(
        DietLog.user_id == current_user.id,
        DietLog.logged_at >= start_date
    ).all()

    exercise_logs = db.query(ExerciseLog).filter(
        ExerciseLog.user_id == current_user.id,
        ExerciseLog.logged_at >= start_date
    ).all()

    sleep_logs = db.query(SleepLog).filter(
        SleepLog.user_id == current_user.id,
        SleepLog.logged_at >= start_date
    ).all()

    recent_logs = {
        "diet": [{"calories": log.calories} for log in diet_logs],
        "exercise": [{"duration_minutes": log.duration_minutes} for log in exercise_logs],
        "sleep": [{"duration_hours": log.duration_hours} for log in sleep_logs]
    }

    # Generate advice
    advice = gemini_service.generate_health_advice(
        character_state=character_state,
        recent_logs=recent_logs,
        user_query=request.query
    )

    return {"advice": advice}


@router.post("/workplace-scenario")
async def generate_workplace_scenario(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a workplace scenario based on current health state"""
    character = db.query(Character).filter(Character.user_id == current_user.id).first()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    character_state = {
        "stamina": character.stamina,
        "energy": character.energy,
        "mood": character.mood,
        "stress": character.stress
    }

    scenario = gemini_service.generate_workplace_scenario(character_state)
    return scenario


@router.post("/food-search")
async def search_foods(
    request: FoodSearchRequest,
    current_user: User = Depends(get_current_user)
):
    """Search for foods in USDA database"""
    results = await usda_service.search_foods(request.query, request.page_size)
    return {"foods": results}


@router.get("/food/{fdc_id}")
async def get_food_details(
    fdc_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get detailed nutrition information for a food"""
    food_data = await usda_service.get_food_details(fdc_id)
    if not food_data:
        raise HTTPException(status_code=404, detail="Food not found")

    nutrition = usda_service.parse_nutrition(food_data)
    return {
        "food": food_data.get("description", "Unknown"),
        "nutrition": nutrition
    }