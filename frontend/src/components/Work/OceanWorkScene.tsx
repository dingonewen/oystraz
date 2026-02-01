/**
 * Ocean Work Scene Component
 * Seal employee chasing fish theme with rich ocean environment using Kenney assets
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
  type: string; // fish color: blue, brown, green, grey, orange, pink, red
  x: number;
  y: number;
  speed: number;
  direction: number; // 1 or -1
}

interface Decoration {
  id: number;
  type: string;
  x: string;
  y: string;
  size: number;
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

  // Static decorations (rocks and seaweed) - generated once on mount
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  // Initialize random swimming fish on mount
  useEffect(() => {
    const fishTypes = ['blue', 'brown', 'green', 'grey', 'orange', 'pink', 'red'];
    const initialFish: Fish[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      type: fishTypes[Math.floor(Math.random() * fishTypes.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      speed: Math.random() * 0.5 + 0.2,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));
    setBackgroundFish(initialFish);

    // Generate random decorations
    const rocks = [
      { id: 1, type: 'rock_a', x: '15%', y: '85%', size: 40 },
      { id: 2, type: 'rock_b', x: '60%', y: '88%', size: 35 },
      { id: 3, type: 'background_rock_a', x: '80%', y: '82%', size: 30 },
    ];

    const seaweeds = [
      { id: 4, type: 'seaweed_green_a', x: '25%', y: '75%', size: 50 },
      { id: 5, type: 'seaweed_pink_b', x: '45%', y: '80%', size: 45 },
      { id: 6, type: 'seaweed_orange_a', x: '70%', y: '78%', size: 48 },
      { id: 7, type: 'seaweed_grass_a', x: '35%', y: '83%', size: 40 },
    ];

    setDecorations([...rocks, ...seaweeds]);
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
        {/* Ocean Floor - Terrain with texture */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(139, 90, 43, 0.3) 50%, rgba(101, 67, 33, 0.5) 100%)',
            backgroundImage: 'url(/assets/ocean/background_terrain.png)',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'bottom',
            backgroundSize: 'auto 60%',
          }}
        />

        {/* Decorations (rocks and seaweed) */}
        {decorations.map(deco => (
          <Box
            key={deco.id}
            sx={{
              position: 'absolute',
              left: deco.x,
              top: deco.y,
              zIndex: deco.type.startsWith('rock') ? 3 : 2,
            }}
          >
            <img
              src={`/assets/ocean/${deco.type}.png`}
              alt={deco.type}
              style={{
                width: `${deco.size}px`,
                height: 'auto',
                imageRendering: 'pixelated', // Crisp pixel art
              }}
            />
          </Box>
        ))}

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
              zIndex: 4,
            }}
          >
            <img
              src={`/assets/ocean/fish_${fish.type}.png`}
              alt={`${fish.type} fish`}
              style={{
                width: '25px',
                height: 'auto',
                imageRendering: 'pixelated',
              }}
            />
          </Box>
        ))}

        {/* Fishing Hook (hanging from top) - Using emoji as requested */}
        <Box
          sx={{
            position: 'absolute',
            right: '10%',
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 5,
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
          {/* Hook (emoji - no asset available) */}
          <Typography sx={{ fontSize: { xs: '25px', sm: '35px' } }}>🪝</Typography>
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
            zIndex: 6,
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <img
              src="/assets/ocean/seal.png"
              alt="seal"
              style={{
                width: '60px',
                height: 'auto',
                imageRendering: 'pixelated',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: -15,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap',
              }}
            >
              You
            </Typography>
          </Box>
        </Box>

        {/* Octopus Boss (on platform) */}
        <Box
          sx={{
            position: 'absolute',
            right: '5%',
            top: '5%',
            textAlign: 'center',
            transform: octopusAnnoyed ? 'rotate(15deg) scale(1.1)' : 'none',
            transition: 'transform 0.3s',
            zIndex: 7,
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={`/assets/ocean/octopus_${octopusAnnoyed ? 'angry' : 'normal'}.png`}
              alt="octopus boss"
              style={{
                width: '70px',
                height: 'auto',
                imageRendering: 'pixelated',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: -15,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap',
              }}
            >
              Manager
            </Typography>
          </Box>
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
        {[
          { x: '30%', y: '40%', delay: 0, img: 'bubble_a' },
          { x: '50%', y: '25%', delay: 0.5, img: 'bubble_b' },
          { x: '75%', y: '35%', delay: 1, img: 'bubble_c' },
        ].map((bubble, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: bubble.x,
              bottom: bubble.y,
              animation: `float 3s ease-in-out infinite ${bubble.delay}s`,
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-20px)' },
              },
              zIndex: 8,
              opacity: 0.7,
            }}
          >
            <img
              src={`/assets/ocean/${bubble.img}.png`}
              alt="bubble"
              style={{
                width: '15px',
                height: 'auto',
                imageRendering: 'pixelated',
              }}
            />
          </Box>
        ))}

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
              zIndex: 10,
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
              zIndex: 10,
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