/**
 * Diet Log Component
 * Search USDA food database and log meals
 */

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { searchFoods, logDiet, getTodayDietLogs, deleteDietLog } from '../../services/healthService';
import { usePearlBubble } from '../../hooks/usePearlBubble';

interface FoodItem {
  fdcId: number;
  description: string;
  calories?: number;
}

interface DietLogItem {
  id: number;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: number;
  logged_at: string;
}

export default function DietLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingSize, setServingSize] = useState('100');
  const [todayLogs, setTodayLogs] = useState<DietLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { triggerActivityBubble } = usePearlBubble();

  useEffect(() => {
    loadTodayLogs();
  }, []);

  const loadTodayLogs = async () => {
    try {
      setIsLoading(true);
      const logs = await getTodayDietLogs();
      setTodayLogs(logs);
    } catch (err) {
      console.error('Failed to load diet logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setError(null);
      const results = await searchFoods(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search foods. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleLogFood = async () => {
    if (!selectedFood) return;

    try {
      setIsLoading(true);
      setError(null);
      const servingSizeNum = parseFloat(servingSize) || 100;
      const calories = Math.round((selectedFood.calories || 0) * servingSizeNum / 100);
      await logDiet({
        food_name: selectedFood.description,
        calories,
        protein: 0, // Will be enhanced with actual nutrition data
        carbs: 0,
        fat: 0,
        serving_size: servingSizeNum,
      });
      setSuccess('Meal logged successfully!');
      setSelectedFood(null);
      setServingSize('100');
      await loadTodayLogs();

      // Trigger Pearl bubble
      triggerActivityBubble('diet', { calories });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to log meal. Please try again.');
      console.error('Log error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLog = async (id: number) => {
    try {
      await deleteDietLog(id);
      await loadTodayLogs();
    } catch (err) {
      setError('Failed to delete log.');
      console.error('Delete error:', err);
    }
  };

  const totalCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);

  return (
    <Box sx={{ px: { xs: 0, sm: 1, md: 3 } }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
      >
        Log Your Meals
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
      >
        Search for foods in the USDA database (600,000+ items)
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

      {/* Food Search */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mt: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
          <Grid size={{ xs: 12, sm: 9 }}>
            <TextField
              fullWidth
              placeholder="Search for food (e.g., chicken breast, apple, rice)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isSearching}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <List sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
            {searchResults.map((food) => (
              <ListItemButton
                key={food.fdcId}
                onClick={() => handleSelectFood(food)}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={food.description}
                  secondary={food.calories ? `~${food.calories} cal/100g` : 'Nutrition data available'}
                />
              </ListItemButton>
            ))}
          </List>
        )}

        {/* Selected Food */}
        {selectedFood && (
          <Box sx={{ mt: { xs: 2, sm: 3 }, p: { xs: 1.5, sm: 2 }, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' } }}
            >
              Selected: {selectedFood.description}
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center" sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Serving Size (grams)"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Estimated: {Math.round((selectedFood.calories || 0) * (parseFloat(servingSize) || 100) / 100)} calories
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleLogFood}
                  disabled={isLoading}
                >
                  Log This Meal
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Today's Logs */}
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
            Today's Meals
          </Typography>
          <Chip
            label={`Total: ${totalCalories} cal`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        {isLoading && !selectedFood ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : todayLogs.length === 0 ? (
          <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
            <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              No meals logged today. Start by searching for foods above!
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
                    primary={log.food_name}
                    secondary={
                      <>
                        {log.calories} cal • {log.serving_size}g
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