/**
 * Background Music Component
 * Plays neo-soul BGM after login, with mute control
 */

import { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMuted, volume } = useAudioStore();

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/oystraz_neosoul_bgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    // Try to play (may be blocked by browser autoplay policy)
    const playAudio = async () => {
      if (audioRef.current && !isMuted) {
        try {
          await audioRef.current.play();
        } catch (err) {
          // Autoplay blocked - wait for user interaction
          const handleInteraction = async () => {
            if (audioRef.current && !isMuted) {
              try {
                await audioRef.current.play();
                document.removeEventListener('click', handleInteraction);
              } catch {
                // Still blocked
              }
            }
          };
          document.addEventListener('click', handleInteraction);
        }
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Autoplay blocked
        });
      }
    }
  }, [isMuted]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return null;  // No visual component
}