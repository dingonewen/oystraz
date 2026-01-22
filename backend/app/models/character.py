"""
Character database model
"""
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Character(Base):
    """Virtual character model representing user's health state"""
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Health metrics (0-100)
    stamina = Column(Float, default=100.0)
    energy = Column(Float, default=100.0)
    nutrition = Column(Float, default=100.0)
    mood = Column(Float, default=100.0)
    stress = Column(Float, default=0.0)

    # Character progression
    level = Column(Integer, default=1)
    experience = Column(Integer, default=0)

    # Appearance states
    body_type = Column(String, default="normal")  # thin, normal, overweight, obese
    emotional_state = Column(String, default="normal")  # happy, normal, tired, stressed, angry

    # Timestamps
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="character")