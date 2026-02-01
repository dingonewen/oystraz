"""
Work Log Model
Track work sessions with duration and intensity
"""

from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class WorkLog(Base):
    __tablename__ = "work_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Work session data
    duration_hours = Column(Float, nullable=False)  # 1-8 hours
    intensity = Column(Integer, nullable=False)  # 1-5 scale

    # Effects
    energy_cost = Column(Integer, default=0)  # Energy lost
    stress_gain = Column(Integer, default=0)  # Stress gained
    experience_gain = Column(Integer, default=0)  # XP earned

    # Prank tracking
    pranked_boss = Column(Integer, default=0)  # Number of pranks during session

    # Optional notes
    notes = Column(String(500), nullable=True)

    # Timestamps
    logged_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
