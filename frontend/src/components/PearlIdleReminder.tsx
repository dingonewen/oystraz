/**
 * Pearl Idle Reminder Component
 * Shows reminder bubbles when user is inactive (Tide mode)
 */

import { useEffect, useRef } from 'react';
import { usePearlStore } from '../store/pearlStore';
import { generateIdleReminder } from '../services/pearlBubbleService';

const IDLE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes of inactivity

export default function PearlIdleReminder() {
  const { activityLevel, lastActiveTime, showBubble, updateActiveTime } = usePearlStore();
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Only active in Tide mode
    if (activityLevel !== 'tide') {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      return;
    }

    // Check for idle every minute
    checkIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActiveTime;

      if (idleTime >= IDLE_THRESHOLD_MS) {
        showBubble(generateIdleReminder());
        updateActiveTime(); // Reset to avoid spamming
      }
    }, 60000); // Check every minute

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [activityLevel, lastActiveTime, showBubble, updateActiveTime]);

  // Track user activity (clicks, keypresses)
  useEffect(() => {
    const handleActivity = () => {
      updateActiveTime();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [updateActiveTime]);

  return null; // No visual component
}