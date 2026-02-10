"""
Character API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Character
from app.schemas import CharacterResponse, CharacterUpdate
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/character", tags=["Character"])


@router.get("/", response_model=CharacterResponse)
async def get_character(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's character"""
    character = db.query(Character).filter(Character.user_id == current_user.id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )
    return character


@router.put("/", response_model=CharacterResponse)
async def update_character(
    character_update: CharacterUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's character stats"""
    character = db.query(Character).filter(Character.user_id == current_user.id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )

    # Update only provided fields
    update_data = character_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(character, field, value)

    # Update body type and emotional state based on stats
    _update_character_appearance(character)

    db.commit()
    db.refresh(character)

    return character


def _update_character_appearance(character: Character):
    """Update character's body type and emotional state based on health metrics"""
    # Update emotional state based on mood and stress
    if character.mood >= 80 and character.stress < 30:
        character.emotional_state = "happy"
    elif character.mood < 40 or character.energy < 30:
        character.emotional_state = "tired"
    elif character.stress >= 70:
        character.emotional_state = "stressed"
    elif character.stress >= 85:
        character.emotional_state = "angry"
    else:
        character.emotional_state = "normal"

    # Body type would be calculated based on user's BMI in a real scenario
    # For now, we'll keep it simple