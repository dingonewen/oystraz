/**
 * Home Page
 * Main page showing character status and quick actions
 * Compact layout - no scrolling needed to see all stats
 * Ocean theme with pearl shimmer effects
 */

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacterStore } from '../store/characterStore';
import { useUserStore } from '../store/userStore';
import { usePearlStore } from '../store/pearlStore';
import { getCharacter } from '../services/characterService';
import { generateWorkCultureRoast, generateCharacterStateComment } from '../services/pearlBubbleService';

// Pearl iridescent gradients
const pearlTitleGradient = 'linear-gradient(135deg, #F5E6E8 0%, #E8E0F0 25%, #E0EBF5 50%, #F0EDE5 75%, #F8F0E8 100%)';
const pearlBorderGradient = 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)';
// Dark pearl gradient - black pearl with subtle iridescent sheen
const darkPearlGradient = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #1f1f3d 50%, #1a1a2e 75%, #0f0f1a 100%)';

export default function Home() {
  const { character, setCharacter, isLoading, setLoading, setError } = useCharacterStore();
  const { user } = useUserStore();
  const { showBubble } = usePearlStore();
  const [isOctopusHovered, setIsOctopusHovered] = useState(false);
  const [isCharacterHovered, setIsCharacterHovered] = useState(false);

  // Load character data from backend
  useEffect(() => {
    const loadCharacter = async () => {
      try {
        setLoading(true);
        const data = await getCharacter();
        setCharacter({
          stamina: data.stamina,
          energy: data.energy,
          nutrition: data.nutrition,
          mood: data.mood,
          stress: data.stress,
          level: data.level,
          experience: data.experience,
          bodyType: data.body_type as 'thin' | 'normal' | 'overweight' | 'obese',
          emotionalState: data.emotional_state as 'happy' | 'normal' | 'tired' | 'stressed' | 'angry',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load character');
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [setCharacter, setLoading, setError]);

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Stat card data - integer values
  const stats = [
    { label: 'Stamina', emoji: '💪', value: Math.round(character?.stamina || 0), color: 'primary', desc: 'Exercise & sleep' },
    { label: 'Energy', emoji: '🔋', value: Math.round(character?.energy || 0), color: 'primary', desc: 'Caloric balance' },
    { label: 'Nutrition', emoji: '🍎', value: Math.round(character?.nutrition || 0), color: 'primary', desc: 'Diet balance' },
    { label: 'Mood', emoji: '😊', value: Math.round(character?.mood || 0), color: 'primary', desc: 'Overall wellness' },
    { label: 'Stress', emoji: '🫩', value: Math.round(character?.stress || 0), color: 'error', desc: 'Lower is better' },
    { label: 'Level', emoji: '🏆', value: character?.level || 1, color: 'secondary', desc: `XP: ${character?.experience || 0}` },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 2 }, px: { xs: 1, sm: 0 } }}>
        {/* Welcome - compact with pearl shimmer */}
        <Box sx={{ mb: { xs: 3, sm: 4.5 } }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              background: pearlTitleGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              component="img"
              src="/assets/pearl.png"
              alt=""
              sx={{ width: 28, height: 28, filter: 'drop-shadow(0 0 4px rgba(232, 213, 231, 0.6))' }}
            />
            Life is your Oyster, {user?.username || 'Guest'}!
          </Typography>
        </Box>

        {/* Character State - Compact horizontal card with ocean theme */}
        <motion.div
          onMouseEnter={() => {
            setIsCharacterHovered(true);
            const state = (character?.emotionalState || 'normal') as 'happy' | 'normal' | 'tired' | 'stressed' | 'angry';
            showBubble(generateCharacterStateComment(state));
          }}
          onMouseLeave={() => setIsCharacterHovered(false)}
          animate={isCharacterHovered ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{ cursor: 'pointer' }}
        >
          <Box
            sx={{
              p: '2px',
              mb: { xs: 1.5, sm: 2 },
              borderRadius: '26px',
              background: isCharacterHovered
                ? 'linear-gradient(135deg, #FFE8F0 0%, #E8D5F0 25%, #D5E8F5 50%, #F0EDE5 75%, #FFF8E8 100%)'
                : pearlBorderGradient,
              transition: 'background 0.3s ease',
            }}
          >
            <Paper
              elevation={isCharacterHovered ? 4 : 2}
              sx={{
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, sm: 3 },
                background: darkPearlGradient,
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {/* Character emoji */}
              <Box sx={{ fontSize: { xs: '2.5rem', sm: '3rem' } }}>
                {character?.emotionalState === 'happy' && '😊'}
                {character?.emotionalState === 'normal' && '🙂'}
                {character?.emotionalState === 'tired' && '😴'}
                {character?.emotionalState === 'stressed' && '🫩'}
                {character?.emotionalState === 'angry' && '😠'}
                {!character?.emotionalState && '🙂'}
              </Box>
              {/* Character info */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Your Character Seal
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  {character?.bodyType || 'Normal'} • {character?.emotionalState || 'Normal'}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </motion.div>

        {/* Stats Grid - 3 rows x 2 columns, compact cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 6 }}>
              <Paper
                elevation={1}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  background: darkPearlGradient,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(138, 180, 248, 0.15)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                  <Typography sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>{stat.emoji}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  color={stat.color as 'primary' | 'secondary' | 'error'}
                  sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, fontWeight: 600 }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
                >
                  {stat.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Interactive Octopus Boss */}
        <Box
          sx={{
            mt: { xs: 4, sm: 5 },
            mb: { xs: 2, sm: 3 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <motion.div
            onMouseEnter={() => {
              setIsOctopusHovered(true);
              showBubble(generateWorkCultureRoast());
            }}
            onMouseLeave={() => setIsOctopusHovered(false)}
            animate={isOctopusHovered ? {
              scale: [1, 1.05, 1],
              rotate: [0, -3, 3, 0],
            } : {}}
            transition={{ duration: 0.5 }}
            style={{ cursor: 'pointer', position: 'relative', overflow: 'visible' }}
          >
            {/* Pearl shimmer glow effect on hover - contained around octopus */}
            <AnimatePresence>
              {isOctopusHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(ellipse at center, rgba(232, 213, 231, 0.5) 0%, rgba(213, 229, 240, 0.3) 40%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(10px)',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>

            <Box
              component="img"
              src="/assets/ocean/octopus.png"
              alt="Octopus Boss"
              sx={{
                width: { xs: 120, sm: 100 },
                height: { xs: 120, sm: 100 },
                objectFit: 'contain',
                imageRendering: 'pixelated',
                position: 'relative',
                zIndex: 1,
                filter: isOctopusHovered
                  ? 'drop-shadow(0 0 12px rgba(232, 213, 231, 0.8)) drop-shadow(0 0 20px rgba(213, 229, 240, 0.5))'
                  : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                transition: 'filter 0.3s ease',
              }}
            />
          </motion.div>

          {/* Subtle label */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              position: 'absolute',
              bottom: { xs: -10, sm: -24 },
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              opacity: 0.6,
              fontStyle: 'italic',
            }}
          >
            {isOctopusHovered ? '🐙 The Boss has thoughts...' : '🐙 I am watching you...'}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}