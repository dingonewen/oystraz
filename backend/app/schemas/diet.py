"""
Diet log schemas
"""
from pydantic import BaseModel, ConfigDict, field_serializer
from datetime import datetime, timezone


def serialize_datetime_utc(dt: datetime) -> str:
    """Serialize datetime as ISO format with Z suffix for UTC"""
    if dt.tzinfo is None:
        # Assume naive datetime is UTC
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace('+00:00', 'Z')


class DietLogBase(BaseModel):
    """Base diet log schema"""
    food_name: str
    meal_type: str | None = None
    calories: float = 0.0
    protein: float = 0.0
    carbs: float = 0.0
    fat: float = 0.0
    fiber: float = 0.0
    serving_size: float = 1.0
    serving_unit: str = "serving"
    notes: str | None = None


class DietLogCreate(DietLogBase):
    """Diet log creation schema"""
    logged_at: datetime | None = None


class DietLogUpdate(BaseModel):
    """Diet log update schema"""
    food_name: str | None = None
    meal_type: str | None = None
    calories: float | None = None
    protein: float | None = None
    carbs: float | None = None
    fat: float | None = None
    fiber: float | None = None
    serving_size: float | None = None
    serving_unit: str | None = None
    notes: str | None = None


class DietLogResponse(DietLogBase):
    """Diet log response schema"""
    id: int
    user_id: int
    logged_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_serializer('logged_at', 'created_at')
    def serialize_dt(self, dt: datetime) -> str:
        return serialize_datetime_utc(dt)