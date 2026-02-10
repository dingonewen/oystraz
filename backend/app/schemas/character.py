"""
Character schemas
"""
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class CharacterBase(BaseModel):
    """Base character schema"""
    stamina: float = Field(ge=0, le=100, default=100.0)
    energy: float = Field(ge=0, le=100, default=100.0)
    nutrition: float = Field(ge=0, le=100, default=100.0)
    mood: float = Field(ge=0, le=100, default=100.0)
    stress: float = Field(ge=0, le=100, default=0.0)


class CharacterCreate(CharacterBase):
    """Character creation schema"""
    pass


class CharacterUpdate(BaseModel):
    """Character update schema"""
    stamina: float | None = Field(ge=0, le=100, default=None)
    energy: float | None = Field(ge=0, le=100, default=None)
    nutrition: float | None = Field(ge=0, le=100, default=None)
    mood: float | None = Field(ge=0, le=100, default=None)
    stress: float | None = Field(ge=0, le=100, default=None)


class CharacterResponse(CharacterBase):
    """Character response schema"""
    id: int
    user_id: int
    level: int
    experience: int
    body_type: str
    emotional_state: str
    last_updated: datetime

    model_config = ConfigDict(from_attributes=True)