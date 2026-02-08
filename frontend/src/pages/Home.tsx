/**
 * Home Page
 * Main page showing character status and quick actions
 * Compact layout - no scrolling needed to see all stats
 * Ocean theme with pearl shimmer effects
 */

import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { useCharacterStore } from '../store/characterStore';
import { useUserStore } from '../store/userStore';
import { getCharacter } from '../services/characterService';

// Pearl iridescent gradients
const pearlTitleGradient = 'linear-gradient(135deg, #F5E6E8 0%, #E8E0F0 25%, #E0EBF5 50%, #F0EDE5 75%, #F8F0E8 100%)';
const pearlBorderGradient = 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)';
// Dark pearl gradient - black pearl with subtle iridescent sheen
const darkPearlGradient = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #1f1f3d 50%, #1a1a2e 75%, #0f0f1a 100%)';

export default function Home() {
  const { character, setCharacter, isLoading, setLoading, setError } = useCharacterStore();
  const { user } = useUserStore();

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
    { label: 'Energy', emoji: '⚡', value: Math.round(character?.energy || 0), color: 'primary', desc: 'Caloric balance' },
    { label: 'Nutrition', emoji: '🍎', value: Math.round(character?.nutrition || 0), color: 'primary', desc: 'Diet balance' },
    { label: 'Mood', emoji: '😊', value: Math.round(character?.mood || 0), color: 'primary', desc: 'Overall wellness' },
    { label: 'Stress', emoji: '😰', value: Math.round(character?.stress || 0), color: 'error', desc: 'Lower is better' },
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
        <Box
          sx={{
            p: '2px',
            mb: { xs: 1.5, sm: 2 },
            borderRadius: '26px',
            background: pearlBorderGradient,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.5, sm: 2 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
              background: darkPearlGradient,
            }}
          >
          {/* Character emoji */}
          <Box sx={{ fontSize: { xs: '2.5rem', sm: '3rem' } }}>
            {character?.emotionalState === 'happy' && '😊'}
            {character?.emotionalState === 'normal' && '🙂'}
            {character?.emotionalState === 'tired' && '😴'}
            {character?.emotionalState === 'stressed' && '😰'}
            {character?.emotionalState === 'angry' && '😠'}
            {!character?.emotionalState && '🙂'}
          </Box>
          {/* Character info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Your Character
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
              {character?.bodyType || 'Normal'} • {character?.emotionalState || 'Normal'}
            </Typography>
          </Box>
          </Paper>
        </Box>

        {/* Stats Grid - 3 rows x 2 columns, compact cards */}
        <Grid container spacing={{ xs: 1, sm: 1.5 }}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 6 }}>
              <Paper
                elevation={1}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  background: darkPearlGradient,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(138, 180, 248, 0.15)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
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
      </Box>
    </Container>
  );
}