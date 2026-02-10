"""
Workplace event schemas
"""
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class WorkplaceEventBase(BaseModel):
    """Base workplace event schema"""
    event_type: str
    event_name: str
    outcome: str | None = None
    character_state: dict | None = None
    description: str | None = None
    consequences: str | None = None
    experience_gained: int = 0


class WorkplaceEventCreate(WorkplaceEventBase):
    """Workplace event creation schema"""
    occurred_at: datetime | None = None


class WorkplaceEventResponse(WorkplaceEventBase):
    """Workplace event response schema"""
    id: int
    user_id: int
    occurred_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)