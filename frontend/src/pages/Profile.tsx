/**
 * Profile Page
 * User settings and profile management
 */

import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { useUserStore } from '../store/userStore';

export default function Profile() {
  const { user } = useUserStore();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Profile Settings
        </Typography>

        <Paper elevation={2} sx={{ p: 4, mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Username</Typography>
              <Typography color="text.secondary">
                {user?.username || 'Not set'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Email</Typography>
              <Typography color="text.secondary">
                {user?.email || 'Not set'}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h6">Height</Typography>
              <Typography color="text.secondary">
                {user?.height || 0} cm
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h6">Weight</Typography>
              <Typography color="text.secondary">
                {user?.weight || 0} kg
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h6">Age</Typography>
              <Typography color="text.secondary">
                {user?.age || 0}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h6">Goal</Typography>
              <Typography color="text.secondary">
                {user?.goal?.replace('_', ' ') || 'Not set'}
              </Typography>
            </Grid>
          </Grid>

          {/* TODO: Add edit functionality */}
        </Paper>
      </Box>
    </Container>
  );
}