/**
 * Work Page - Ocean Theme
 * Seal Employee vs Octopus Manager
 * Ocean theme with pearl shimmer effects
 */

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Pearl iridescent gradient for title
const pearlTitleGradient = 'linear-gradient(135deg, #F5E6E8 0%, #E8E0F0 25%, #E0EBF5 50%, #F0EDE5 75%, #F8F0E8 100%)';
import { useCharacterStore } from '../store/characterStore';
import { getCharacter } from '../services/characterService';
import { logWork, getWorkLogs, getWorkStats, deleteWorkLog } from '../services/workService';
import type { WorkLog, WorkStats } from '../services/workService';
import OceanWorkScene from '../components/Work/OceanWorkScene';

export default function Work() {
  const { character, setCharacter } = useCharacterStore();
  const [_isLoading, setIsLoading] = useState(false);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [workStats, setWorkStats] = useState<WorkStats | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCharacter();
    loadWorkData();
  }, []);

  const loadCharacter = async () => {
    try {
      const data = await getCharacter();
      setCharacter({
        stamina: data.stamina,
        energy: data.energy,
        nutrition: data.nutrition,
        mood: data.mood,
        stress: data.stress,
        level: data.level,
        experience: data.experience,
        bodyType: data.body_type as any,
        emotionalState: data.emotional_state as any,
      });
    } catch (error) {
      console.error('Failed to load character:', error);
    }
  };

  const loadWorkData = async () => {
    try {
      const [logs, stats] = await Promise.all([
        getWorkLogs(7),
        getWorkStats(7),
      ]);
      setWorkLogs(logs);
      setWorkStats(stats);
    } catch (error) {
      console.error('Failed to load work data:', error);
    }
  };

  const handleWorkComplete = async (hours: number, intensity: number, isPrank: boolean = false) => {
    if (!character) return;

    try {
      setIsLoading(true);
      setError(null);

      // Log work session - backend will calculate and update metrics
      await logWork({
        duration_hours: isPrank ? 0 : hours,  // Prank sessions have 0 hours
        intensity: isPrank ? 1 : intensity,   // Intensity min is 1 (schema validation)
        energy_cost: 0,  // Backend calculates this
        stress_gain: 0,  // Backend calculates this
        experience_gain: 0,  // Backend calculates this
        pranked_boss: isPrank ? 1 : 0,
        notes: isPrank ? 'Pranked the octopus boss! 💦' : `${hours}h work at intensity ${intensity}`,
      });

      if (isPrank) {
        setSuccess('😂 Successfully pranked the boss! Stress reduced!');
      } else {
        setSuccess(`Work complete! ${hours}h at intensity ${intensity}. Metrics updated!`);
      }

      // Reload character to get updated metrics from backend
      await loadCharacter();

      // Reload work data
      await loadWorkData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to complete work session. Please try again.');
      console.error('Work error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLog = async (logId: number) => {
    try {
      await deleteWorkLog(logId);
      setSuccess('Work log deleted! Stats recalculated.');
      await loadCharacter();
      await loadWorkData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete work log.');
      console.error('Delete error:', err);
    }
  };

  if (!character) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            component="img"
            src="/assets/ocean/seal.png"
            alt=""
            sx={{ width: { xs: 36, sm: 48 }, height: { xs: 36, sm: 48 } }}
          />
          Ocean Office Simulator
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          You're a seal employee fishing for work. Beware of the octopus manager!
        </Typography>

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Character Status - Synced with Home */}
        <Paper sx={{ p: { xs: 2, sm: 2, md: 3 }, mt: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, borderRadius: 3, background: 'linear-gradient(180deg, rgba(26, 58, 92, 0.2) 0%, transparent 100%)' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Current Status (synced with Home)
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">💪 Stamina</Typography>
                  <Typography variant="body2">{Math.round(character.stamina)}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.stamina}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'rgba(138, 43, 226, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    }
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">⚡ Energy</Typography>
                  <Typography variant="body2">{Math.round(character.energy)}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.energy}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'rgba(138, 43, 226, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    }
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">😊 Mood</Typography>
                  <Typography variant="body2">{Math.round(character.mood)}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.mood}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'rgba(138, 43, 226, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    }
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">😰 Stress</Typography>
                  <Typography variant="body2">{Math.round(character.stress)}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.stress}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'rgba(138, 43, 226, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <Chip
              label={`Level ${character.level}`}
              color="primary"
              variant="outlined"
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                XP: {character.experience % (character.level * 100)}/{character.level * 100}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(character.experience % (character.level * 100)) / (character.level * 100) * 100}
                sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Ocean Work Scene */}
        <OceanWorkScene
          onWorkComplete={handleWorkComplete}
          characterStress={character.stress}
          characterEnergy={character.energy}
          characterStamina={character.stamina}
          characterMood={character.mood}
        />

        {/* Work Statistics */}
        {workStats && (
          <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              📊 This Week's Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Hours
                </Typography>
                <Typography variant="h5">{workStats.total_hours.toFixed(1)}h</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Sessions
                </Typography>
                <Typography variant="h5">{workStats.total_sessions}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Avg Intensity
                </Typography>
                <Typography variant="h5">{workStats.avg_intensity.toFixed(1)}/5</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Boss Pranks
                </Typography>
                <Typography variant="h5">💦 {workStats.total_pranks}</Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Recent Work Logs */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            📜 Recent Work History
          </Typography>
          {workLogs.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No work logs yet. Start a work session above!
            </Typography>
          ) : (
            <List>
              {workLogs.slice(0, 10).map((log, index) => (
                <Box key={log.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleDeleteLog(log.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        log.pranked_boss > 0
                          ? `💦 Pranked the boss! (${new Date(log.logged_at).toLocaleDateString()})`
                          : `${Math.round(log.duration_hours)}h work - Intensity ${log.intensity}/5`
                      }
                      secondary={
                        log.pranked_boss > 0
                          ? `Stress -${Math.round(Math.abs(log.stress_gain))} • Mood boost!`
                          : `Energy -${Math.round(log.energy_cost)} • Stress +${Math.round(log.stress_gain)} • XP +${log.experience_gain}`
                      }
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                      {new Date(log.logged_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </ListItem>
                  {index < workLogs.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Container>
  );
}