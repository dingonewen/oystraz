/**
 * Stats Page
 * Data visualization and reports
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

      setTimeAllocation([
        { name: 'Sleep', value: parseFloat(avgSleepHours.toFixed(1)), color: '#8884d8' },
        { name: 'Work', value: parseFloat(avgWorkHours.toFixed(1)), color: '#82ca9d' },
        { name: 'Exercise', value: parseFloat(avgExerciseHours.toFixed(1)), color: '#ffc658' },
        { name: 'Leisure', value: parseFloat(avgLeisureHours.toFixed(1)), color: '#ff7c7c' },
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
            sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
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

        {/* Summary Cards */}
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Avg Calories/Day
                </Typography>
                <Typography variant="h4">{totalStats.avgCalories}</Typography>
                <Typography variant="body2" color="text.secondary">
                  kcal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Avg Exercise/Day
                </Typography>
                <Typography variant="h4">{totalStats.avgExercise}</Typography>
                <Typography variant="body2" color="text.secondary">
                  kcal burned
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Avg Sleep/Night
                </Typography>
                <Typography variant="h4">{totalStats.avgSleep}</Typography>
                <Typography variant="body2" color="text.secondary">
                  hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Workouts
                </Typography>
                <Typography variant="h4">{totalStats.totalWorkouts}</Typography>
                <Typography variant="body2" color="text.secondary">
                  sessions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Time Allocation Pie Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 2, md: 3 }, mb: { xs: 2, sm: 2, md: 3 } }}>
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
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 2, md: 3 }, mb: { xs: 2, sm: 2, md: 3 } }}>
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
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="Calories (kcal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* Exercise Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 2, md: 3 }, mb: { xs: 2, sm: 2, md: 3 } }}>
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
              <Bar dataKey="exercise" fill="#82ca9d" name="Calories Burned (kcal)" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Sleep Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 2, md: 3 }, mb: { xs: 2, sm: 2, md: 3 } }}>
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
                stroke="#8884d8"
                strokeWidth={2}
                name="Sleep (hours)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sleepQuality"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Quality (0-5)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Net Calories Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 2, md: 3 } }}>
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
                stroke="#8884d8"
                strokeWidth={2}
                name="Intake (kcal)"
              />
              <Line
                type="monotone"
                dataKey="exercise"
                stroke="#ff7300"
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