"""
Exercise tracking API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, ExerciseLog, Character, DietLog, SleepLog, WorkLog
from app.schemas import ExerciseLogCreate, ExerciseLogUpdate, ExerciseLogResponse
from app.services.auth import get_current_user
from app.services import health_calculator as hc

router = APIRouter(prefix="/api/exercise", tags=["Exercise"])


def _get_daily_hours_used(db: Session, user_id: int) -> tuple[float, float, float]:
    """Get total hours used today for sleep, exercise, and work"""
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    sleep_hours = db.query(func.coalesce(func.sum(SleepLog.duration_hours), 0)).filter(
        SleepLog.user_id == user_id,
        SleepLog.logged_at >= today_start
    ).scalar() or 0

    exercise_minutes = db.query(func.coalesce(func.sum(ExerciseLog.duration_minutes), 0)).filter(
        ExerciseLog.user_id == user_id,
        ExerciseLog.logged_at >= today_start
    ).scalar() or 0
    exercise_hours = exercise_minutes / 60

    work_hours = db.query(func.coalesce(func.sum(WorkLog.duration_hours), 0)).filter(
        WorkLog.user_id == user_id,
        WorkLog.logged_at >= today_start
    ).scalar() or 0

    return float(sleep_hours), float(exercise_hours), float(work_hours)


def _recalculate_character_exercise(db: Session, user_id: int, exercise_minutes: int):
    """Recalculate character stamina and stress after exercise"""
    character = db.query(Character).filter(Character.user_id == user_id).first()
    if not character:
        return

    # Get today's activity logs
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    sleep_logs = db.query(SleepLog).filter(
        SleepLog.user_id == user_id,
        SleepLog.logged_at >= today_start
    ).all()
    work_logs = db.query(WorkLog).filter(
        WorkLog.user_id == user_id,
        WorkLog.logged_at >= today_start
    ).all()

    total_sleep_hours = sum(s.duration_hours or 0 for s in sleep_logs) if sleep_logs else 7
    total_work_hours = sum(w.duration_hours or 0 for w in work_logs)
    avg_work_intensity = (sum(w.intensity or 3 for w in work_logs) / len(work_logs)) if work_logs else 3

    # Calculate stamina change from exercise
    stamina_change = hc.calculate_stamina_change(
        exercise_minutes=exercise_minutes,
        sleep_hours=total_sleep_hours,
        work_hours=total_work_hours
    )

    # Calculate stress reduction from exercise
    stress_change = hc.calculate_stress_change(
        work_hours=total_work_hours,
        work_intensity=int(avg_work_intensity),
        exercise_minutes=exercise_minutes,
        sleep_hours=total_sleep_hours
    )

    # Apply changes
    character.stamina = max(0, min(100, character.stamina + stamina_change * 0.5))
    character.stress = max(0, min(100, character.stress + stress_change * 0.3))  # Partial stress relief
    character.mood = hc.calculate_mood_score(
        character.stamina, character.energy, character.nutrition, character.stress
    )

    # Add XP for logging exercise
    character.experience += 15
    if character.experience >= hc.get_level_up_threshold(character.level):
        character.experience -= hc.get_level_up_threshold(character.level)
        character.level += 1

    db.commit()


@router.post("/", response_model=ExerciseLogResponse, status_code=status.HTTP_201_CREATED)
async def create_exercise_log(
    exercise_log: ExerciseLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new exercise log entry and update character stats"""
    # Check 24h daily limit
    sleep_hours, existing_exercise, work_hours = _get_daily_hours_used(db, current_user.id)
    new_exercise_hours = (exercise_log.duration_minutes or 0) / 60
    total_hours = sleep_hours + existing_exercise + work_hours + new_exercise_hours
    if total_hours > 24:
        remaining_hours = 24 - (sleep_hours + existing_exercise + work_hours)
        remaining_minutes = remaining_hours * 60
        raise HTTPException(
            status_code=400,
            detail=f"Daily limit exceeded! You can only log {remaining_minutes:.0f} more exercise minutes today. "
                   f"(Sleep: {sleep_hours:.1f}h, Exercise: {existing_exercise:.1f}h, Work: {work_hours:.1f}h)"
        )

    new_log = ExerciseLog(
        user_id=current_user.id,
        **exercise_log.model_dump()
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # Recalculate character stamina and stress
    _recalculate_character_exercise(db, current_user.id, int(new_log.duration_minutes or 0))

    return new_log


@router.get("/", response_model=list[ExerciseLogResponse])
async def get_exercise_logs(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get exercise logs for the past N days"""
    start_date = datetime.utcnow() - timedelta(days=days)
    logs = db.query(ExerciseLog).filter(
        ExerciseLog.user_id == current_user.id,
        ExerciseLog.logged_at >= start_date
    ).order_by(ExerciseLog.logged_at.desc()).all()
    return logs


@router.get("/{log_id}", response_model=ExerciseLogResponse)
async def get_exercise_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific exercise log by ID"""
    log = db.query(ExerciseLog).filter(
        ExerciseLog.id == log_id,
        ExerciseLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise log not found"
        )
    return log


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exercise_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an exercise log"""
    log = db.query(ExerciseLog).filter(
        ExerciseLog.id == log_id,
        ExerciseLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise log not found"
        )

    db.delete(log)
    db.commit()