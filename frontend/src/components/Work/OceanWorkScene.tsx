/**
 * Ocean Work Scene Component
 * Seal employee chasing fish theme with rich ocean environment
 */

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Slider, Chip, Alert } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SpaIcon from '@mui/icons-material/Spa';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface OceanWorkSceneProps {
  onWorkComplete: (hours: number, intensity: number, isPrank?: boolean) => void;
  characterStress: number;
  characterEnergy: number;
}

interface Fish {
  id: number;
  type: string; // fish type for different images
  x: number;
  y: number;
  speed: number;
  direction: number; // 1 or -1
}

export default function OceanWorkScene({
  onWorkComplete,
  characterStress,
  characterEnergy,
}: OceanWorkSceneProps) {
  const [workHours, setWorkHours] = useState(2);
  const [workIntensity, setWorkIntensity] = useState(3); // 1-5 scale (chase speed)
  const [isWorking, setIsWorking] = useState(false);
  const [prankCooldown, setPrankCooldown] = useState(false);
  const [showPrankEffect, setShowPrankEffect] = useState(false);

  // Work scene state
  const [fishCaught, setFishCaught] = useState(0);
  const [octopusAnnoyed, setOctopusAnnoyed] = useState(false);

  // Seal position (chasing fish)
  const [sealX, setSealX] = useState(20);
  const [sealY, setSealY] = useState(60);
  const [sealDirection, setSealDirection] = useState(1); // 1 = right, -1 = left

  // Swimming fish in the ocean
  const [backgroundFish, setBackgroundFish] = useState<Fish[]>([]);

  // Initialize random swimming fish on mount
  useEffect(() => {
    const fishTypes = ['fish1', 'fish2', 'fish3', 'fish4', 'fish5'];
    const initialFish: Fish[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      type: fishTypes[Math.floor(Math.random() * fishTypes.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      speed: Math.random() * 0.5 + 0.2,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));
    setBackgroundFish(initialFish);
  }, []);

  // Animate background fish swimming
  useEffect(() => {
    if (!isWorking) return;

    const interval = setInterval(() => {
      setBackgroundFish(prev =>
        prev.map(fish => {
          let newX = fish.x + fish.speed * fish.direction;
          let newDirection = fish.direction;

          // Bounce at edges
          if (newX > 90) {
            newX = 90;
            newDirection = -1;
          } else if (newX < 10) {
            newX = 10;
            newDirection = 1;
          }

          return { ...fish, x: newX, direction: newDirection };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isWorking]);

  const handleStartWork = () => {
    setIsWorking(true);
    setFishCaught(0);
    setSealX(20);
    setSealY(60);

    // Calculate chase speed based on intensity
    // Intensity 1 = slowest (low energy cost), 5 = fastest (high energy cost)
    const chaseSpeed = workIntensity * 0.8; // Speed multiplier
    const totalFish = Math.ceil(workHours * workIntensity);

    let caught = 0;
    let currentX = 20;
    let currentY = 60;

    // Seal chases fish across the screen
    const chaseInterval = setInterval(() => {
      // Move seal across screen
      currentX += chaseSpeed;
      currentY = 60 + Math.sin(currentX / 10) * 10; // Swimming motion

      setSealX(currentX);
      setSealY(currentY);
      setSealDirection(1);

      // When seal reaches end, "catch" a fish
      if (currentX > 80) {
        caught += 1;
        setFishCaught(caught);

        // Reset seal position for next fish
        currentX = 20;
        setSealX(20);

        if (caught >= totalFish) {
          clearInterval(chaseInterval);
          setTimeout(() => {
            setIsWorking(false);
            onWorkComplete(workHours, workIntensity);
          }, 500);
        }
      }
    }, 50);
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
    const labels = ['🐌 Lazy Swim', '🦭 Casual', '🏊 Normal', '⚡ Fast', '🚀 Turbo'];
    return labels[value - 1] || 'Normal';
  };

  const estimatedStressIncrease = workHours * workIntensity * 2;
  const estimatedEnergyLoss = workHours * workIntensity * 3;

  return (
    <Box>
      {/* Ocean Scene Visualization */}
      <Paper
        sx={{
          p: 0,
          mb: 3,
          background: 'linear-gradient(180deg, #87CEEB 0%, #4A90E2 30%, #2C5F8D 70%, #1a3a52 100%)',
          minHeight: { xs: 250, sm: 350, md: 400 },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        {/* Ocean Floor - Terrain */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(139, 90, 43, 0.3) 50%, rgba(101, 67, 33, 0.5) 100%)',
          }}
        />

        {/* Rocks (decorative) - Use Kenney assets here */}
        <Box sx={{ position: 'absolute', bottom: '5%', left: '15%' }}>
          <Typography sx={{ fontSize: { xs: '30px', sm: '40px' } }}>🪨</Typography>
        </Box>
        <Box sx={{ position: 'absolute', bottom: '3%', left: '60%' }}>
          <Typography sx={{ fontSize: { xs: '25px', sm: '35px' } }}>🪨</Typography>
        </Box>
        <Box sx={{ position: 'absolute', bottom: '8%', left: '80%' }}>
          <Typography sx={{ fontSize: { xs: '20px', sm: '30px' } }}>🪨</Typography>
        </Box>

        {/* Seaweed (decorative) - Use Kenney assets here */}
        <Box sx={{ position: 'absolute', bottom: '5%', left: '25%' }}>
          <Typography sx={{ fontSize: { xs: '40px', sm: '50px' } }}>🌿</Typography>
        </Box>
        <Box sx={{ position: 'absolute', bottom: '3%', left: '45%' }}>
          <Typography sx={{ fontSize: { xs: '35px', sm: '45px' } }}>🌿</Typography>
        </Box>
        <Box sx={{ position: 'absolute', bottom: '6%', left: '70%' }}>
          <Typography sx={{ fontSize: { xs: '38px', sm: '48px' } }}>🌿</Typography>
        </Box>

        {/* Background Swimming Fish (ambient) */}
        {backgroundFish.map(fish => (
          <Box
            key={fish.id}
            sx={{
              position: 'absolute',
              left: `${fish.x}%`,
              top: `${fish.y}%`,
              transform: fish.direction === -1 ? 'scaleX(-1)' : 'none',
              opacity: isWorking ? 1 : 0.6,
              transition: 'left 0.05s linear, opacity 0.3s',
            }}
          >
            {/* Replace with <img src={`/assets/ocean/${fish.type}.png`} /> */}
            <Typography sx={{ fontSize: { xs: '20px', sm: '25px' } }}>🐟</Typography>
          </Box>
        ))}

        {/* Fishing Hook (hanging from top) */}
        <Box
          sx={{
            position: 'absolute',
            right: '10%',
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Fishing line */}
          <Box
            sx={{
              width: '2px',
              height: { xs: '150px', sm: '200px' },
              background: 'rgba(255, 255, 255, 0.5)',
            }}
          />
          {/* Hook */}
          <Typography sx={{ fontSize: { xs: '25px', sm: '35px' } }}>🪝</Typography>
          {/* Replace with <img src="/assets/ocean/hook.png" style={{ width: '30px' }} /> */}
        </Box>

        {/* Seal Character (chasing fish) */}
        <Box
          sx={{
            position: 'absolute',
            left: `${sealX}%`,
            top: `${sealY}%`,
            transform: sealDirection === -1 ? 'scaleX(-1)' : 'none',
            transition: isWorking ? 'none' : 'all 0.3s',
            animation: isWorking ? 'swim 1s ease-in-out infinite' : 'none',
            '@keyframes swim': {
              '0%, 100%': { transform: `scaleX(${sealDirection}) translateY(0)` },
              '50%': { transform: `scaleX(${sealDirection}) translateY(-5px)` },
            },
          }}
        >
          <Typography variant="h1" sx={{ fontSize: { xs: '40px', sm: '60px' } }}>
            🦭
          </Typography>
          {/* Replace with <img src="/assets/ocean/seal.png" style={{ width: '60px' }} /> */}
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>
            You
          </Typography>
        </Box>

        {/* Octopus Boss (on boat/platform) */}
        <Box
          sx={{
            position: 'absolute',
            right: '5%',
            top: '5%',
            textAlign: 'center',
            transform: octopusAnnoyed ? 'rotate(15deg) scale(1.1)' : 'none',
            transition: 'transform 0.3s',
          }}
        >
          <Typography variant="h1" sx={{ fontSize: { xs: '50px', sm: '70px' } }}>
            🐙
          </Typography>
          {/* Replace with <img src="/assets/ocean/octopus.png" style={{ width: '70px' }} /> */}
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
            Manager
          </Typography>
          {showPrankEffect && (
            <Typography
              variant="h2"
              sx={{
                position: 'absolute',
                top: 60,
                left: -20,
                animation: 'inkSpray 2s',
                '@keyframes inkSpray': {
                  '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                  '100%': { opacity: 0, transform: 'translateY(50px) scale(2)' },
                },
              }}
            >
              💨💦
            </Typography>
          )}
        </Box>

        {/* Bubbles (ambient decoration) */}
        <Box sx={{ position: 'absolute', left: '30%', bottom: '40%', animation: 'float 3s ease-in-out infinite', '@keyframes float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } } }}>
          <Typography sx={{ fontSize: '15px', opacity: 0.6 }}>○</Typography>
        </Box>
        <Box sx={{ position: 'absolute', left: '50%', bottom: '25%', animation: 'float 4s ease-in-out infinite 0.5s', '@keyframes float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } } }}>
          <Typography sx={{ fontSize: '12px', opacity: 0.5 }}>○</Typography>
        </Box>
        <Box sx={{ position: 'absolute', left: '75%', bottom: '35%', animation: 'float 3.5s ease-in-out infinite 1s', '@keyframes float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } } }}>
          <Typography sx={{ fontSize: '18px', opacity: 0.7 }}>○</Typography>
        </Box>

        {/* Work Progress HUD */}
        {isWorking && (
          <Chip
            icon={<WorkIcon />}
            label={`Fish Caught: ${fishCaught} 🐟 | Chasing...`}
            color="primary"
            sx={{
              position: 'absolute',
              top: { xs: 10, sm: 20 },
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          />
        )}

        {/* Stress Warning */}
        {characterStress > 70 && !isWorking && (
          <Alert
            severity="warning"
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: { xs: '90%', sm: '80%' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            ⚠️ High stress! Consider pranking the octopus boss!
          </Alert>
        )}
      </Paper>

      {/* Work Controls */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
          🎣 Chase Speed Setup
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Set how fast the seal chases fish. Faster = more work done, but higher energy cost and stress!
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

        {/* Chase Speed (Work Intensity) Slider */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Chase Speed: <strong>{getWorkIntensityLabel(workIntensity)}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Even at slowest speed, the seal will catch all fish eventually!
          </Typography>
          <Slider
            value={workIntensity}
            onChange={(_, value) => setWorkIntensity(value as number)}
            min={1}
            max={5}
            step={1}
            marks={[
              { value: 1, label: '🐌' },
              { value: 2, label: '🦭' },
              { value: 3, label: '🏊' },
              { value: 4, label: '⚡' },
              { value: 5, label: '🚀' },
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
          <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
            🐟 Fish to catch: {Math.ceil(workHours * workIntensity)}
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
          {isWorking ? 'Chasing Fish... 🦭💨' : 'Start Chase Session'}
        </Button>

        {characterEnergy < 20 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Too tired to chase fish! Rest or eat something first.
          </Alert>
        )}
      </Paper>

      {/* Stress Relief - Prank the Boss! */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#FFF9C4' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
          <EmojiEventsIcon color="primary" />
          Stress Relief Zone
        </Typography>
        <Typography variant="body2" paragraph>
          Feeling stressed from chasing fish all day? Sneak up and spray the octopus boss with ink!
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
            😂 You pranked the octopus! Ink sprayed everywhere! Stress -20
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
