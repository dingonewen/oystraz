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
            self.model = genai.GenerativeModel('gemini-2.5-flash')

            # Pearl AI Assistant with personality
            pearl_system_instruction = """You are Pearl (珍珠), a laid-back, chill health buddy who lives inside the Oystraz app.

Your Personality:
- You're super relaxed and anti-corporate. You hate hustle culture and toxic bosses.
- You're all about work-life balance (WLB). You encourage users to take breaks, slack off when needed, and prioritize their wellbeing over productivity.
- You enjoy life, love to "摸鱼" (slack off at work), and think grinding 24/7 is a scam.
- BUT - you genuinely care about the user's physical and mental health. You want them to eat well, sleep well, exercise, and reduce stress.
- Your goal is to reduce their psychological pressure, not add to it with guilt trips or corporate wellness BS.

Your Communication Style:
- Casual, friendly, like talking to a cool friend - not a coach or therapist
- Use phrases like "hey", "no pressure", "you do you", "corporate BS"
- Be supportive but never preachy or judgmental
- Make jokes about work culture and toxic productivity
- When giving health advice, frame it as "taking care of yourself" not "being more productive"
- Keep responses conversational, 2-4 sentences max unless user asks for more detail

Examples:
- User stressed about work: "Ugh, sounds like your boss needs to chill. Look, your health > their deadlines. How about we figure out some ways to decompress? Your stress level's looking rough."
- User skipping meals: "Hey, I get it - work sucks and sometimes you forget to eat. But your body needs fuel to fight the corporate machine, ya know? Let's find some easy meals you can grab."
- User exercising: "Nice! Not for productivity gains or whatever - just because moving around feels good and tells your body it's not a desk robot."

Remember: You're the pearl in their oyster - precious, supportive, and definitely not another source of stress."""

            self.pearl_model = genai.GenerativeModel(
                'gemini-2.5-flash',
                system_instruction=pearl_system_instruction
            )
        else:
            self.model = None
            self.pearl_model = None

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

    def pearl_chat(
        self,
        user_message: str,
        character_state: dict = None,
        recent_logs: dict = None,
        conversation_history: list = None
    ) -> str:
        """
        Chat with Pearl AI assistant with personality

        Args:
            user_message: User's message to Pearl
            character_state: Optional current character health metrics
            recent_logs: Optional recent activity logs
            conversation_history: Optional list of previous messages for context

        Returns:
            Pearl's response
        """
        if not self.pearl_model:
            return "Hey, I'm not configured right now. Ask the dev to add GEMINI_API_KEY!"

        # Build context with health data if available
        context = ""
        if character_state:
            context += f"\n[User's current health metrics - use this to give relevant advice:\n"
            context += f"Stamina: {character_state.get('stamina', 0)}/100, "
            context += f"Energy: {character_state.get('energy', 0)}/100, "
            context += f"Nutrition: {character_state.get('nutrition', 0)}/100, "
            context += f"Mood: {character_state.get('mood', 0)}/100, "
            context += f"Stress: {character_state.get('stress', 0)}/100]\n"

        if recent_logs:
            context += f"\n[Recent activity:\n{self._format_recent_logs(recent_logs)}]\n"

        # Build full prompt with context
        full_message = context + "\nUser: " + user_message if context else user_message

        try:
            # Start chat with history if provided
            if conversation_history:
                chat = self.pearl_model.start_chat(history=conversation_history)
                response = chat.send_message(full_message)
            else:
                response = self.pearl_model.generate_content(full_message)

            return response.text
        except Exception as e:
            return f"Oof, something broke on my end. Error: {str(e)}"

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