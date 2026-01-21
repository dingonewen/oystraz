# Oystraz Backend API

FastAPI backend for the Oystraz health tracking application with Google Gemini AI integration.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👤 **User Management** - Profile management with health metrics
- 🎮 **Character System** - Virtual character reflecting health state
- 🍽️ **Diet Tracking** - Log meals with USDA nutrition data
- 🏃 **Exercise Tracking** - Record workouts and activities
- 😴 **Sleep Tracking** - Monitor sleep quality and duration
- 🤖 **Gemini AI Assistant** - Personalized health insights
- 🏢 **Workplace Simulator** - AI-generated scenarios based on health
- 📊 **USDA API Integration** - 600k+ foods nutrition database

## Tech Stack

- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI**: Google Gemini API
- **External APIs**: USDA FoodData Central
- **Python**: 3.11+

## Project Structure

```
backend/
├── app/
│   ├── models/          # SQLAlchemy database models
│   │   ├── user.py
│   │   ├── character.py
│   │   ├── diet.py
│   │   ├── exercise.py
│   │   ├── sleep.py
│   │   └── workplace.py
│   ├── routers/         # API endpoints
│   │   ├── auth.py      # Register/Login
│   │   ├── user.py      # User profile
│   │   ├── character.py # Character management
│   │   ├── diet.py      # Diet logging
│   │   ├── exercise.py  # Exercise logging
│   │   ├── sleep.py     # Sleep logging
│   │   └── assistant.py # AI & USDA APIs
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   │   ├── auth.py      # JWT & password utils
│   │   ├── gemini.py    # Gemini AI integration
│   │   └── usda.py      # USDA API integration
│   ├── config.py        # Configuration settings
│   ├── database.py      # Database connection
│   └── main.py          # FastAPI app entry point
├── requirements.txt
├── .env.example
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Python 3.11 or higher
- PostgreSQL 14 or higher
- pip (Python package manager)

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Database Setup

**Create PostgreSQL database:**

```bash
# Linux/Mac
sudo -u postgres psql
CREATE DATABASE oystraz;
CREATE USER oystraz_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE oystraz TO oystraz_user;
\q

# Windows (using psql)
psql -U postgres
CREATE DATABASE oystraz;
```

### 4. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use any text editor
```

**Required environment variables:**

```env
DATABASE_URL=postgresql://oystraz_user:your_password@localhost:5432/oystraz
SECRET_KEY=<generate using: openssl rand -hex 32>
GEMINI_API_KEY=<your Google AI Studio API key>
USDA_API_KEY=<your USDA FoodData Central API key>
```

**Get API Keys:**

- **Gemini API**: https://makersuite.google.com/app/apikey
- **USDA API**: https://fdc.nal.usda.gov/api-key-signup.html (free)

### 5. Initialize Database

The database tables will be automatically created when you first run the application.

```bash
# Run the application (tables auto-create)
python -m app.main
```

Alternatively, you can create tables manually:

```python
from app.database import engine, Base
from app.models import *  # Import all models
Base.metadata.create_all(bind=engine)
```

### 6. Run the Server

**Development mode (with auto-reload):**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Production mode:**

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 7. Access API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### User Management

- `GET /api/users/me` - Get current user info
- `PUT /api/users/me` - Update user profile

### Character

- `GET /api/character` - Get user's character
- `PUT /api/character` - Update character stats

### Health Tracking

- `POST /api/diet` - Create diet log
- `GET /api/diet` - Get diet logs (last N days)
- `PUT /api/diet/{log_id}` - Update diet log
- `DELETE /api/diet/{log_id}` - Delete diet log

*(Similar endpoints for `/api/exercise` and `/api/sleep`)*

### AI Assistant

- `POST /api/assistant/advice` - Get personalized health advice from Gemini
- `POST /api/assistant/workplace-scenario` - Generate workplace scenario
- `POST /api/assistant/food-search` - Search USDA food database
- `GET /api/assistant/food/{fdc_id}` - Get food nutrition details

## Usage Examples

### Register a new user

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "securepass123",
    "full_name": "Test User"
  }'
```

### Login and get token

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=securepass123"
```

### Get character (with authentication)

```bash
curl -X GET "http://localhost:8000/api/character" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Log a meal

```bash
curl -X POST "http://localhost:8000/api/diet" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "food_name": "Chicken Breast",
    "meal_type": "lunch",
    "calories": 165,
    "protein": 31,
    "carbs": 0,
    "fat": 3.6,
    "serving_size": 100,
    "serving_unit": "g"
  }'
```

### Get AI health advice

```bash
curl -X POST "http://localhost:8000/api/assistant/advice" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How can I improve my energy levels?",
    "days": 7
  }'
```

## Development

### Running Tests

```bash
pytest
```

### Code Style

This project follows PEP 8 style guidelines. Format code with:

```bash
black app/
```

### Database Migrations (Optional)

For production, consider using Alembic for database migrations:

```bash
pip install alembic
alembic init alembic
# Configure alembic.ini and env.py
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Deployment

### Docker (Recommended)

```dockerfile
# Dockerfile example
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```env
DEBUG=False
SECRET_KEY=<use strong random key>
DATABASE_URL=<production database URL>
CORS_ORIGINS=https://yourdomain.com
```

## Troubleshooting

### Database connection errors

- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

### Import errors

- Make sure you're in the `backend/` directory
- Activate virtual environment if using one
- Reinstall dependencies: `pip install -r requirements.txt`

### API key errors

- Verify API keys are correctly set in `.env`
- Check API key quotas (USDA: 3,600 requests/hour)

## License

This project is part of the Oystraz health tracking application.

## Support

For issues and questions, please open an issue on the project repository.
