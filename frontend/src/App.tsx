/**
 * Main App Component
 * Root component with routing and layout
 */

import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';

// Pages
import Home from './pages/Home';
import Track from './pages/Track';
import Work from './pages/Work';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Store
import { useUserStore } from './store/userStore';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Health Green
    },
    secondary: {
      main: '#2196F3', // Energy Blue
    },
    error: {
      main: '#F44336', // Stress Red
    },
    warning: {
      main: '#FF9800', // Caution Orange
    },
  },
});

function App() {
  const { isAuthenticated, logout } = useUserStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Navigation Bar - only show when authenticated */}
          {isAuthenticated && (
            <AppBar position="static" elevation={1}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  🎮 Oystraz
                </Typography>

                <Button color="inherit" component={RouterLink} to="/">
                  Home
                </Button>
                <Button color="inherit" component={RouterLink} to="/track">
                  Track
                </Button>
                <Button color="inherit" component={RouterLink} to="/work">
                  Work
                </Button>
                <Button color="inherit" component={RouterLink} to="/stats">
                  Stats
                </Button>
                <Button color="inherit" component={RouterLink} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </Toolbar>
            </AppBar>
          )}

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fafafa', py: 3 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/track" element={<Track />} />
              <Route path="/work" element={<Work />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Box>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[200]
                  : theme.palette.grey[800],
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                Oystraz - Orchestrate your health. Control your life.
              </Typography>
            </Container>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;