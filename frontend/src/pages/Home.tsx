/**
 * Home Page
 * Main page showing character status and quick actions
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 0 } }}>
        {/* Welcome Section */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
        >
          Welcome back, {user?.username || 'Guest'}!
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Your virtual character is ready to orchestrate your wellness journey
        </Typography>

        {/* Character Status Grid */}
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ mt: { xs: 2, sm: 3 } }}>
          {/* Stamina */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                💪 Stamina
              </Typography>
              <Typography variant="h3" color="primary">
                {character?.stamina || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on exercise & sleep
              </Typography>
            </Paper>
          </Grid>

          {/* Energy */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                ⚡ Energy
              </Typography>
              <Typography variant="h3" color="primary">
                {character?.energy || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on caloric balance
              </Typography>
            </Paper>
          </Grid>

          {/* Nutrition */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                🍎 Nutrition
              </Typography>
              <Typography variant="h3" color="primary">
                {character?.nutrition || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on dietary balance
              </Typography>
            </Paper>
          </Grid>

          {/* Mood */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                😊 Mood
              </Typography>
              <Typography variant="h3" color="primary">
                {character?.mood || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on overall wellness
              </Typography>
            </Paper>
          </Grid>

          {/* Stress */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                😰 Stress
              </Typography>
              <Typography variant="h3" color="error">
                {character?.stress || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lower is better
              </Typography>
            </Paper>
          </Grid>

          {/* Level */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                🏆 Level
              </Typography>
              <Typography variant="h3" color="secondary">
                {character?.level || 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                XP: {character?.experience || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Character State Display */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mt: { xs: 3, sm: 4 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
          >
            Your Character
          </Typography>
          <Box sx={{ fontSize: { xs: '3rem', sm: '4rem', md: '5rem' }, my: 2 }}>
            {character?.emotionalState === 'happy' && '😊'}
            {character?.emotionalState === 'normal' && '🙂'}
            {character?.emotionalState === 'tired' && '😴'}
            {character?.emotionalState === 'stressed' && '😰'}
            {character?.emotionalState === 'angry' && '😠'}
          </Box>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
          >
            Body Type: {character?.bodyType || 'Normal'}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Emotional State: {character?.emotionalState || 'Normal'}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}