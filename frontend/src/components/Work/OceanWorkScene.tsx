/**
 * Ocean Work Scene Component
 * Seal employee vs Octopus manager theme
 */

import { useState } from 'react';
import { Box, Button, Typography, Paper, Slider, Chip, Alert } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SpaIcon from '@mui/icons-material/Spa';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface OceanWorkSceneProps {
  onWorkComplete: (hours: number, intensity: number, isPrank?: boolean) => void;
  characterStress: number;
  characterEnergy: number;
}

export default function OceanWorkScene({
  onWorkComplete,
  characterStress,
  characterEnergy,
}: OceanWorkSceneProps) {
  const [workHours, setWorkHours] = useState(2);
  const [workIntensity, setWorkIntensity] = useState(3); // 1-5 scale
  const [isWorking, setIsWorking] = useState(false);
  const [prankCooldown, setPrankCooldown] = useState(false);
  const [showPrankEffect, setShowPrankEffect] = useState(false);

  // Work scene state
  const [fishCaught, setFishCaught] = useState(0);
  const [octopusAnnoyed, setOctopusAnnoyed] = useState(false);

  const handleStartWork = () => {
    setIsWorking(true);
    setFishCaught(0);

    // Simulate work progress
    const fishPerHour = workIntensity;
    const totalFish = workHours * fishPerHour;

    let caught = 0;
    const interval = setInterval(() => {
      caught += 1;
      setFishCaught(caught);

      if (caught >= totalFish) {
        clearInterval(interval);
        setTimeout(() => {
          setIsWorking(false);
          onWorkComplete(workHours, workIntensity);
        }, 1000);
      }
    }, (workHours * 1000) / totalFish); // Distribute over work duration
  };

  const handlePrankBoss = () => {
    if (prankCooldown) return;

    setShowPrankEffect(true);
    setOctopusAnnoyed(true);
    setPrankCooldown(true);

    // Reduce stress by pranking the boss!
    onWorkComplete(0, 0, true); // Trigger character update with prank effect

    // Visual effect timeout
    setTimeout(() => {
      setShowPrankEffect(false);
      setOctopusAnnoyed(false);
    }, 2000);

    // Cooldown timer (30 seconds)
    setTimeout(() => {
      setPrankCooldown(false);
    }, 30000);
  };

  const getWorkIntensityLabel = (value: number) => {
    const labels = ['😴 Slacking', '🚶 Easy', '💼 Normal', '⚡ Busy', '🔥 Overtime'];
    return labels[value - 1] || 'Normal';
  };

  const estimatedStressIncrease = workHours * workIntensity * 2;
  const estimatedEnergyLoss = workHours * workIntensity * 3;

  return (
    <Box>
      {/* Ocean Scene Visualization */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          background: 'linear-gradient(180deg, #87CEEB 0%, #4A90E2 50%, #2C5F8D 100%)',
          minHeight: 300,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Seal Character (Employee) */}
        <Box
          sx={{
            position: 'absolute',
            left: '20%',
            bottom: '30%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h1" sx={{ fontSize: { xs: '60px', sm: '80px' } }}>
            🦭
          </Typography>
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
            You (Seal Employee)
          </Typography>
          {isWorking && (
            <Typography variant="h3" sx={{ position: 'absolute', top: -20, left: 40 }}>
              🎣
            </Typography>
          )}
        </Box>

        {/* Octopus Boss */}
        <Box
          sx={{
            position: 'absolute',
            right: '20%',
            top: '20%',
            textAlign: 'center',
            transform: octopusAnnoyed ? 'rotate(15deg)' : 'none',
            transition: 'transform 0.3s',
          }}
        >
          <Typography variant="h1" sx={{ fontSize: { xs: '60px', sm: '80px' } }}>
            🐙
          </Typography>
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
            Manager Octopus
          </Typography>
          {showPrankEffect && (
            <Typography
              variant="h2"
              sx={{
                position: 'absolute',
                top: 80,
                left: -20,
                animation: 'fadeOut 2s',
                '@keyframes fadeOut': {
                  '0%': { opacity: 1, transform: 'translateY(0)' },
                  '100%': { opacity: 0, transform: 'translateY(50px)' },
                },
              }}
            >
              💨💦
            </Typography>
          )}
        </Box>

        {/* Fish (Work Tasks) */}
        {isWorking && (
          <Box sx={{ position: 'absolute', left: '40%', bottom: '40%' }}>
            <Typography variant="h3">🐟</Typography>
          </Box>
        )}

        {/* Work Progress */}
        {isWorking && (
          <Chip
            icon={<WorkIcon />}
            label={`Fish Caught: ${fishCaught} 🐟`}
            color="primary"
            sx={{
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )}

        {/* Stress Warning */}
        {characterStress > 70 && (
          <Alert
            severity="warning"
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
            }}
          >
            ⚠️ High stress detected! Consider pranking the octopus boss or taking a break!
          </Alert>
        )}
      </Paper>

      {/* Work Controls */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          🎣 Work Session Setup
        </Typography>

        {/* Work Hours Slider */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Work Duration: <strong>{workHours} hours</strong>
          </Typography>
          <Slider
            value={workHours}
            onChange={(_, value) => setWorkHours(value as number)}
            min={1}
            max={8}
            step={0.5}
            marks
            valueLabelDisplay="auto"
            disabled={isWorking}
          />
        </Box>

        {/* Work Intensity Slider */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Work Intensity: <strong>{getWorkIntensityLabel(workIntensity)}</strong>
          </Typography>
          <Slider
            value={workIntensity}
            onChange={(_, value) => setWorkIntensity(value as number)}
            min={1}
            max={5}
            step={1}
            marks={[
              { value: 1, label: '😴' },
              { value: 2, label: '🚶' },
              { value: 3, label: '💼' },
              { value: 4, label: '⚡' },
              { value: 5, label: '🔥' },
            ]}
            valueLabelDisplay="auto"
            disabled={isWorking}
          />
        </Box>

        {/* Impact Preview */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Estimated Impact:</strong>
          </Typography>
          <Typography variant="body2" color="error">
            ⚡ Energy: -{estimatedEnergyLoss}
          </Typography>
          <Typography variant="body2" color="warning.main">
            😰 Stress: +{estimatedStressIncrease}
          </Typography>
          <Typography variant="body2" color="primary">
            ⭐ Experience: +{Math.round(workHours * workIntensity * 10)}
          </Typography>
        </Box>

        {/* Start Work Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<WorkIcon />}
          onClick={handleStartWork}
          disabled={isWorking || characterEnergy < 20}
        >
          {isWorking ? 'Working... 🎣' : 'Start Work Session'}
        </Button>

        {characterEnergy < 20 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Too tired to work! Rest or eat something first.
          </Alert>
        )}
      </Paper>

      {/* Stress Relief - Prank the Boss! */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#FFF9C4' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEventsIcon color="primary" />
          Stress Relief Zone
        </Typography>
        <Typography variant="body2" paragraph>
          Feeling stressed? Sneak up on the octopus boss and squirt his ink!
          <strong> -20 Stress</strong> 💨
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          size="large"
          startIcon={<SpaIcon />}
          onClick={handlePrankBoss}
          disabled={prankCooldown || characterStress < 30}
        >
          {prankCooldown
            ? '⏳ Cooldown (30s)'
            : characterStress < 30
            ? "😌 Not stressed enough to prank"
            : '💦 Prank the Octopus Boss!'}
        </Button>
        {showPrankEffect && (
          <Alert severity="success" sx={{ mt: 2 }}>
            😂 You pranked the octopus! Ink squirted everywhere! Stress -20
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
