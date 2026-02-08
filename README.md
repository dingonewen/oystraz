<p align="center">
  <img src="frontend/public/assets/logo.png" alt="Oystraz Logo" width="200"/>
</p>

<h1 align="center">Oystraz - Life Orchestration Through Health</h1>

<p align="center">
  <strong>"The world is your oyster; Orchestrate your life through wellness."</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Google%20Gemini-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini Powered"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License"/>
</p>

<p align="center">
  A gamified health tracking and life simulation app where your real-world choices (diet, sleep, exercise) directly influence your virtual character's performance at work and in life.
</p>

---

## Feature Highlights

| Feature | Powered By | Why It Matters |
|---------|-----------|----------------|
| **Pearl AI Companion** | Gemini 2.0 Flash | Personalized, witty health coaching with food science expertise and anti-hustle philosophy |
| **Ocean Work Simulator** | Dynamic Health Logic | Correlates real-world health with virtual work performance - catch fish, prank your boss! |
| **Nutritional Intelligence** | USDA FoodData API | Access to 600k+ food records for 100% data-driven tracking |
| **Smart Health Metrics** | Custom Algorithms | Sleep, exercise, and work intensity affect your character in realistic ways |
| **24h Daily Limit** | Backend Validation | Realistic time constraints - sleep + exercise + work can't exceed 24 hours |
| **Neo-Soul BGM** | Custom Audio | Relaxing background music that plays after login - mute option in sidebar |
| **Prank Video** | Animation | Fun seal-pokes-octopus video plays for overtime work or manual prank |

---

## Why Gemini?

This project leverages **Google Gemini 2.0 Flash** for its core AI functionality, specifically chosen for:

### 1. Long Context Memory
Pearl, our AI health companion, maintains conversational context to provide personalized advice based on your health history. Gemini's extended context window allows Pearl to remember your past conversations and health trends.

### 2. Advanced Reasoning for Health Insights
Gemini's reasoning capabilities enable Pearl to:
- Analyze complex USDA nutritional data and explain it in plain English
- Generate personalized workplace coping strategies based on your current stress/energy levels
- Provide food science-backed advice that connects your diet to how you feel

### 3. Personality-Driven Prompt Engineering
We extensively used **System Instructions** to create Pearl's unique personality:
- **Anti-hustle culture advocate** - Work-life balance is sacred
- **Food science enthusiast** - Gets genuinely excited about nutrition
- **Dry humor** - Drops dad jokes and puns naturally
- **Direct communicator** - No wellness BS, just practical advice

```python
# Example: Pearl's System Instruction (excerpt)
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

## Project Vision

**Oystraz** merges two powerful metaphors:
- **Oyster** - "The world is your oyster" - life is full of opportunities
- **Orchestra** - Coordinating complex elements into harmony

**Core philosophy: By orchestrating your physical wellness, you gain control over your work and life.**

---

## Health Metrics System

**IMPORTANT:** Metrics ONLY change when you LOG activities. Your character won't decay if you don't use the app!

**Daily Limit:** Sleep + Exercise + Work cannot exceed 24 hours per day.

### Default Values (New Users)
| Metric | Default | Description |
|--------|---------|-------------|
| Stamina | 80 | Physical endurance |
| Energy | 80 | Daily energy level |
| Nutrition | 60 | Diet quality (starts lower to encourage logging) |
| Mood | 60 | Composite emotional state |
| Stress | 40 | Stress level (lower is better) |

### Stamina (0-100)
Physical endurance - **WORK AND EXERCISE COST STAMINA! YOGA RESTORES IT!**

| Action | Effect |
|--------|--------|
| **Yoga** | **+10 per hour** (recovery exercise!) |
| Other Exercise | **-3 per hour** (tiring but good for stress) |
| Sleep 9+ hours | **+25** (MAJOR recovery) |
| Sleep 8+ hours | +20 |
| Sleep 7+ hours | +15 |
| Sleep 6+ hours | +5 |
| Sleep <5 hours | -10 |
| Work | **-3 per hour** |
| Overwork (>8h) | Extra **-5 per overtime hour** |

### Energy (0-100)
Daily energy for activities.

| Action | Effect |
|--------|--------|
| Caloric surplus | +1 per 100 kcal (max +15) |
| Caloric deficit | -1 per 100 kcal (max -15) |
| Sleep 8+ hours | **+20** (big boost!) |
| Sleep 7+ hours | +15 |
| Sleep 6+ hours | +5 |
| Sleep <5 hours | -10 |
| Work | -(hours × intensity × 0.3) |

### Nutrition (0-100)
Calculated from daily diet quality.

| Component | Target | Max Score |
|-----------|--------|-----------|
| Protein | 50g/day | 33.3 |
| Fiber | 25g/day | 33.3 |
| Fat | ≤65g/day | 33.3 |

**Formula:** `nutrition = protein_score + fiber_score + fat_score`

### Mood (0-100)
Composite emotional state.

**Formula:** `mood = (stamina + energy + nutrition) / 3 - stress / 2`

**Key insight:** Good nutrition + good sleep + exercise = happy character!

### Stress (0-100)
Lower is better!

| Action | Effect |
|--------|--------|
| Work | +(hours × intensity × 0.5) |
| Overwork (>8h) | +5 per extra hour |
| Exercise | -1 per 5 minutes (max -15) |
| Sleep 9+ hours | **-20** (MAJOR relief!) |
| Sleep 8+ hours | -15 |
| Sleep 7+ hours | -10 |
| Sleep 6+ hours | -5 |
| Sleep <5 hours | +5 |
| Prank octopus boss | -20 |

### Recovery Tips
- **SLEEP IS POWERFUL!** 8-9 hours gives major stamina/energy boost and stress relief
- **YOGA RESTORES STAMINA!** +10 per hour - perfect recovery exercise
- **Other exercise** costs stamina (-3/h) but reduces stress - trade-off!
- **Lower work intensity** is more sustainable than high intensity
- **Balanced diet** with protein and fiber keeps nutrition high
- **In the Work game**, catch 24+ fish to auto-prank the boss!
- **Work overtime (>8h)?** Get rewarded with a fun prank video!

### Level & Experience System

| Action | XP Gained |
|--------|-----------|
| Log diet | +10 |
| Log exercise | +15 |
| Log sleep | +10 |
| Work session | +(hours × intensity × 10) |
| Nutrition ≥80 | +20 |
| Prank boss | +50 |

**Level Up:** XP needed = current_level × 100

### Character Emotional States

| State | Condition |
|-------|-----------|
| Happy | mood ≥ 80 AND stress < 30 |
| Tired | mood < 40 OR energy < 30 |
| Stressed | stress ≥ 70 |
| Angry | stress ≥ 85 |
| Normal | Default state |

---

## Meet Pearl - Your AI Health Companion

**Pearl (珍珠)** is not your typical wellness coach. She's a Food Science major with dry humor and zero tolerance for hustle culture BS.

### Pearl's Personality
- **Reliable but Chill** - Solid advice without corporate wellness fluff
- **Food Enthusiast** - Gets excited about ingredients and food chemistry
- **Witty & Deadpan** - Dad jokes and puns, sometimes you're not sure if she's joking
- **Anti-Hustle** - Believes in work-life balance and real breaks
- **Direct** - 2-3 sentences, no filler words

### Example Interactions
```
User: "I'm so stressed from work"
Pearl: "Your stress is at 80/100. That's not sustainable - unless you're
trying to speedrun burnout. Take a real break, not just scrolling Twitter."

User: "Just had some rice for lunch"
Pearl: "Rice! Great choice. White or brown? Fun fact: cooling cooked rice
creates resistant starch - feeds your gut bacteria."

User: "How do I decrease my stress?"
Pearl: "Your stress is at 65/100. Here's what works: sleep 8+ hours (-15 stress),
exercise for 30 mins (-6 stress), or catch 24 fish in Work to prank your boss (-20)."
```

---

## Technical Architecture

### Technology Stack

**Frontend**
- React 19 + TypeScript
- Material-UI v6 (MUI)
- Zustand (State Management)
- React Router v7
- Recharts (Data Visualization)
- Framer Motion (Animations)
- Vite (Build Tool)

**Backend**
- FastAPI (Python 3.11+)
- PostgreSQL
- SQLAlchemy 2.0 (ORM)
- JWT Authentication (python-jose)
- bcrypt (Password Hashing)

**AI & Data**
- **Google Gemini 2.0 Flash** (Pearl AI)
- USDA FoodData Central API (600k+ foods)
- Custom health calculation algorithms

### System Architecture

```
┌─────────────────────────────────────────────────┐
│              User Interface (React)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Track   │  │   Work   │  │  Stats   │      │
│  │ (Health) │  │(Simulate)│  │(Visualize│      │
│  └──────────┘  └──────────┘  └──────────┘      │
└───────────────────┬─────────────────────────────┘
                    │ HTTP/REST
                    ▼
┌─────────────────────────────────────────────────┐
│           FastAPI Backend (Python)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Auth   │  │ Character│  │  Pearl   │      │
│  │  Routes  │  │  Routes  │  │ (Gemini) │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└───────┬─────────────┬───────────────┬───────────┘
        │             │               │
        ▼             ▼               ▼
┌──────────┐  ┌──────────┐  ┌──────────────────┐
│PostgreSQL│  │  Gemini  │  │  USDA FoodData   │
│ Database │  │ 2.0 Flash│  │  Central API     │
└──────────┘  └──────────┘  └──────────────────┘
```

### Scalability

- **FastAPI** - High-performance async Python framework, production-ready
- **PostgreSQL** - Enterprise-grade database with connection pooling
- **Stateless Backend** - Horizontally scalable API design
- **JWT Auth** - No server-side session storage required

---

## Quick Start

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

## Ocean Work Simulator

A unique stress-relief game where you play as a seal employee!

### Gameplay
- **Catch fish** = Complete work tasks
- **Multiple hooks** = Different work priorities
- **Octopus boss** = Your manager (can be pranked!)
- **Work intensity** = How much stamina you spend
- **Prank button** = Click to trigger prank video animation!
- **Overtime (>8h)** = Auto-prank video plays after catching all fish

### Health Connection
- High energy = Faster catch speed
- Low energy = Slower work
- High stress = Time to prank the boss!
- Catch 24+ fish = Auto-prank for stress relief
- Work and exercise cost stamina - **Yoga restores it!**

---

## Innovation Highlights

1. **Health → Work Performance Link** - Shows consequences of health choices through simulation
2. **Stress Relief Through Play** - Safe outlet for workplace frustrations
3. **Food Science-Backed AI** - Pearl has real nutritional knowledge
4. **Anti-Productivity Culture** - Encourages rest and work-life balance
5. **USDA Integration** - 600k+ foods with accurate data

---

## Future Roadmap

### Phase 1: Polish (Current)
- Mobile optimization
- Additional character states
- Performance improvements

### Phase 2: Enhanced Features
- Achievement system
- Daily/weekly challenges
- Advanced analytics

### Phase 3: Mobile App
- iOS/Android deployment
- Push notifications
- Health app integrations

### Phase 4: Social
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

## Acknowledgments

- **USDA FoodData Central** - Nutritional database
- **Google Gemini 2.0 Flash** - AI capabilities for Pearl
- **Google Nano Banana Pro 2** - AI-generated character assets
- **Kenney Fish Pack** - Ocean environment assets
- **Material-UI** - React components
- **Recharts** - Data visualization

---

## Contact

- GitHub: [github.com/dingonewen](https://github.com/dingonewen)
- Email: dingywn@seas.upenn.edu

---

<p align="center">
  <strong>Make wellness fun. Give workplace stress a safe outlet. The world is your oyster.</strong>
</p>

<p align="center">
  <em>Built for the Google Gemini Hackathon</em>
</p>
