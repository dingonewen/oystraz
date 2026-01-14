/**
 * Home Page
 * Main page showing character status and quick actions
 */

import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { useCharacterStore } from '../store/characterStore';
import { useUserStore } from '../store/userStore';

export default function Home() {
  const { character } = useCharacterStore();
  const { user } = useUserStore();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome back, {user?.username || 'Guest'}!
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Your virtual character is ready to orchestrate your wellness journey
        </Typography>

        {/* Character Status Grid */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Stamina */}
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Your Character
          </Typography>
          <Box sx={{ fontSize: '5rem', my: 2 }}>
            {character?.emotionalState === 'happy' && '😊'}
            {character?.emotionalState === 'normal' && '🙂'}
            {character?.emotionalState === 'tired' && '😴'}
            {character?.emotionalState === 'stressed' && '😰'}
            {character?.emotionalState === 'angry' && '😠'}
          </Box>
          <Typography variant="h6" color="text.secondary">
            Body Type: {character?.bodyType || 'Normal'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Emotional State: {character?.emotionalState || 'Normal'}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}