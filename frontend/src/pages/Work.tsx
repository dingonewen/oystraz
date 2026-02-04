/**
 * Work Page - Ocean Theme
 * Seal Employee vs Octopus Manager
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
} from '@mui/material';
import { useCharacterStore } from '../store/characterStore';
import { getCharacter, updateCharacter } from '../services/characterService';
import { logWork, getWorkLogs, getWorkStats } from '../services/workService';
import type { WorkLog, WorkStats } from '../services/workService';
import OceanWorkScene from '../components/Work/OceanWorkScene';

export default function Work() {
  const { character, setCharacter } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(false);
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

      let energyCost = 0;
      let stressGain = 0;
      let experienceGain = 0;
      let newStats = { ...character };

      if (isPrank) {
        // Prank reduces stress!
        const stressReduction = 20;
        newStats.stress = Math.max(0, character.stress - stressReduction);
        newStats.mood = Math.min(100, character.mood + 10);

        // Log prank work "session"
        await logWork({
          duration_hours: 0,
          intensity: 0,
          energy_cost: 0,
          stress_gain: -stressReduction,
          experience_gain: 5,
          pranked_boss: 1,
          notes: 'Pranked the octopus boss! 💦',
        });

        setSuccess('😂 Successfully pranked the boss! Stress -20, Mood +10');
      } else {
        // Normal work session
        energyCost = Math.round(hours * intensity * 3);
        stressGain = Math.round(hours * intensity * 2);
        experienceGain = Math.round(hours * intensity * 10);

        newStats.energy = Math.max(0, character.energy - energyCost);
        newStats.stress = Math.min(100, character.stress + stressGain);
        newStats.mood = Math.max(0, character.mood - Math.round(stressGain / 2));
        newStats.experience = character.experience + experienceGain;
        newStats.level = Math.floor(newStats.experience / 100) + 1;

        // Log work session
        await logWork({
          duration_hours: hours,
          intensity,
          energy_cost: energyCost,
          stress_gain: stressGain,
          experience_gain: experienceGain,
          pranked_boss: 0,
          notes: `${hours}h work at intensity ${intensity}`,
        });

        setSuccess(`Work complete! Energy -${energyCost}, Stress +${stressGain}, XP +${experienceGain}`);
      }

      // Update character
      await updateCharacter({
        stamina: newStats.stamina,
        energy: newStats.energy,
        nutrition: newStats.nutrition,
        mood: newStats.mood,
        stress: newStats.stress,
      });

      setCharacter(newStats);

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
          sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
        >
          🦭 Ocean Office
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

        {/* Character Status */}
        <Paper sx={{ p: { xs: 2, sm: 2, md: 3 }, mt: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">⚡ Energy</Typography>
                  <Typography variant="body2">{character.energy}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.energy}
                  sx={{ height: 8, borderRadius: 1 }}
                  color="secondary"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">😊 Mood</Typography>
                  <Typography variant="body2">{character.mood}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.mood}
                  sx={{ height: 8, borderRadius: 1 }}
                  color="success"
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">😰 Stress</Typography>
                  <Typography variant="body2">{character.stress}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.stress}
                  sx={{ height: 8, borderRadius: 1 }}
                  color="error"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip
                  label={`Level ${character.level}`}
                  color="primary"
                  variant="outlined"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    XP: {character.experience % 100}/100
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(character.experience % 100)}
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Ocean Work Scene */}
        <OceanWorkScene
          onWorkComplete={handleWorkComplete}
          characterStress={character.stress}
          characterEnergy={character.energy}
        />

        {/* Work Statistics */}
        {workStats && (
          <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
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
        <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
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
                  <ListItem>
                    <ListItemText
                      primary={
                        log.pranked_boss > 0
                          ? `💦 Pranked the boss! (${new Date(log.logged_at).toLocaleDateString()})`
                          : `${log.duration_hours}h work - Intensity ${log.intensity}/5`
                      }
                      secondary={
                        log.pranked_boss > 0
                          ? `Stress -${Math.abs(log.stress_gain)} • Mood boost!`
                          : `Energy -${log.energy_cost} • Stress +${log.stress_gain} • XP +${log.experience_gain}`
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
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