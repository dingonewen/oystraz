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

    # Health metrics (0-100) - Default values for new users
    # These values only change when user logs activities (diet, exercise, sleep, work)
    # NOT on login - so character won't "starve" if user doesn't use app for days
    stamina = Column(Float, default=80.0)   # Physical endurance
    energy = Column(Float, default=80.0)    # Energy level
    nutrition = Column(Float, default=60.0) # Nutritional status
    mood = Column(Float, default=60.0)      # Emotional state (composite)
    stress = Column(Float, default=40.0)    # Stress level (lower is better)

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