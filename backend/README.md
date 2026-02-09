# Oystraz Backend API

FastAPI backend for the Oystraz gamified health tracking application with Google Gemini AI integration.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance async web framework |
| **Python 3.11+** | Runtime |
| **PostgreSQL** | Database (hosted on **Supabase**) |
| **SQLAlchemy 2.0** | ORM |
| **JWT + bcrypt** | Authentication |
| **Google Gemini 2.0 Flash** | Pearl AI companion |
| **USDA FoodData API** | Nutrition database (600k+ foods) |

## Quick Start

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run server (auto-creates tables)
uvicorn app.main:app --reload --port 8000
```

### Required Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/oystraz
SECRET_KEY=<generate with: openssl rand -hex 32>
GEMINI_API_KEY=<from Google AI Studio>
USDA_API_KEY=<from USDA FoodData Central>
```

## Project Structure

```
app/
├── models/           # SQLAlchemy models
│   ├── user.py
│   ├── character.py
│   ├── diet_log.py
│   ├── exercise_log.py
│   ├── sleep_log.py
│   └── work_log.py   # Includes pranked_boss tracking
├── routers/          # API endpoints
│   ├── auth.py       # Register/Login (JWT)
│   ├── user.py       # Profile management
│   ├── character.py  # Character stats & state
│   ├── diet.py       # Diet logging
│   ├── exercise.py   # Exercise logging
│   ├── sleep.py      # Sleep logging
│   ├── work.py       # Work sessions & prank tracking
│   └── assistant.py  # Gemini AI & USDA integration
├── schemas/          # Pydantic request/response models
├── services/
│   ├── auth.py       # JWT & password utilities
│   ├── gemini.py     # Gemini 2.0 Flash integration
│   └── usda.py       # USDA API client
├── config.py         # Settings
├── database.py       # DB connection
└── main.py           # FastAPI app entry
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT token |

### Character
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/character` | Get character stats |
| PUT | `/api/character` | Update character |

### Health Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/diet` | Log meal |
| GET | `/api/diet` | Get diet logs |
| POST | `/api/exercise` | Log exercise |
| GET | `/api/exercise` | Get exercise logs |
| POST | `/api/sleep` | Log sleep |
| GET | `/api/sleep` | Get sleep logs |

### Work Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/work/log` | Log work session |
| GET | `/api/work/logs` | Get work history |
| GET | `/api/work/stats` | Get stats (hours, pranks) |
| DELETE | `/api/work/{id}` | Delete work log |

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assistant/advice` | Get Pearl health advice |
| POST | `/api/assistant/food-search` | Search USDA foods |
| GET | `/api/assistant/food/{fdc_id}` | Get food nutrition |

## Health Calculation Logic

### Character Stats Update (on activity log)

```python
# Sleep effects
if duration >= 9: stamina += 25, stress -= 20
elif duration >= 8: stamina += 20, stress -= 15
elif duration >= 7: stamina += 15, stress -= 10
elif duration < 5: stamina -= 10, stress += 5

# Work effects
stress += hours * intensity * 0.5
energy -= hours * intensity * 0.3
stamina -= hours * 3
if hours > 8:  # Overtime penalty
    stamina -= (hours - 8) * 5

# Exercise effects
stress -= minutes / 5  # Max -15
if exercise_type == 'yoga':
    stamina += 10 * hours  # Recovery!
else:
    stamina -= 3 * hours   # Tiring but good

# Boss prank effect
if pranked_boss: stress -= 20, mood += 10
```

### Emotional State Calculation

```python
if mood >= 80 and stress < 30: state = 'happy'
elif mood < 40 or energy < 30: state = 'tired'
elif stress >= 85: state = 'angry'
elif stress >= 70: state = 'stressed'
else: state = 'normal'
```

## Pearl AI (Gemini Integration)

### System Prompt Highlights

```python
"""You are Pearl, a Food Science major in the Oystraz app.
Beliefs:
- Anti-hustle culture. Work smart, not grind.
- Work-life balance is sacred.
Style:
- Dry humor, dad jokes dropped naturally.
- PASSIONATE about food and nutrition.
- Direct: 2-3 sentences max, no filler."""
```

### API Integration

```python
# gemini.py
model = genai.GenerativeModel('gemini-2.0-flash-exp')
response = model.generate_content([system_prompt, user_message])
```

## Database (Supabase)

Production database hosted on **Supabase**:

```env
DATABASE_URL=postgresql://postgres:[password]@[project].supabase.co:5432/postgres
```

Features:
- Managed PostgreSQL with auto-backups
- Connection pooling
- Real-time capabilities (optional)

## API Documentation

FastAPI auto-generates interactive docs:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Environment

```env
DEBUG=False
SECRET_KEY=<strong random key>
DATABASE_URL=<Supabase connection string>
CORS_ORIGINS=https://yourdomain.com
```

## Acknowledgments

- **Google Gemini 2.0 Flash** - Pearl AI companion
- **USDA FoodData Central** - Nutrition database
- **Supabase** - PostgreSQL hosting
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM

## License

MIT - Part of the Oystraz health tracking application.