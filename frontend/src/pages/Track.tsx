/**
 * Track Page
 * Page for logging food, exercise, and sleep
 * Ocean theme with pearl shimmer effects
 */

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';

// Pearl iridescent gradient for title
const pearlTitleGradient = 'linear-gradient(135deg, #F5E6E8 0%, #E8E0F0 25%, #E0EBF5 50%, #F0EDE5 75%, #F8F0E8 100%)';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import DietLog from '../components/Track/DietLog';
import ExerciseLog from '../components/Track/ExerciseLog';
import SleepLog from '../components/Track/SleepLog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`track-tabpanel-${index}`}
      aria-labelledby={`track-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2 } }}>{children}</Box>}
    </div>
  );
}

export default function Track() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            background: pearlTitleGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
          }}
        >
          🗎 Track Your Health
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
        >
          Maintain your organic hardware. Feed it, move it, and reboot it.
        </Typography>

        <Paper sx={{ mt: { xs: 2, sm: 3 }, borderRadius: 1.5, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="health tracking tabs"
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              background: 'linear-gradient(180deg, rgba(26, 58, 92, 0.3) 0%, transparent 100%)',
              '& .MuiTab-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minHeight: { xs: 64, sm: 72 },
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  color: '#8AB4F8',
                },
              },
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(90deg, #8AB4F8, #81C995)',
                height: 3,
              },
            }}
          >
            <Tab
              icon={<RestaurantIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />}
              label="Diet"
              id="track-tab-0"
              aria-controls="track-tabpanel-0"
            />
            <Tab
              icon={<FitnessCenterIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />}
              label="Exercise"
              id="track-tab-1"
              aria-controls="track-tabpanel-1"
            />
            <Tab
              icon={<BedtimeIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />}
              label="Sleep"
              id="track-tab-2"
              aria-controls="track-tabpanel-2"
            />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <DietLog />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <ExerciseLog />
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <SleepLog />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}