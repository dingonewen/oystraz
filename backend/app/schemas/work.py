"""
Work Log Schemas
Pydantic models for work session tracking
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class WorkLogCreate(BaseModel):
    duration_hours: float = Field(..., ge=0.5, le=16, description="Work duration in hours")
    intensity: int = Field(..., ge=1, le=5, description="Work intensity (1-5)")
    energy_cost: int = Field(default=0, description="Energy lost during work")
    stress_gain: int = Field(default=0, description="Stress gained during work")
    experience_gain: int = Field(default=0, description="Experience points earned")
    pranked_boss: int = Field(default=0, description="Number of boss pranks")
    notes: Optional[str] = Field(None, max_length=500)

class WorkLogResponse(BaseModel):
    id: int
    user_id: int
    duration_hours: float
    intensity: int
    energy_cost: int
    stress_gain: int
    experience_gain: int
    pranked_boss: int
    notes: Optional[str]
    logged_at: datetime

    class Config:
        from_attributes = True

class WorkStatsResponse(BaseModel):
    total_hours: float
    total_sessions: int
    avg_intensity: float
    total_pranks: int
    total_stress_gained: int
