/**
 * Pearl Idle Reminder Component
 * Shows random reminder bubbles based on activity level
 * Tide: every 3 minutes, Flow: every 6 minutes
 */

import { useEffect, useRef } from 'react';
import { usePearlStore } from '../store/pearlStore';
import { generateIdleReminder } from '../services/pearlBubbleService';

export default function PearlIdleReminder() {
  const { activityLevel, showBubble, updateActiveTime } = usePearlStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Schedule next reminder
  const scheduleNextReminder = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Get interval based on activity level
    let intervalMs: number;
    if (activityLevel === 'tide') {
      intervalMs = 3 * 60 * 1000; // 3 minutes
    } else if (activityLevel === 'flow') {
      intervalMs = 6 * 60 * 1000; // 6 minutes
    } else {
      return; // Calm mode doesn't have idle reminders
    }

    // Add some randomness (±30 seconds)
    const randomOffset = (Math.random() - 0.5) * 60 * 1000;
    const delay = intervalMs + randomOffset;

    timerRef.current = setTimeout(() => {
      showBubble(generateIdleReminder());
      scheduleNextReminder(); // Schedule next one
    }, delay);
  };

  useEffect(() => {
    // Only for Tide and Flow modes
    if (activityLevel === 'calm') {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    scheduleNextReminder();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activityLevel]);

  // Track user activity
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

  return null;
}