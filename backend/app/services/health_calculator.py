"""
Health Calculator Service
Calculates character metrics based on user activities (diet, exercise, sleep, work)
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta


# Recommended daily values
RECOMMENDED_PROTEIN = 50  # grams
RECOMMENDED_FIBER = 25    # grams
RECOMMENDED_CALORIES = 2000  # kcal
MAX_FAT = 65              # grams
RECOMMENDED_SLEEP = 7     # hours
MAX_WORK_HOURS = 8        # hours per day


def calculate_nutrition_score(diet_logs: List[Dict[str, Any]]) -> float:
    """
    Calculate nutrition score (0-100) based on daily diet logs.

    Simplified version using existing fields:
    - Protein ratio (target: 50g/day)
    - Fiber ratio (target: 25g/day)
    - Fat ratio (not exceeding 65g/day)
    """
    if not diet_logs:
        return 80.0  # Default if no logs

    total_protein = sum(log.get('protein', 0) for log in diet_logs)
    total_fiber = sum(log.get('fiber', 0) for log in diet_logs)
    total_fat = sum(log.get('fat', 0) for log in diet_logs)

    # Protein score (0-33.3 points)
    protein_ratio = min(1.0, total_protein / RECOMMENDED_PROTEIN)
    protein_score = protein_ratio * 33.3

    # Fiber score (0-33.3 points)
    fiber_ratio = min(1.0, total_fiber / RECOMMENDED_FIBER)
    fiber_score = fiber_ratio * 33.3

    # Fat score (0-33.3 points) - penalize excess fat
    if total_fat <= MAX_FAT:
        fat_score = 33.3
    else:
        fat_penalty = (total_fat - MAX_FAT) / MAX_FAT
        fat_score = max(0, 33.3 * (1 - fat_penalty))

    return min(100.0, protein_score + fiber_score + fat_score)


def calculate_energy_change(
    calories_in: float,
    calories_out: float,
    sleep_hours: float,
    work_hours: float,
    work_intensity: int
) -> float:
    """
    Calculate energy change based on caloric balance and activities.

    Returns: Change in energy (-30 to +40)
    """
    change = 0.0

    # Caloric balance effect
    caloric_diff = calories_in - calories_out
    if caloric_diff > 0:
        change += min(15, caloric_diff / 100)  # Surplus gives energy, max +15
    else:
        change += max(-15, caloric_diff / 100)  # Deficit costs energy, max -15

    # Sleep effect (MAJOR impact)
    if sleep_hours >= 8:
        change += 20  # Great sleep = big energy boost
    elif sleep_hours >= 7:
        change += 15
    elif sleep_hours >= 6:
        change += 5
    elif sleep_hours >= 5:
        change += 0
    else:
        change -= 10  # Poor sleep hurts but not devastatingly

    # Work effect (reduced penalty)
    if work_hours > 0:
        work_cost = work_hours * work_intensity * 0.3  # Reduced from 0.5
        change -= min(20, work_cost)

    return change


def calculate_stamina_change(
    exercise_minutes: int,
    sleep_hours: float,
    work_hours: float,
    work_intensity: int = 3,
    exercise_type: str = "general"
) -> float:
    """
    Calculate stamina change based on exercise and rest.

    Exercise effects:
    - Yoga: +10 per hour (recovery exercise)
    - Other exercise: -3 per hour (tiring but good for stress)
    - Work: costs stamina based on intensity

    Returns: Change in stamina (-50 to +35)
    """
    change = 0.0

    # Exercise effect - depends on type
    if exercise_minutes > 0:
        exercise_hours = exercise_minutes / 60
        if exercise_type.lower() == "yoga":
            # Yoga restores stamina
            change += exercise_hours * 10
        else:
            # Other exercise costs stamina (tiring)
            change -= exercise_hours * 3

    # Sleep effect (MAJOR recovery)
    if sleep_hours >= 9:
        change += 25  # Extended sleep = major stamina recovery
    elif sleep_hours >= 8:
        change += 20
    elif sleep_hours >= 7:
        change += 15
    elif sleep_hours >= 6:
        change += 5
    elif sleep_hours >= 5:
        change += 0
    else:
        change -= 10  # Poor sleep hurts but manageable

    # Work effect - costs stamina based on intensity
    if work_hours > 0:
        base_cost = work_hours * 3  # 3 stamina per work hour
        change -= base_cost
        # Extra penalty for overtime
        if work_hours > MAX_WORK_HOURS:
            overtime = work_hours - MAX_WORK_HOURS
            change -= overtime * 5  # Extra 5 per overtime hour

    return max(-50, min(35, change))


def calculate_stress_change(
    work_hours: float,
    work_intensity: int,
    exercise_minutes: int,
    sleep_hours: float,
    pranked_boss: bool = False
) -> float:
    """
    Calculate stress change based on work and recovery activities.

    Returns: Change in stress (-35 to +30)
    """
    change = 0.0

    # Work increases stress (reduced from 0.8)
    if work_hours > 0:
        work_stress = work_hours * work_intensity * 0.5  # Reduced from 0.8
        change += work_stress

        # Overwork penalty (>8h is bad but manageable)
        if work_hours > MAX_WORK_HOURS:
            overtime = work_hours - MAX_WORK_HOURS
            change += overtime * 5  # Reduced from 8

    # Exercise reduces stress
    if exercise_minutes > 0:
        change -= min(15, exercise_minutes / 5)  # Improved: max -15

    # Sleep reduces stress (MAJOR impact)
    if sleep_hours >= 9:
        change -= 20  # Extended sleep = major stress relief
    elif sleep_hours >= 8:
        change -= 15
    elif sleep_hours >= 7:
        change -= 10
    elif sleep_hours >= 6:
        change -= 5
    elif sleep_hours >= 5:
        change -= 0
    else:
        change += 5  # Poor sleep adds stress but not too much

    # Prank the octopus boss!
    if pranked_boss:
        change -= 20

    return max(-35, min(30, change))


def calculate_mood_score(
    stamina: float,
    energy: float,
    nutrition: float,
    stress: float
) -> float:
    """
    Calculate mood as a composite of other metrics.

    Formula: (stamina + energy + nutrition) / 3 - stress / 2
    """
    base_mood = (stamina + energy + nutrition) / 3
    stress_penalty = stress / 2
    return max(0, min(100, base_mood - stress_penalty))


def calculate_xp_gain(
    diet_logged: bool,
    exercise_logged: bool,
    sleep_logged: bool,
    work_hours: float,
    work_intensity: int,
    daily_streak: int,
    nutrition_target_met: bool,
    pranked_boss: bool = False
) -> int:
    """
    Calculate experience points gained.

    Returns: XP gained (0-200+)
    """
    xp = 0

    # Logging bonuses
    if diet_logged:
        xp += 10
    if exercise_logged:
        xp += 15
    if sleep_logged:
        xp += 10

    # Work XP
    if work_hours > 0:
        xp += int(work_hours * work_intensity * 10)

    # Streak bonus (max 50)
    xp += min(50, daily_streak * 5)

    # Nutrition target bonus
    if nutrition_target_met:
        xp += 20

    # First prank bonus
    if pranked_boss:
        xp += 50

    return xp


def get_level_up_threshold(current_level: int) -> int:
    """
    Get XP required to reach next level.

    Formula: level * 100
    """
    return current_level * 100


def apply_daily_decay(character_dict: Dict[str, float]) -> Dict[str, float]:
    """
    Apply natural daily decay/recovery to metrics.
    Called at daily reset (e.g., 4 AM).
    """
    result = character_dict.copy()

    # Slight natural recovery if not overworked
    if result.get('stamina', 80) < 100:
        result['stamina'] = min(100, result['stamina'] + 5)

    # Stress naturally decreases a bit
    if result.get('stress', 30) > 0:
        result['stress'] = max(0, result['stress'] - 3)

    # Energy decays if not eating
    if result.get('energy', 80) > 50:
        result['energy'] = max(50, result['energy'] - 2)

    # Nutrition decays without eating
    if result.get('nutrition', 80) > 50:
        result['nutrition'] = max(50, result['nutrition'] - 5)

    return result


# Metric change summary for documentation/Pearl knowledge
METRICS_DOCUMENTATION = """
## Oystraz Health Metrics System

IMPORTANT: Metrics ONLY change when users LOG activities (diet, exercise, sleep, work).
The character will NOT decay or change automatically - no penalty for not using the app!
Daily limit: Sleep + Exercise + Work cannot exceed 24 hours per day.

### Default Values (New Users)
- Stamina: 80 (physical endurance)
- Energy: 80 (daily energy level)
- Nutrition: 60 (diet quality - starts lower to encourage logging meals)
- Mood: 60 (composite emotional state)
- Stress: 40 (stress level, lower is better)

### Stamina (0-100)
What affects it:
- Exercise: +1.5 per 10 minutes (max +15)
- Sleep 9+ hours: +25 (MAJOR recovery)
- Sleep 8+ hours: +20
- Sleep 7+ hours: +15
- Sleep 6+ hours: +5
- Sleep <5h: -10
- Work: -0.3 per hour
- Overwork (>8h): -3 per extra hour

### Energy (0-100)
What affects it:
- Caloric surplus: +1 per 100 kcal (max +15)
- Caloric deficit: -1 per 100 kcal (max -15)
- Sleep 8+ hours: +20 (big boost!)
- Sleep 7+ hours: +15
- Sleep 6+ hours: +5
- Sleep <5h: -10
- Work: -(hours x intensity x 0.3)

### Nutrition (0-100)
Calculated from daily diet:
- Protein (target 50g): 0-33.3 points
- Fiber (target 25g): 0-33.3 points
- Fat (under 65g): 0-33.3 points
- Total: protein + fiber + fat scores

### Mood (0-100)
Composite formula: mood = (stamina + energy + nutrition) / 3 - stress / 2
Good nutrition + good sleep + exercise = happy character!

### Stress (0-100, lower is better)
What affects it:
- Work: +(hours x intensity x 0.5)
- Overwork (>8h): +5 per extra hour
- Exercise: -1 per 5 minutes (max -15)
- Sleep 9+ hours: -20 (MAJOR relief!)
- Sleep 8+ hours: -15
- Sleep 7+ hours: -10
- Sleep 6+ hours: -5
- Sleep <5h: +5
- Prank octopus boss: -20

### Character Emotional States
- Happy: mood >= 80 AND stress < 30
- Tired: mood < 40 OR energy < 30
- Stressed: stress >= 70
- Angry: stress >= 85
- Normal: default state

### Level & XP
XP Sources:
- Log diet: +10 XP
- Log exercise: +15 XP
- Log sleep: +10 XP
- Work: +(hours x intensity x 10) XP
- Nutrition target met (>=80): +20 XP
- Prank boss: +50 XP

Level Up Formula: XP needed = current_level x 100

### Tips
- SLEEP IS POWERFUL! 8-9 hours gives major stamina/energy boost and stress relief.
- Metrics only update when you log activities! No penalty for taking breaks.
- Don't overwork! Working >8h/day still hurts, but sleeping well recovers you.
- Exercise reduces stress AND builds stamina. Win-win.
- Balanced diet with protein and fiber keeps nutrition high.
- Good mood = balanced nutrition + good sleep + exercise. Take care of yourself!
- In the Work game, catching 24+ fish triggers auto-prank on the octopus boss!
- Easter egg: Eat any food with "oyster" in the name for +50 to ALL stats!
"""