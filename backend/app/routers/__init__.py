"""
API routers
"""
from app.routers import auth, user, character, diet, exercise, sleep, assistant

__all__ = ["auth", "user", "character", "diet", "exercise", "sleep", "assistant"]

# Note: work router is imported directly in main.py to avoid circular import