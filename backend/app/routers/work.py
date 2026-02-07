"""
Work tracking API routes
Logs work sessions and updates character metrics using health_calculator
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, Character, DietLog, ExerciseLog, SleepLog
from app.models.work import WorkLog
from app.schemas.work import WorkLogCreate, WorkLogResponse, WorkStats, HealthRecalculateResponse
from app.services.auth import get_current_user
from app.services import health_calculator as hc

router = APIRouter(prefix="/api/work", tags=["Work"])


def _get_today_logs(db: Session, user_id: int):
    """Get today's activity logs for health calculation"""
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    diet_logs = db.query(DietLog).filter(
        DietLog.user_id == user_id,
        DietLog.logged_at >= today_start
    ).all()

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

    return diet_logs, exercise_logs, sleep_logs, work_logs


def _recalculate_and_update_character(db: Session, character: Character,
                                       diet_logs, exercise_logs, sleep_logs, work_logs,
                                       pranked_boss: bool = False):
    """Recalculate all health metrics and update character"""

    # Convert logs to dicts for health_calculator
    diet_data = [{"protein": d.protein or 0, "fiber": d.fiber or 0, "fat": d.fat or 0,
                  "calories": d.calories or 0} for d in diet_logs]

    # Calculate totals from logs
    total_calories_in = sum(d.calories or 0 for d in diet_logs)
    total_calories_out = sum(e.calories_burned or 0 for e in exercise_logs) + 500  # Base metabolic
    total_exercise_minutes = sum(e.duration_minutes or 0 for e in exercise_logs)
    total_sleep_hours = sum(s.duration_hours or 0 for s in sleep_logs) if sleep_logs else 7  # Default
    total_work_hours = sum(w.duration_hours or 0 for w in work_logs)
    avg_work_intensity = (sum(w.intensity or 3 for w in work_logs) / len(work_logs)) if work_logs else 3

    # Calculate nutrition score
    new_nutrition = hc.calculate_nutrition_score(diet_data)

    # Calculate changes from activities
    energy_change = hc.calculate_energy_change(
        calories_in=total_calories_in,
        calories_out=total_calories_out,
        sleep_hours=total_sleep_hours,
        work_hours=total_work_hours,
        work_intensity=int(avg_work_intensity)
    )

    stamina_change = hc.calculate_stamina_change(
        exercise_minutes=int(total_exercise_minutes),
        sleep_hours=total_sleep_hours,
        work_hours=total_work_hours
    )

    stress_change = hc.calculate_stress_change(
        work_hours=total_work_hours,
        work_intensity=int(avg_work_intensity),
        exercise_minutes=int(total_exercise_minutes),
        sleep_hours=total_sleep_hours,
        pranked_boss=pranked_boss
    )

    # Apply changes (but start from a base that considers recent activity)
    # For now, apply changes to current values with bounds
    new_energy = max(0, min(100, character.energy + energy_change))
    new_stamina = max(0, min(100, character.stamina + stamina_change))
    new_stress = max(0, min(100, character.stress + stress_change))

    # Mood is a composite
    new_mood = hc.calculate_mood_score(new_stamina, new_energy, new_nutrition, new_stress)

    # Calculate XP
    xp_gain = hc.calculate_xp_gain(
        diet_logged=len(diet_logs) > 0,
        exercise_logged=len(exercise_logs) > 0,
        sleep_logged=len(sleep_logs) > 0,
        work_hours=total_work_hours,
        work_intensity=int(avg_work_intensity),
        daily_streak=1,  # TODO: implement streak tracking
        nutrition_target_met=new_nutrition >= 80,
        pranked_boss=pranked_boss
    )

    new_experience = character.experience + xp_gain
    new_level = character.level

    # Check for level up
    while new_experience >= hc.get_level_up_threshold(new_level):
        new_experience -= hc.get_level_up_threshold(new_level)
        new_level += 1

    # Update character
    character.stamina = new_stamina
    character.energy = new_energy
    character.nutrition = new_nutrition
    character.mood = new_mood
    character.stress = new_stress
    character.experience = new_experience
    character.level = new_level

    # Update appearance based on new stats
    if character.mood >= 80 and character.stress < 30:
        character.emotional_state = "happy"
    elif character.mood < 40 or character.energy < 30:
        character.emotional_state = "tired"
    elif character.stress >= 70:
        character.emotional_state = "stressed"
    elif character.stress >= 85:
        character.emotional_state = "angry"
    else:
        character.emotional_state = "normal"

    db.commit()
    db.refresh(character)

    return character


@router.post("/log", response_model=WorkLogResponse, status_code=status.HTTP_201_CREATED)
async def log_work(
    work_data: WorkLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a work session and update character metrics"""

    # Get character
    character = db.query(Character).filter(Character.user_id == current_user.id).first()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    # Calculate work impact using health_calculator formulas
    hours = work_data.duration_hours
    intensity = work_data.intensity
    is_prank = work_data.pranked_boss == 1

    if is_prank:
        # Prank session - only stress relief
        energy_cost = 0
        stress_gain = -20  # Negative = reduction
        stamina_cost = 0
        experience_gain = 50
    else:
        # Normal work session
        energy_cost = hours * intensity * 0.5  # From health_calculator formula
        stress_gain = hours * intensity * 0.8  # From health_calculator formula
        stamina_cost = hours * 0.5 if hours <= 8 else hours * 0.5 + (hours - 8) * 5
        experience_gain = int(hours * intensity * 10)

    # Create work log
    new_log = WorkLog(
        user_id=current_user.id,
        duration_hours=hours,
        intensity=intensity,
        energy_cost=energy_cost,
        stress_gain=stress_gain,
        stamina_cost=stamina_cost,
        experience_gain=experience_gain,
        pranked_boss=work_data.pranked_boss,
        notes=work_data.notes
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # Get today's logs and recalculate character metrics
    diet_logs, exercise_logs, sleep_logs, work_logs = _get_today_logs(db, current_user.id)
    _recalculate_and_update_character(
        db, character, diet_logs, exercise_logs, sleep_logs, work_logs,
        pranked_boss=is_prank
    )

    return new_log


@router.get("/logs", response_model=list[WorkLogResponse])
async def get_work_logs(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get work logs for the past N days"""
    start_date = datetime.utcnow() - timedelta(days=days)
    logs = db.query(WorkLog).filter(
        WorkLog.user_id == current_user.id,
        WorkLog.logged_at >= start_date
    ).order_by(WorkLog.logged_at.desc()).all()
    return logs


@router.get("/stats", response_model=WorkStats)
async def get_work_stats(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get work statistics for the past N days"""
    start_date = datetime.utcnow() - timedelta(days=days)
    logs = db.query(WorkLog).filter(
        WorkLog.user_id == current_user.id,
        WorkLog.logged_at >= start_date
    ).all()

    if not logs:
        return WorkStats(
            total_hours=0,
            total_sessions=0,
            avg_intensity=0,
            total_pranks=0,
            total_stress_gained=0
        )

    total_hours = sum(log.duration_hours for log in logs)
    total_sessions = len([log for log in logs if log.duration_hours > 0])
    total_pranks = sum(log.pranked_boss for log in logs)
    total_stress = sum(log.stress_gain for log in logs)

    # Calculate average intensity (excluding prank sessions)
    work_sessions = [log for log in logs if log.duration_hours > 0]
    avg_intensity = (sum(log.intensity for log in work_sessions) / len(work_sessions)) if work_sessions else 0

    return WorkStats(
        total_hours=total_hours,
        total_sessions=total_sessions,
        avg_intensity=avg_intensity,
        total_pranks=total_pranks,
        total_stress_gained=total_stress
    )


@router.delete("/log/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_work_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a work log"""
    log = db.query(WorkLog).filter(
        WorkLog.id == log_id,
        WorkLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(status_code=404, detail="Work log not found")

    db.delete(log)
    db.commit()


@router.post("/recalculate", response_model=HealthRecalculateResponse)
async def recalculate_health(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Manually trigger health recalculation based on today's activities"""
    character = db.query(Character).filter(Character.user_id == current_user.id).first()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    diet_logs, exercise_logs, sleep_logs, work_logs = _get_today_logs(db, current_user.id)
    character = _recalculate_and_update_character(
        db, character, diet_logs, exercise_logs, sleep_logs, work_logs
    )

    return HealthRecalculateResponse(
        stamina=character.stamina,
        energy=character.energy,
        nutrition=character.nutrition,
        mood=character.mood,
        stress=character.stress,
        level=character.level,
        experience=character.experience,
        message="Health metrics recalculated successfully"
    )