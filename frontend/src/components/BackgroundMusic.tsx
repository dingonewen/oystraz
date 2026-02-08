/**
 * Background Music Component
 * Plays neo-soul BGM after login, with mute control
 */

import { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMuted, volume } = useAudioStore();
  const hasInteractedRef = useRef(false);

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('/assets/oystraz_neosoul_bgm.mp3');
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;

      // Handle user interaction to start audio (browser autoplay policy)
      const handleInteraction = () => {
        if (!hasInteractedRef.current && audioRef.current && !isMuted) {
          audioRef.current.play().catch(() => {});
          hasInteractedRef.current = true;
        }
      };

      document.addEventListener('click', handleInteraction);
      document.addEventListener('keydown', handleInteraction);

      return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else if (hasInteractedRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isMuted]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return null;
}