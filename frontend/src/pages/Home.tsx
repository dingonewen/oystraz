/**
 * Home Page
 * Main page showing character status and quick actions
 * Compact layout - no scrolling needed to see all stats
 */

import { useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { useCharacterStore } from '../store/characterStore';
import { useUserStore } from '../store/userStore';
import { getCharacter } from '../services/characterService';

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

  // Stat card data
  const stats = [
    { label: 'Stamina', emoji: '💪', value: character?.stamina || 0, color: 'primary', desc: 'Exercise & sleep' },
    { label: 'Energy', emoji: '⚡', value: character?.energy || 0, color: 'primary', desc: 'Caloric balance' },
    { label: 'Nutrition', emoji: '🍎', value: character?.nutrition || 0, color: 'primary', desc: 'Diet balance' },
    { label: 'Mood', emoji: '😊', value: character?.mood || 0, color: 'primary', desc: 'Overall wellness' },
    { label: 'Stress', emoji: '😰', value: character?.stress || 0, color: 'error', desc: 'Lower is better' },
    { label: 'Level', emoji: '🏆', value: character?.level || 1, color: 'secondary', desc: `XP: ${character?.experience || 0}` },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 2 }, px: { xs: 1, sm: 0 } }}>
        {/* Welcome - compact */}
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, mb: { xs: 3, sm: 4.5 } }}
        >
          🦪 Life is your Oyster, {user?.username || 'Guest'}!
        </Typography>

        {/* Character State - Compact horizontal card */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: { xs: 1.5, sm: 2 },
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 2, sm: 3 },
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