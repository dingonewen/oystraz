"""
Sleep tracking API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, SleepLog
from app.schemas import SleepLogCreate, SleepLogUpdate, SleepLogResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/sleep", tags=["Sleep"])


@router.post("/", response_model=SleepLogResponse, status_code=status.HTTP_201_CREATED)
async def create_sleep_log(
    sleep_log: SleepLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new sleep log entry"""
    new_log = SleepLog(
        user_id=current_user.id,
        **sleep_log.model_dump()
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
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