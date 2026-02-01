# 🌊 Ocean Theme Implementation Guide

## Overview

Your Oystraz work simulator now features an ocean theme:
- **Protagonist**: 🦭 Seal Employee
- **Boss**: 🐙 Octopus Manager
- **Work**: 🎣 Fishing (metaphor for working for others' benefit)
- **Innovation**: 💦 Prank the boss to relieve stress

---

## 🎨 How to Add Kenney Assets

### 1. Asset Placement

```
frontend/public/assets/ocean/
├── seal.png          # Seal (you)
├── octopus.png       # Octopus (boss)
├── fish-*.png        # Various fish (work tasks)
├── hook.png          # Fishing hook
├── bubble.png        # Bubble decoration
├── ink.png           # Ink effect
└── wave.png          # Wave (optional)
```

### 2. Using Images in Components

Edit `frontend/src/components/Work/OceanWorkScene.tsx` and replace emojis with images:

```typescript
// Replace seal emoji at line 91
<Box
  sx={{
    position: 'absolute',
    left: '20%',
    bottom: '30%',
    textAlign: 'center',
  }}
>
  {/* Option 1: Using emoji (current) */}
  <Typography variant="h1" sx={{ fontSize: { xs: '60px', sm: '80px' } }}>
    🦭
  </Typography>

  {/* Option 2: Using Kenney image (recommended) */}
  <img
    src="/assets/ocean/seal.png"
    alt="seal"
    style={{ width: '80px', height: '80px' }}
  />
</Box>

// Replace octopus emoji at line 109
<Box
  sx={{
    position: 'absolute',
    right: '20%',
    top: '20%',
    textAlign: 'center',
    transform: octopusAnnoyed ? 'rotate(15deg)' : 'none',
    transition: 'transform 0.3s',
  }}
>
  {/* Use image instead of emoji */}
  <img
    src="/assets/ocean/octopus.png"
    alt="octopus"
    style={{
      width: '80px',
      height: '80px',
      filter: showPrankEffect ? 'brightness(1.5)' : 'none'
    }}
  />
</Box>

// Replace fish emoji at line 135
{isWorking && (
  <Box sx={{ position: 'absolute', left: '40%', bottom: '40%' }}>
    <img
      src="/assets/ocean/fish-1.png"
      alt="fish"
      style={{ width: '40px', height: '40px' }}
    />
  </Box>
)}
```

---

## 🎮 Feature Documentation

### Work Logging System

**New API endpoints**:
- `POST /work/log` - Log work session
- `GET /work/logs?days=7` - Get work logs from last 7 days
- `GET /work/stats?days=7` - Get work statistics
- `DELETE /work/log/{id}` - Delete work log

**Database table** (`work_logs`):
- `duration_hours` - Work duration
- `intensity` - Work intensity (1-5)
- `energy_cost` - Energy consumed
- `stress_gain` - Stress gained
- `experience_gain` - Experience earned
- `pranked_boss` - Number of pranks

### Work Modes

**Normal Work**:
1. Adjust work duration (1-8 hours)
2. Set work intensity (1-5)
3. Preview impact:
   - Energy loss = duration × intensity × 3
   - Stress gain = duration × intensity × 2
   - Experience gain = duration × intensity × 10
4. Click "Start Work Session" to begin
5. Watch the seal fishing (animation effect)

**Prank the Boss** (Innovative Feature!):
1. Unlocks when stress ≥ 30
2. Click "💦 Prank the Octopus Boss!"
3. Effects:
   - Stress -20
   - Mood +10
   - Octopus gets inked (animation)
4. 30-second cooldown

### Stress Management System

```typescript
// Auto reminder system (in scene)
{characterStress > 70 && (
  <Alert severity="warning">
    ⚠️ High stress detected!
    Consider pranking the octopus boss or taking a break!
  </Alert>
)}
```

---

## 🎨 Enhancement Suggestions

### 1. Improve Ocean Background

In `OceanWorkScene.tsx` at line 89:

```typescript
<Paper
  sx={{
    p: { xs: 2, sm: 3 },
    mb: 3,
    background: 'linear-gradient(180deg, #87CEEB 0%, #4A90E2 50%, #2C5F8D 100%)',
    minHeight: 300,
    position: 'relative',
    overflow: 'hidden',
    // Add animated wave background
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '200%',
      height: '100px',
      background: 'url(/assets/ocean/wave.png) repeat-x',
      animation: 'wave 10s linear infinite',
    },
    '@keyframes wave': {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(-50%)' },
    },
  }}
>
```

### 2. Add Bubble Decorations

```typescript
// Add to ocean scene
<Box
  sx={{
    position: 'absolute',
    left: '30%',
    bottom: '20%',
    animation: 'float 3s ease-in-out infinite',
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-20px)' },
    },
  }}
>
  <img src="/assets/ocean/bubble.png" alt="bubble" style={{ width: '20px', opacity: 0.6 }} />
</Box>
```

### 3. Fishing Animation

```typescript
// Add fishing rod animation while working
{isWorking && (
  <>
    {/* Hook */}
    <Box
      sx={{
        position: 'absolute',
        left: '25%',
        top: '50%',
        animation: 'fishing 2s ease-in-out infinite',
        '@keyframes fishing': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(5deg)' },
        },
      }}
    >
      <img src="/assets/ocean/hook.png" alt="hook" style={{ width: '30px' }} />
    </Box>
  </>
)}
```

---

## 📱 Mobile Optimization

Completed responsive design features:
- ✅ Ocean scene adapts to screen size
- ✅ Seal/octopus automatically scale down on mobile
- ✅ Work control panel stacks on mobile
- ✅ Touch-friendly sliders and buttons

---

## 🚀 Next Steps

### Short-term (Visual Optimization):
1. **Replace emojis with Kenney images**
2. **Add wave background animation**
3. **Optimize color scheme** (ocean blue palette)
4. **Add sound effects** (optional):
   - Fish catching sound
   - Octopus prank sound
   - Background ocean waves

### Mid-term (Feature Enhancement):
1. **Different fish types**:
   - Small fish = simple tasks
   - Big fish = complex projects
   - Golden fish = bonus tasks
2. **Octopus boss states**:
   - Good mood = easier tasks
   - Pranked too much = "retaliation"
3. **Achievement system**:
   - "Prank Master" - Prank boss 50 times
   - "Fishing Expert" - Complete 100 hours of work
   - "Stress Manager" - Keep stress <30 for 7 days straight

### Long-term (AI Integration):
1. **Gemini-generated work scenarios**
2. **Pearl gives work advice**
3. **Smart break time recommendations**

---

## 💡 Innovation Highlights

Your **Prank the Boss** feature is a unique innovation:
1. ✅ **Solves real pain point** - Work stress relief
2. ✅ **Safe outlet** - Virtual environment, no real-world consequences
3. ✅ **Gamified** - Has cooldown, prevents abuse
4. ✅ **Anti-hustle culture** - Encourages stress management

This feature will stand out during Hackathon demos!

---

## 🔧 Running and Testing

```bash
# Backend (create database table)
cd backend
alembic revision --autogenerate -m "Add work_logs table"
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

Visit http://localhost:5173/work to see the new ocean theme!

---

## 📝 Demo Script Suggestion

**For Hackathon presentation**:
1. "Does everyone feel stressed at work? Ever wanted to punch your boss?"
2. "In Oystraz, you're a seal employee, and your boss is an octopus"
3. Demo work session → stress increases
4. **Climax**: "Too stressed? No problem, when boss isn't looking..."
5. Click prank button → octopus sprays ink → audience laughs
6. "This is our innovation - safely release work stress in a virtual world"

---

Good luck with your Hackathon! 🎉🏆
