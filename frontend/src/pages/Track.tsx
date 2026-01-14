/**
 * Track Page
 * Page for logging food, exercise, and sleep
 */

import { Container, Typography, Box } from '@mui/material';

export default function Track() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Track Your Health
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Log your meals, exercise, and sleep here
        </Typography>

        {/* TODO: Add food, exercise, and sleep logging components */}
        <Box sx={{ mt: 4 }}>
          <Typography color="text.secondary">
            Food, exercise, and sleep tracking components will be added here
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}