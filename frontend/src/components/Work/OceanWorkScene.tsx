/**
 * Ocean Work Scene Component
 * Seal employee chasing fish theme with rich ocean environment using Kenney assets
 *
 * Animation behaviors:
 * - Bubbles: Rise from bottom to top continuously
 * - Fish: Always swimming left-right regardless of work state
 * - Seal: Chases nearest fish, catches it, brings it to the hook
 */

import { useState, useEffect, useRef, useCallback } from 'react';
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
  caught: boolean; // whether the fish has been caught
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  img: string;
}

interface Decoration {
  id: number;
  type: string;
  x: string;
  y: string;
  size: number;
}

interface CaughtFishOnHook {
  id: number;
  type: string;
  yOffset: number;
}

// Seal states for the chase animation
type SealState = 'idle' | 'chasing' | 'carrying' | 'delivering';

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
  const totalFishToCatch = useRef(0);

  // Seal position and state (chasing fish)
  const [sealX, setSealX] = useState(20);
  const [sealY, setSealY] = useState(60);
  const [sealDirection, setSealDirection] = useState(1); // 1 = right, -1 = left
  const [sealState, setSealState] = useState<SealState>('idle');
  const [targetFishId, setTargetFishId] = useState<number | null>(null);
  const [carriedFish, setCarriedFish] = useState<Fish | null>(null);

  // Fish on the hook (delivered fish)
  const [fishOnHook, setFishOnHook] = useState<CaughtFishOnHook[]>([]);

  // Hook position (right side of screen)
  const hookX = 88;
  const hookY = 25;

  // Swimming fish in the ocean
  const [fish, setFish] = useState<Fish[]>([]);

  // Bubbles rising from bottom
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Static decorations (rocks and seaweed) - generated once on mount
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  // Animation frame ref
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Initialize scene on mount
  useEffect(() => {
    initializeFish();
    initializeBubbles();
    initializeDecorations();
  }, []);

  const initializeFish = () => {
    const fishTypes = ['blue', 'brown', 'green', 'grey', 'orange', 'pink', 'red'];
    const initialFish: Fish[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      type: fishTypes[Math.floor(Math.random() * fishTypes.length)],
      x: Math.random() * 70 + 10,
      y: Math.random() * 50 + 25,
      speed: Math.random() * 0.3 + 0.15,
      direction: Math.random() > 0.5 ? 1 : -1,
      caught: false,
    }));
    setFish(initialFish);
  };

  const initializeBubbles = () => {
    const bubbleImages = ['bubble_a', 'bubble_b', 'bubble_c'];
    const initialBubbles: Bubble[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 100 + 100, // Start below the visible area
      speed: Math.random() * 0.5 + 0.3,
      size: Math.random() * 10 + 10,
      img: bubbleImages[Math.floor(Math.random() * bubbleImages.length)],
    }));
    setBubbles(initialBubbles);
  };

  const initializeDecorations = () => {
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
  };

  // Fish always swim (regardless of work state)
  useEffect(() => {
    const interval = setInterval(() => {
      setFish(prev =>
        prev.map(f => {
          if (f.caught) return f; // Don't move caught fish

          let newX = f.x + f.speed * f.direction;
          let newDirection = f.direction;

          // Bounce at edges
          if (newX > 85) {
            newX = 85;
            newDirection = -1;
          } else if (newX < 5) {
            newX = 5;
            newDirection = 1;
          }

          return { ...f, x: newX, direction: newDirection };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Bubbles rise continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev =>
        prev.map(bubble => {
          let newY = bubble.y - bubble.speed;

          // Reset to bottom when reaching top
          if (newY < -10) {
            return {
              ...bubble,
              y: 110 + Math.random() * 20,
              x: Math.random() * 80 + 10,
            };
          }

          return { ...bubble, y: newY };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Seal chasing logic
  const updateSealChase = useCallback(() => {
    if (!isWorking) return;

    const chaseSpeed = workIntensity * 0.4 + 0.3; // Base speed + intensity multiplier

    if (sealState === 'idle' || sealState === 'chasing') {
      // Find the nearest uncaught fish
      const uncaughtFish = fish.filter(f => !f.caught);

      if (uncaughtFish.length === 0) {
        // All fish caught, work complete
        if (fishCaught >= totalFishToCatch.current) {
          setIsWorking(false);
          setSealState('idle');
          onWorkComplete(workHours, workIntensity);
        }
        return;
      }

      // Find nearest fish
      let nearestFish = uncaughtFish[0];
      let minDistance = Infinity;

      uncaughtFish.forEach(f => {
        const dist = Math.sqrt(Math.pow(f.x - sealX, 2) + Math.pow(f.y - sealY, 2));
        if (dist < minDistance) {
          minDistance = dist;
          nearestFish = f;
        }
      });

      setTargetFishId(nearestFish.id);
      setSealState('chasing');

      // Move seal towards fish
      const dx = nearestFish.x - sealX;
      const dy = nearestFish.y - sealY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Catch the fish!
        setFish(prev => prev.map(f =>
          f.id === nearestFish.id ? { ...f, caught: true } : f
        ));
        setCarriedFish(nearestFish);
        setSealState('carrying');
        setTargetFishId(null);
      } else {
        // Move towards fish
        const moveX = (dx / distance) * chaseSpeed;
        const moveY = (dy / distance) * chaseSpeed;

        setSealX(prev => prev + moveX);
        setSealY(prev => prev + moveY);
        setSealDirection(dx > 0 ? 1 : -1);
      }
    } else if (sealState === 'carrying') {
      // Move seal towards hook with the fish
      const dx = hookX - sealX;
      const dy = hookY - sealY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Deliver fish to hook!
        if (carriedFish) {
          setFishOnHook(prev => [
            ...prev,
            {
              id: carriedFish.id,
              type: carriedFish.type,
              yOffset: prev.length * 20, // Stack fish on the hook
            },
          ]);
          setCarriedFish(null);
          setFishCaught(prev => prev + 1);
        }
        setSealState('delivering');
      } else {
        // Move towards hook
        const moveX = (dx / distance) * chaseSpeed * 1.2; // Slightly faster when carrying
        const moveY = (dy / distance) * chaseSpeed * 1.2;

        setSealX(prev => prev + moveX);
        setSealY(prev => prev + moveY);
        setSealDirection(dx > 0 ? 1 : -1);
      }
    } else if (sealState === 'delivering') {
      // Move back to center to find next fish
      const centerX = 30;
      const centerY = 55;
      const dx = centerX - sealX;
      const dy = centerY - sealY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Ready to chase next fish
        setSealState('idle');
      } else {
        const moveX = (dx / distance) * chaseSpeed;
        const moveY = (dy / distance) * chaseSpeed;

        setSealX(prev => prev + moveX);
        setSealY(prev => prev + moveY);
        setSealDirection(dx > 0 ? 1 : -1);
      }
    }
  }, [isWorking, sealState, sealX, sealY, fish, carriedFish, hookX, hookY, workIntensity, fishCaught, onWorkComplete, workHours]);

  // Run seal chase animation
  useEffect(() => {
    if (!isWorking) return;

    const interval = setInterval(() => {
      updateSealChase();
    }, 50);

    return () => clearInterval(interval);
  }, [isWorking, updateSealChase]);

  const handleStartWork = () => {
    // Reset state
    setIsWorking(true);
    setFishCaught(0);
    setFishOnHook([]);
    setSealX(20);
    setSealY(60);
    setSealState('idle');
    setCarriedFish(null);
    setTargetFishId(null);

    // Calculate total fish to catch
    const total = Math.ceil(workHours * workIntensity);
    totalFishToCatch.current = total;

    // Reset all fish to uncaught and randomize positions
    const fishTypes = ['blue', 'brown', 'green', 'grey', 'orange', 'pink', 'red'];
    const newFish: Fish[] = Array.from({ length: Math.max(8, total) }, (_, i) => ({
      id: i,
      type: fishTypes[Math.floor(Math.random() * fishTypes.length)],
      x: Math.random() * 60 + 15,
      y: Math.random() * 45 + 30,
      speed: Math.random() * 0.3 + 0.15,
      direction: Math.random() > 0.5 ? 1 : -1,
      caught: false,
    }));
    setFish(newFish);
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
    const labels = ['Lazy Swim', 'Casual', 'Normal', 'Fast', 'Turbo'];
    return labels[value - 1] || 'Normal';
  };

  const estimatedStressIncrease = workHours * workIntensity * 2;
  const estimatedEnergyLoss = workHours * workIntensity * 3;

  // Get the fish that is currently being targeted
  const targetFish = fish.find(f => f.id === targetFishId);

  return (
    <Box>
      {/* Ocean Scene Visualization */}
      <Paper
        sx={{
          p: 0,
          mb: 3,
          background: 'linear-gradient(180deg, #87CEEB 0%, #4A90E2 30%, #2C5F8D 70%, #1a3a52 100%)',
          minHeight: { xs: 300, sm: 350, md: 400 },
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

        {/* Bubbles rising from bottom */}
        {bubbles.map(bubble => (
          <Box
            key={bubble.id}
            sx={{
              position: 'absolute',
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              zIndex: 8,
              opacity: 0.7,
              transition: 'top 0.05s linear',
            }}
          >
            <img
              src={`/assets/ocean/${bubble.img}.png`}
              alt="bubble"
              style={{
                width: `${bubble.size}px`,
                height: 'auto',
                imageRendering: 'pixelated',
              }}
            />
          </Box>
        ))}

        {/* Swimming Fish (always moving) */}
        {fish.filter(f => !f.caught).map(f => (
          <Box
            key={f.id}
            sx={{
              position: 'absolute',
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: f.direction === -1 ? 'scaleX(-1)' : 'none',
              transition: 'left 0.05s linear, top 0.05s linear',
              zIndex: 4,
              opacity: targetFishId === f.id ? 1 : 0.8,
              filter: targetFishId === f.id ? 'drop-shadow(0 0 5px yellow)' : 'none',
            }}
          >
            <img
              src={`/assets/ocean/fish_${f.type}.png`}
              alt={`${f.type} fish`}
              style={{
                width: '25px',
                height: 'auto',
                imageRendering: 'pixelated',
              }}
            />
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
            zIndex: 5,
          }}
        >
          {/* Fishing line */}
          <Box
            sx={{
              width: '2px',
              height: { xs: '80px', sm: '100px' },
              background: 'rgba(255, 255, 255, 0.5)',
            }}
          />
          {/* Hook */}
          <Typography sx={{ fontSize: { xs: '25px', sm: '35px' } }}>🪝</Typography>

          {/* Fish on the hook */}
          {fishOnHook.map((fh, index) => (
            <Box
              key={fh.id}
              sx={{
                position: 'absolute',
                top: { xs: 85 + index * 18, sm: 110 + index * 22 },
                transform: 'scaleX(-1)',
                animation: 'dangle 1s ease-in-out infinite',
                animationDelay: `${index * 0.2}s`,
                '@keyframes dangle': {
                  '0%, 100%': { transform: 'scaleX(-1) rotate(-5deg)' },
                  '50%': { transform: 'scaleX(-1) rotate(5deg)' },
                },
              }}
            >
              <img
                src={`/assets/ocean/fish_${fh.type}.png`}
                alt="caught fish"
                style={{
                  width: '20px',
                  height: 'auto',
                  imageRendering: 'pixelated',
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Seal Character (chasing fish) */}
        <Box
          sx={{
            position: 'absolute',
            left: `${sealX}%`,
            top: `${sealY}%`,
            transform: `scaleX(${sealDirection})`,
            transition: 'left 0.05s linear, top 0.05s linear',
            animation: isWorking ? 'swim 0.5s ease-in-out infinite' : 'bob 2s ease-in-out infinite',
            '@keyframes swim': {
              '0%, 100%': { transform: `scaleX(${sealDirection}) translateY(0) rotate(0deg)` },
              '25%': { transform: `scaleX(${sealDirection}) translateY(-3px) rotate(${sealDirection * 5}deg)` },
              '50%': { transform: `scaleX(${sealDirection}) translateY(0) rotate(0deg)` },
              '75%': { transform: `scaleX(${sealDirection}) translateY(3px) rotate(${sealDirection * -5}deg)` },
            },
            '@keyframes bob': {
              '0%, 100%': { transform: `scaleX(${sealDirection}) translateY(0)` },
              '50%': { transform: `scaleX(${sealDirection}) translateY(-8px)` },
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
            {/* Show carried fish */}
            {carriedFish && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -5,
                  left: sealDirection === 1 ? 45 : -20,
                  transform: `scaleX(${-sealDirection})`,
                }}
              >
                <img
                  src={`/assets/ocean/fish_${carriedFish.type}.png`}
                  alt="carried fish"
                  style={{
                    width: '20px',
                    height: 'auto',
                    imageRendering: 'pixelated',
                  }}
                />
              </Box>
            )}
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: -15,
                left: '50%',
                transform: `translateX(-50%) scaleX(${sealDirection})`,
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

        {/* Work Progress HUD */}
        {isWorking && (
          <Chip
            icon={<WorkIcon />}
            label={`Fish: ${fishCaught}/${totalFishToCatch.current} | ${sealState === 'chasing' ? 'Chasing...' : sealState === 'carrying' ? 'Carrying!' : sealState === 'delivering' ? 'Delivering...' : 'Ready'}`}
            color="primary"
            sx={{
              position: 'absolute',
              top: { xs: 10, sm: 20 },
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: { xs: '0.7rem', sm: '0.875rem' },
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
            High stress! Consider pranking the octopus boss!
          </Alert>
        )}
      </Paper>

      {/* Work Controls */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
          Chase Speed Setup
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
              { value: 1, label: 'Lazy' },
              { value: 2, label: 'Casual' },
              { value: 3, label: 'Normal' },
              { value: 4, label: 'Fast' },
              { value: 5, label: 'Turbo' },
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
            Energy: -{estimatedEnergyLoss}
          </Typography>
          <Typography variant="body2" color="warning.main">
            Stress: +{estimatedStressIncrease}
          </Typography>
          <Typography variant="body2" color="primary">
            Experience: +{Math.round(workHours * workIntensity * 10)}
          </Typography>
          <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
            Fish to catch: {Math.ceil(workHours * workIntensity)}
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
          {isWorking ? 'Working...' : 'Start Chase Session'}
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
          <strong> -20 Stress</strong>
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
            ? 'Cooldown (30s)'
            : characterStress < 30
            ? "Not stressed enough to prank"
            : 'Prank the Octopus Boss!'}
        </Button>
        {showPrankEffect && (
          <Alert severity="success" sx={{ mt: 2 }}>
            You pranked the octopus! Ink sprayed everywhere! Stress -20
          </Alert>
        )}
      </Paper>
    </Box>
  );
}