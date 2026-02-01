/**
 * Profile Page
 * User settings and profile management
 */

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useUserStore } from '../store/userStore';
import { updateUser } from '../services/authService';

export default function Profile() {
  const { user, setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    age: user?.age?.toString() || '',
    gender: user?.gender || '',
    height: user?.height?.toString() || '',
    weight: user?.weight?.toString() || '',
    goal: user?.goal || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(false);
    // Reset form data to current user data
    setFormData({
      full_name: user?.full_name || '',
      age: user?.age?.toString() || '',
      gender: user?.gender || '',
      height: user?.height?.toString() || '',
      weight: user?.weight?.toString() || '',
      goal: user?.goal || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Convert string values to numbers for API
      const dataToSave = {
        full_name: formData.full_name,
        age: formData.age ? parseFloat(formData.age) : undefined,
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        goal: formData.goal,
      };

      // Update user via API
      const updatedUser = await updateUser(dataToSave);

      // Update local user store
      setUser({
        ...user!,
        ...updatedUser,
      });

      setSuccess(true);
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const goalOptions = [
    { value: 'lose_weight', label: 'Lose Weight' },
    { value: 'gain_muscle', label: 'Gain Muscle' },
    { value: 'maintain', label: 'Maintain Health' },
    { value: 'improve_fitness', label: 'Improve Fitness' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

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
            Profile Settings
          </Typography>
          {!isEditing && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {/* Read-only fields */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
              >
                Account Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Username
              </Typography>
              <Typography variant="body1">
                {user?.username || 'Not set'}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1">
                {user?.email || 'Not set'}
              </Typography>
            </Grid>

            {/* Editable fields */}
            <Grid size={{ xs: 12 }} sx={{ mt: { xs: 1, sm: 2 } }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
              >
                Personal Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.full_name}
                  onChange={handleChange('full_name')}
                />
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {user?.full_name || 'Not set'}
                  </Typography>
                </>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange('age')}
                  inputProps={{ min: 1, max: 120 }}
                />
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Age
                  </Typography>
                  <Typography variant="body1">
                    {user?.age || 'Not set'}
                  </Typography>
                </>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={formData.gender}
                  onChange={handleChange('gender')}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Gender
                  </Typography>
                  <Typography variant="body1">
                    {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set'}
                  </Typography>
                </>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={handleChange('height')}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Height
                  </Typography>
                  <Typography variant="body1">
                    {user?.height || 0} cm
                  </Typography>
                </>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange('weight')}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Weight
                  </Typography>
                  <Typography variant="body1">
                    {user?.weight || 0} kg
                  </Typography>
                </>
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  select
                  label="Health Goal"
                  value={formData.goal}
                  onChange={handleChange('goal')}
                >
                  {goalOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Health Goal
                  </Typography>
                  <Typography variant="body1">
                    {user?.goal?.replace('_', ' ') || 'Not set'}
                  </Typography>
                </>
              )}
            </Grid>

            {/* Action buttons */}
            {isEditing && (
              <Grid size={{ xs: 12 }} sx={{ mt: { xs: 1, sm: 2 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1.5, sm: 2 },
                  }}
                >
                  <Button
                    fullWidth={true}
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{ flex: { sm: 1 } }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    fullWidth={true}
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={loading}
                    sx={{ flex: { sm: 1 } }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}