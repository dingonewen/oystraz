/**
 * Stats Page
 * Data visualization and reports
 * Ocean theme with pearl shimmer effects
 */

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from '@mui/material';

// Pearl iridescent gradient for title
const pearlTitleGradient = 'linear-gradient(135deg, #F5E6E8 0%, #E8E0F0 25%, #E0EBF5 50%, #F0EDE5 75%, #F8F0E8 100%)';
// Dark pearl gradient
const darkPearlGradient = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #1f1f3d 50%, #1a1a2e 75%, #0f0f1a 100%)';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getDietLogs, getExerciseLogs, getSleepLogs } from '../services/healthService';
import type { DietLog, ExerciseLog, SleepLog } from '../types';

interface DailyStats {
  date: string;
  calories: number;
  exercise: number;
  sleep: number;
  sleepQuality: number;
}

interface TimeAllocation {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export default function Stats() {
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [totalStats, setTotalStats] = useState({
    avgCalories: 0,
    avgExercise: 0,
    avgSleep: 0,
    totalWorkouts: 0,
  });
  const [timeAllocation, setTimeAllocation] = useState<TimeAllocation[]>([]);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const days = parseInt(timeRange);

      // Fetch all health logs
      const [dietLogs, exerciseLogs, sleepLogs] = await Promise.all([
        getDietLogs(days),
        getExerciseLogs(days),
        getSleepLogs(days),
      ]);

      // Process data by date
      const statsMap = new Map<string, DailyStats>();

      // Initialize dates for the past N days
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        statsMap.set(dateStr, {
          date: dateStr,
          calories: 0,
          exercise: 0,
          sleep: 0,
          sleepQuality: 0,
        });
      }

      // Aggregate diet logs
      dietLogs.forEach((log: DietLog) => {
        const date = new Date(log.logged_at).toISOString().split('T')[0];
        const stats = statsMap.get(date);
        if (stats) {
          stats.calories += log.calories || 0;
        }
      });

      // Aggregate exercise logs
      exerciseLogs.forEach((log: ExerciseLog) => {
        const date = new Date(log.logged_at).toISOString().split('T')[0];
        const stats = statsMap.get(date);
        if (stats) {
          stats.exercise += log.calories_burned || 0;
        }
      });

      // Aggregate sleep logs
      sleepLogs.forEach((log: SleepLog) => {
        const date = new Date(log.logged_at).toISOString().split('T')[0];
        const stats = statsMap.get(date);
        if (stats) {
          stats.sleep = log.duration_hours || 0;
          stats.sleepQuality = log.quality_score || 0;
        }
      });

      // Convert map to array and sort by date
      const statsArray = Array.from(statsMap.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Format dates for display (MM/DD)
      const formattedStats = statsArray.map((stat) => ({
        ...stat,
        date: new Date(stat.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      }));

      setDailyStats(formattedStats);

      // Calculate totals
      const totalCalories = formattedStats.reduce((sum, day) => sum + day.calories, 0);
      const totalExercise = formattedStats.reduce((sum, day) => sum + day.exercise, 0);
      const totalSleep = formattedStats.reduce((sum, day) => sum + day.sleep, 0);
      // Use actual days with recorded data for more accurate averages
      const daysWithData = formattedStats.filter((day) => day.calories > 0 || day.exercise > 0 || day.sleep > 0).length || 1;

      setTotalStats({
        avgCalories: Math.round(totalCalories / daysWithData),
        avgExercise: Math.round(totalExercise / daysWithData),
        avgSleep: parseFloat((totalSleep / daysWithData).toFixed(1)),
        totalWorkouts: exerciseLogs.length,
      });

      // Calculate time allocation for pie chart (use daysWithData for accurate averages)
      const avgSleepHours = totalSleep / daysWithData;

      // Calculate average exercise time in hours
      const totalExerciseMinutes = exerciseLogs.reduce((sum, log) => sum + (log.duration_minutes || 0), 0);
      const avgExerciseHours = totalExerciseMinutes / daysWithData / 60;

      // Assume 8 hours of work per day (can be made configurable later)
      const avgWorkHours = 8;

      // Calculate leisure time
      const avgLeisureHours = Math.max(0, 24 - avgSleepHours - avgExerciseHours - avgWorkHours);

      // Ocean theme colors with pearl iridescence
      setTimeAllocation([
        { name: 'Sleep', value: parseFloat(avgSleepHours.toFixed(1)), color: '#8AB4F8' },  // Ocean blue
        { name: 'Work', value: parseFloat(avgWorkHours.toFixed(1)), color: '#81C995' },   // Sea green
        { name: 'Exercise', value: parseFloat(avgExerciseHours.toFixed(1)), color: '#4dd0e1' }, // Cyan
        { name: 'Leisure', value: parseFloat(avgLeisureHours.toFixed(1)), color: '#E8D5E7' },   // Pearl pink
      ]);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: { xs: 2, sm: 3 },
            gap: 2,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              background: pearlTitleGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
            }}
          >
            Your Statistics
          </Typography>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(_, value) => value && setTimeRange(value)}
            size="small"
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            <ToggleButton value="7">7 Days</ToggleButton>
            <ToggleButton value="30">30 Days</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Summary Cards - 2x2 on mobile */}
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 3, background: darkPearlGradient, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(138, 180, 248, 0.15)' } }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }} gutterBottom>
                  Avg Calories/Day
                </Typography>
                <Typography variant="h4" sx={{ color: '#8AB4F8', fontSize: { xs: '1.5rem', sm: '2rem' } }}>{totalStats.avgCalories}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  kcal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 3, background: darkPearlGradient, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(129, 201, 149, 0.15)' } }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }} gutterBottom>
                  Avg Exercise/Day
                </Typography>
                <Typography variant="h4" sx={{ color: '#81C995', fontSize: { xs: '1.5rem', sm: '2rem' } }}>{totalStats.avgExercise}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  kcal burned
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 3, background: darkPearlGradient, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(77, 208, 225, 0.15)' } }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }} gutterBottom>
                  Avg Sleep/Night
                </Typography>
                <Typography variant="h4" sx={{ color: '#4dd0e1', fontSize: { xs: '1.5rem', sm: '2rem' } }}>{totalStats.avgSleep}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 3, background: darkPearlGradient, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(232, 213, 231, 0.15)' } }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }} gutterBottom>
                  Total Workouts
                </Typography>
                <Typography variant="h4" sx={{ color: '#E8D5E7', fontSize: { xs: '1.5rem', sm: '2rem' } }}>{totalStats.totalWorkouts}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  sessions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Time Allocation Pie Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 2, md: 3 }, mb: { xs: 2, sm: 2, md: 3 }, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Daily Time Allocation (24 Hours)
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={timeAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}h`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {timeAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} hours`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Calories Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 2, md: 3 }, mb: { xs: 2, sm: 2, md: 3 }, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Daily Calorie Intake
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#8AB4F8"
                fill="#8AB4F8"
                fillOpacity={0.6}
                name="Calories (kcal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* Exercise Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 2, md: 3 }, mb: { xs: 2, sm: 2, md: 3 }, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Daily Exercise Activity
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="exercise" fill="#81C995" name="Calories Burned (kcal)" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Sleep Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 2, md: 3 }, mb: { xs: 2, sm: 2, md: 3 }, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sleep Duration & Quality
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sleep"
                stroke="#8AB4F8"
                strokeWidth={2}
                name="Sleep (hours)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sleepQuality"
                stroke="#81C995"
                strokeWidth={2}
                name="Quality (0-5)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Net Calories Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 2, md: 3 }, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Net Calories (Intake - Exercise)
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#8AB4F8"
                strokeWidth={2}
                name="Intake (kcal)"
              />
              <Line
                type="monotone"
                dataKey="exercise"
                stroke="#4dd0e1"
                strokeWidth={2}
                name="Burned (kcal)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Container>
  );
}