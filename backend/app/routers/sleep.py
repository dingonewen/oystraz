"""
Sleep tracking API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, SleepLog, Character, DietLog, ExerciseLog, WorkLog
from app.schemas import SleepLogCreate, SleepLogUpdate, SleepLogResponse
from app.services.auth import get_current_user
from app.services import health_calculator as hc

router = APIRouter(prefix="/api/sleep", tags=["Sleep"])


def _recalculate_character_sleep(db: Session, user_id: int, sleep_hours: float):
    """Recalculate character stats after sleep logging"""
    character = db.query(Character).filter(Character.user_id == user_id).first()
    if not character:
        return

    # Get today's activity logs
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    diet_logs = db.query(DietLog).filter(
        DietLog.user_id == user_id,
        DietLog.logged_at >= today_start
    ).all()
    exercise_logs = db.query(ExerciseLog).filter(
        ExerciseLog.user_id == user_id,
        ExerciseLog.logged_at >= today_start
    ).all()
    work_logs = db.query(WorkLog).filter(
        WorkLog.user_id == user_id,
        WorkLog.logged_at >= today_start
    ).all()

    total_calories_in = sum(d.calories or 0 for d in diet_logs)
    total_calories_out = sum(e.calories_burned or 0 for e in exercise_logs) + 500
    total_exercise_minutes = sum(e.duration_minutes or 0 for e in exercise_logs)
    total_work_hours = sum(w.duration_hours or 0 for w in work_logs)
    avg_work_intensity = (sum(w.intensity or 3 for w in work_logs) / len(work_logs)) if work_logs else 3

    # Calculate energy change (sleep has big impact)
    energy_change = hc.calculate_energy_change(
        calories_in=total_calories_in,
        calories_out=total_calories_out,
        sleep_hours=sleep_hours,
        work_hours=total_work_hours,
        work_intensity=int(avg_work_intensity)
    )

    # Calculate stamina recovery from sleep
    stamina_change = hc.calculate_stamina_change(
        exercise_minutes=int(total_exercise_minutes),
        sleep_hours=sleep_hours,
        work_hours=total_work_hours
    )

    # Calculate stress relief from sleep
    stress_change = hc.calculate_stress_change(
        work_hours=total_work_hours,
        work_intensity=int(avg_work_intensity),
        exercise_minutes=int(total_exercise_minutes),
        sleep_hours=sleep_hours
    )

    # Apply changes (sleep effects are significant)
    character.energy = max(0, min(100, character.energy + energy_change * 0.5))
    character.stamina = max(0, min(100, character.stamina + stamina_change * 0.5))
    character.stress = max(0, min(100, character.stress + stress_change * 0.3))
    character.mood = hc.calculate_mood_score(
        character.stamina, character.energy, character.nutrition, character.stress
    )

    # Add XP for logging sleep
    character.experience += 10
    if character.experience >= hc.get_level_up_threshold(character.level):
        character.experience -= hc.get_level_up_threshold(character.level)
        character.level += 1

    db.commit()


@router.post("/", response_model=SleepLogResponse, status_code=status.HTTP_201_CREATED)
async def create_sleep_log(
    sleep_log: SleepLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new sleep log entry and update character stats"""
    new_log = SleepLog(
        user_id=current_user.id,
        **sleep_log.model_dump()
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # Recalculate character stats based on sleep
    _recalculate_character_sleep(db, current_user.id, float(new_log.duration_hours or 0))

    return new_log


@router.get("/", response_model=list[SleepLogResponse])
async def get_sleep_logs(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get sleep logs for the past N days"""
    start_date = datetime.utcnow() - timedelta(days=days)
    logs = db.query(SleepLog).filter(
        SleepLog.user_id == current_user.id,
        SleepLog.logged_at >= start_date
    ).order_by(SleepLog.logged_at.desc()).all()
    return logs


@router.get("/{log_id}", response_model=SleepLogResponse)
async def get_sleep_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific sleep log by ID"""
    log = db.query(SleepLog).filter(
        SleepLog.id == log_id,
        SleepLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sleep log not found"
        )
    return log


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sleep_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a sleep log"""
    log = db.query(SleepLog).filter(
        SleepLog.id == log_id,
        SleepLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sleep log not found"
        )

    db.delete(log)
    db.commit()