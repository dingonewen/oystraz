"""
Exercise tracking API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, ExerciseLog
from app.schemas import ExerciseLogCreate, ExerciseLogUpdate, ExerciseLogResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/exercise", tags=["Exercise"])


@router.post("/", response_model=ExerciseLogResponse, status_code=status.HTTP_201_CREATED)
async def create_exercise_log(
    exercise_log: ExerciseLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new exercise log entry"""
    new_log = ExerciseLog(
        user_id=current_user.id,
        **exercise_log.model_dump()
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
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