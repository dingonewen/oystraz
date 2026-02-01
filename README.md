# Oystraz - Life Orchestration Through Health

> **"The world is your oyster; Orchestrate your life through wellness."**
>
> A gamified health tracking and life simulation app where your real-world choices (diet, sleep, exercise) directly influence your virtual character's performance at work and in life.

**Google Gemini 3 Hackathon Project**

---

## 🎮 Project Vision

**Oystraz** merges two powerful metaphors:
- **Oyster** - "The world is your oyster" - life is full of opportunities waiting to be seized
- **Orchestra** - The art of coordinating complex elements into harmonious performance

The core philosophy: **By orchestrating your physical wellness, you gain control over your work and life.**

Oystraz is not just another health tracker - it's a **stress-relief simulator** that gamifies wellness while providing a safe space to express workplace frustrations. Your virtual character mirrors your real health data, and its workplace behavior reflects your physical and mental state.

### Core Principles
- 🍎 **Data-Driven Wellness** - Powered by USDA FoodData Central (600,000+ foods)
- 🏃 **Scientific Activity Tracking** - Accurate calorie expenditure calculations
- 😊 **Emotional Intelligence** - Dynamic workplace scenarios based on health metrics
- 💼 **Work-Life Balance** - Anti-hustle culture, pro-taking-breaks philosophy
- 🤖 **AI Companion (Pearl)** - Gemini-powered assistant with personality and food science expertise

---

## ✅ Current Implementation Status

### Completed Features (MVP Ready)

#### 1. **Health Tracking System** ✅
- ✅ **Diet Logging** - USDA food search (600k+ items), serving size customization, calorie tracking
- ✅ **Exercise Recording** - 13 activity types, 4 intensity levels, automatic calorie burn calculation
- ✅ **Sleep Tracking** - Duration logging, 5-star quality rating, 7-day history

#### 2. **Character System** ✅
- ✅ Character state management (stamina, energy, nutrition, mood, stress)
- ✅ Real-time attribute updates based on health logs
- ✅ Level and experience progression system
- ✅ Body type and emotional state tracking

#### 3. **Work Simulator** ✅
- ✅ Interactive workplace scenario engine
- ✅ Health-based event triggering
- ✅ 4-choice decision system with stat impacts
- ✅ Fallback scenarios for varied gameplay

#### 4. **Data Visualization** ✅
- ✅ Interactive statistics dashboard
- ✅ 7-day and 30-day trend analysis
- ✅ Multiple chart types (area, bar, line, pie)
- ✅ Summary cards (avg calories, exercise, sleep, workouts)
- ✅ Time allocation pie chart (sleep/work/exercise/leisure)

#### 5. **Profile Management** ✅
- ✅ User information editing (height, weight, age, gender, health goals)
- ✅ Form validation and error handling
- ✅ Real-time updates to user store

#### 6. **AI Assistant (Pearl)** ✅
- ✅ Gemini 2.5 Flash integration
- ✅ Contextual health advice
- ✅ Personality-driven responses (humorous, reliable, food-passionate)
- ✅ Conversation history support

#### 7. **Authentication & Security** ✅
- ✅ JWT-based authentication
- ✅ User registration and login
- ✅ Password hashing with bcrypt
- ✅ Protected API routes

---

## 🤖 Meet Pearl - Your AI Health Companion

**Pearl (珍珠)** is not your typical wellness coach. She's a Food Science major who genuinely loves food and has a dry sense of humor.

### Pearl's Personality:
- **Reliable but Chill** - Gives solid, researched advice without the corporate wellness BS
- **Food Enthusiast** - Lights up when discussing nutrition, gets excited about ingredients and food chemistry
- **Witty & Deadpan** - Drops dad jokes and puns naturally, sometimes you're not sure if she's joking
- **Anti-Hustle Culture** - Believes in work-life balance, taking real breaks, and logging off at 5pm
- **Direct Communicator** - No filler words, gets straight to the point in 2-3 sentences

### Example Interactions:
```
User: "I'm so stressed from work"
Pearl: "Your stress is at 80/100. That's not sustainable - unless you're
trying to speedrun burnout. Take a real break, not just scrolling Twitter
for 5 minutes."

User: "Just had some rice for lunch"
Pearl: "Rice! Great choice. White or brown? Fun fact: cooling cooked rice
creates resistant starch - feeds your gut bacteria. Meal prep enthusiasts
figured that out by accident."

User: "Haven't eaten all day"
Pearl: "Can't run on empty. Your body's not a startup that runs on vibes
and cold brew. What's the fastest thing you can grab right now?"
```

---

## 🏗️ Technical Architecture

### Technology Stack

#### Frontend
```
├─ React 19 + TypeScript
├─ Material-UI v6 (MUI)
├─ State Management: Zustand
├─ Routing: React Router v7
├─ Charts: Recharts
├─ Build Tool: Vite
└─ Icons: @mui/icons-material
```

#### Backend
```
├─ FastAPI (Python 3.11+)
├─ Database: PostgreSQL
├─ ORM: SQLAlchemy 2.0
├─ Authentication: JWT (python-jose)
├─ Password Hashing: passlib with bcrypt
└─ API Docs: Auto-generated (FastAPI/Swagger)
```

#### AI & Data Sources
```
├─ Google Gemini 2.5 Flash (chat & advice)
├─ USDA FoodData Central API (nutritional database)
├─ Custom calorie calculation algorithms
└─ Food science-based nutrition parsing
```

### Project Structure (Actual)

```
oystraz/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Track/
│   │   │   │   ├── DietLog.tsx       # USDA food search & logging
│   │   │   │   ├── ExerciseLog.tsx   # Exercise tracking
│   │   │   │   └── SleepLog.tsx      # Sleep tracking
│   │   │   └── Work/
│   │   │       └── WorkScenario.tsx  # Workplace simulator
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Character dashboard
│   │   │   ├── Track.tsx             # Health tracking hub
│   │   │   ├── Work.tsx              # Work simulation
│   │   │   ├── Stats.tsx             # Data visualization ⭐
│   │   │   └── Profile.tsx           # User settings
│   │   ├── services/
│   │   │   ├── api.ts                # Axios client
│   │   │   ├── authService.ts        # Auth APIs
│   │   │   ├── characterService.ts   # Character APIs
│   │   │   ├── healthService.ts      # Health tracking APIs
│   │   │   ├── aiService.ts          # Pearl chat API
│   │   │   └── pearlService.ts       # Pearl helpers
│   │   ├── store/
│   │   │   ├── userStore.ts          # User state
│   │   │   └── characterStore.ts     # Character state
│   │   └── types/
│   │       └── index.ts              # TypeScript definitions
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry
│   │   ├── config.py                 # Environment config
│   │   ├── database.py               # DB connection
│   │   ├── models/                   # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── character.py
│   │   │   ├── diet_log.py
│   │   │   ├── exercise_log.py
│   │   │   └── sleep_log.py
│   │   ├── schemas/                  # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── character.py
│   │   │   ├── diet.py
│   │   │   ├── exercise.py
│   │   │   └── sleep.py
│   │   ├── routers/                  # API routes
│   │   │   ├── auth.py               # Register/login
│   │   │   ├── user.py               # User management
│   │   │   ├── character.py          # Character endpoints
│   │   │   ├── diet.py               # Diet logging
│   │   │   ├── exercise.py           # Exercise logging
│   │   │   ├── sleep.py              # Sleep logging
│   │   │   └── assistant.py          # Pearl chat & USDA search ⭐
│   │   └── services/
│   │       ├── auth.py               # JWT logic
│   │       ├── gemini.py             # Gemini API client ⭐
│   │       └── usda.py               # USDA API client ⭐
│   └── requirements.txt
│
└── README.md
```

### System Flow

```
┌─────────────────────────────────────────────────┐
│              User Interface (React)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Track   │  │   Work   │  │  Stats   │      │
│  │ (Health) │  │ (Simulate│  │(Visualize│      │
│  └──────────┘  └──────────┘  └──────────┘      │
└───────────────────┬─────────────────────────────┘
                    │ HTTP/REST
                    ▼
┌─────────────────────────────────────────────────┐
│           FastAPI Backend (Python)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Auth   │  │ Character│  │   AI     │      │
│  │  Routes  │  │  Routes  │  │ Assistant│      │
│  └──────────┘  └──────────┘  └──────────┘      │
└───────┬─────────────┬───────────────┬───────────┘
        │             │               │
        ▼             ▼               ▼
┌──────────┐  ┌──────────┐  ┌──────────────────┐
│PostgreSQL│  │  Gemini  │  │  USDA FoodData   │
│ Database │  │   API    │  │  Central API     │
└──────────┘  └──────────┘  └──────────────────┘
```

---

## 📊 Database Schema

```sql
-- Users
users:
  id, username, email, hashed_password,
  full_name, age, gender, height, weight, goal,
  created_at, updated_at

-- Characters (one per user)
characters:
  id, user_id,
  stamina, energy, nutrition, mood, stress,
  level, experience,
  body_type, emotional_state,
  created_at, updated_at

-- Diet Logs
diet_logs:
  id, user_id,
  food_name, meal_type,
  calories, protein, carbs, fat, fiber,
  serving_size, serving_unit,
  notes, logged_at

-- Exercise Logs
exercise_logs:
  id, user_id,
  activity_name, activity_type,
  duration_minutes, intensity,
  calories_burned, distance, distance_unit,
  heart_rate_avg, steps,
  notes, logged_at

-- Sleep Logs
sleep_logs:
  id, user_id,
  sleep_start, sleep_end, duration_hours,
  quality, quality_score,
  deep_sleep_minutes, light_sleep_minutes,
  rem_sleep_minutes, awake_minutes,
  interruptions, notes, logged_at
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

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

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🎨 Key Features Showcase

### 1. USDA Food Search
- 600,000+ food items from USDA FoodData Central
- Real-time search with calorie preview
- Smart deduplication and formatting
- Brand name cleaning (removes Inc, LLC, etc.)

### 2. Interactive Stats Dashboard
- 4 summary cards with key metrics
- Time allocation pie chart (24-hour breakdown)
- Calorie intake area chart
- Exercise bar chart
- Sleep duration & quality dual-axis chart
- Net calories comparison

### 3. Workplace Scenarios
- Dynamic events based on character health
- 4 choices per scenario with stat impacts
- Leveling and experience system
- Fallback scenarios for variety

### 4. Pearl AI Chat
- Context-aware responses
- Food science expertise
- Dry humor and puns
- Gets excited about food discussions
- Anti-hustle culture advice

---

## 🔮 Future Development Roadmap

### Phase 1: Mobile Optimization & Visual Polish (In Progress)
```
📱 Responsive Design
├─ Optimize all pages for mobile screens
├─ Touch-friendly button sizes
├─ Mobile navigation improvements
└─ Ensure charts are readable on small screens

🎨 Visual Enhancement ✅ (Mostly Complete)
├─ ✅ Ocean work simulator with pixel art assets
├─ ✅ Seal employee character with chase mechanics
├─ ✅ Octopus boss with mood states (normal/angry)
├─ ✅ Rich ocean environment (fish, rocks, seaweed, bubbles)
├─ ✅ Animated character movements and swimming fish
├─ 🚧 Additional character states for other pages
└─ ✅ Unified ocean/blue color palette
```

### Phase 2: Enhanced Features
```
🎮 Gamification Improvements
├─ Achievement system
├─ Daily/weekly challenges
├─ Streak tracking
├─ Unlockable character accessories
└─ Leaderboards (optional social)

📊 Advanced Analytics
├─ Weight tracking over time
├─ BMI calculator and trends
├─ Macro balance analysis
├─ Correlation insights (sleep vs mood, etc.)
└─ Weekly/monthly reports

🍔 Enhanced Food Logging
├─ Recent foods quick-add
├─ Favorite foods list
├─ Meal templates (breakfast combos)
├─ Photo recognition (Gemini Vision)
└─ Barcode scanner
```

### Phase 3: Mobile App Deployment
```
📱 Cross-Platform App
├─ Capacitor/Ionic integration
├─ iOS App Store deployment
├─ Google Play Store deployment
├─ Push notifications
├─ Offline mode with sync
└─ Native device features (camera, health data)

🔄 Data Sync & Integration
├─ Apple Health integration
├─ Google Fit integration
├─ Fitbit/smartwatch sync
├─ Cloud backup
└─ Multi-device sync
```

### Phase 4: Community & Social
```
👥 Social Features
├─ Friend system
├─ Share progress/achievements
├─ Group challenges
├─ Community scenario library (user-created)
└─ Support/accountability partners

🎭 Expanded Work Scenarios
├─ Multiple career paths (programmer, designer, etc.)
├─ Branching storylines
├─ Long-term consequences
├─ Career progression system
└─ AI-generated personalized scenarios
```

### Phase 5: Advanced AI Features
```
🤖 Enhanced Pearl
├─ Voice chat support
├─ Proactive check-ins
├─ Trend prediction and warnings
├─ Personalized meal planning
├─ Recipe suggestions based on preferences
└─ Workout routine generation

🧠 Smart Insights
├─ Pattern recognition (e.g., "You sleep poorly after late dinners")
├─ Predictive mood tracking
├─ Optimal timing suggestions
└─ Personalized goal recommendations
```

---

## 🎯 Design Philosophy

### User Experience Principles
1. **No Guilt Trips** - Focus on progress, not perfection
2. **Make It Easy** - Minimize steps to log activities
3. **Make It Fun** - Gamification without feeling childish
4. **Be Honest** - Pearl tells it like it is, no sugar-coating
5. **Respect Boundaries** - Anti-hustle, pro-rest mentality

### Visual Design Goals
- **Minimalist** - Clean, uncluttered interface
- **Playful** - Stickman character, ocean theme, light animations
- **Data-Rich** - Charts and stats without overwhelming
- **Mobile-First** - Designed for on-the-go logging
- **Accessible** - High contrast, readable fonts, clear icons

### Ocean Work Simulator Theme (Implemented)
```
🦭 Seal Employee in Ocean Workplace:
├─ Fishing hook hanging from above = work assignments
├─ Seal chases fish across screen = completing tasks
├─ Multiple swimming fish = ambient ocean life
├─ Octopus boss assigns work and can be pranked
├─ Character's health affects work performance:
│   ├─ High energy = faster chase speed (higher intensity)
│   ├─ Low energy = slower work, more fatigue
│   ├─ High stress = need for stress relief (prank boss)
│   └─ Work hours/intensity affects stamina and stress
└─ Rich ocean environment with rocks, seaweed, bubbles

🎨 Visual Assets:
├─ Environment: Kenney Fish Pack (rocks, seaweed, fish, bubbles)
├─ Characters: Google Nano Banana Pro 2 generated (seal, octopus)
└─ Logo: Custom designed with AI assistance
```

---

## 💡 Innovation Highlights

### What Makes Oystraz Different?

1. **Health → Work Performance Link**
   - Unlike fitness apps that just track data, Oystraz shows the *consequences* of your health choices through workplace simulation
   - Makes abstract health metrics concrete and relatable

2. **Stress Relief Through Simulation**
   - Safe outlet for workplace frustrations
   - Cathartic "confront boss" or "take nap at work" options
   - Reduces real-world stress by gamifying it

3. **Food Science-Backed AI**
   - Pearl has actual food science knowledge, not generic wellness advice
   - Gets genuinely excited about nutrition, making learning fun
   - Combines humor with expertise

4. **Anti-Productivity Culture**
   - Refreshing stance against hustle culture
   - Encourages real breaks, work-life balance
   - Validates rest as productive

5. **Comprehensive USDA Integration**
   - 600,000+ foods with accurate nutrition data
   - Smart search with deduplication
   - Scientific accuracy for calorie tracking

---

## 🤝 Contributing

Contributions welcome! Especially interested in:
- New workplace scenario ideas
- Food science facts for Pearl
- UI/UX improvements
- Mobile optimization suggestions

---

## 📝 License

MIT License - Free to use and modify

---

## 🌟 Acknowledgments

- **USDA FoodData Central** - Nutritional database
- **Google Gemini 2.5 Flash** - AI capabilities for Pearl assistant
- **Google Nano Banana Pro 2** - AI-generated character assets (seal, octopus, logo)
- **Kenney Fish Pack** - Ocean environment assets (fish, rocks, seaweed, bubbles, terrain)
- **Material-UI** - React component library
- **Recharts** - Data visualization

---

## 📞 Contact

- GitHub: [Your Repository]
- Issues: [Report Bugs/Request Features]

---

**Make wellness fun. Give workplace stress a safe outlet. The world is your oyster.** 🎮💪🦪

**Built for the Google Gemini 3 Hackathon** ✨
