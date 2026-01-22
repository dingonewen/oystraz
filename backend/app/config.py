"""
Application configuration settings
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Application
    APP_NAME: str = "Oystraz API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/oystraz"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # External APIs
    GEMINI_API_KEY: Optional[str] = None
    USDA_API_KEY: Optional[str] = None

    # Character System
    STAMINA_DECAY_RATE: float = 0.1
    ENERGY_DECAY_RATE: float = 0.15
    NUTRITION_DECAY_RATE: float = 0.2

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()