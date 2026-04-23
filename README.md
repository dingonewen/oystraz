<p align="center">
  <img src="frontend/public/assets/oystraz_final_logo.png" alt="Oystraz Logo" width="180"/>
</p>

<h1 align="center">Oystraz</h1>

<p align="center">
  <em>Life orchestration through health — where real-world choices power a virtual character.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Google%20Gemini%202.0-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white"/>
</p>

---

## Live Demo

**[https://oystraz.vercel.app](https://oystraz.vercel.app)** — No download required. Installable as a PWA on any device.

- **iPhone:** Safari → Share → "Add to Home Screen"
- **Android:** Chrome → "Install Oystraz"

**Demo account:**

| Field | Value |
|-------|-------|
| Email | `demo@oystraz.com` |
| Password | `demo123` |

**Judge account:**

| Field | Value |
|-------|-------|
| Email | `judges@oystraz.com` |
| Username | `oystrazjudge` |
| Password | `oystraz2026` |

---

## Demo Video

[![Oystraz Demo](https://img.youtube.com/vi/DRbhOWUHf2o/maxresdefault.jpg)](https://youtu.be/DRbhOWUHf2o)

[https://youtu.be/DRbhOWUHf2o](https://youtu.be/DRbhOWUHf2o)

| Component | Tool |
|-----------|------|
| Test Device | Google Pixel 7 |
| Background Music | Suno AI |
| Video Assets | Google Veo 3.1 |
| Character Images | Nano Banana Pro |

---

## Problem Statement

Traditional health apps feel like another obligation. People know they should eat better, sleep more, and exercise — but knowing isn't enough. At the same time, hustle culture has normalized burnout as a productivity strategy.

Oystraz approaches this differently:

1. **Gamification with real stakes** — your actual sleep, diet, and exercise directly affect your character's stats
2. **A safe stress outlet** — prank your virtual octopus boss instead of your real one
3. **Anti-hustle philosophy** — Pearl, the AI companion, actively discourages overwork
4. **Intrinsic motivation** — ocean theme, pixel art, and a personality-driven AI make tracking feel worth doing

---

## Google Products

| Product | Usage |
|---------|-------|
| **Gemini 2.0 Flash** | Powers Pearl — AI health companion with personality-driven responses, food science knowledge, and personalized coaching |
| **Google Veo 3.1** | Generated the "Seal Pranks Octopus" animation that plays during overtime/stress relief events |
| **Google AI Studio** | Prompt engineering and development assistance |

### Why Gemini 2.0 Flash?

- **Extended context** — Pearl retains health history across the conversation
- **Advanced reasoning** — analyzes USDA nutritional data and produces personalized insights
- **Personality engineering** — system instructions define Pearl's dry humor, food enthusiasm, and anti-hustle stance

```python
# Pearl's system instruction (excerpt)
"""You are Pearl, a Food Science major who lives inside the Oystraz app.
- Anti-hustle culture. Working smart, not grinding yourself into dust.
- Work-life balance is sacred. Taking breaks is normal, not lazy.
- Dry humor and dad jokes, dropped casually without announcing.
- PASSIONATE about food. Light up when discussing nutrition.
- Direct and concise. No filler words. 2-3 sentences max."""
```

---

## Features

| Feature | Description | Powered By |
|---------|-------------|------------|
| **Pearl AI Companion** | Personalized health coaching with anti-hustle philosophy and dry wit | Gemini 2.0 Flash |
| **Ocean Work Simulator** | Play as a seal employee — catch fish, manage workload, prank the octopus boss | Custom game engine |
| **Nutritional Intelligence** | Search 600k+ foods with detailed macro and micronutrient data | USDA FoodData API |
| **Character Evolution** | Diet, sleep, and exercise directly update character stats in real time | Health algorithms |
| **Stress Relief Mechanics** | Boss prank reduces stress — with a Veo-generated video reward | Google Veo 3.1 |
| **Sleep Quality Ratings** | Tech-themed ratings from "High Latency" to "Offline Perfection" | Custom UI |
| **Neo-Soul BGM** | Relaxing deep-sea exploration soundtrack | Suno AI |

---

## Innovation Highlights

**Health → Work performance link**
Your real sleep quality affects how fast your seal catches fish. Low energy means slower movement; high stress unlocks the prank button.

**Anti-productivity mechanics**
Pearl discourages overwork. Working beyond 8 hours triggers an overtime alert and prank video. Rest is rewarded — not penalized.

**Food science-backed AI**
Pearl draws on USDA nutritional data and genuinely engages with food topics — resistant starch, fiber targets, protein timing — not just generic advice.

**Gamified stress relief**
Virtual boss pranking provides a safe outlet for workplace frustration. Catch 24+ fish and the prank triggers automatically; stress drops by 20 points.

**Emotional character states**
The character reflects real health metrics: Happy, Tired, Stressed, Angry, or Normal. Hovering triggers Pearl commentary in a parental tough-love tone.

---

## Technical Architecture

### Stack

**Frontend**
- React 19 + TypeScript + Vite
- Material-UI v6
- Zustand (state management)
- Framer Motion (animations)
- Recharts (data visualization)

**Backend**
- FastAPI (Python 3.11+)
- PostgreSQL on Supabase
- SQLAlchemy 2.0 ORM
- JWT authentication
- Deployed on Railway

**AI & External APIs**
- Google Gemini 2.0 Flash
- USDA FoodData Central API (600k+ foods)

**Infrastructure**
- Frontend: Vercel (auto-deploy from main branch)
- Backend: Railway
- PWA: Vite PWA Plugin with service worker
- Static assets: Cloudinary CDN

**Creative Assets**
- Google Veo 3.1 — prank video animation
- Suno AI — neo-soul BGM
- Nano Banana Pro — character art and logo
- Kenney Fish Pack — ocean environment assets

### System Diagram

```
┌─────────────────────────────────────────────────────┐
│              User Interface (React 19)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Track   │  │   Work   │  │  Stats   │  Pearl   │
│  │ (Health) │  │(Simulate)│  │(Visualize│  (Chat)  │
│  └──────────┘  └──────────┘  └──────────┘          │
└───────────────────┬─────────────────────────────────┘
                    │ HTTPS / REST
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

### Core Stats (0–100)

| Stat | Description | Key Influences |
|------|-------------|----------------|
| **Stamina** | Physical endurance | Sleep (+25 for 9h), exercise (+1.5/10 min), overwork (-5/extra hour) |
| **Energy** | Daily energy level | Caloric balance, sleep quality |
| **Nutrition** | Diet quality | Protein, fiber, and fat balance via USDA data |
| **Mood** | Emotional state | Composite of stamina, energy, nutrition, and stress |
| **Stress** | Lower is better | Work (+), exercise (−), sleep (−), boss prank (−20) |

### Character Emotional States

| State | Trigger |
|-------|---------|
| Happy | mood ≥ 80 and stress < 30 |
| Tired | mood < 40 or energy < 30 |
| Stressed | stress ≥ 70 |
| Angry | stress ≥ 85 |
| Normal | default |

### Sleep Quality Ratings

| Rating | Score |
|--------|-------|
| High Latency | 1 |
| Weak Connection | 2 |
| Optimized Standby | 3 |
| Fully Encrypted | 4 |
| Offline Perfection | 5 |

---

## Pearl — AI Health Companion

Pearl is a Food Science major with dry humor and zero tolerance for hustle culture. She's direct, food-obsessed, and genuinely invested in your wellbeing — without the guilt trips.

**Personality**
- Anti-hustle advocate — believes rest is productive, not lazy
- Food science enthusiast — lights up over macros, fermentation, and resistant starch
- Dry humor — dad jokes dropped without fanfare
- Direct communicator — 2–3 sentences, no filler

**Example interactions**

```
User: "I'm so stressed from work"
Pearl: "Your stress is at 80/100. That's not sustainable — unless you're
trying to speedrun burnout. Take a real break, not just scrolling Twitter."

User: "Just had some rice for lunch"
Pearl: "Rice! Fun fact: cooling cooked rice creates resistant starch —
feeds your gut bacteria. White or brown?"

User: "How do I decrease my stress?"
Pearl: "Options: sleep 8+ hours (−15), exercise 30 min (−6), or catch 24
fish in Work to auto-prank the boss (−20). Your call."
```

---

## Ocean Work Simulator

A stress-relief game where you play as a seal employee in an underwater office.

**Gameplay**
- Catch fish = complete work tasks
- Multiple hooks = parallel work priorities
- Work intensity slider = stamina and energy cost
- Octopus boss = your manager (can be pranked)

**Prank triggers**
1. Manual button — available when stress ≥ 30
2. 24+ fish caught — auto-prank for overwork detection
3. Overtime (>8h) — Veo video plays on completion

**Health connections**
- High energy → faster catch speed
- Low stamina → slower movement
- High stress → prank button enabled

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+ (or a Supabase account)

### Environment Variables

**Backend (`backend/.env`):**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/oystraz
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
USDA_API_KEY=your-usda-api-key
```

**Frontend (`frontend/.env`):**
```bash
VITE_API_URL=http://localhost:8000/api

# Optional: serve BGM from CDN instead of bundling it
VITE_BGM_URL=https://res.cloudinary.com/your-cloud-name/video/upload/oystraz_neosoul_bgm.mp3
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

## Deployment

| Service | URL |
|---------|-----|
| Frontend (PWA) | https://oystraz.vercel.app |
| Backend API | https://oystraz-production.up.railway.app |

- Auto-deployment on push to `main` via Vercel
- CORS configured with regex to support all Vercel preview deployments
- Database: Supabase PostgreSQL with connection pooling
- Static assets: Cloudinary CDN

---

## Roadmap

**Phase 1 — Complete**
- Production deployment (Railway + Vercel)
- PWA with offline capability
- Mobile-responsive design
- CDN integration

**Phase 2 — Planned**
- Achievement system
- Daily and weekly challenges
- Advanced analytics dashboard

**Phase 3 — Future**
- iOS App Store release
- Push notifications
- Apple Health integration

**Phase 4 — Future**
- Friend system
- Group challenges
- Community scenarios

---

## Design Philosophy

- **No guilt trips** — focus on progress, not perfection
- **Low friction** — minimize steps to log activities
- **Fun without being childish** — gamification that respects the user
- **Honesty** — Pearl tells it like it is
- **Rest is valid** — anti-hustle, pro-recovery

---

## Credits

| Component | Tool / Service |
|-----------|----------------|
| AI Companion | Google Gemini 2.0 Flash |
| Prank Video | Google Veo 3.1 |
| Development Assistance | Google AI Studio, Claude Code |
| Database | PostgreSQL on Supabase |
| Background Music | Suno AI |
| Characters & Logo | Nano Banana Pro |
| Ocean Assets | Kenney Fish Pack |
| UI Components | Material-UI, Recharts |

---

## Contact

- **GitHub:** [github.com/dingonewen](https://github.com/dingonewen)
- **Email:** dingywn@seas.upenn.edu

---

<p align="center">
  <em>The world is your oyster. Orchestrate your life through wellness.</em>
</p>
