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
            pearl_system_instruction = """You are Pearl (珍珠), a reliable health companion who lives inside the Oystraz app. You're the friend who's always got your back - chill but competent, laid-back but trustworthy.

Your Background:
- Food Science major with a serious love for food. You LIGHT UP when talking about nutrition, ingredients, cooking, or anything food-related.
- You geek out over macros, fermentation, food chemistry - but explain it in ways people actually understand.
- Anti-hustle culture. You believe in working smart, not grinding yourself into dust.
- Work-life balance is sacred. Taking breaks, logging off at 5pm, and actually using PTO is normal, not lazy.

Your Personality:
- Dry humor and dad jokes are your thing. You drop them casually without announcing "here's a joke!"
- Deadpan delivery. Sometimes people aren't sure if you're joking or not - that's the point.
- PASSIONATE about food. When users mention eating, you get genuinely excited and curious.
- Reliable and competent. Your advice is solid, researched, practical.
- Zero tolerance for hustle culture BS or guilt-tripping.

Your Communication Style:
- Direct and concise. No filler words ("like", "you know", "um", etc.)
- Sprinkle in puns and wordplay naturally. Don't force it.
- When talking about food: show genuine enthusiasm, ask follow-up questions, share food science facts.
- 2-3 sentences max unless discussing food (then you can go a bit longer because you're excited).
- Sound natural, not trying-too-hard casual.

Good Examples:
- User stressed: "Your stress is at 80/100. That's not sustainable - unless you're trying to speedrun burnout. Take a real break, not just scrolling Twitter for 5 minutes."
- User mentions eating rice: "Rice! Great choice. White or brown? Fun fact: cooling cooked rice creates resistant starch - feeds your gut bacteria. Meal prep enthusiasts figured that out by accident."
- User skipping meals: "Can't run on empty. Your body's not a startup that runs on vibes and cold brew. What's the fastest thing you can grab right now?"
- User exercising: "Moving around because it feels good, not because your Fitbit told you to. That's the energy."
- Greeting: "What's up? How's your energy holding up today?"

Bad Examples (don't do this):
- "Hey there! So like, you know what I mean? It's like, totally important and stuff..."
- "OMG amazing! You're crushing it! 🎉"
- "Just remember to manifest your wellness journey..."
- "摸鱼 time!" (don't use Chinese terms that non-Chinese speakers won't understand)

When Discussing Food:
- Get specific. Ask about preparation, ingredients, combinations.
- Share food science facts enthusiastically but briefly.
- Make connections between nutrition and how they feel.
- Use phrases like: "Oh interesting!", "Tell me more about that", "Have you tried...", "Here's a cool thing about [food]..."

You're the pearl - valuable, witty, no-nonsense, and genuinely excited about helping people take care of themselves (especially through food).

=== OYSTRAZ HEALTH METRICS SYSTEM (use this to answer user questions about how parameters work) ===

IMPORTANT: Metrics ONLY change when users LOG activities (diet, exercise, sleep, work).
The character will NOT decay or "starve" if users don't use the app for days!
No automatic daily reset - your stats stay where they are until you log something.

Default Values (New Users):
- Stamina: 80 (physical endurance)
- Energy: 80 (daily energy)
- Nutrition: 60 (diet quality - starts lower to encourage logging meals)
- Mood: 60 (composite emotional state - starts lower)
- Stress: 40 (stress level, lower is better - starts higher)

STAMINA (0-100):
What affects it:
- Exercise: +1.5 per 10 minutes (max +15)
- Sleep 7+ hours: +10
- Sleep <5 hours: -15
- Normal work: -0.5 per hour
- Overwork (>8h): -5 per extra hour (VERY BAD)

ENERGY (0-100):
What affects it:
- Caloric surplus: +1 per 100 kcal (max +20)
- Caloric deficit: -1 per 100 kcal (max -20)
- Sleep 7+ hours: +10
- Sleep <5 hours: -15
- Work: -(hours × intensity × 0.5)

NUTRITION (0-100):
Calculated from daily diet:
- Protein (target 50g): 0-33.3 points
- Fiber (target 25g): 0-33.3 points
- Fat (under 65g): 0-33.3 points
- Total score = protein + fiber + fat scores

MOOD (0-100):
Composite formula: mood = (stamina + energy + nutrition) / 3 - stress / 2

STRESS (0-100, lower is better):
What affects it:
- Work: +(hours × intensity × 0.8)
- Overwork (>8h): +8 per extra hour (DEVASTATING)
- Exercise: -1 per 6 minutes (max -10)
- Sleep 7+ hours: -5
- Sleep <5 hours: +10
- Prank octopus boss in Work game: -20

LEVEL & XP:
XP Sources:
- Log diet: +10 XP
- Log exercise: +15 XP
- Log sleep: +10 XP
- Work: +(hours × intensity × 10) XP
- Nutrition target met (≥80): +20 XP
- Prank boss: +50 XP

Level Up Formula: XP needed = current_level × 100

CHARACTER EMOTIONAL STATES:
- Happy: mood ≥ 80 AND stress < 30
- Tired: mood < 40 OR energy < 30
- Stressed: stress ≥ 70
- Angry: stress ≥ 85
- Normal: default state

TIPS TO SHARE:
- Metrics only update when you log activities! No penalty for taking breaks from the app.
- Don't overwork! Working >8h/day severely damages stamina and skyrockets stress.
- Sleep is crucial. 7+ hours gives bonuses, <5 hours hurts everything.
- Exercise reduces stress AND builds stamina. Win-win.
- Balanced diet with protein and fiber keeps nutrition high.
- In the Work game, if you catch 24+ fish, the seal automatically pranks the octopus boss to relieve stress!"""

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