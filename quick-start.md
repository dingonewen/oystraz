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

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Avatar/
│   ├── HealthBars/
│   ├── FoodInput/
│   ├── ExerciseLog/
│   ├── WorkSimulator/
│   ├── AIChat/
│   └── Dashboard/
├── pages/          # Page components
│   ├── Home.tsx
│   ├── Track.tsx
│   ├── Work.tsx
│   ├── Stats.tsx
│   └── Profile.tsx
├── services/       # API services
│   ├── api.ts
│   ├── foodService.ts
│   ├── exerciseService.ts
│   └── geminiService.ts
├── store/          # Zustand stores
│   ├── userStore.ts
│   ├── characterStore.ts
│   └── workStore.ts
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── hooks/          # Custom React hooks
```

## 🎨 Color Scheme

- Primary (Health Green): `#4CAF50`
- Secondary (Energy Blue): `#2196F3`
- Error (Stress Red): `#F44336`
- Warning (Caution Orange): `#FF9800`
- Background: `#FAFAFA`

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

## 🚧 TODO

- [ ] Implement individual components (Avatar, HealthBars, etc.)
- [ ] Add form validation
- [ ] Implement authentication flow
- [ ] Add loading states and error boundaries
- [ ] Add unit tests
- [ ] Configure PWA features

## 📄 License

MIT
