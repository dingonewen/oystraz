"""
Exercise log database model
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class ExerciseLog(Base):
    """Exercise/activity tracking log"""
    __tablename__ = "exercise_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Exercise details
    activity_name = Column(String, nullable=False)
    activity_type = Column(String)  # cardio, strength, flexibility, sports

    # Duration and intensity
    duration_minutes = Column(Float, nullable=False)
    intensity = Column(String, default="moderate")  # light, moderate, vigorous
    calories_burned = Column(Float, default=0.0)

    # Distance (for running, cycling, etc.)
    distance = Column(Float)  # in km
    distance_unit = Column(String, default="km")

    # Additional metrics
    heart_rate_avg = Column(Integer)
    steps = Column(Integer)

    # Notes
    notes = Column(Text)

    # Timestamps
    logged_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="exercise_logs")