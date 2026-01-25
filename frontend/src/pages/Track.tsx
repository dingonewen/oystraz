/**
 * Track Page
 * Page for logging food, exercise, and sleep
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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
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
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Track Your Health
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Log your meals, exercise, and sleep to keep your character healthy
        </Typography>

        <Paper sx={{ mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="health tracking tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              icon={<RestaurantIcon />}
              label="Diet"
              id="track-tab-0"
              aria-controls="track-tabpanel-0"
            />
            <Tab
              icon={<FitnessCenterIcon />}
              label="Exercise"
              id="track-tab-1"
              aria-controls="track-tabpanel-1"
            />
            <Tab
              icon={<BedtimeIcon />}
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