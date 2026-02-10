"""
Exercise log schemas
"""
from pydantic import BaseModel, ConfigDict, field_serializer
from datetime import datetime, timezone


def serialize_datetime_utc(dt: datetime) -> str:
    """Serialize datetime as ISO format with Z suffix for UTC"""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace('+00:00', 'Z')


class ExerciseLogBase(BaseModel):
    """Base exercise log schema"""
    activity_name: str
    activity_type: str | None = None
    duration_minutes: float
    intensity: str = "moderate"
    calories_burned: float = 0.0
    distance: float | None = None
    distance_unit: str = "km"
    heart_rate_avg: int | None = None
    steps: int | None = None
    notes: str | None = None


class ExerciseLogCreate(ExerciseLogBase):
    """Exercise log creation schema"""
    logged_at: datetime | None = None


class ExerciseLogUpdate(BaseModel):
    """Exercise log update schema"""
    activity_name: str | None = None
    activity_type: str | None = None
    duration_minutes: float | None = None
    intensity: str | None = None
    calories_burned: float | None = None
    distance: float | None = None
    distance_unit: str | None = None
    heart_rate_avg: int | None = None
    steps: int | None = None
    notes: str | None = None


class ExerciseLogResponse(ExerciseLogBase):
    """Exercise log response schema"""
    id: int
    user_id: int
    logged_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_serializer('logged_at', 'created_at')
    def serialize_dt(self, dt: datetime) -> str:
        return serialize_datetime_utc(dt)