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