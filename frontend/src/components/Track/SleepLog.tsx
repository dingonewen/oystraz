/**
 * Sleep Log Component
 * Log sleep duration and quality
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { logSleep, getRecentSleepLogs, deleteSleepLog } from '../../services/healthService';
import { usePearlBubble } from '../../hooks/usePearlBubble';

interface SleepLogItem {
  id: number;
  duration_hours: number;
  quality: string;
  notes?: string;
  logged_at: string;
}

const QUALITY_LEVELS = [
  { value: 'poor', label: 'Poor', stars: 1 },
  { value: 'fair', label: 'Fair', stars: 2 },
  { value: 'good', label: 'Good', stars: 3 },
  { value: 'very_good', label: 'Very Good', stars: 4 },
  { value: 'excellent', label: 'Excellent', stars: 5 },
];

export default function SleepLog() {
  const [duration, setDuration] = useState('8');
  const [quality, setQuality] = useState('good');
  const [notes, setNotes] = useState('');
  const [recentLogs, setRecentLogs] = useState<SleepLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { triggerActivityBubble } = usePearlBubble();

  useEffect(() => {
    loadRecentLogs();
  }, []);

  const loadRecentLogs = async () => {
    try {
      setIsLoading(true);
      const logs = await getRecentSleepLogs(7); // Last 7 days
      setRecentLogs(logs);
    } catch (err) {
      console.error('Failed to load sleep logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogSleep = async () => {
    const durationNum = parseFloat(duration) || 0;
    if (durationNum <= 0 || durationNum > 24) {
      setError('Please enter a valid sleep duration (0-24 hours)');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Calculate sleep_start and sleep_end based on duration
      const now = new Date();
      const sleep_end = now.toISOString();
      const sleep_start = new Date(now.getTime() - durationNum * 60 * 60 * 1000).toISOString();

      await logSleep({
        sleep_start,
        sleep_end,
        duration_hours: durationNum,
        quality: quality,
        notes: notes.trim() || undefined,
      });
      setSuccess('Sleep logged successfully!');
      setDuration('8');
      setQuality('good');
      setNotes('');
      await loadRecentLogs();

      // Trigger Pearl bubble
      triggerActivityBubble('sleep');

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to log sleep. Please try again.');
      console.error('Log error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLog = async (id: number) => {
    try {
      await deleteSleepLog(id);
      await loadRecentLogs();
    } catch (err) {
      setError('Failed to delete log.');
      console.error('Delete error:', err);
    }
  };

  const getQualityStars = (qualityValue: string): number => {
    return QUALITY_LEVELS.find((q) => q.value === qualityValue)?.stars || 3;
  };

  const averageSleep =
    recentLogs.length > 0
      ? (recentLogs.reduce((sum, log) => sum + log.duration_hours, 0) / recentLogs.length).toFixed(1)
      : '0';

  return (
    <Box sx={{ px: { xs: 0, sm: 1, md: 3 } }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
      >
        Log Your Sleep
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
      >
        Track your sleep to maintain your character's energy and mood
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

      {/* Sleep Form */}
      <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mt: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Sleep Duration (hours)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              inputProps={{ min: 0, max: 24, step: 0.5 }}
              helperText="Recommended: 7-9 hours"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Sleep Quality</InputLabel>
              <Select
                value={quality}
                label="Sleep Quality"
                onChange={(e) => setQuality(e.target.value)}
              >
                {QUALITY_LEVELS.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {level.label}
                      <Rating value={level.stars} size="small" readOnly />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Notes (optional)"
              placeholder="E.g., woke up multiple times, dreams, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleLogSleep}
              disabled={isLoading}
            >
              Log Sleep
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Recent Logs */}
      <Box sx={{ mt: { xs: 3, sm: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
            Last 7 Days
          </Typography>
          <Chip
            icon={<BedtimeIcon />}
            label={`Avg: ${averageSleep} hrs`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        {isLoading && recentLogs.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : recentLogs.length === 0 ? (
          <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
            <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              No sleep logged yet. Start tracking your sleep to improve your character's wellbeing!
            </Typography>
          </Paper>
        ) : (
          <List>
            {recentLogs.map((log, index) => (
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle1">
                          {log.duration_hours} hours
                        </Typography>
                        <Rating value={getQualityStars(log.quality)} size="small" readOnly />
                      </Box>
                    }
                    secondary={
                      <>
                        {QUALITY_LEVELS.find((q) => q.value === log.quality)?.label || log.quality}
                        {log.notes && ` • ${log.notes}`}
                        {' • '}
                        {new Date(log.logged_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </>
                    }
                  />
                </ListItem>
                {index < recentLogs.length - 1 && <Divider />}
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}