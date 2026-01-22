"""
Sleep log database model
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class SleepLog(Base):
    """Sleep tracking log"""
    __tablename__ = "sleep_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Sleep duration
    sleep_start = Column(DateTime, nullable=False)
    sleep_end = Column(DateTime, nullable=False)
    duration_hours = Column(Float, nullable=False)

    # Sleep quality
    quality = Column(String, default="average")  # poor, average, good, excellent
    quality_score = Column(Float)  # 0-100

    # Sleep stages (if available from wearables)
    deep_sleep_minutes = Column(Float)
    light_sleep_minutes = Column(Float)
    rem_sleep_minutes = Column(Float)
    awake_minutes = Column(Float)

    # Additional info
    interruptions = Column(Integer, default=0)
    notes = Column(Text)

    # Timestamps
    logged_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="sleep_logs")