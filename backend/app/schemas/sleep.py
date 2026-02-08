"""
Sleep log schemas
"""
from pydantic import BaseModel, ConfigDict, field_serializer
from datetime import datetime, timezone


def serialize_datetime_utc(dt: datetime) -> str:
    """Serialize datetime as ISO format with Z suffix for UTC"""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace('+00:00', 'Z')


class SleepLogBase(BaseModel):
    """Base sleep log schema"""
    sleep_start: datetime
    sleep_end: datetime
    duration_hours: float
    quality: str = "average"
    quality_score: float | None = None
    deep_sleep_minutes: float | None = None
    light_sleep_minutes: float | None = None
    rem_sleep_minutes: float | None = None
    awake_minutes: float | None = None
    interruptions: int = 0
    notes: str | None = None


class SleepLogCreate(SleepLogBase):
    """Sleep log creation schema"""
    logged_at: datetime | None = None


class SleepLogUpdate(BaseModel):
    """Sleep log update schema"""
    sleep_start: datetime | None = None
    sleep_end: datetime | None = None
    duration_hours: float | None = None
    quality: str | None = None
    quality_score: float | None = None
    deep_sleep_minutes: float | None = None
    light_sleep_minutes: float | None = None
    rem_sleep_minutes: float | None = None
    awake_minutes: float | None = None
    interruptions: int | None = None
    notes: str | None = None


class SleepLogResponse(SleepLogBase):
    """Sleep log response schema"""
    id: int
    user_id: int
    logged_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_serializer('sleep_start', 'sleep_end', 'logged_at', 'created_at')
    def serialize_dt(self, dt: datetime) -> str:
        return serialize_datetime_utc(dt)