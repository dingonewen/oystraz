"""
Workplace event database model
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class WorkplaceEvent(Base):
    """Workplace simulator event log"""
    __tablename__ = "workplace_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Event details
    event_type = Column(String, nullable=False)  # meeting, presentation, conflict, break, etc.
    event_name = Column(String, nullable=False)
    outcome = Column(String)  # success, failure, neutral

    # Character state at event time
    character_state = Column(JSON)  # Snapshot of stamina, energy, mood, etc.

    # Event result
    description = Column(Text)
    consequences = Column(Text)  # What happened as a result
    experience_gained = Column(Integer, default=0)

    # Timestamps
    occurred_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="workplace_events")