/**
 * Exercise Log Component
 * Log exercise activities
 */

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { logExercise, getTodayExerciseLogs, deleteExerciseLog } from '../../services/healthService';

interface ExerciseLogItem {
  id: number;
  activity_name: string;
  duration_minutes: number;
  intensity: string;
  calories_burned: number;
  logged_at: string;
}

const EXERCISE_TYPES = [
  'Running',
  'Walking',
  'Cycling',
  'Swimming',
  'Weightlifting',
  'Yoga',
  'Pilates',
  'Basketball',
  'Soccer',
  'Tennis',
  'Dancing',
  'Hiking',
  'Other',
];

const INTENSITY_LEVELS = ['Low', 'Moderate', 'High', 'Very High'];

// Rough calorie estimates per minute
const CALORIE_RATES: Record<string, Record<string, number>> = {
  Running: { Low: 6, Moderate: 10, High: 14, 'Very High': 18 },
  Walking: { Low: 3, Moderate: 4, High: 5, 'Very High': 6 },
  Cycling: { Low: 5, Moderate: 8, High: 12, 'Very High': 16 },
  Swimming: { Low: 6, Moderate: 9, High: 13, 'Very High': 17 },
  Weightlifting: { Low: 3, Moderate: 5, High: 7, 'Very High': 9 },
  Yoga: { Low: 2, Moderate: 3, High: 4, 'Very High': 5 },
  Other: { Low: 4, Moderate: 6, High: 8, 'Very High': 10 },
};

export default function ExerciseLog() {
  const [exerciseType, setExerciseType] = useState('');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState('Moderate');
  const [todayLogs, setTodayLogs] = useState<ExerciseLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadTodayLogs();
  }, []);

  const loadTodayLogs = async () => {
    try {
      setIsLoading(true);
      const logs = await getTodayExerciseLogs();
      setTodayLogs(logs);
    } catch (err) {
      console.error('Failed to load exercise logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCalories = (): number => {
    const rates = CALORIE_RATES[exerciseType] || CALORIE_RATES.Other;
    const durationNum = parseFloat(duration) || 0;
    return Math.round(durationNum * rates[intensity]);
  };

  const handleLogExercise = async () => {
    const durationNum = parseFloat(duration) || 0;
    if (!exerciseType || durationNum <= 0) {
      setError('Please select exercise type and duration');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await logExercise({
        activity_name: exerciseType,
        duration_minutes: durationNum,
        intensity: intensity.toLowerCase(),
        calories_burned: calculateCalories(),
      });
      setSuccess('Exercise logged successfully!');
      setExerciseType('');
      setDuration('30');
      setIntensity('Moderate');
      await loadTodayLogs();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to log exercise. Please try again.');
      console.error('Log error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLog = async (id: number) => {
    try {
      await deleteExerciseLog(id);
      await loadTodayLogs();
    } catch (err) {
      setError('Failed to delete log.');
      console.error('Delete error:', err);
    }
  };

  const totalMinutes = todayLogs.reduce((sum, log) => sum + log.duration_minutes, 0);
  const totalCalories = todayLogs.reduce((sum, log) => sum + log.calories_burned, 0);

  return (
    <Box sx={{ px: { xs: 0, sm: 1, md: 3 } }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
      >
        Log Your Exercise
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
      >
        Track your physical activities to boost your character's stamina and energy
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Exercise Form */}
      <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mt: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Exercise Type</InputLabel>
              <Select
                value={exerciseType}
                label="Exercise Type"
                onChange={(e) => setExerciseType(e.target.value)}
              >
                {EXERCISE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Intensity</InputLabel>
              <Select
                value={intensity}
                label="Intensity"
                onChange={(e) => setIntensity(e.target.value)}
              >
                {INTENSITY_LEVELS.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Estimated calories burned:
              </Typography>
              <Typography variant="h6" color="primary">
                {exerciseType ? calculateCalories() : 0} cal
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleLogExercise}
              disabled={isLoading || !exerciseType}
            >
              Log Exercise
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Today's Logs */}
      <Box sx={{ mt: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
            Today's Activities
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1 }, flexWrap: 'wrap' }}>
            <Chip
              label={`${totalMinutes} min`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`${totalCalories} cal burned`}
              color="secondary"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        {isLoading && todayLogs.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : todayLogs.length === 0 ? (
          <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
            <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              No exercise logged today. Get moving and boost your character's stamina!
            </Typography>
          </Paper>
        ) : (
          <List>
            {todayLogs.map((log, index) => (
              <Paper key={log.id} sx={{ mb: 1 }}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDeleteLog(log.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">{log.activity_name}</Typography>
                        <Chip size="small" label={log.intensity} />
                      </Box>
                    }
                    secondary={
                      <>
                        {log.duration_minutes} min • {log.calories_burned} cal burned
                        {' • '}
                        {new Date(log.logged_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </>
                    }
                  />
                </ListItem>
                {index < todayLogs.length - 1 && <Divider />}
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}