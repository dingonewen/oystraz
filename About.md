## Inspiration

The name **Oystraz** combines two powerful metaphors: "oyster" (the world is your oyster—unlimited potential) and "orchestra" (harmonious coordination). As a TPM working long hours, I noticed how easy it is to neglect health when focused on project deadlines. Traditional health apps feel like homework—another task to manage.

I wanted to create something that makes health tracking **emotionally engaging** through gamification, while leveraging **Gemini AI** to provide personalized insights that understand context, not just numbers.

The "workplace simulator" feature was inspired by the irony that poor health choices directly impact our professional performance—yet we sacrifice health for work. What if your virtual character could show you the consequences in real-time?

## What it does

Oystraz is a **gamified health companion** that transforms daily wellness tracking into an interactive experience:

**Core Features:**
1. **Virtual Character System**: Your character's appearance and behavior reflect your real health state
   - Health metrics: Stamina, Energy, Nutrition, Mood, Stress (each 0-100)
   - Body types dynamically change based on BMI: $\text{BMI} = \frac{\text{weight (kg)}}{\text{height (m)}^2}$
   - Emotional states: happy, normal, tired, stressed, angry

2. **Workplace Simulator**: Your character navigates office scenarios influenced by health stats
   - High stress + low energy → Character might "sleep at work"
   - Good health → Can "confront boss" or "deliver presentations" confidently
   - Poor nutrition → "Brain fog during meetings"

3. **Gemini AI Health Assistant**:
   - Analyzes patterns: "Your stress spikes every Monday—consider meal prepping Sundays"
   - Contextual advice: Uses diary entries to understand *why* metrics changed
   - Predictive insights: "Based on your sleep trend, energy will be 23% lower tomorrow"

4. **Comprehensive Tracking**:
   - Nutrition: USDA FoodData Central API integration (600k+ foods)
   - Exercise: Activity logging with calorie burn calculations
   - Sleep: Quality tracking with circadian rhythm analysis
   - Water intake, mood journaling

**Health Score Calculation:**
$$\text{Overall Health} = \frac{0.2 \times \text{Stamina} + 0.25 \times \text{Energy} + 0.2 \times \text{Nutrition} + 0.2 \times \text{Mood} - 0.15 \times \text{Stress}}{100}$$

## How we built it

**Technical Architecture:**

```
Frontend: React 18 + TypeScript + Vite
├── UI: Material-UI v6 (component library)
├── State: Zustand (lightweight state management)
├── Routing: React Router v6
└── PWA: Installable mobile web app

Backend: FastAPI (Python 3.11+)
├── Database: PostgreSQL with async SQLAlchemy
├── AI: Google Gemini API integration
├── APIs: USDA FoodData Central, exercise databases
└── Auth: JWT tokens with secure session management

Character System:
├── Physics-based attribute decay: ΔE = -k₁·t + k₂·(sleep)
├── Real-time rendering based on health metrics
└── Behavior tree AI for workplace scenarios
```

**Key Technical Decisions:**

1. **Why React over Streamlit?**
   - Needed rich interactivity for character animations
   - Better state management for real-time updates
   - Mobile PWA support for on-the-go tracking

2. **Gemini AI Integration Strategy:**
   - Structured prompts with health context: `{ metrics: [...], diary: "...", goal: "..." }`
   - Batch analysis for pattern detection across 7-day windows
   - Privacy-first: Local processing before API calls

3. **TypeScript + Vite Configuration:**
   - Overcame `verbatimModuleSyntax` vs runtime module issues
   - Downgraded MUI v7→v6 for API stability
   - Optimized build: 5.19s compile time

**Data Flow Example:**
```typescript
User logs meal → USDA API fetch nutrition →
Calculate Δ Nutrition = Σ(calories, protein, vitamins) →
Update character state → Gemini analyzes context →
Generate personalized insight → Update UI
```

## Challenges we ran into

**1. TypeScript Module System Hell**
- **Problem**: `verbatimModuleSyntax: true` required `import type`, but Vite strips types at runtime
- **Error**: `Uncaught SyntaxError: does not provide an export named 'CharacterState'`
- **Solution**: Balanced strict typing with runtime compatibility (`verbatimModuleSyntax: false`)
- **TPM Lesson**: Configuration decisions have cascading effects—test end-to-end

**2. MUI Version Breaking Changes**
- **Problem**: MUI v7 changed Grid API, removed `item` prop
- **Impact**: 15+ files showing type errors
- **Solution**: Strategic downgrade to v6 for stability during hackathon timeline
- **TPM Lesson**: Risk management—sometimes maturity > cutting-edge

**3. Health Metric Balance Algorithm**
- **Challenge**: Making stats feel realistic without being punishing
- **Math Problem**:
  - Too aggressive decay: $E(t) = E_0 \cdot e^{-0.3t}$ felt demotivating
  - Too lenient: Users didn't see consequences
- **Solution**: Piecewise functions with thresholds:
  $$
  \text{Decay Rate} =
  \begin{cases}
  k_{\text{slow}} & \text{if } E > 70 \\
  k_{\text{normal}} & \text{if } 30 \leq E \leq 70 \\
  k_{\text{fast}} & \text{if } E < 30
  \end{cases}
  $$

**4. Gemini API Prompt Engineering**
- **Challenge**: Generic responses like "drink more water"
- **Solution**:
  - Added 7-day context windows
  - Structured JSON inputs with diary sentiment
  - Explicit instructions: "Avoid clichés, reference specific user data"

**5. 25-Day Timeline Management**
- **TPM Challenge**: Scope creep temptation (gamification ideas are endless)
- **Solution**: Ruthless MVP prioritization
  - Phase 1: Core tracking + character (Week 1-2)
  - Phase 2: Workplace simulator (Week 3)
  - Phase 3: Gemini integration (Week 4)
  - Polish: Week 4 buffer

## Accomplishments that we're proud of

✅ **Full-Stack AI Integration in 3 Weeks**
- Architected and implemented React + FastAPI + PostgreSQL + Gemini AI
- Zero security vulnerabilities (SQL injection safe, XSS protected)

✅ **Novel Gamification Approach**
- First health app (to my knowledge) with workplace behavior simulation
- Character system with 5-dimensional health metrics

✅ **TPM Documentation Excellence**
- Comprehensive README with ER diagrams, API specs, deployment guides
- Architecture decisions documented for future contributors

✅ **Real-World Problem Solving**
- Debugged complex TypeScript/Vite module issues
- Balanced technical debt vs delivery timeline

✅ **Gemini AI Contextual Intelligence**
- Moved beyond simple rule-based advice
- Successfully integrated multi-turn context for personalized insights

**Metrics:**
- 🏗️ 2,500+ lines of TypeScript
- 🎨 12 UI components
- 🧠 5 Zustand stores
- 📊 4 health tracking categories
- 🤖 Gemini-powered AI assistant

## What we learned

**Technical:**
1. **AI Integration is About Context**: Raw numbers → Gemini works poorly. Structured data + user intent + history → magical
2. **TypeScript Strictness Trade-offs**: `verbatimModuleSyntax` taught me that perfect type safety isn't always practical
3. **React State Management**: Zustand's simplicity beats Redux for small-medium apps
4. **API Rate Limiting**: USDA API has 3,600 requests/hour—need caching strategy

**TPM Skills:**
1. **Risk Mitigation**: Downgrading MUI was the right call for timeline stability
2. **Scope Management**: Saying "no" to features is harder than saying "yes"
3. **Documentation ROI**: Time spent on README saved 10x debugging time later
4. **Iterative Development**: MVP → feedback → iterate beats waterfall planning

**Product Design:**
1. **Gamification Psychology**: Rewards work better than punishment (positive stat gains > penalties)
2. **User Empathy**: Health tracking fails when it feels like judgment—make it playful
3. **AI as Companion**: Users want AI to understand *them*, not generic health rules

**Math/Science:**
- Learned about BMR calculations: $\text{BMR} = 10W + 6.25H - 5A + S$ (Mifflin-St Jeor)
- Circadian rhythm impacts on energy: sinusoidal modeling $E(t) = A \sin(\frac{2\pi t}{24} + \phi)$

## What's next for Oystraz

**Immediate Post-Hackathon (Month 1-2):**

1. **Advanced Gemini Features**
   - Multi-modal: Analyze food photos for nutrition estimation
   - Voice integration: "Hey Oystraz, log my breakfast"
   - Predictive modeling: Use Gemini to forecast health trends

2. **Social Features**
   - Team challenges: "Engineering team fitness competition"
   - Share workplace scenarios: "My character slept through standup—yours?"

3. **Workplace Simulator Expansion**
   - 20+ scenarios (currently planning 8)
   - Consequence chains: Poor health → missed deadline → stress → worse health
   - Boss personality types that react differently

**Long-term Vision (6-12 months):**

4. **Wearable Integration**
   - Sync with Apple Health, Google Fit, Fitbit
   - Real-time heart rate → stress detection
   - Sleep tracking automation

5. **Personalized AI Coach**
   - Gemini learns your patterns over months
   - Adaptive goals: Not everyone needs 10k steps
   - Mental health support: Detect burnout patterns

6. **Enterprise Version**
   - Corporate wellness programs
   - Aggregate (anonymous) team health dashboards
   - ROI metrics: Health improvement → productivity gains

**Technical Debt to Address:**
- Migrate to MUI v7 when stable (Q2 2026)
- Implement Redis caching for USDA API
- Add E2E testing with Playwright
- Optimize character rendering (Canvas vs SVG performance)

**Research Questions:**
- Can Gemini detect eating disorders from diary patterns? (Ethical considerations)
- Optimal health metric weights: $\alpha, \beta, \gamma$ in $H = \alpha E + \beta N + \gamma M$
- Workplace scenario realism: Survey users on accuracy

**Moonshot Idea:**
- VR workplace simulator: Experience "Monday after no sleep weekend" in immersive 3D
- Biometric feedback: Real stress → virtual character stress in real-time

---

**The ultimate goal**: Make health tracking so engaging that people *want* to check their character every day—not because they should, but because they're curious what adventure awaits in the workplace simulator. Health improvement becomes a side effect of play, not a chore.

*"The world is your oyster when your health orchestrates harmony."* 🦪🎻
