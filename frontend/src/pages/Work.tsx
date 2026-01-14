/**
 * Work Simulation Page
 * Interactive workplace scenarios
 */

import { Container, Typography, Box, Button } from '@mui/material';
import { useWorkStore } from '../store/workStore';

export default function Work() {
  const { isWorking, startWork, endWork } = useWorkStore();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Work Simulator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Your workplace - where health meets reality
        </Typography>

        <Box sx={{ mt: 4 }}>
          {!isWorking ? (
            <Button
              variant="contained"
              size="large"
              onClick={startWork}
              sx={{ fontSize: '1.2rem', py: 2, px: 4 }}
            >
              🏢 Start Work
            </Button>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                You're at work!
              </Typography>
              <Typography color="text.secondary" paragraph>
                Workplace events will appear here based on your character's
                health state
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                onClick={endWork}
              >
                End Work Day
              </Button>

              {/* TODO: Add workplace event simulator component */}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}