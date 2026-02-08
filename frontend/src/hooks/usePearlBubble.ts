/**
 * usePearlBubble Hook
 * Provides easy integration for triggering Pearl bubbles from any component
 */

import { usePearlStore } from '../store/pearlStore';
import { generateBubbleComment } from '../services/pearlBubbleService';

type ActivityType = 'diet' | 'exercise' | 'sleep' | 'work';

export const usePearlBubble = () => {
  const {
    incrementInput,
    resetInputCount,
    shouldShowBubble,
    showBubble,
    activityLevel,
    consecutiveWorkSessions,
    consecutiveHighCalorie,
    consecutiveExercise,
    trackWorkSession,
    trackHighCalorie,
    trackExercise,
  } = usePearlStore();

  const triggerActivityBubble = (activityType: ActivityType, details?: {
    calories?: number;
    workHours?: number;
    exerciseMinutes?: number;
  }) => {
    // Track health metrics
    if (activityType === 'work') {
      trackWorkSession();
    }
    if (activityType === 'diet' && details?.calories && details.calories > 800) {
      trackHighCalorie();
    }
    if (activityType === 'exercise' && details?.exerciseMinutes && details.exerciseMinutes > 60) {
      trackExercise();
    }

    // Increment input counter
    incrementInput(activityType);

    // Check if should show bubble based on activity level
    if (shouldShowBubble()) {
      const comment = generateBubbleComment(activityType, {
        isOverworking: consecutiveWorkSessions >= 3,
        isOvereating: consecutiveHighCalorie >= 3,
        isOverexercising: consecutiveExercise >= 4,
      });
      showBubble(comment);
      resetInputCount();
    }
  };

  return {
    triggerActivityBubble,
    activityLevel,
  };
};