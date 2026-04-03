# Oystraz Frontend

Progressive Web App (PWA) for the Oystraz gamified health tracking application.

> **For full project documentation, see the [main README](../README.md)**

## Live Demo

**Production:** https://oystraz.vercel.app

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with latest features |
| **TypeScript** | Type safety |
| **Vite 7** | Build tool & dev server |
| **Material-UI v7** | Component library |
| **Zustand** | State management |
| **Framer Motion** | Animations |
| **Recharts** | Data visualization |
| **Vite PWA Plugin** | Progressive Web App support |

## Quick Start

```bash
# Install dependencies
cd frontend
npm install

# Configure environment
cp .env.example .env
# Edit VITE_API_URL to point to backend

# Run dev server
npm run dev
# Opens on http://localhost:5173
```

## Environment Variables

```bash
# Backend API endpoint
VITE_API_URL=http://localhost:8000/api

# Optional: Background music from CDN (Cloudinary)
VITE_BGM_URL=https://res.cloudinary.com/your-cloud-name/video/upload/oystraz_neosoul_bgm.mp3
```

## Build for Production

```bash
npm run build
# Output: dist/

# Preview production build
npm run preview
```

## Deployment (Vercel)

**Auto-deployment configured:** Every push to `main` branch triggers Vercel rebuild.

### Vercel Configuration

**Settings → General → Build & Development:**
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

**Environment Variables (Production):**
- `VITE_API_URL`: `https://oystraz-production.up.railway.app/api`
- `VITE_BGM_URL`: (Optional) Cloudinary CDN URL for background music

### PWA Features

- ✅ **Installable** - Add to home screen on iOS/Android
- ✅ **Offline support** - Service worker caches assets
- ✅ **App-like experience** - Standalone display mode
- ✅ **Icons** - 192px and 512px PWA icons

**Install Instructions:**
- **📱 iPhone:** Safari → Share → "Add to Home Screen"
- **🤖 Android:** Chrome → Menu → "Install Oystraz"

### Important Files

| File | Purpose |
|------|---------|
| `vercel.json` | Routing config for SPA (rewrites all routes to index.html) |
| `vite.config.ts` | Build config + PWA plugin settings |
| `public/icon-192.png` | PWA icon (small) |
| `public/icon-512.png` | PWA icon (large) |
| `.vercelignore` | Excludes large files from deployment |

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # Main bundle
│   ├── index-[hash].css   # Styles
│   └── ...
├── sw.js                   # Service worker
└── manifest.webmanifest    # PWA manifest
```

## Project Structure

```
src/
├── components/          # React components
│   ├── BackgroundMusic.tsx
│   ├── PearlAssistant.tsx
│   ├── Sidebar.tsx
│   ├── Track/          # Health tracking forms
│   └── Work/           # Ocean work simulator
├── pages/              # Route pages
│   ├── Home.tsx
│   ├── Stats.tsx
│   ├── Work.tsx
│   └── ...
├── services/           # API clients
│   ├── api.ts         # Axios instance with auth
│   ├── characterService.ts
│   ├── dietService.ts
│   └── ...
├── store/             # Zustand state
│   ├── characterStore.ts
│   ├── userStore.ts
│   └── pearlStore.ts
├── config/            # Configuration
│   └── api.ts        # API endpoints
└── main.tsx          # App entry + PWA registration
```

## Key Features

### Pearl AI Companion
- Real-time chat with Google Gemini 2.0 Flash
- Personality-driven responses (anti-hustle, food enthusiast)
- Health advice based on character stats

### Ocean Work Simulator
- Canvas-based game engine
- Seal character animation
- Fish catching mechanics
- Boss prank system with Veo video integration

### Health Tracking
- Diet logging with USDA food search (600k+ foods)
- Exercise tracking with type selection
- Sleep quality ratings (tech-themed)
- Character stats visualization (Recharts)

### Responsive Design
- Mobile-first approach
- Touch-optimized controls
- PWA-ready for iOS/Android

## Development Notes

### State Management (Zustand)

```typescript
// Character state example
const { character, setCharacter } = useCharacterStore();

// Updates automatically trigger re-renders
setCharacter({ stamina: 80, mood: 75 });
```

### API Integration

```typescript
// All API calls use authenticated axios instance
import api from './services/api';

// Auto-adds JWT token from userStore
const response = await api.get('/character');
```

### Styling

- Material-UI theme customization
- Ocean color palette (blues, teals)
- Pearl iridescent gradients
- Responsive breakpoints

## Browser Compatibility

- ✅ Chrome/Edge (Chromium) 90+
- ✅ Safari 14+ (iOS 14+)
- ✅ Firefox 88+
- ✅ Samsung Internet 14+

## Performance

- **Build size:** ~500KB (gzipped)
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Lighthouse PWA Score:** 100/100

## Troubleshooting

### Build Warnings

```
(!) Some chunks are larger than 500 kB after minification
```

**This is normal** - Recharts and Material-UI are large libraries. Performance is still good thanks to code splitting.

### CORS Errors

Ensure backend is running and `VITE_API_URL` points to correct endpoint with `/api` suffix.

### PWA Not Installing

- Check HTTPS (required for PWA on production)
- Verify `manifest.webmanifest` is accessible
- Clear browser cache and try again

## Acknowledgments

- **React 19** - Latest React features
- **Vite** - Lightning-fast builds
- **Material-UI** - Beautiful components
- **Vite PWA Plugin** - Offline support
- **Vercel** - Deployment platform

## License

MIT - Part of the Oystraz health tracking application.

---

**For full project details, demo video, and Google AI integration info, see the [main README](../README.md)**