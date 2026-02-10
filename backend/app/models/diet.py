"""
Diet log database model
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class DietLog(Base):
    """Food/meal tracking log"""
    __tablename__ = "diet_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Food details
    food_name = Column(String, nullable=False)
    meal_type = Column(String)  # breakfast, lunch, dinner, snack

    # Nutrition info (from USDA API)
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)  # grams
    carbs = Column(Float, default=0.0)  # grams
    fat = Column(Float, default=0.0)  # grams
    fiber = Column(Float, default=0.0)  # grams

    # Serving info
    serving_size = Column(Float, default=1.0)
    serving_unit = Column(String, default="serving")

    # Additional info
    notes = Column(Text)

    # Timestamps
    logged_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="diet_logs")