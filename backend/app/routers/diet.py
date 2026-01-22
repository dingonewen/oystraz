"""
Diet tracking API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, DietLog
from app.schemas import DietLogCreate, DietLogUpdate, DietLogResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/diet", tags=["Diet"])


@router.post("/", response_model=DietLogResponse, status_code=status.HTTP_201_CREATED)
async def create_diet_log(
    diet_log: DietLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new diet log entry"""
    new_log = DietLog(
        user_id=current_user.id,
        **diet_log.model_dump()
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
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