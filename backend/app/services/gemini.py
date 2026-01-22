"""
Google Gemini AI service integration
"""
import google.generativeai as genai
from app.config import settings


class GeminiService:
    """Service for interacting with Google Gemini AI"""

    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None

    def generate_health_advice(
        self,
        character_state: dict,
        recent_logs: dict,
        user_query: str = None
    ) -> str:
        """
        Generate personalized health advice based on character state and recent activity

        Args:
            character_state: Dict with stamina, energy, nutrition, mood, stress
            recent_logs: Dict with recent diet, exercise, and sleep logs
            user_query: Optional specific question from user

        Returns:
            AI-generated health advice
        """
        if not self.model:
            return "Gemini AI is not configured. Please add GEMINI_API_KEY to your environment."

        # Build context prompt
        prompt = self._build_health_prompt(character_state, recent_logs, user_query)

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating advice: {str(e)}"

    def _build_health_prompt(
        self,
        character_state: dict,
        recent_logs: dict,
        user_query: str = None
    ) -> str:
        """Build a structured prompt for health advice"""
        prompt = f"""You are a health and wellness coach analyzing a user's health data.

Current Health Metrics:
- Stamina: {character_state.get('stamina', 0)}/100
- Energy: {character_state.get('energy', 0)}/100
- Nutrition: {character_state.get('nutrition', 0)}/100
- Mood: {character_state.get('mood', 0)}/100
- Stress: {character_state.get('stress', 0)}/100

Recent Activity Summary:
{self._format_recent_logs(recent_logs)}

Provide personalized, actionable advice based on this data. Focus on:
1. Identifying patterns and potential issues
2. Suggesting specific, practical improvements
3. Being encouraging and supportive, not judgmental
4. Avoid generic clichés like "drink more water" unless specifically relevant

"""
        if user_query:
            prompt += f"\nUser's specific question: {user_query}\n"

        prompt += "\nProvide your advice in a friendly, conversational tone (2-3 paragraphs):"
        return prompt

    def _format_recent_logs(self, logs: dict) -> str:
        """Format recent logs into readable text"""
        formatted = []

        if 'diet' in logs and logs['diet']:
            total_calories = sum(log.get('calories', 0) for log in logs['diet'])
            formatted.append(f"- Diet: {len(logs['diet'])} meals logged, ~{int(total_calories)} calories")

        if 'exercise' in logs and logs['exercise']:
            total_minutes = sum(log.get('duration_minutes', 0) for log in logs['exercise'])
            formatted.append(f"- Exercise: {len(logs['exercise'])} activities, {int(total_minutes)} minutes total")

        if 'sleep' in logs and logs['sleep']:
            avg_sleep = sum(log.get('duration_hours', 0) for log in logs['sleep']) / len(logs['sleep'])
            formatted.append(f"- Sleep: {len(logs['sleep'])} nights logged, avg {avg_sleep:.1f} hours")

        return "\n".join(formatted) if formatted else "No recent activity logged"

    def generate_workplace_scenario(self, character_state: dict) -> dict:
        """
        Generate a workplace scenario based on character's health state

        Returns:
            Dict with event_type, description, and possible outcomes
        """
        if not self.model:
            return {
                "event_type": "generic",
                "description": "Gemini AI not configured",
                "outcomes": []
            }

        prompt = f"""Based on these health metrics, generate a realistic workplace scenario:

Stamina: {character_state.get('stamina', 0)}/100
Energy: {character_state.get('energy', 0)}/100
Mood: {character_state.get('mood', 0)}/100
Stress: {character_state.get('stress', 0)}/100

Create a brief workplace scenario (2-3 sentences) that reflects these health stats.
Low energy = might struggle in meetings
High stress = might react poorly to challenges
Good health = handles work situations confidently

Format:
Event Type: [meeting/presentation/conflict/decision]
Description: [2-3 sentences describing the scenario]
Likely Outcome: [success/struggle/mixed based on stats]
"""

        try:
            response = self.model.generate_content(prompt)
            # Parse response (simplified - in production, use structured output)
            return {
                "event_type": "workplace_event",
                "description": response.text,
                "outcome": "mixed"
            }
        except Exception as e:
            return {
                "event_type": "error",
                "description": f"Error: {str(e)}",
                "outcome": "neutral"
            }


# Singleton instance
gemini_service = GeminiService()