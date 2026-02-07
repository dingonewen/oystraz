"""
Diet tracking API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, DietLog, Character, ExerciseLog, SleepLog, WorkLog
from app.schemas import DietLogCreate, DietLogUpdate, DietLogResponse
from app.services.auth import get_current_user
from app.services import health_calculator as hc

router = APIRouter(prefix="/api/diet", tags=["Diet"])


def _recalculate_character_nutrition(db: Session, user_id: int):
    """Recalculate character nutrition and related metrics after diet change"""
    character = db.query(Character).filter(Character.user_id == user_id).first()
    if not character:
        return

    # Get today's diet logs
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    diet_logs = db.query(DietLog).filter(
        DietLog.user_id == user_id,
        DietLog.logged_at >= today_start
    ).all()

    # Calculate nutrition score
    diet_data = [{"protein": d.protein or 0, "fiber": d.fiber or 0, "fat": d.fat or 0,
                  "calories": d.calories or 0} for d in diet_logs]
    new_nutrition = hc.calculate_nutrition_score(diet_data)

    # Get other activity data for energy calculation
    exercise_logs = db.query(ExerciseLog).filter(
        ExerciseLog.user_id == user_id,
        ExerciseLog.logged_at >= today_start
    ).all()
    sleep_logs = db.query(SleepLog).filter(
        SleepLog.user_id == user_id,
        SleepLog.logged_at >= today_start
    ).all()
    work_logs = db.query(WorkLog).filter(
        WorkLog.user_id == user_id,
        WorkLog.logged_at >= today_start
    ).all()

    # Calculate energy change from caloric balance
    total_calories_in = sum(d.calories or 0 for d in diet_logs)
    total_calories_out = sum(e.calories_burned or 0 for e in exercise_logs) + 500
    total_sleep_hours = sum(s.duration_hours or 0 for s in sleep_logs) if sleep_logs else 7
    total_work_hours = sum(w.duration_hours or 0 for w in work_logs)
    avg_work_intensity = (sum(w.intensity or 3 for w in work_logs) / len(work_logs)) if work_logs else 3

    energy_change = hc.calculate_energy_change(
        calories_in=total_calories_in,
        calories_out=total_calories_out,
        sleep_hours=total_sleep_hours,
        work_hours=total_work_hours,
        work_intensity=int(avg_work_intensity)
    )

    # Update character
    character.nutrition = new_nutrition
    character.energy = max(0, min(100, character.energy + energy_change * 0.1))  # Apply partial change
    character.mood = hc.calculate_mood_score(
        character.stamina, character.energy, character.nutrition, character.stress
    )

    # Add XP for logging
    character.experience += 10
    if character.experience >= hc.get_level_up_threshold(character.level):
        character.experience -= hc.get_level_up_threshold(character.level)
        character.level += 1

    db.commit()


@router.post("/", response_model=DietLogResponse, status_code=status.HTTP_201_CREATED)
async def create_diet_log(
    diet_log: DietLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new diet log entry and update character nutrition"""
    new_log = DietLog(
        user_id=current_user.id,
        **diet_log.model_dump()
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # Recalculate character nutrition
    _recalculate_character_nutrition(db, current_user.id)

    return new_log


@router.get("/", response_model=list[DietLogResponse])
async def get_diet_logs(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get diet logs for the past N days"""
    start_date = datetime.utcnow() - timedelta(days=days)
    logs = db.query(DietLog).filter(
        DietLog.user_id == current_user.id,
        DietLog.logged_at >= start_date
    ).order_by(DietLog.logged_at.desc()).all()
    return logs


@router.get("/{log_id}", response_model=DietLogResponse)
async def get_diet_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific diet log by ID"""
    log = db.query(DietLog).filter(
        DietLog.id == log_id,
        DietLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diet log not found"
        )
    return log


@router.put("/{log_id}", response_model=DietLogResponse)
async def update_diet_log(
    log_id: int,
    diet_update: DietLogUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a diet log"""
    log = db.query(DietLog).filter(
        DietLog.id == log_id,
        DietLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diet log not found"
        )

    update_data = diet_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(log, field, value)

    db.commit()
    db.refresh(log)
    return log


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_diet_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a diet log"""
    log = db.query(DietLog).filter(
        DietLog.id == log_id,
        DietLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diet log not found"
        )

    db.delete(log)
    db.commit()