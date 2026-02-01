# 🌊 Ocean Theme Implementation Guide

## Overview

Your Oystraz work simulator features a rich ocean environment where:
- **Protagonist**: 🦭 Seal Employee (chases fish for work)
- **Boss**: 🐙 Octopus Manager (watches from above)
- **Work Mechanism**: Seal chases swimming fish at different speeds
- **Innovation**: 💦 Prank the boss to relieve stress

---

## 🎨 New Ocean Scene Features

### Layered Environment Design

**Bottom Layer (Ocean Floor)**:
- Gradient terrain effect
- 3 rocks at different positions
- 3 seaweed plants swaying
- All easily replaceable with Kenney assets

**Middle Layer (Active Zone)**:
- 8 background fish swimming randomly
- Each fish has unique speed, direction, type
- Fish bounce off edges automatically
- Seal chases across the screen

**Top Layer (UI & Boss)**:
- Fishing hook hanging from top
- Octopus manager on platform
- Work progress HUD
- Stress warnings

**Ambient Elements**:
- 3 floating bubbles with animation
- Ocean gradient background (light to deep blue)

---

## 🎣 Work Mechanics: Seal Chasing Fish

### How It Works

1. **Set Chase Speed** (1-5 intensity)
   - 🐌 **Lazy Swim** (1): Slowest, minimal energy/stress cost
   - 🦭 **Casual** (2): Relaxed pace
   - 🏊 **Normal** (3): Standard work speed
   - ⚡ **Fast** (4): High productivity, high cost
   - 🚀 **Turbo** (5): Maximum speed, maximum toll

2. **Chase Animation**
   - Seal starts at left side (20% position)
   - Swims across screen with wave motion
   - Catches fish when reaching right side (80%)
   - Resets to left for next fish
   - Fish caught counter updates

3. **Work Completion**
   - Total fish = work hours × intensity
   - Example: 2 hours × intensity 3 = 6 fish to catch
   - Even slowest speed completes all fish (guaranteed!)

4. **Health Impact**
   - Energy cost = hours × intensity × 3
   - Stress gain = hours × intensity × 2
   - Experience = hours × intensity × 10

---

## 🐟 Swimming Fish System

### Automatic Fish Spawning

On page load, 8 background fish are randomly generated:
```typescript
- Random position (10-90% horizontal, 20-80% vertical)
- Random type (fish1, fish2, fish3, fish4, fish5)
- Random speed (0.2 - 0.7)
- Random direction (left or right)
```

### Swimming Behavior

- Fish swim continuously at their own pace
- Bounce when hitting screen edges
- Semi-transparent when not working (0.6 opacity)
- Fully visible during work sessions
- Smooth 50ms animation intervals

---

## 📦 How to Add Kenney Assets

### 1. Recommended Asset Organization

```
frontend/public/assets/ocean/
├── Characters
│   ├── seal.png              # Seal employee (60px recommended)
│   └── octopus.png           # Octopus manager (70px recommended)
│
├── Fish (for random swimming)
│   ├── fish1.png             # Small fish
│   ├── fish2.png             # Medium fish
│   ├── fish3.png             # Large fish
│   ├── fish4.png             # Colorful fish
│   └── fish5.png             # Golden fish
│
├── Decorations
│   ├── rock1.png             # Rock variant 1 (30-40px)
│   ├── rock2.png             # Rock variant 2
│   ├── seaweed1.png          # Seaweed variant 1 (40-50px)
│   ├── seaweed2.png          # Seaweed variant 2
│   ├── hook.png              # Fishing hook (30-35px)
│   └── bubble.png            # Bubble (15-20px)
│
└── Optional
    ├── terrain.png           # Ocean floor texture
    └── ink.png               # Ink spray effect
```

### 2. Replace Emojis with Images

Edit `frontend/src/components/Work/OceanWorkScene.tsx`:

#### Rocks (Lines 193-201)
```typescript
// Current:
<Typography sx={{ fontSize: { xs: '30px', sm: '40px' } }}>🪨</Typography>

// Replace with:
<img
  src="/assets/ocean/rock1.png"
  alt="rock"
  style={{ width: '40px', height: 'auto' }}
/>
```

#### Seaweed (Lines 204-212)
```typescript
// Current:
<Typography sx={{ fontSize: { xs: '40px', sm: '50px' } }}>🌿</Typography>

// Replace with:
<img
  src="/assets/ocean/seaweed1.png"
  alt="seaweed"
  style={{ width: '50px', height: 'auto' }}
/>
```

#### Background Fish (Line 228)
```typescript
// Current:
<Typography sx={{ fontSize: { xs: '20px', sm: '25px' } }}>🐟</Typography>

// Replace with:
<img
  src={`/assets/ocean/${fish.type}.png`}  // Automatically uses fish1.png, fish2.png, etc.
  alt="fish"
  style={{
    width: '25px',
    height: 'auto',
    transform: fish.direction === -1 ? 'scaleX(-1)' : 'none' // Flip when swimming left
  }}
/>
```

#### Fishing Hook (Line 252)
```typescript
// Current:
<Typography sx={{ fontSize: { xs: '25px', sm: '35px' } }}>🪝</Typography>

// Replace with:
<img
  src="/assets/ocean/hook.png"
  alt="hook"
  style={{ width: '35px', height: 'auto' }}
/>
```

#### Seal (Lines 271-273)
```typescript
// Current:
<Typography variant="h1" sx={{ fontSize: { xs: '40px', sm: '60px' } }}>
  🦭
</Typography>

// Replace with:
<img
  src="/assets/ocean/seal.png"
  alt="seal"
  style={{ width: '60px', height: 'auto' }}
/>
```

#### Octopus (Lines 291-293)
```typescript
// Current:
<Typography variant="h1" sx={{ fontSize: { xs: '50px', sm: '70px' } }}>
  🐙
</Typography>

// Replace with:
<img
  src="/assets/ocean/octopus.png"
  alt="octopus"
  style={{
    width: '70px',
    height: 'auto',
    filter: showPrankEffect ? 'brightness(1.5)' : 'none'  // Highlight when pranked
  }}
/>
```

---

## 🎮 Feature Documentation

### Work Logging System

**API endpoints**:
- `POST /work/log` - Log work session with chase metrics
- `GET /work/logs?days=7` - Get recent work history
- `GET /work/stats?days=7` - Get statistics (total hours, avg speed, pranks)
- `DELETE /work/log/{id}` - Delete work log

**Database fields** (`work_logs`):
```sql
- duration_hours: FLOAT      -- Work session duration
- intensity: INT (1-5)        -- Chase speed
- energy_cost: INT            -- Energy consumed
- stress_gain: INT            -- Stress accumulated
- experience_gain: INT        -- XP earned
- pranked_boss: INT           -- Number of pranks (0 or 1)
```

### Stress Management

**Prank the Boss Feature**:
1. Unlocks when stress ≥ 30
2. Click button → Octopus sprays ink (2s animation)
3. Effects: Stress -20, Mood +10
4. 30-second cooldown prevents spam
5. Auto-reminder appears when stress > 70

---

## 🎨 Visual Customization Tips

### 1. Add More Variety

**Multiple Rock/Seaweed Variants**:
```typescript
// Randomly select decorations
const rocks = ['rock1.png', 'rock2.png', 'rock3.png'];
const seaweeds = ['seaweed1.png', 'seaweed2.png', 'seaweed3.png'];

<img
  src={`/assets/ocean/${rocks[Math.floor(Math.random() * rocks.length)]}`}
  alt="rock"
/>
```

### 2. Improve Ocean Floor

**Add Texture**:
```typescript
<Box
  sx={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '30%',
    background: 'url(/assets/ocean/terrain.png) repeat-x bottom',
    backgroundSize: 'cover',
    opacity: 0.8,
  }}
/>
```

### 3. Enhance Bubbles

**Use Kenney Bubble Assets**:
```typescript
<Box sx={{
  position: 'absolute',
  left: '30%',
  bottom: '40%',
  animation: 'float 3s ease-in-out infinite'
}}>
  <img src="/assets/ocean/bubble.png" style={{ width: '15px', opacity: 0.6 }} />
</Box>
```

### 4. Add HUD Elements

Use Kenney's HUD pack for:
- Progress bars
- Score displays
- Button frames
- Icon backgrounds

---

## 🚀 Performance Tips

### Optimize Fish Animation

Current: 8 fish updating every 50ms
If laggy on mobile:
```typescript
// Reduce fish count
const initialFish: Fish[] = Array.from({ length: 5 }, ...);  // Was 8

// Increase interval
setInterval(() => { ... }, 100);  // Was 50ms
```

### Lazy Load Images

```typescript
import { lazy, Suspense } from 'react';

const OceanScene = lazy(() => import('./components/Work/OceanWorkScene'));

<Suspense fallback={<CircularProgress />}>
  <OceanScene {...props} />
</Suspense>
```

---

## 📱 Mobile Optimization

Already implemented:
- ✅ Responsive font sizes for all elements
- ✅ Touch-friendly sliders and buttons
- ✅ Scaled-down characters on small screens
- ✅ Adaptive scene height (250px mobile → 400px desktop)
- ✅ Stacked controls on mobile

---

## 💡 Innovation Highlights

### What Makes This Special

1. **Work ≠ Boring Clicking**
   - Visual feedback (seal chasing)
   - Speed customization
   - Guaranteed completion (no frustration)

2. **Stress Management Gamified**
   - Prank boss feature is unique
   - Safe outlet for workplace frustration
   - Cooldown prevents abuse

3. **Rich Environment**
   - 8 swimming fish (ambient life)
   - Layered decorations
   - Smooth animations
   - Professional game feel

4. **Anti-Hustle Philosophy**
   - "Lazy Swim" is a valid choice
   - Slower ≠ failure, just lower cost
   - Rest encouraged (prank feature)

---

## 🎤 Demo Script for Hackathon

### Setup (30 seconds)
> "Ever feel like work is just chasing fish all day for someone else's benefit? In Oystraz, that's literally what happens!"

### Demo Work (45 seconds)
1. Show chase speed slider: "You control how hard you work"
2. Select "Turbo" speed
3. Watch seal chase fish: "See? Working hard drains energy and builds stress"
4. Point out stats: "High productivity, but at what cost?"

### Climax - Prank Boss (30 seconds)
> "But wait - stress too high? No problem!"

5. Click "Prank the Octopus Boss"
6. Watch ink spray animation
7. Show stress drop: "Safe stress relief in a virtual world!"

### Closing (15 seconds)
> "That's Oystraz - real health tracking meets playful stress management. Your fish-catching seal thanks you!"

---

## 🔧 Running & Testing

```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

Visit http://localhost:5173/work

**Test checklist**:
- [ ] 8 fish swim continuously
- [ ] Seal chases when work starts
- [ ] Speed affects chase animation
- [ ] Fish counter updates correctly
- [ ] Prank button shows cooldown
- [ ] Mobile responsive (test on phone)

---

## 🌟 Future Enhancements

### Short-term
- Replace all emojis with Kenney assets
- Add sound effects (splash, ink spray)
- More fish variety (10+ types)

### Mid-term
- Different catch animations per fish type
- Octopus "attacks" if pranked too much
- Day/night ocean themes

### Long-term
- Multiplayer (race other seals)
- Fish leaderboard
- Seasonal ocean events

---

Good luck with your Hackathon presentation! 🎉🏆

The seal is ready to chase fish! 🦭🐟💨
