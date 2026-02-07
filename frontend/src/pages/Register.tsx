/**
 * Registration Page
 * Ocean theme with pearl shimmer effects
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { register, getCurrentUser } from '../services/authService';
import { useUserStore } from '../store/userStore';

// Pearl iridescent gradients
const pearlTitleGradient = 'linear-gradient(135deg, #F5E6E8 0%, #E8E0F0 25%, #E0EBF5 50%, #F0EDE5 75%, #F8F0E8 100%)';
const pearlBorderGradient = 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)';

export default function Register() {
  const navigate = useNavigate();
  const { setUser, setToken } = useUserStore();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Register and get token
      const authResponse = await register(formData);
      setToken(authResponse.access_token);

      // Get user info
      const userResponse = await getCurrentUser();
      setUser(userResponse);

      // Redirect to home
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Box sx={{ p: '2px', borderRadius: '26px', background: pearlBorderGradient }}>
          <Paper sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(180deg, rgba(26, 58, 92, 0.15) 0%, transparent 100%)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                component="img"
                src="/assets/pearl.png"
                alt="Oystraz"
                sx={{ width: 64, height: 64, filter: 'drop-shadow(0 0 8px rgba(232, 213, 231, 0.6))' }}
              />
            </Box>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                background: pearlTitleGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
              }}
            >
              Join Oystraz
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
              Start your health journey today
            </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link href="/login" sx={{ cursor: 'pointer' }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}