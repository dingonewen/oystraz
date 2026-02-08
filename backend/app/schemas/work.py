"""
Work log schemas
"""
from pydantic import BaseModel, ConfigDict, Field, field_serializer
from datetime import datetime, timezone
from typing import Optional


def serialize_datetime_utc(dt: datetime) -> str:
    """Serialize datetime as ISO format with Z suffix for UTC"""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace('+00:00', 'Z')


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

    @field_serializer('logged_at', 'created_at')
    def serialize_dt(self, dt: datetime) -> str:
        return serialize_datetime_utc(dt)


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