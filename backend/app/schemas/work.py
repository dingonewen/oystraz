"""
Work log schemas
"""
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional


class WorkLogBase(BaseModel):
    """Base work log schema"""
    duration_hours: float = Field(ge=0, le=24)
    intensity: int = Field(ge=0, le=5)
    energy_cost: float = 0
    stress_gain: float = 0
    stamina_cost: float = 0
    experience_gain: int = 0
    pranked_boss: int = Field(ge=0, le=1, default=0)
    notes: Optional[str] = None


class WorkLogCreate(BaseModel):
    """Work log creation schema - client sends minimal data"""
    duration_hours: float = Field(ge=0, le=24)
    intensity: int = Field(ge=1, le=5)
    pranked_boss: int = Field(ge=0, le=1, default=0)
    notes: Optional[str] = None
    logged_at: Optional[datetime] = None  # Client can send local time


class WorkLogResponse(WorkLogBase):
    """Work log response schema"""
    id: int
    user_id: int
    logged_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WorkStats(BaseModel):
    """Work statistics schema"""
    total_hours: float
    total_sessions: int
    avg_intensity: float
    total_pranks: int
    total_stress_gained: float


class HealthRecalculateResponse(BaseModel):
    """Response after health recalculation"""
    stamina: float
    energy: float
    nutrition: float
    mood: float
    stress: float
    level: int
    experience: int
    message: str