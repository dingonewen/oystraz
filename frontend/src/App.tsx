/**
 * Main App Component
 * Root component with routing and layout
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
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
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import WorkIcon from '@mui/icons-material/Work';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Pages
import Home from './pages/Home';
import Track from './pages/Track';
import Work from './pages/Work';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Components
import PearlAssistant from './components/PearlAssistant';
import BackgroundMusic from './components/BackgroundMusic';
import PearlBubble from './components/PearlBubble';
import PearlIdleReminder from './components/PearlIdleReminder';

// Store
import { useUserStore } from './store/userStore';
import { useAudioStore } from './store/audioStore';
import { usePearlStore, type PearlActivityLevel } from './store/pearlStore';

// Material Design 3 Dark Theme with Google's Dark Mode palette
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8AB4F8', // MD3 Primary Blue
      light: '#AECBFA',
      dark: '#669DF6',
    },
    secondary: {
      main: '#81C995', // MD3 Secondary Green
      light: '#A8DAB5',
      dark: '#5BB974',
    },
    error: {
      main: '#F28B82', // MD3 Error
    },
    warning: {
      main: '#FDD663', // MD3 Warning
    },
    background: {
      default: '#131314', // Google Dark Mode background
      paper: '#1E1F20', // Elevated surface
    },
    text: {
      primary: '#E3E3E3',
      secondary: '#9AA0A6',
    },
    divider: '#3C4043',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 },
    h2: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 500 },
    h6: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 500 },
    button: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 500 },
  },
  shape: {
    borderRadius: 24, // MD3 large radius for cards
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default gradient
          borderRadius: 24,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundColor: '#1E1F20',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          background: 'linear-gradient(135deg, #E8D5E7 0%, #D5C4E8 50%, #C4B5E0 100%)',
          color: '#2D2D2D',
          '&:hover': {
            background: 'linear-gradient(135deg, #D5C4E8 0%, #C4B5E0 50%, #B5A6D8 100%)',
          },
          '&:disabled': {
            background: '#555',
            color: '#888',
          },
        },
        outlined: {
          borderColor: '#E8D5E7',
          color: '#E8D5E7',
          '&:hover': {
            borderColor: '#D5C4E8',
            backgroundColor: 'rgba(232, 213, 231, 0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
          borderRadius: 0,
        },
      },
    },
  },
});

// Navigation component that needs router context
function AppNavigation() {
  const { isAuthenticated, logout } = useUserStore();
  const { isMuted, toggleMute } = useAudioStore();
  const { activityLevel, setActivityLevel } = usePearlStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cycleActivityLevel = () => {
    const levels: PearlActivityLevel[] = ['calm', 'flow', 'tide'];
    const currentIndex = levels.indexOf(activityLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    setActivityLevel(levels[nextIndex]);
  };

  const getActivityLabel = () => {
    switch (activityLevel) {
      case 'calm': return '🌊 Calm';
      case 'flow': return '🌊🌊 Flow';
      case 'tide': return '🌊🌊🌊 Tide';
    }
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Track', icon: <TrackChangesIcon />, path: '/track' },
    { text: 'Work', icon: <WorkIcon />, path: '/work' },
    { text: 'Stats', icon: <BarChartIcon />, path: '/stats' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
          backdropFilter: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <img
              src="/assets/ocean/seal.png"
              alt="seal"
              style={{ width: 28, height: 'auto', imageRendering: 'pixelated' }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                background: 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Oystraz
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
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
                Surface
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer - narrower */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 160,
          },
        }}
      >
        <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/assets/ocean/seal.png"
            alt="seal"
            style={{ width: 24, height: 'auto', imageRendering: 'pixelated' }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Oystraz
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.path)}>
                <ListItemIcon sx={{ color: '#E8D5E7', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      background: 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 500,
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={cycleActivityLevel}>
              <ListItemIcon sx={{ color: '#E8D5E7', minWidth: 36 }}>
                <AutoAwesomeIcon />
              </ListItemIcon>
              <ListItemText
                primary={getActivityLabel()}
                secondary="Pearl Mode"
                sx={{
                  '& .MuiListItemText-primary': {
                    background: 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.65rem',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleMute}>
              <ListItemIcon sx={{ color: '#E8D5E7', minWidth: 36 }}>
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </ListItemIcon>
              <ListItemText
                primary={isMuted ? 'Unmute' : 'Mute'}
                sx={{
                  '& .MuiListItemText-primary': {
                    background: 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 500,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ color: '#E8D5E7', minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Surface"
                sx={{
                  '& .MuiListItemText-primary': {
                    background: 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 500,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

function App() {
  const { isAuthenticated } = useUserStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Navigation Bar */}
          <AppNavigation />

          {/* Toolbar spacer for fixed AppBar */}
          {isAuthenticated && <Box sx={{ height: { xs: 56, sm: 64 } }} />}

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', py: 3 }}>
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

          {/* Pearl AI Assistant - Global floating widget */}
          {isAuthenticated && <PearlAssistant />}

          {/* Background Music - plays after login */}
          {isAuthenticated && <BackgroundMusic />}

          {/* Pearl Bubble - quick comments */}
          {isAuthenticated && <PearlBubble />}

          {/* Pearl Idle Reminder - for Tide mode */}
          {isAuthenticated && <PearlIdleReminder />}

          {/* Footer - compact to avoid overlap with Pearl button */}
          <Box
            component="footer"
            sx={{
              py: 1.5,
              px: 2,
              mt: 'auto',
              backgroundColor: '#1E1F20',
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                Oystraz - Orchestrate your health
              </Typography>
            </Container>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;