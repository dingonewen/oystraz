/**
 * Pearl Bubble Service
 * Generates witty one-liner comments for Pearl's bubbles
 */

type ActivityType = 'diet' | 'exercise' | 'sleep' | 'work' | 'idle';

// Diet comments
const dietComments = [
  "Fuel acquired! 🍽️",
  "Yum! Calories secured.",
  "Your gut bacteria approves.",
  "Energy coming right up!",
  "Logging calories > counting sheep.",
  "Eaten and noted! ✓",
  "Food is medicine. Facts.",
  "Body: thank you for the fuel!",
];

// Exercise comments
const exerciseComments = [
  "Muscles: we're awake now!",
  "Endorphins activated! 💪",
  "Stress leaving the building.",
  "Your heart says thanks.",
  "Movement is medicine!",
  "Sweating it out! Nice.",
  "Stamina +1 (or something)",
  "Exercise logged. You moved!",
];

// Sleep comments
const sleepComments = [
  "Sleep is the best medicine!",
  "Zzz logged. Recovery mode!",
  "Brain: defrag complete.",
  "Your cells are regenerating.",
  "Sleep = free healing potion.",
  "Rest is productive. Period.",
  "Recharging your batteries!",
  "Quality rest = quality life.",
];

// Idle reminders (for Tide mode)
const idleReminders = [
  "Hey, still there? Log something!",
  "Your character misses you...",
  "Time for a stretch?",
  "Don't forget to eat!",
  "Movement break? 🏃",
  "Log a meal, stay real.",
  "Your health needs attention!",
  "Pearl's waiting... log stuff!",
];

// Health warnings (overwork, overeating, over-exercise)
const overworkWarnings = [
  "Easy there, workaholic!",
  "Rest is also productive.",
  "Burnout isn't a goal...",
  "Take. A. Break. Please.",
  "Your stress says: enough.",
];

const overeatingWarnings = [
  "Maybe... slow down a bit?",
  "Your stomach has limits!",
  "Mindful eating > speed eating.",
  "Quality over quantity!",
];

const overexerciseWarnings = [
  "Rest days exist for a reason!",
  "Muscles need recovery time.",
  "More isn't always better.",
  "Listen to your body!",
];

const getRandomComment = (comments: string[]): string => {
  return comments[Math.floor(Math.random() * comments.length)];
};

export const generateBubbleComment = (
  activityType: ActivityType,
  details?: {
    isOverworking?: boolean;
    isOvereating?: boolean;
    isOverexercising?: boolean;
  }
): string => {
  // Check for health warnings first
  if (details?.isOverworking) {
    return getRandomComment(overworkWarnings);
  }
  if (details?.isOvereating) {
    return getRandomComment(overeatingWarnings);
  }
  if (details?.isOverexercising) {
    return getRandomComment(overexerciseWarnings);
  }

  // Regular comments by activity type
  switch (activityType) {
    case 'diet':
      return getRandomComment(dietComments);
    case 'exercise':
      return getRandomComment(exerciseComments);
    case 'sleep':
      return getRandomComment(sleepComments);
    case 'idle':
      return getRandomComment(idleReminders);
    default:
      return "Logged! ✓";
  }
};

export const generateIdleReminder = (): string => {
  return getRandomComment(idleReminders);
};

/**
 * Generate a stats summary with 3-4 insights about the data
 */
export const generateStatsSummary = (stats: {
  avgCalories: number;
  avgExercise: number;
  avgSleep: number;
  totalWorkouts: number;
  days: number;
}): string[] => {
  const summaries: string[] = [];

  // Calorie summary
  if (stats.avgCalories > 2500) {
    summaries.push(`Eating well! ~${stats.avgCalories} cal/day avg.`);
  } else if (stats.avgCalories > 1500) {
    summaries.push(`Balanced intake: ~${stats.avgCalories} cal/day.`);
  } else if (stats.avgCalories > 0) {
    summaries.push(`Only ${stats.avgCalories} cal/day? Eat more!`);
  } else {
    summaries.push("No meals logged yet. Let's fix that!");
  }

  // Sleep summary
  if (stats.avgSleep >= 8) {
    summaries.push(`Great sleep: ${stats.avgSleep}h avg! 💤`);
  } else if (stats.avgSleep >= 6) {
    summaries.push(`Sleep's okay: ${stats.avgSleep}h avg.`);
  } else if (stats.avgSleep > 0) {
    summaries.push(`Only ${stats.avgSleep}h sleep? Rest more!`);
  } else {
    summaries.push("Log some sleep data! 😴");
  }

  // Exercise summary
  if (stats.totalWorkouts > 5) {
    summaries.push(`${stats.totalWorkouts} workouts! You're on fire! 🔥`);
  } else if (stats.totalWorkouts > 0) {
    summaries.push(`${stats.totalWorkouts} workout(s). Keep moving!`);
  } else {
    summaries.push("No workouts logged. Time to move! 🏃");
  }

  // Overall insight
  if (stats.avgCalories > 0 && stats.avgSleep > 6 && stats.totalWorkouts > 2) {
    summaries.push("Overall: You're doing great! 🌟");
  } else if (stats.avgCalories > 0 || stats.avgSleep > 0 || stats.totalWorkouts > 0) {
    summaries.push("Keep tracking for better insights!");
  } else {
    summaries.push("Start logging to see your progress!");
  }

  return summaries.slice(0, 4); // Return up to 4 summaries
};

/**
 * Work culture sarcasm - big tech humor for the octopus boss interaction
 * Rich variety to minimize repetition
 */
const workCultureRoasts = [
  // Oncall & Pager Duty
  "Oncall again? Sleep is overrated anyway.",
  "Page at 3am? That's just the universe testing you.",
  "Your pager loves you more than your bed does.",
  "Weekend oncall: because who needs a life?",
  "Another P0? Time to cancel dinner plans.",
  "Pager went off during vacation? Classic.",

  // Promotion & Career
  "Promotion? In this economy?",
  "When's the promotion? Ask again in 6 months.",
  "Exceeds expectations but still no promo. Weird.",
  "Your skip-level: 'Great work!' Your promo: 404.",
  "Impact! Visibility! Promo... still pending.",
  "Senior Staff? Maybe next cycle. Or the next.",
  "Ladder climbing is cardio, right?",

  // Layoffs & Job Security
  "Reorg incoming. Update that LinkedIn.",
  "Efficiency improvements = run.",
  "Your team is 'right-sized'. Congrats?",
  "Headcount freeze but hey, free snacks!",
  "That 'quick sync' from HR... gulp.",
  "Layoffs? No no, it's 'role elimination'.",
  "Your role is 'evolving'. Nervously.",

  // Meetings & Calendar
  "This meeting could've been a Slack.",
  "Your calendar looks like Tetris. And you're losing.",
  "Meeting about the meeting? Sure.",
  "Sync to align on syncing. Very aligned.",
  "Focus time? Your calendar laughed.",
  "30 min meeting = 45 min always.",
  "Another standup that's actually a sitdown.",

  // Work-Life Balance (or lack thereof)
  "WLB is just three random letters.",
  "Unlimited PTO = take none, feel guilty.",
  "Friday 5pm Slack? Bold move, boss.",
  "Working from home = home is now work.",
  "Flexible hours: flex into more hours!",
  "Mental health day? Is that a holiday?",

  // Corporate Speak
  "Let's circle back. And back. And back.",
  "Taking this offline to never discuss again.",
  "Synergy! Paradigm! ...What are we doing?",
  "Per my last email (the passive-aggressive one).",
  "Moving forward = forgetting backward.",
  "Low-hanging fruit is getting pretty high.",
  "Bandwidth? Mine is at -10%.",

  // Performance Reviews
  "Meets expectations: the participation trophy.",
  "360 feedback: surprise roast edition.",
  "Self-review: creative writing exercise.",
  "Peer feedback: everyone's nice. Suspiciously.",
  "Rating calibration: where dreams go to die.",
  "Stack ranking: Hunger Games, office edition.",

  // Tech Industry Specifics
  "Ship it! Test in prod! YOLO!",
  "Technical debt? That's future you's problem.",
  "Code review: where friendships end.",
  "Legacy code: someone else's crime scene.",
  "Documentation? We call it 'self-documenting'.",
  "Sprint planning: fiction writing workshop.",
  "Story points are made up and nothing matters.",

  // Boss & Management
  "Boss wants 'quick sync'. It's never quick.",
  "Skip-level: therapy session with HR witness.",
  "Manager changed again. Third one this year.",
  "1:1 cancelled. Again. Very aligned.",
  "Open door policy: door is closed.",
  "Feedback is a gift. Return to sender.",

  // Office Life
  "Free lunch! The real compensation.",
  "Ping pong table = we care about you.",
  "Standing desk = suffering standing up.",
  "Open office: hear every conversation forever.",
  "Hot desking: musical chairs for adults.",
  "Kombucha on tap but no raises.",

  // Remote Work
  "You're on mute. You're STILL on mute.",
  "Camera on? My background is chaos.",
  "Zoom fatigue is my only personality now.",
  "Async communication: ignored synchronously.",
  "Slack notification PTSD is real.",
  "Home office = kitchen table empire.",

  // Deadlines & Shipping
  "EOD means midnight, right?",
  "Aggressive timeline = impossible timeline.",
  "MVP: Minimum Viable Panic.",
  "Crunch time! (It's always crunch time.)",
  "Launch delayed. Shocked. Absolutely shocked.",
  "Scope creep is just scope galloping now.",

  // General Cynicism
  "Another day, another dollar (before taxes).",
  "Living the dream! (The nightmare kind.)",
  "Is it Friday yet? No? Pain.",
  "Coffee: the real employee benefit.",
  "Passion for the job! (cries internally)",
  "Work hard, play... when? Never.",
  "This is fine. Everything is fine. 🔥",
];

// Track recently used comments to reduce repetition
let recentWorkRoasts: string[] = [];
const MAX_RECENT = 15;

export const generateWorkCultureRoast = (): string => {
  // Filter out recently used comments
  const availableRoasts = workCultureRoasts.filter(
    (roast) => !recentWorkRoasts.includes(roast)
  );

  // If we've used too many, reset
  const roastsToUse = availableRoasts.length > 0 ? availableRoasts : workCultureRoasts;

  const selected = roastsToUse[Math.floor(Math.random() * roastsToUse.length)];

  // Track this comment
  recentWorkRoasts.push(selected);
  if (recentWorkRoasts.length > MAX_RECENT) {
    recentWorkRoasts.shift();
  }

  return selected;
};

/**
 * Work page specific humor - ocean-themed workplace dark comedy
 * Three styles: Boss-as-food, Prank-oriented, Cold corporate reality
 */
const workPageHumor = [
  // === 职场猎杀派 (Boss as Calamari) ===
  "Fishing for clams, dodging tentacles. Boss with wasabi?",
  "Eight-armed micromanager? Time for calamari.",
  "Today's special: fried octopus. Extra crispy boss.",
  "The boss has eight arms. That's eight chances to fail.",
  "Calamari rings are just manager performance reviews.",
  "Octopus ink? That's just corporate email leaking.",
  "Boss sashimi: the ultimate exit interview.",
  "Eight tentacles, zero empathy. Classic management.",
  "Catch fish, avoid tentacles, contemplate sushi.",
  "The ocean is vast. Boss's patience is not.",
  "Grilled octopus: performance improvement plan?",
  "Tentacles in every meeting. Literally.",
  "Boss's brain is in his arms. Explains a lot.",
  "Seafood buffet featuring... middle management.",
  "Eight arms, still can't give you a raise.",

  // === 恶作剧/破坏者派 (Prank & Sabotage) ===
  "Eight arms = eight things to trip him with.",
  "Tie his tentacles into a decorative knot.",
  "Ink in the coffee machine? Wasn't me.",
  "Pranking the boss: it's not revenge, it's therapy.",
  "His tentacles are everywhere. Except in raises.",
  "Today's mission: maximum chaos, minimum traces.",
  "Octopus can't catch what he can't see coming.",
  "Prank him before he micromanages you.",
  "Eight arms, still can't stop a determined seal.",
  "Tangle his tentacles. Blame the current.",
  "Sabotage? I prefer 'creative problem solving'.",
  "Ink cloud: nature's smoke bomb for meetings.",
  "Every tentacle is a new prank opportunity.",
  "Boss is distracted. Strike now.",
  "Catch fish. Avoid boss. Cause problems.",
  "His weakness? Thinking he has no weakness.",
  "Plot twist: the seal is the real apex predator.",
  "Chaos is a ladder. Especially underwater.",

  // === 冷淡职场现实派 (Cold Corporate Reality) ===
  "Swim like a shark, bark like a seal, die inside.",
  "Clam-counting by day. Soul-searching by night.",
  "HR stands for Human Remains. Probably.",
  "The ocean is deep. Your job security isn't.",
  "Catch fish. Get paid. Question existence.",
  "Another day, another tentacle in your face.",
  "Workplace synergy: everyone drowning together.",
  "The food chain is real. You're not at the top.",
  "Fish don't negotiate. Neither does payroll.",
  "Deep sea pressure? Just like quarterly reviews.",
  "Current carries you. So does corporate BS.",
  "Breathe. Work. Repeat. Until retirement (LOL).",
  "The abyss stares back. So does your manager.",
  "Ocean ecosystem: eat or be eaten. Or both.",
  "Survival mode: permanently enabled.",

  // === 海洋职场混搭 (Ocean Office Blend) ===
  "Seals don't get promoted. They just get faster.",
  "Octopus approved your PTO. Denied it. Approved again.",
  "Fish are currency. Sanity is optional.",
  "Underwater Wi-Fi: always dropping. Like morale.",
  "The reef is your cubicle. But wetter.",
  "Commute time: zero. Escape time: infinite.",
  "Bubbles are just your screams, visualized.",
  "Water pressure increases. So do expectations.",
  "The current is strong. Your will is stronger. Maybe.",
  "Coral grows slowly. So does your career.",
  "Sharks don't attend standups. Lucky them.",
  "Plankton has more work-life balance than you.",
  "Jellyfish don't stress. Be the jellyfish. Float.",
  "The anchor is your only weight... besides imposter syndrome.",
  "Ocean floor: where deadlines go to die.",

  // === 黑色幽默金句 (Dark One-liners) ===
  "Ink cloud activated. Emotions hidden.",
  "Fish caught: many. Feelings felt: zero.",
  "Tentacles reaching. Boundaries breached.",
  "Another hook, another existential crisis.",
  "Swimming in circles? That's called strategy.",
  "The tide waits for no seal. Neither does the boss.",
  "Salt water heals wounds. Not corporate ones.",
  "Drowning in tasks. Literally this time.",
  "Echo location: finding yourself. Still searching.",
  "Fish school together. You're homeschooled.",
  "Bioluminescence: the only bright spot here.",
  "Predator or prey? Depends on the meeting.",
  "Deep dive into your feelings? Hard pass.",
  "The ocean is big. Your impact is... there.",
  "Waves of anxiety incoming. Surf's up.",

  // === 反差萌吐槽 (Cute Seal Dark Thoughts) ===
  "Bark bark! (Translation: I'm dead inside.)",
  "Flippers up! Heart rate down. Way down.",
  "Cute but calculating. Always calculating.",
  "Whiskers twitching. Murder plotting. Maybe.",
  "Ball-balancing skills: excellent. Life: less so.",
  "Clapping for fish. Crying for validation.",
  "Blubber keeps me warm. Rage keeps me warmer.",
  "Seal of approval? More like seal of survival.",
  "Flopping around looks cute. It's actually panic.",
  "Big eyes for detecting threats. And snacks.",

  // === 职场哲学 (Workplace Philosophy) ===
  "Work is temporary. The void is eternal.",
  "Catch enough fish and they might notice you.",
  "The ocean doesn't care. Neither does HR.",
  "Every tentacle has a story. Usually a bad one.",
  "In the food chain of life, be the unexpected.",
  "Depth is relative. So is your contribution.",
  "Currents change. Managers don't.",
  "Even fish swim upstream. You can too. Eventually.",
  "The reef will outlast us all. Especially this job.",
  "Swim with purpose. Or don't. Nobody's watching.",
];

// Track recently used work page humor
let recentWorkPageHumor: string[] = [];
const MAX_RECENT_WORK = 20;

export const generateWorkPageHumor = (): string => {
  const availableHumor = workPageHumor.filter(
    (humor) => !recentWorkPageHumor.includes(humor)
  );

  const humorToUse = availableHumor.length > 0 ? availableHumor : workPageHumor;
  const selected = humorToUse[Math.floor(Math.random() * humorToUse.length)];

  recentWorkPageHumor.push(selected);
  if (recentWorkPageHumor.length > MAX_RECENT_WORK) {
    recentWorkPageHumor.shift();
  }

  return selected;
};

/**
 * Character emotional state comments - parental tough love style
 * Pearl speaks like a caring but sassy parent/elder sibling
 */
type EmotionalState = 'happy' | 'normal' | 'tired' | 'stressed' | 'angry';

// Happy state - "傻乐也挺好" vibe, playful teasing
const happyComments = [
  "Look at you, all sunshine and rainbows. Suspicious.",
  "Someone's in a good mood. What did you eat?",
  "Happiness looks good on you. Don't get used to it.",
  "All smiles today? The universe must be broken.",
  "You're glowing. Is that happiness or fever?",
  "Mr./Ms. Happy over here. Save some joy for the rest of us.",
  "Being cheerful won't pay the bills... but carry on.",
  "That smile is either genuine or concerning. Can't tell.",
  "Happy again? Your face must be tired from smiling.",
  "Enjoying life? In THIS economy? Bold.",
  "Your good mood is making the fish nervous.",
  "Keep smiling like that and people will think you're up to something.",
  "Happiness suits you. Temporarily.",
  "Someone woke up on the right side of the ocean today.",
  "All this positivity... are you sure you're okay?",
  "Your joy is contagious. Stay away from the grumpy fish.",
  "Living your best life? How exhausting for the rest of us.",
  "That happy glow? Either contentment or sunburn.",
];

// Normal state - casual check-ins, neutral observations
const normalComments = [
  "Stable and steady. Not bad, not bad.",
  "Everything's normal? That's... surprisingly normal.",
  "Just vibing? Respect.",
  "Nothing to report? How refreshingly boring.",
  "You seem... fine? I guess that's good?",
  "Average day? Average is underrated.",
  "Coasting through life. Not a bad strategy.",
  "Neither up nor down. The zen of meh.",
  "Doing okay? That's the bare minimum. Congrats.",
  "No drama today? The ocean is healing.",
  "Just existing? Valid life choice.",
  "Neutral mood detected. Carry on, citizen.",
  "Everything in balance. How very mature of you.",
  "Not great, not terrible. The sweet spot.",
  "Just... normal? I'll take it.",
  "Steady as a sea rock. Boring but reliable.",
  "No complaints? Must be a simulation glitch.",
  "You're fine. The fish are fine. We're all fine.",
];

// Tired state - 嘴硬心软, nagging about rest
const tiredComments = [
  "Told you to sleep early. Did you listen? No.",
  "Those bags under your eyes have bags.",
  "Burning the midnight oil again? Your pillow misses you.",
  "You look like a zombie. A cute one, but still.",
  "Sleep is free healthcare. Why won't you take it?",
  "Exhausted again? Color me shocked. Not.",
  "Your body is screaming for rest. I can hear it from here.",
  "Running on fumes? That's not a flex, that's a warning.",
  "Too tired to function? Groundbreaking discovery.",
  "Sleep deprivation isn't a personality trait, you know.",
  "Looking rough. Did the bed reject you last night?",
  "Energy at 0%? Maybe try charging yourself. In bed. Sleeping.",
  "Overworking again? Your future self is already mad.",
  "Tired? Rest. Revolutionary concept, I know.",
  "Your eye bags could carry groceries at this point.",
  "Burning out isn't brave. Go. To. Sleep.",
  "Running on caffeine and regret? Classic you.",
  "Exhaustion isn't cute. Well, maybe a little. But rest anyway.",
  "Another late night? Your circadian rhythm is filing for divorce.",
  "Tired yet stubborn. The human condition, really.",
  "Sleep? Never heard of her? She's waiting for you.",
  "Looking drained. The fish are concerned.",
];

// Stressed state - tough love with genuine care
const stressedComments = [
  "Stressed? Take a breath. No, a real one.",
  "Your cortisol levels are visible from space.",
  "Stress eating the worry, are we? Not effective.",
  "Panicking won't solve it. Deep breaths, human.",
  "Stressed out again? The ocean didn't do this to you.",
  "That tension could power a small city. Relax.",
  "Worrying is praying for things you don't want. Stop it.",
  "Stressed? Join the club. We have anxiety snacks.",
  "Your stress is stressing ME out. Please.",
  "Overwhelmed? Break it down. One fish at a time.",
  "Stress mode activated? Time to deactivate, chief.",
  "You're spiraling. I can see it. Come back.",
  "Fretting about tomorrow? It's not here yet. Chill.",
  "That stress wrinkle is becoming permanent. Relax.",
  "Anxious about everything? Try being anxious about nothing.",
  "Stress is temporary. Your health isn't. Prioritize.",
  "Wound up tight? Even springs need to uncoil.",
  "The world won't end if you take a break. Probably.",
  "Stressing won't add hours to your day. Just wrinkles.",
  "Your shoulders are up by your ears. Drop them. Now.",
];

// Angry state - calming but validating
const angryComments = [
  "Mad at the world? Fair. The world is annoying.",
  "Anger detected. Who needs to be flopped with a fish?",
  "Fuming? Let it out. Then let it go. In that order.",
  "Rage mode? Channel it into something. Like napping.",
  "Angry vibes today. The ocean absorbs all moods.",
  "Frustrated? Understandable. Take it out on some clams.",
  "Seeing red? Try seeing blue. It's more calming.",
  "Mad about something? Is it worth your peace? Doubt it.",
  "Anger is a guest. Let it visit, then show it the door.",
  "Irritated? Valid. But don't let it camp in your brain.",
  "Something upset you? The fish are ready to listen.",
  "Furious? Cool. Now breathe before you combust.",
  "That anger will pass. Like gas. Let it out safely.",
  "Mad? Good. Anger means you still care about something.",
  "Seething? The coral doesn't judge. Vent away.",
  "Rage bubbling up? Let it bubble out. Then float on.",
  "Angry at someone? They're probably not thinking about it. Neither should you.",
  "Frustration is just motivation in a bad mood. Use it.",
];

// Track recently used emotional state comments
const recentStateComments: Record<EmotionalState, string[]> = {
  happy: [],
  normal: [],
  tired: [],
  stressed: [],
  angry: [],
};
const MAX_RECENT_STATE = 5;

const stateCommentMap: Record<EmotionalState, string[]> = {
  happy: happyComments,
  normal: normalComments,
  tired: tiredComments,
  stressed: stressedComments,
  angry: angryComments,
};

export const generateCharacterStateComment = (state: EmotionalState): string => {
  const comments = stateCommentMap[state] || normalComments;
  const recentlyUsed = recentStateComments[state] || [];

  const availableComments = comments.filter(
    (comment) => !recentlyUsed.includes(comment)
  );

  const commentsToUse = availableComments.length > 0 ? availableComments : comments;
  const selected = commentsToUse[Math.floor(Math.random() * commentsToUse.length)];

  // Track this comment
  if (!recentStateComments[state]) {
    recentStateComments[state] = [];
  }
  recentStateComments[state].push(selected);
  if (recentStateComments[state].length > MAX_RECENT_STATE) {
    recentStateComments[state].shift();
  }

  return selected;
};