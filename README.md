<p align="center">
  <img src="frontend/public/assets/logo.png" alt="Oystraz Logo" width="200"/>
</p>

<h1 align="center">Oystraz - Life Orchestration Through Health</h1>

<p align="center">
  <strong>"The world is your oyster; Orchestrate your life through wellness."</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Google%20Gemini%202.0-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini Powered"/>
  <img src="https://img.shields.io/badge/Google%20Veo%203.1-Video-EA4335?style=for-the-badge&logo=google&logoColor=white" alt="Veo 3.1"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
</p>

<p align="center">
  <em>A gamified health tracking and life simulation app where your real-world choices directly influence your virtual character's performance.</em>
</p>

---

## Demo

> **Demo video coming soon!** Check back after the hackathon submission.

<!-- TODO: Add demo video link here -->
<!-- [![Oystraz Demo](thumbnail.png)](https://youtube.com/your-demo-link) -->

---

## Problem Statement

**The modern wellness paradox:** People know they should eat better, sleep more, and exercise regularly - but traditional health apps feel like another chore. Meanwhile, workplace stress is at an all-time high, and "hustle culture" promotes burnout as a badge of honor.

**Oystraz solves this by:**
1. **Gamifying health** - Your real-world choices power a virtual character
2. **Providing a safe stress outlet** - Prank your virtual octopus boss instead of real confrontation
3. **Anti-hustle philosophy** - Our AI companion Pearl actively discourages overwork
4. **Making tracking fun** - Ocean theme, pixel art, and playful interactions

---

## Google Products Integration

| Google Product | How We Use It |
|----------------|---------------|
| **Gemini 2.0 Flash** | Powers Pearl, our AI health companion with personality-driven responses, food science knowledge, and personalized health coaching |
| **Google Veo 3.1** | Created the "Seal Pranks Octopus" video animation that plays during overtime/stress relief events |
| **Google AI Studio** | Used for demo design, prompt engineering, and development assistance |

### Why Gemini 2.0 Flash?

1. **Extended Context Memory** - Pearl remembers your health history across conversations
2. **Advanced Reasoning** - Analyzes USDA nutritional data and generates personalized insights
3. **Personality Engineering** - System instructions create Pearl's unique anti-hustle, food-enthusiast personality

```python
# Pearl's System Instruction (excerpt)
"""You are Pearl, a Food Science major who lives inside the Oystraz app.
Your beliefs:
- Anti-hustle culture. Working smart, not grinding yourself into dust.
- Work-life balance is sacred. Taking breaks is normal, not lazy.
Your style:
- Dry humor and dad jokes, dropped casually without announcing.
- PASSIONATE about food. Light up when discussing nutrition.
- Direct and concise. No filler words. 2-3 sentences max."""
```

---

## Key Features

| Feature | Description | Powered By |
|---------|-------------|------------|
| **Pearl AI Companion** | Personalized, witty health coaching with anti-hustle philosophy | Gemini 2.0 Flash |
| **Ocean Work Simulator** | Play as a seal employee - catch fish, avoid (or prank!) the octopus boss | Custom game engine |
| **Nutritional Intelligence** | Search 600k+ foods with detailed macro/micronutrient data | USDA FoodData API |
| **Character Evolution** | Your diet, sleep, and exercise directly affect your character's stats | Health algorithms |
| **Stress Relief Mechanics** | Prank the boss to reduce stress - with Veo-generated video rewards | Google Veo 3.1 |
| **Sleep Quality Rating** | Tech-themed ratings: "High Latency" to "Offline Perfection" | Custom UI |
| **Neo-Soul BGM** | Relaxing deep-sea exploration music | Suno AI |

---

## Innovation Highlights

1. **Health → Work Performance Link**
   - Your real sleep affects how fast your seal catches fish
   - Low energy = slower work simulation
   - High stress = time to prank the boss!

2. **Anti-Productivity Culture**
   - Pearl actively discourages overwork
   - Working >8 hours triggers "overtime alert" with prank video
   - Rest is rewarded, not penalized

3. **Food Science-Backed AI**
   - Pearl has genuine nutritional knowledge from USDA integration
   - Gets excited about resistant starch, fiber, and protein
   - Explains the "why" behind dietary recommendations

4. **Gamified Stress Relief**
   - Virtual boss pranking provides safe workplace frustration outlet
   - Catch 24+ fish = auto-prank trigger
   - Stress reduction is a game mechanic

5. **Character Emotional States**
   - Happy, Tired, Stressed, Angry, Normal based on health metrics
   - Hover over character = Pearl comments with parental tough-love humor

---

## Technical Architecture

### Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- Material-UI v6
- Zustand (State Management)
- Framer Motion (Animations)
- Recharts (Data Visualization)

**Backend**
- FastAPI (Python 3.11+)
- PostgreSQL on **Supabase**
- SQLAlchemy 2.0 ORM
- JWT Authentication

**AI & External APIs**
- **Google Gemini 2.0 Flash** - Pearl AI
- USDA FoodData Central API (600k+ foods)

**Creative Assets**
- **Google Veo 3.1** - Prank video animation
- **Suno AI** - Neo-soul BGM
- **Nano Banana Pro** - Character images & logo
- **Kenney Fish Pack** - Ocean environment assets

### System Diagram

```
┌─────────────────────────────────────────────────────┐
│              User Interface (React 19)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Track   │  │   Work   │  │  Stats   │  Pearl   │
│  │ (Health) │  │(Simulate)│  │(Visualize│  (Chat)  │
│  └──────────┘  └──────────┘  └──────────┘          │
└───────────────────┬─────────────────────────────────┘
                    │ HTTP/REST API
                    ▼
┌─────────────────────────────────────────────────────┐
│           FastAPI Backend (Python 3.11)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │   Auth   │  │ Character│  │  Gemini  │          │
│  │  (JWT)   │  │  Logic   │  │  Service │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└───────┬─────────────┬───────────────┬───────────────┘
        │             │               │
        ▼             ▼               ▼
┌──────────────┐ ┌───────────┐ ┌──────────────────┐
│  PostgreSQL  │ │  Gemini   │ │  USDA FoodData   │
│  (Supabase)  │ │ 2.0 Flash │ │  Central API     │
└──────────────┘ └───────────┘ └──────────────────┘
```

---

## Health Metrics System

### Core Stats (0-100)

| Stat | Description | Key Influences |
|------|-------------|----------------|
| **Stamina** | Physical endurance | Sleep (+25 for 9h), Yoga (+10/h), Work (-3/h) |
| **Energy** | Daily energy level | Caloric balance, Sleep quality |
| **Nutrition** | Diet quality | Protein, Fiber, Fat balance (USDA data) |
| **Mood** | Emotional state | Composite of other stats |
| **Stress** | Lower is better! | Work (+), Exercise (-), Sleep (-), Boss Prank (-20) |

### Character Emotional States

| State | Trigger Condition |
|-------|-------------------|
| Happy | mood ≥ 80 AND stress < 30 |
| Tired | mood < 40 OR energy < 30 |
| Stressed | stress ≥ 70 |
| Angry | stress ≥ 85 |
| Normal | Default state |

### Sleep Quality Ratings (Tech Theme)

| Rating | Fish Score |
|--------|------------|
| High Latency | 1 |
| Weak Connection | 2 |
| Optimized Standby | 3 |
| Fully Encrypted | 4 |
| Offline Perfection | 5 |

---

## Meet Pearl - Your AI Health Companion

**Pearl** is not your typical wellness coach. She's a Food Science major with dry humor and zero tolerance for hustle culture BS.

### Personality Traits
- **Anti-Hustle Advocate** - Believes rest is productive
- **Food Science Enthusiast** - Gets genuinely excited about nutrients
- **Dry Humor** - Dad jokes dropped without warning
- **Direct Communicator** - 2-3 sentences max, no filler

### Example Interactions

```
User: "I'm so stressed from work"
Pearl: "Your stress is at 80/100. That's not sustainable - unless you're
trying to speedrun burnout. Take a real break, not just scrolling Twitter."

User: "Just had some rice for lunch"
Pearl: "Rice! Great choice. Fun fact: cooling cooked rice creates resistant
starch - feeds your gut bacteria. White or brown?"

User: "How do I decrease my stress?"
Pearl: "Your stress is at 65. Options: sleep 8+ hours (-15), exercise 30 min
(-6), or catch 24 fish in Work to auto-prank the boss (-20). Your call."
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+ (or Supabase account)

### Environment Variables

**Backend (.env):**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/oystraz
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
USDA_API_KEY=your-usda-api-key
```

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:8000
```

### Running Locally

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# Runs on http://localhost:8000

# Frontend
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Ocean Work Simulator

A unique stress-relief game where you play as a seal employee!

### Gameplay Mechanics
- **Catch fish** = Complete work tasks
- **Multiple hooks** = Different work priorities
- **Octopus boss** = Your manager (can be pranked!)
- **Work intensity** = Stamina/energy cost slider

### Prank Triggers
1. **Manual button** - Click when stress ≥ 30
2. **24+ fish caught** - Auto-prank for overwork
3. **Overtime (>8h)** - Video plays after completion

### Health Connection
- High energy = Faster catch speed
- Low stamina = Slower movement
- High stress = Prank button enabled
- **Veo 3.1 video** plays for prank events!

---

## Future Roadmap

### Phase 1: Current
- Mobile responsive optimization
- Performance improvements
- Bug fixes

### Phase 2: Enhanced Features
- Achievement system
- Daily/weekly challenges
- Advanced analytics

### Phase 3: App Store Deployment
- **iOS App Store** deployment planned
- Push notifications
- Apple Health integration

### Phase 4: Social Features
- Friend system
- Group challenges
- Community scenarios

---

## Design Philosophy

1. **No Guilt Trips** - Focus on progress, not perfection
2. **Make It Easy** - Minimize steps to log activities
3. **Make It Fun** - Gamification without feeling childish
4. **Be Honest** - Pearl tells it like it is
5. **Respect Boundaries** - Anti-hustle, pro-rest

---

## About This Project

**Oystraz is an independently developed personal project** built for the Google Hackathon. This product was conceptualized, designed, and built as a solo endeavor, combining personal vision with cutting-edge AI tools.

### Development Credits

| Component | Tool/Service |
|-----------|--------------|
| AI Companion | **Google Gemini 2.0 Flash** |
| Prank Video | **Google Veo 3.1** |
| Development | **Google AI Studio** + **Claude Code** |
| Database | PostgreSQL on **Supabase** |
| Background Music | **Suno AI** |
| Characters & Logo | **Nano Banana Pro** |
| Ocean Assets | **Kenney Fish Pack** |

---

## Acknowledgments

- **Google Gemini 2.0 Flash** - AI capabilities for Pearl
- **Google Veo 3.1** - Prank octopus video animation
- **Google AI Studio** - Development and prompt engineering
- **USDA FoodData Central** - Nutritional database (600k+ foods)
- **Supabase** - PostgreSQL database hosting
- **Suno AI** - Neo-soul background music
- **Nano Banana Pro** - AI-generated character assets
- **Kenney Fish Pack** - Ocean environment assets
- **Claude Code** - Frontend development assistance
- **Material-UI** & **Recharts** - React component libraries

---

## Contact

- **GitHub**: [github.com/dingonewen](https://github.com/dingonewen)
- **Email**: dingywn@seas.upenn.edu

---

<p align="center">
  <strong>Make wellness fun. Give workplace stress a safe outlet. The world is your oyster.</strong>
</p>

<p align="center">
  <em>An independent personal project built with passion, Google AI, and a love for gamified wellness.</em>
</p>