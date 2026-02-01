# Oystraz Frontend

React + TypeScript + Vite frontend for the Oystraz health tracking application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI) v6/v7** - Component library
- **Zustand** - State management
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **@mui/icons-material** - Icon library

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Track/
│   │   ├── DietLog.tsx       # USDA food search & logging
│   │   ├── ExerciseLog.tsx   # Exercise tracking
│   │   └── SleepLog.tsx      # Sleep tracking
│   └── Work/
│       └── OceanWorkScene.tsx # Ocean-themed work simulator
├── pages/               # Page components
│   ├── Login.tsx            # Authentication
│   ├── Register.tsx         # User registration
│   ├── Home.tsx             # Character dashboard
│   ├── Track.tsx            # Health tracking hub
│   ├── Work.tsx             # Work simulation
│   ├── Stats.tsx            # Data visualization
│   ├── Assistant.tsx        # Pearl AI chat
│   └── Profile.tsx          # User settings
├── services/            # API services
│   ├── api.ts               # Axios client
│   ├── authService.ts       # Authentication
│   ├── characterService.ts  # Character state
│   ├── healthService.ts     # Diet/exercise/sleep
│   ├── workService.ts       # Work logging
│   ├── aiService.ts         # Pearl AI chat
│   └── pearlService.ts      # Pearl personality
├── store/               # Zustand stores
│   ├── userStore.ts         # User authentication state
│   └── characterStore.ts    # Character stats state
├── types/               # TypeScript definitions
│   └── index.ts
└── App.tsx              # Main app component with routing
```

## 🎨 Visual Design

### Color Scheme
- Primary (Ocean Blue): `#2196F3`, `#4A90E2`
- Secondary (Health Green): `#4CAF50`
- Error (Stress Red): `#F44336`
- Warning (Caution Orange): `#FF9800`
- Background: Ocean gradients and light backgrounds

### Visual Assets
- **Ocean Environment**: Kenney Fish Pack (fish, rocks, seaweed, bubbles, terrain)
- **Characters**: Google Nano Banana Pro 2 generated (seal employee, octopus boss)
- **Logo**: Custom designed with AI assistance
- **Assets Location**: `/public/assets/ocean/` (60+ pixel art assets)
- **Rendering**: Pixel-perfect with `imageRendering: 'pixelated'` CSS

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Build for production
npm run preview      # Preview production build locally

# Linting
npm run lint         # Run ESLint
```

## 🔗 API Configuration

Update `.env` file with your backend API URL:

```env
VITE_API_URL=http://localhost:8000/api
```

## 🧪 Development Notes

- The app uses MUI's theming system for consistent styling
- State management is handled by Zustand (lightweight alternative to Redux)
- API calls are centralized in the `services/` directory
- All types are defined in `types/index.ts`

## ✅ Implementation Status

### Completed
- ✅ All core components (Diet, Exercise, Sleep logging)
- ✅ Form validation with MUI TextField helpers
- ✅ Full authentication flow (JWT-based)
- ✅ Ocean-themed work simulator with pixel art
- ✅ Character state management
- ✅ Statistics dashboard with charts
- ✅ Pearl AI assistant integration
- ✅ USDA food search integration
- ✅ Profile management

### TODO
- [ ] Mobile responsive optimization
- [ ] Loading states and error boundaries
- [ ] Add unit tests
- [ ] Configure PWA features
- [ ] Achievement system
- [ ] Offline mode support

## 🌟 Acknowledgments

- **Kenney Fish Pack** - Ocean environment assets (fish, rocks, seaweed, bubbles, terrain)
- **Google Nano Banana Pro 2** - AI-generated character assets (seal, octopus, logo)
- **Material-UI** - React component library
- **Recharts** - Data visualization library

## 📄 License

MIT
