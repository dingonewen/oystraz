/**
 * Login Page
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
import { login, getCurrentUser } from '../services/authService';
import { useUserStore } from '../store/userStore';

// Logo-style gradient (red to green like the Oystraz logo)
const logoBorderGradient = 'linear-gradient(135deg, #F28B82 0%, #FDD663 25%, #81C995 50%, #8AB4F8 75%, #E8D5E7 100%)';

// Pearl iridescent gradient for title
const pearlTitleGradient = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #1f1f3d 50%, #1a1a2e 75%, #0f0f1a 100%)';
const pearlBorderGradient = 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)';

// Pearl purple button gradient
const pearlPurpleGradient = 'linear-gradient(135deg, #E8D5E7 0%, #D5C4E8 50%, #C4B5E0 100%)';

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setToken } = useUserStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Login and get token
      const authResponse = await login({ username, password });
      setToken(authResponse.access_token);

      // Get user info
      const userResponse = await getCurrentUser();
      setUser(userResponse);

      // Redirect to home
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        {/* Outer border with logo gradient */}
        <Box sx={{ p: '3px', borderRadius: '28px', background: logoBorderGradient }}>
          <Paper sx={{ p: 4, borderRadius: 3, background: pearlBorderGradient }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                component="img"
                src="/assets/pearl.png"
                alt="Oystraz"
                sx={{ width: 64, height: 64, filter: 'drop-shadow(0 0 8px rgba(232, 213, 231, 0.6))' }}
              />
            </Box>
            {/* Title with pearl gradient */}
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                background: pearlTitleGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 1000,
                WebkitTextStroke: '0.5px #CFACCE',
              }}
            >
              Oystraz: Your Personal Shell
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}> 
              Leave the grind outside. Your well-being starts now.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {/* TextField with dark gray input text */}
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                autoFocus
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#2c234b',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#2c234b',
                  },
                }}
              />
              {/* Pearl purple button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  background: pearlPurpleGradient,
                  color: '#2D2D2D',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #D5C4E8 0%, #C4B5E0 50%, #B5A6D8 100%)',
                  },
                  '&:disabled': {
                    background: '#555',
                    color: '#888',
                  },
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link href="/register" sx={{ cursor: 'pointer', color: '#CFACCE' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}