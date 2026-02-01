"""
Work Log API Router
Endpoints for tracking work sessions
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.models.work_log import WorkLog
from app.schemas.work import WorkLogCreate, WorkLogResponse, WorkStatsResponse
from app.services.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/work", tags=["work"])

@router.post("/log", response_model=WorkLogResponse)
def log_work_session(
    work_data: WorkLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a work session"""
    work_log = WorkLog(
        user_id=current_user.id,
        duration_hours=work_data.duration_hours,
        intensity=work_data.intensity,
        energy_cost=work_data.energy_cost,
        stress_gain=work_data.stress_gain,
        experience_gain=work_data.experience_gain,
        pranked_boss=work_data.pranked_boss,
        notes=work_data.notes
    )

    db.add(work_log)
    db.commit()
    db.refresh(work_log)

    return work_log

@router.get("/logs", response_model=List[WorkLogResponse])
def get_work_logs(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get work logs for the past N days"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)

    logs = db.query(WorkLog).filter(
        WorkLog.user_id == current_user.id,
        WorkLog.logged_at >= cutoff_date
    ).order_by(WorkLog.logged_at.desc()).all()

    return logs

@router.get("/stats", response_model=WorkStatsResponse)
def get_work_stats(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get work statistics for the past N days"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)

    result = db.query(
        func.sum(WorkLog.duration_hours).label('total_hours'),
        func.count(WorkLog.id).label('total_sessions'),
        func.avg(WorkLog.intensity).label('avg_intensity'),
        func.sum(WorkLog.pranked_boss).label('total_pranks'),
        func.sum(WorkLog.stress_gain).label('total_stress_gained')
    ).filter(
        WorkLog.user_id == current_user.id,
        WorkLog.logged_at >= cutoff_date
    ).first()

    return WorkStatsResponse(
        total_hours=result.total_hours or 0,
        total_sessions=result.total_sessions or 0,
        avg_intensity=float(result.avg_intensity or 0),
        total_pranks=result.total_pranks or 0,
        total_stress_gained=result.total_stress_gained or 0
    )

@router.delete("/log/{log_id}")
def delete_work_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a work log entry"""
    work_log = db.query(WorkLog).filter(
        WorkLog.id == log_id,
        WorkLog.user_id == current_user.id
    ).first()

    if not work_log:
        raise HTTPException(status_code=404, detail="Work log not found")

    db.delete(work_log)
    db.commit()

    return {"message": "Work log deleted successfully"}
