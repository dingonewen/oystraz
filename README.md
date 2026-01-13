# Oystraz - Life Orchestration Through Health

> **"The world is your oyster; Orchestrate your life through wellness."**
>
> A gamified health tracking and life simulation app where your real-world choices (diet, sleep, exercise) directly influence your virtual character's performance at work and in life.

---

## 🎮 Project Vision

**Oystraz** merges two powerful metaphors:
- **Oyster** - "The world is your oyster" - life is full of opportunities waiting to be seized
- **Orchestra** - The art of coordinating complex elements into harmonious performance

The core philosophy: **By orchestrating your physical wellness, you gain control over your work and life.**

Oystraz is not just another health tracker - it's a **stress-relief simulator** that gamifies wellness while providing a safe space to express workplace frustrations. Your virtual character mirrors your real health data, and its workplace behavior reflects your physical and mental state.

### Core Principles
- 🍎 **Data-Driven Wellness** - Powered by USDA nutritional database
- 🏃 **Scientific Activity Tracking** - Accurate calorie expenditure calculations
- 😊 **Emotional Intelligence** - Dynamic workplace scenarios based on health metrics
- 💼 **Stress Liberation** - Safely "confront your boss", "slack off", or "nap at work" in virtual world
- 🤖 **AI Companion** - Gemini AI provides empathetic coaching and personalized advice

---

## 🌟 Core Features

### 1. Health Data Tracking
```
📊 Three Pillars of Wellness:

🍽️ Nutrition Logging
   ├─ Quick food search (USDA database)
   ├─ Photo recognition (Gemini Vision)
   └─ Automatic nutritional analysis

😴 Sleep Tracking
   ├─ Duration monitoring
   ├─ Bedtime/wake time logging
   └─ Quality scoring

🏃 Exercise Recording
   ├─ Activity type and duration
   ├─ Calorie burn calculation
   └─ Intensity classification
```

### 2. Virtual Character System
```
👤 Character Attributes (0-100 scale):
├─ 💪 Stamina - Based on exercise and sleep quality
├─ ⚡ Energy - Based on caloric intake vs expenditure
├─ 🍎 Nutrition - Based on dietary balance
├─ 😊 Mood - Based on overall wellness trends
└─ 😰 Stress - Based on work hours and rest quality

🎭 Character States:
├─ Body type changes (BMI-influenced)
├─ Mental states (exhausted ↔ energized)
├─ Emotional expressions (happy, frustrated, angry, tired)
└─ Level progression system (earn XP through healthy behaviors)
```

### 3. Office Life Simulator ⭐ Core Innovation ⭐
```
💼 Workplace Scenario Engine:

When users click "Start Work", their virtual character enters
an office environment where different interactive events trigger
based on current health attributes.

Example Scenario:
┌─────────────────────────────────────┐
│  [Character sitting at desk]        │
│                                     │
│  Current Status:                    │
│  💪 Stamina: 85  ⚡ Energy: 90     │
│  😊 Mood: 75     😰 Stress: 30     │
│                                     │
│  Event Triggered:                   │
│  "Your boss suddenly calls you      │
│   for an urgent meeting..."         │
│                                     │
│  Available Actions:                 │
│  [💥 Tell them off] (mood > 80)    │
│  [😴 Pretend not to hear] (stamina < 40) │
│  [📝 Comply quietly] (default)     │
│  [🏃 Hide in bathroom] (stress > 70) │
└─────────────────────────────────────┘
```

#### Workplace Event Types (Health-Based Triggers)
```
High Stamina (>80):
├─ ✨ "Work overtime energetically, gain boss approval" (+mood)
├─ 💪 "Complete challenging project" (+XP)
└─ 🏆 "Volunteer for extra responsibilities" (+achievement)

Low Stamina (<40):
├─ 😴 "Doze off during work, caught by colleagues" (-mood)
├─ 💤 "Fall asleep at desk" (restore stamina but -reputation)
└─ 🥱 "Low productivity, tasks delayed" (+stress)

High Mood (>80):
├─ 💥 "Confront boss about unreasonable demands" (cathartic! -stress)
├─ 💰 "Ask for a raise" (chance of success)
└─ 🎉 "Peak productivity mode" (+work output)

Low Mood (<30):
├─ 😢 "Cry in bathroom stall" (emotional release)
├─ 💼 "Submit resignation letter" (life reset)
└─ 🏃 "Leave early without notice" (-work progress)

High Stress (>80):
├─ 🤯 "Emotional outburst" (reduce stress but damage relationships)
├─ 🏖️ "Forced vacation mode" (restore mood)
└─ 🧘 "Meditation/exercise prompt triggered"

Balanced State (all metrics 60-80):
├─ 📊 "Steady performance, normal workday"
├─ 🤝 "Smooth team collaboration"
└─ ⬆️ "Career level up"
```

### 4. AI Health Coach (Gemini)
```
🤖 Intelligent Assistant Features:

💬 Emotional Resonance
   "Looks like you didn't sleep well last night.
    Your stamina is only at 45 today...
    Want to hear my suggestions?"

🎯 Personalized Recommendations
   "You haven't exercised for 3 days, and your nutrition
    score dropped to 60. I recommend a 30-minute brisk walk
    today with a high-protein breakfast!"

🎉 Encouragement & Celebration
   "Amazing! 7-day healthy eating streak! Your character
    just leveled up to Level 3! Achievement unlocked:
    Wellness Warrior 🏆"

📈 Trend Analysis
   "Your sleep quality has been declining over the past
    two weeks. This might be work-stress related.
    Consider adjusting your schedule..."

🎭 Workplace Scenario Commentary
   "Haha! Your character just confronted the boss!
    Stress -30, Mood +20, but watch those workplace
    relationships 😄"
```

### 5. Data Visualization & Reporting
```
📊 Health Dashboard:
├─ Four-dimensional radar chart (stamina/energy/nutrition/mood)
├─ Historical trend curves
├─ Weekly/monthly wellness reports
└─ Workplace scenario replay logs

📅 Daily Summary:
"January 13, 2026 - Your Day"
├─ Breakfast: Oatmeal + Banana (350 cal, nutrition +15)
├─ Exercise: 30min jog (stamina +20, energy -250)
├─ Work: Confronted boss once (mood +25, stress -30)
└─ Overall: Health Level 5 → 6 ⬆️
```

---

## 🏗️ Technical Architecture

### Technology Stack
```
Frontend:
├─ React 18 + TypeScript
├─ UI Library: Material-UI (mobile-responsive)
├─ State Management: Zustand
├─ Routing: React Router v6
├─ Charts: Recharts
├─ Animation: Framer Motion
└─ PWA: Installable on mobile devices

Backend:
├─ FastAPI (Python 3.11+)
├─ Database: PostgreSQL
├─ ORM: SQLAlchemy
├─ Authentication: JWT
└─ API Docs: Auto-generated (FastAPI)

AI & Data Sources:
├─ Google Gemini API (chat + image recognition)
├─ USDA FoodData Central API (nutritional data)
├─ Exercise DB / MET Database (activity data)
└─ Redis (caching layer)

Deployment:
├─ Frontend: Vercel / Netlify
├─ Backend: Railway / Render
├─ Database: Supabase (PostgreSQL hosting)
└─ Containerization: Docker + Docker Compose
```

### System Architecture Diagram
```
┌─────────────────────────────────────────────────┐
│              User Interface Layer                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Data Input│  │Character │  │Work Sim  │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│         │              │              │         │
└─────────┼──────────────┼──────────────┼─────────┘
          │              │              │
          ▼              ▼              ▼
┌─────────────────────────────────────────────────┐
│               API Gateway Layer                  │
│              FastAPI REST API                    │
└─────────────────────────────────────────────────┘
          │              │              │
    ┌─────┴─────┐  ┌────┴────┐  ┌─────┴─────┐
    ▼           ▼  ▼         ▼  ▼           ▼
┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐
│Health  │ │Scenario│ │AI       │ │External  │
│Calc    │ │Engine  │ │Service  │ │APIs      │
│Engine  │ │        │ │(Gemini) │ │(USDA etc)│
└────────┘ └────────┘ └─────────┘ └──────────┘
    │           │          │           │
    └───────────┴──────────┴───────────┘
                    ▼
          ┌──────────────────┐
          │Data Persistence  │
          │PostgreSQL DB     │
          └──────────────────┘
```

### Core Algorithms

#### 1. Health Metrics Calculation Engine
```python
def calculate_health_metrics(user_data):
    """
    Calculate multi-dimensional health parameters

    Inputs:
    - Dietary records (calories, protein, carbs, fat, vitamins)
    - Sleep records (duration, quality, bedtime)
    - Exercise records (type, duration, intensity)
    - User baseline data (height, weight, age, gender)

    Outputs:
    - Stamina (0-100)
    - Energy (0-100)
    - Nutrition (0-100)
    - Mood (0-100)
    - Stress (0-100)
    """

    # 1. Stamina = f(exercise volume, sleep quality)
    stamina = (
        exercise_score * 0.6 +
        sleep_quality * 0.4
    )

    # 2. Energy = f(caloric balance, sleep duration)
    energy = (
        calorie_balance_score * 0.7 +
        sleep_duration_score * 0.3
    )

    # 3. Nutrition = f(dietary balance, micronutrients)
    nutrition = (
        macro_balance * 0.6 +
        vitamin_minerals * 0.4
    )

    # 4. Mood = f(overall health trend, stress level)
    mood = (
        overall_health_trend * 0.6 +
        (100 - stress) * 0.4
    )

    # 5. Stress = f(work hours, rest quality, mood variance)
    stress = calculate_stress_level(
        work_hours, rest_quality, mood_variance
    )

    return {
        'stamina': stamina,
        'energy': energy,
        'nutrition': nutrition,
        'mood': mood,
        'stress': stress
    }
```

#### 2. Workplace Scenario Trigger Engine
```python
def trigger_work_event(character_state):
    """
    Trigger workplace scenarios based on character health state

    Priority System:
    1. Extreme states (any attribute < 20 or > 90)
    2. Combined states (high stress + low mood)
    3. Random events (probability-based)
    """

    # Check extreme states
    if character_state['stamina'] < 20:
        return random.choice([
            Event('SLEEP_AT_DESK',
                  consequence={'stamina': +10, 'reputation': -5}),
            Event('CALL_IN_SICK',
                  consequence={'stamina': +30, 'work_progress': -10})
        ])

    if character_state['mood'] > 90:
        return random.choice([
            Event('CONFRONT_BOSS',
                  consequence={'stress': -30, 'mood': +10}),
            Event('ASK_FOR_RAISE',
                  consequence={'money': +100, 'confidence': +15})
        ])

    # Combined state triggers
    if character_state['stress'] > 80 and character_state['mood'] < 30:
        return Event('MELTDOWN',
                     consequence={'stress': -50, 'relationships': -20})

    # Normal random events
    return get_random_event(character_state)
```

#### 3. AI Conversation Generation
```python
def generate_ai_response(user_data, context, conversation_history):
    """
    Generate personalized AI coach responses using Gemini
    """

    prompt = f"""
    You are Oystraz's AI health coach. Communicate in a relaxed,
    humorous, and empathetic tone. You can see the user's virtual
    character state and offer advice like a supportive friend.

    User's Character Current State:
    - Level: {user_data['level']}
    - 💪 Stamina: {user_data['stamina']}/100
    - ⚡ Energy: {user_data['energy']}/100
    - 🍎 Nutrition: {user_data['nutrition']}/100
    - 😊 Mood: {user_data['mood']}/100
    - 😰 Stress: {user_data['stress']}/100

    Recent Activities:
    - Yesterday's meals: {user_data['yesterday_meals']}
    - Yesterday's exercise: {user_data['yesterday_exercise']}
    - Recent workplace events: {user_data['recent_work_events']}

    Current Context: {context}

    Respond with encouraging, fun, and gamified language.
    Use emojis appropriately. If the user's state is poor,
    show empathy and provide actionable advice. If they're
    doing well, celebrate enthusiastically and encourage continuation.
    """

    response = gemini_client.generate_content(
        prompt,
        history=conversation_history
    )

    return response.text
```

---

## 📂 Project Structure

```
Oystraz/
├── README.md
├── .gitignore
├── docker-compose.yml
│
├── frontend/                      # React Frontend
│   ├── public/
│   │   ├── manifest.json          # PWA config
│   │   ├── icons/                 # App icons
│   │   └── index.html
│   ├── src/
│   │   ├── components/            # UI Components
│   │   │   ├── Avatar/            # Virtual character display
│   │   │   ├── HealthBars/        # Health attribute bars
│   │   │   ├── FoodInput/         # Food logging interface
│   │   │   ├── ExerciseLog/       # Exercise recording
│   │   │   ├── WorkSimulator/     # Workplace scenario simulator ⭐
│   │   │   ├── AIChat/            # AI conversation interface
│   │   │   └── Dashboard/         # Data dashboard
│   │   ├── pages/
│   │   │   ├── Home.tsx           # Main page (character status)
│   │   │   ├── Track.tsx          # Data tracking
│   │   │   ├── Work.tsx           # Work simulation ⭐
│   │   │   ├── Stats.tsx          # Statistics
│   │   │   └── Profile.tsx        # User settings
│   │   ├── hooks/                 # Custom hooks
│   │   ├── services/              # API calls
│   │   │   ├── api.ts             # API client
│   │   │   ├── foodService.ts
│   │   │   ├── exerciseService.ts
│   │   │   └── geminiService.ts
│   │   ├── store/                 # Zustand state management
│   │   │   ├── userStore.ts
│   │   │   ├── characterStore.ts
│   │   │   └── workStore.ts
│   │   ├── utils/
│   │   │   ├── calculations.ts    # Frontend calculation utilities
│   │   │   └── formatters.ts
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                       # FastAPI Backend
│   ├── app/
│   │   ├── main.py                # Application entry point
│   │   ├── config.py              # Configuration management
│   │   ├── database.py            # Database connection
│   │   ├── models/                # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── meal.py
│   │   │   ├── exercise.py
│   │   │   ├── sleep.py
│   │   │   ├── character.py
│   │   │   ├── work_event.py      # Workplace event records
│   │   │   └── achievement.py
│   │   ├── schemas/               # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── health.py
│   │   │   └── work.py
│   │   ├── api/                   # API routes
│   │   │   ├── auth.py            # Authentication
│   │   │   ├── user.py            # User management
│   │   │   ├── food.py            # Food-related endpoints
│   │   │   ├── exercise.py        # Exercise-related endpoints
│   │   │   ├── sleep.py           # Sleep-related endpoints
│   │   │   ├── character.py       # Character state endpoints
│   │   │   ├── work.py            # Workplace scenarios ⭐
│   │   │   └── ai.py              # AI conversation endpoints
│   │   ├── services/              # Business logic
│   │   │   ├── health_calculator.py  # Health calculation engine ⭐
│   │   │   ├── work_engine.py        # Workplace scenario engine ⭐
│   │   │   ├── usda_client.py        # USDA API client
│   │   │   ├── exercise_client.py    # Exercise data API client
│   │   │   ├── gemini_client.py      # Gemini API client
│   │   │   └── character_service.py  # Character state management
│   │   └── core/
│   │       ├── security.py        # JWT and security
│   │       └── dependencies.py
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── alembic/                   # Database migrations
│
├── data/                          # Data files
│   ├── raw/                       # Raw USDA data
│   ├── processed/                 # Processed data
│   └── work_events.json           # Workplace scenario library ⭐
│
└── docs/                          # Documentation
    ├── API.md                     # API documentation
    ├── DATABASE.md                # Database design
    ├── ALGORITHMS.md              # Algorithm explanations
    └── DEPLOYMENT.md              # Deployment guide
```

---

## 🗄️ Database Design

```sql
-- Users table
users:
  id, username, email, password_hash,
  height, weight, age, gender, goal,
  created_at, updated_at

-- Character states table (daily snapshots)
character_states:
  id, user_id, date,
  stamina, energy, nutrition, mood, stress,
  level, experience,
  body_type, emotional_state

-- Meal records
meals:
  id, user_id, datetime, meal_type,
  food_items (JSON),
  total_calories, protein, carbs, fat,
  vitamins_minerals (JSON)

-- Exercise records
exercises:
  id, user_id, datetime,
  exercise_type, duration, intensity,
  calories_burned, met_value

-- Sleep logs
sleep_logs:
  id, user_id, date,
  bedtime, wake_time, duration,
  quality_score

-- Workplace event records ⭐ Core table
work_events:
  id, user_id, datetime,
  event_type, event_description,
  user_choice,
  consequences (JSON),
  character_state_before (JSON),
  character_state_after (JSON)

-- Achievement system
achievements:
  id, user_id, achievement_type,
  title, description, icon,
  unlocked_at

-- AI conversation history
ai_conversations:
  id, user_id,
  user_message, ai_response,
  context (JSON), timestamp
```

---

## 🎯 MVP Development Plan (3 Weeks)

### Week 1: Foundation + Data Tracking
```
Day 1-2: Project Initialization
├─ Frontend and backend project setup
├─ Database design and migrations
├─ Basic authentication system
└─ Development environment configuration

Day 3-4: Data Input Features
├─ Food search and logging (USDA API)
├─ Exercise recording forms
├─ Sleep logging forms
└─ Basic API endpoints

Day 5-7: Health Calculation Engine
├─ Implement health scoring algorithms
├─ Character state calculations
├─ Data persistence
└─ Unit testing
```

### Week 2: Virtual Character + Workplace Scenarios
```
Day 8-10: Character System
├─ Character state display UI
├─ Health attribute visualization (progress bars)
├─ Simple character avatar (emoji/icons)
├─ Real-time state updates

Day 11-14: Workplace Scenario Engine ⭐
├─ Scenario trigger logic
├─ Event library design (10 core scenarios)
├─ User choice and consequence system
├─ Workplace scenario UI interface
└─ Scenario history tracking
```

### Week 3: AI Integration + Optimization & Deployment
```
Day 15-17: AI Assistant
├─ Gemini API integration
├─ Conversation interface
├─ Context management
└─ Personalized responses

Day 18-19: Data Visualization
├─ Health dashboard
├─ Chart displays (Recharts)
├─ Daily/weekly reports
└─ Trend analysis

Day 20-21: Deployment and Testing
├─ Docker configuration
├─ PWA setup
├─ Cloud platform deployment
├─ User testing and bug fixes
└─ Documentation refinement
```

---

## 🎨 Design Style Guide

### Visual Style
```
Theme: Modern, Fresh, Gamified
Color Scheme:
  ├─ Primary: #4CAF50 (Health Green)
  ├─ Secondary: #2196F3 (Energy Blue)
  ├─ Warning: #FF9800 (Caution Orange)
  ├─ Danger: #F44336 (Stress Red)
  └─ Background: #FAFAFA (Light Gray)

Character Avatar:
  ├─ MVP: Emoji combinations (😊💪🏃 etc.)
  ├─ V2: Simplified cartoon illustrations
  └─ V3: Dynamic SVG characters
```

### Interaction Design Principles
```
1. Instant Feedback - Every action has visual/audio response
2. Gamification - Use levels, achievements, animations
3. Emotional Connection - AI uses empathetic language, not cold data
4. Simplified Input - Minimize steps to complete logging
5. Mobile-First - Responsive design
```

---

## 🚀 Deployment Strategy

### Development Environment
```bash
# Clone repository
git clone https://github.com/yourusername/oystraz.git
cd oystraz

# One-click startup with Docker Compose
docker-compose up -d

# Or start frontend and backend separately
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```

### Production Environment
```
Frontend: Vercel
  - Automatic deployment
  - Global CDN
  - PWA support

Backend: Railway / Render
  - Docker deployment
  - Auto-scaling
  - Environment variable management

Database: Supabase
  - PostgreSQL hosting
  - Automatic backups
  - 10GB free tier
```

---

## 📊 Success Metrics

### Product Metrics
```
User Engagement:
├─ DAU (Daily Active Users)
├─ Average daily logging frequency
├─ Workplace scenario trigger rate
└─ AI conversation interaction rate

User Retention:
├─ Day-1 retention > 40%
├─ Day-7 retention > 25%
└─ Day-30 retention > 15%

Feature Usage:
├─ Most popular workplace scenarios
├─ Average character level
└─ Achievement unlock rate
```

### Technical Metrics
```
Performance:
├─ API response time < 200ms
├─ First contentful paint < 2s
└─ PWA score > 90

Reliability:
├─ System uptime > 99%
├─ Error rate < 0.1%
└─ Data accuracy 100%
```

---

## 🤝 Contributing

Welcome contributions for new workplace scenarios, algorithm optimizations, or UI improvements!

### Adding New Workplace Scenarios
```json
// data/work_events.json
{
  "event_id": "boss_unreasonable_demand",
  "title": "Boss Makes Unreasonable Demand",
  "description": "Your boss suddenly demands you work overtime tonight to finish tomorrow's report...",
  "triggers": {
    "stress": [60, 100],
    "time_of_day": "evening"
  },
  "choices": [
    {
      "text": "💥 Refuse directly with explanation",
      "requires": {"mood": 70},
      "consequences": {"stress": -20, "mood": +10, "reputation": -5}
    },
    {
      "text": "😤 Reluctantly agree but feel upset",
      "consequences": {"stress": +15, "mood": -10, "overtime": +3}
    },
    {
      "text": "📱 Pretend phone died, didn't see message",
      "consequences": {"stress": -10, "mood": +5, "reputation": -10}
    }
  ]
}
```

---

## 📝 License

MIT License - Free to use and modify

---

## 🌈 Future Roadmap

### V2.0 Features
```
├─ Multi-character system (different careers: programmer, designer, salesperson)
├─ Social features (friends, challenges, leaderboards)
├─ Richer animation effects
├─ Voice input
├─ Smart band/watch data sync
└─ Multi-language support
```

### V3.0 Vision
```
├─ Native mobile app (React Native)
├─ AR virtual character (ARKit/ARCore)
├─ Community scenario library (user-created scenarios)
├─ AI-generated personalized storylines
└─ Enterprise wellness management edition
```

---

## 📞 Contact

- Project Homepage: [GitHub Repository]
- Issue Reporting: [Issues]
- Discussion Forum: [Discussions]

---

**Make wellness fun, give workplace stress a safe outlet!** 🎮💪😊

**Orchestrate your health. Control your life. The world is your oyster.**
