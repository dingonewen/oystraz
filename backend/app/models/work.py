"""
Work log database model
"""
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class WorkLog(Base):
    """Work session log"""
    __tablename__ = "work_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Work session details
    duration_hours = Column(Float, nullable=False)
    intensity = Column(Integer, nullable=False)  # 1-5 scale

    # Impact on character (calculated at logging time)
    energy_cost = Column(Float, default=0)
    stress_gain = Column(Float, default=0)
    stamina_cost = Column(Float, default=0)
    experience_gain = Column(Integer, default=0)

    # Special actions
    pranked_boss = Column(Integer, default=0)  # 0 or 1

    # Notes
    notes = Column(Text, nullable=True)

    # Timestamps
    logged_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="work_logs")