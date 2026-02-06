/**
 * Ocean Work Scene Component - IMPROVED VERSION
 * Seal employee chasing fish theme with rich ocean environment using Kenney assets
 *
 * IMPROVEMENTS:
 * 1. Smooth seal movement using CSS transitions
 * 2. Swimming animation (bobbing up/down)
 * 3. Complete prank animation (seal swims to octopus, pranks, swims back)
 * 4. Fish carried in front of seal's face smoothly
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
  type: string;
  x: number;
  y: number;
  speed: number;
  direction: number;
  caught: boolean;
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

// Seal states - EXPANDED for prank animation
type SealState = 'idle' | 'chasing' | 'carrying' | 'delivering' | 'pranking_move' | 'pranking_spray' | 'pranking_return';

export default function OceanWorkScene({
  onWorkComplete,
  characterStress,
  characterEnergy,
}: OceanWorkSceneProps) {
  const [workHours, setWorkHours] = useState(2);
  const [workIntensity, setWorkIntensity] = useState(3);
  const [isWorking, setIsWorking] = useState(false);
  const [prankCooldown, setPrankCooldown] = useState(false);
  const [showPrankEffect, setShowPrankEffect] = useState(false);

  const [fishCaught, setFishCaught] = useState(0);
  const [octopusAnnoyed, setOctopusAnnoyed] = useState(false);
  const totalFishToCatch = useRef(0);

  // Seal position and state
  const [sealX, setSealX] = useState(20);
  const [sealY, setSealY] = useState(60);
  const [sealDirection, setSealDirection] = useState(1);
  const [sealState, setSealState] = useState<SealState>('idle');
  const [targetFishId, setTargetFishId] = useState<number | null>(null);
  const [carriedFish, setCarriedFish] = useState<Fish | null>(null);

  // Swimming bobbing animation
  const [sealBobOffset, setSealBobOffset] = useState(0);
  
  // Prank animation state
  const prankStartPosition = useRef({ x: 0, y: 0 });

  const [fishOnHook, setFishOnHook] = useState<CaughtFishOnHook[]>([]);

  const hookX = 88;
  const hookY = 25;

  const [fish, setFish] = useState<Fish[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

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
      y: Math.random() * 100 + 100,
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

  // Swimming bobbing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSealBobOffset(Math.sin(Date.now() / 500) * 2); // Gentle up/down
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Fish swimming
  useEffect(() => {
    const interval = setInterval(() => {
      setFish(prev =>
        prev.map(f => {
          if (f.caught) return f;

          let newX = f.x + f.speed * f.direction;
          let newDirection = f.direction;

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

  // Bubbles rising
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev =>
        prev.map(bubble => {
          let newY = bubble.y - bubble.speed;

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

  // IMPROVED: Seal chasing logic with smooth movement
  const updateSealChase = useCallback(() => {
    if (!isWorking) return;

    const chaseSpeed = workIntensity * 0.4 + 0.3;

    if (sealState === 'idle' || sealState === 'chasing') {
      const uncaughtFish = fish.filter(f => !f.caught);

      if (uncaughtFish.length === 0) {
        if (fishCaught >= totalFishToCatch.current) {
          setIsWorking(false);
          setSealState('idle');
          onWorkComplete(workHours, workIntensity);
        }
        return;
      }

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

      const dx = nearestFish.x - sealX;
      const dy = nearestFish.y - sealY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Caught the fish!
        setFish(prev => prev.map(f => (f.id === nearestFish.id ? { ...f, caught: true } : f)));
        setCarriedFish(nearestFish);
        setSealState('carrying');
        setFishCaught(prev => prev + 1);
      } else {
        // Move towards fish - smooth update
        const moveX = (dx / distance) * chaseSpeed;
        const moveY = (dy / distance) * chaseSpeed;

        setSealX(prev => prev + moveX);
        setSealY(prev => prev + moveY);
        setSealDirection(dx > 0 ? 1 : -1);
      }
    } else if (sealState === 'carrying') {
      // Deliver to hook
      const dx = hookX - sealX;
      const dy = hookY - sealY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Arrived at hook!
        if (carriedFish) {
          setFishOnHook(prev => [
            ...prev,
            {
              id: carriedFish.id,
              type: carriedFish.type,
              yOffset: prev.length * 12,
            },
          ]);
        }
        setCarriedFish(null);
        setSealState('idle');
      } else {
        // Move towards hook
        const moveX = (dx / distance) * chaseSpeed;
        const moveY = (dy / distance) * chaseSpeed;

        setSealX(prev => prev + moveX);
        setSealY(prev => prev + moveY);
        setSealDirection(dx > 0 ? 1 : -1);
      }
    }
  }, [isWorking, sealState, fish, sealX, sealY, carriedFish, fishCaught, workHours, workIntensity, onWorkComplete]);

  // Animation loop
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;

      if (deltaTime >= 50) {
        updateSealChase();
        lastTimeRef.current = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isWorking) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isWorking, updateSealChase]);

  const handleStartWork = () => {
    if (characterEnergy < 20) return;

    const fishToChase = Math.ceil(workHours * workIntensity);
    totalFishToCatch.current = fishToChase;

    setIsWorking(true);
    setFishCaught(0);
    setSealState('idle');
    setFishOnHook([]);
    setCarriedFish(null);

    // Reset fish
    setFish(prev => prev.map(f => ({ ...f, caught: false })));
  };

  // NEW: Prank boss animation with smooth seal movement
  const handlePrankBoss = async () => {
    if (prankCooldown || characterStress < 30) return;

    // Save current position
    prankStartPosition.current = { x: sealX, y: sealY };

    // Phase 1: Swim to octopus (top right corner)
    const octopusX = 88;
    const octopusY = 15;

    setSealState('pranking_move');
    
    // Animate seal moving to octopus
    const moveToOctopus = () => {
      const dx = octopusX - sealX;
      const dy = octopusY - sealY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 3) {
        // Arrived! Spray ink!
        setSealState('pranking_spray');
        setShowPrankEffect(true);
        setOctopusAnnoyed(true);

        // Phase 2: Spray effect
        setTimeout(() => {
          // Phase 3: Return to original position
          setSealState('pranking_return');
          
          const returnInterval = setInterval(() => {
            const dx = prankStartPosition.current.x - sealX;
            const dy = prankStartPosition.current.y - sealY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 2) {
              // Back home!
              clearInterval(returnInterval);
              setSealState('idle');
              setShowPrankEffect(false);
              setOctopusAnnoyed(false);
              
              // Complete prank action
              onWorkComplete(0, 0, true);
            } else {
              const moveX = (dx / distance) * 0.8;
              const moveY = (dy / distance) * 0.8;
              setSealX(prev => prev + moveX);
              setSealY(prev => prev + moveY);
              setSealDirection(dx > 0 ? 1 : -1);
            }
          }, 50);
        }, 1500); // Stay at octopus for 1.5s

      } else {
        const moveX = (dx / distance) * 0.8;
        const moveY = (dy / distance) * 0.8;
        setSealX(prev => prev + moveX);
        setSealY(prev => prev + moveY);
        setSealDirection(dx > 0 ? 1 : -1);
      }
    };

    const prankMoveInterval = setInterval(moveToOctopus, 50);

    // Wait for arrival
    setTimeout(() => {
      clearInterval(prankMoveInterval);
    }, 3000);

    // Cooldown
    setPrankCooldown(true);
    setTimeout(() => setPrankCooldown(false), 30000);
  };

  const getWorkIntensityLabel = (intensity: number) => {
    const labels = ['', 'Lazy 🐌', 'Casual 🚶', 'Normal 🏃', 'Fast 🏃‍♂️💨', 'Turbo 🚀'];
    return labels[intensity] || '';
  };

  const estimatedEnergyLoss = Math.round(workHours * workIntensity * 3);
  const estimatedStressIncrease = Math.round(workHours * workIntensity * 2);

  return (
    <Box>
      <Paper
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 300, sm: 400, md: 500 },
          background: 'linear-gradient(180deg, #1e3a8a 0%, #0c4a6e 50%, #064e3b 100%)',
          overflow: 'hidden',
          mb: 3,
          borderRadius: 2,
        }}
      >
        {/* Decorations */}
        {decorations.map(deco => (
          <Box
            key={deco.id}
            sx={{
              position: 'absolute',
              left: deco.x,
              top: deco.y,
              zIndex: deco.type.includes('rock') ? 2 : 3,
            }}
          >
            <img
              src={`/assets/ocean/${deco.type}.png`}
              alt={deco.type}
              style={{
                width: `${deco.size}px`,
                height: 'auto',
                imageRendering: 'pixelated',
              }}
            />
          </Box>
        ))}

        {/* Bubbles */}
        {bubbles.map(bubble => (
          <Box
            key={bubble.id}
            sx={{
              position: 'absolute',
              left: `${bubble.x}%`,
              bottom: `${bubble.y}%`,
              zIndex: 1,
            }}
          >
            <img
              src={`/assets/ocean/${bubble.img}.png`}
              alt="bubble"
              style={{
                width: `${bubble.size}px`,
                height: 'auto',
                opacity: 0.6,
                imageRendering: 'pixelated',
              }}
            />
          </Box>
        ))}

        {/* Swimming Fish */}
        {fish.map(
          f =>
            !f.caught && (
              <Box
                key={f.id}
                sx={{
                  position: 'absolute',
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  transform: `scaleX(${f.direction}) translateY(${Math.sin(Date.now() / 400 + f.id) * 3}px)`,
                  transition: 'left 0.3s ease-out, top 0.3s ease-out',
                  zIndex: 4,
                }}
              >
                <img
                  src={`/assets/ocean/fish_${f.type}.png`}
                  alt="fish"
                  style={{
                    width: '25px',
                    height: 'auto',
                    imageRendering: 'pixelated',
                  }}
                />
              </Box>
            )
        )}

        {/* Hook with caught fish */}
        <Box
          sx={{
            position: 'absolute',
            right: `${100 - hookX}%`,
            top: `${hookY}%`,
            zIndex: 6,
          }}
        >
          <img
            src="/assets/ocean/hook.png"
            alt="hook"
            style={{
              width: '30px',
              height: 'auto',
              imageRendering: 'pixelated',
            }}
          />
          {fishOnHook.map(f => (
            <Box
              key={f.id}
              sx={{
                position: 'absolute',
                top: f.yOffset,
                left: -5,
              }}
            >
              <img
                src={`/assets/ocean/fish_${f.type}.png`}
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

        {/* IMPROVED Seal with smooth movement */}
        <Box
          sx={{
            position: 'absolute',
            left: `${sealX}%`,
            top: `${sealY + sealBobOffset}%`,
            // KEY: Add transition for smooth movement!
            transition: 'left 0.15s ease-out, top 0.15s ease-out',
            transform: `scaleX(${sealDirection})`,
            zIndex: 5,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <img
              src="/assets/ocean/seal.png"
              alt="seal"
              style={{
                width: '50px',
                height: 'auto',
                imageRendering: 'pixelated',
              }}
            />
            {/* Fish carried in front of seal's face */}
            {carriedFish && (
              <Box
                sx={{
                  position: 'absolute',
                  left: sealDirection > 0 ? 40 : -15,
                  top: 10,
                  transform: `scaleX(${sealDirection})`,
                  // KEY: Smooth carrying animation
                  transition: 'all 0.2s ease-out',
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
             
            </Typography>
          </Box>
        </Box>

        {/* Octopus Boss */}
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
              
            </Typography>
          </Box>
          {/* IMPROVED prank effect */}
          {showPrankEffect && (
            <Typography
              variant="h2"
              sx={{
                position: 'absolute',
                top: 60,
                left: -20,
                animation: 'inkSpray 2s ease-out',
                '@keyframes inkSpray': {
                  '0%': { opacity: 1, transform: 'translateY(0) scale(1) rotate(0deg)' },
                  '50%': { opacity: 0.8, transform: 'translateY(30px) scale(1.5) rotate(180deg)' },
                  '100%': { opacity: 0, transform: 'translateY(60px) scale(2) rotate(360deg)' },
                },
              }}
            >
              💨💦💨
            </Typography>
          )}
        </Box>

        {/* Work Progress HUD */}
        {isWorking && (
          <Chip
            icon={<WorkIcon />}
            label={`Fish: ${fishCaught}/${totalFishToCatch.current} | ${
              sealState === 'chasing'
                ? 'Chasing...'
                : sealState === 'carrying'
                ? 'Carrying!'
                : sealState === 'delivering'
                ? 'Delivering...'
                : 'Ready'
            }`}
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

        {/* Prank State Display */}
        {(sealState === 'pranking_move' || sealState === 'pranking_spray' || sealState === 'pranking_return') && (
          <Chip
            label={
              sealState === 'pranking_move'
                ? 'Sneaking to boss...'
                : sealState === 'pranking_spray'
                ? 'PRANKING! 💦'
                : 'Escaping...'
            }
            color="secondary"
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
        {characterStress > 70 && !isWorking && sealState === 'idle' && (
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

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Work Duration: <strong>{workHours} hours</strong>
          </Typography>
          <Slider
            value={workHours}
            onChange={(_, value) => setWorkHours(value as number)}
            min={1}
            max={16}
            step={0.5}
            marks
            valueLabelDisplay="auto"
            disabled={isWorking || sealState !== 'idle'}
          />
        </Box>

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
            disabled={isWorking || sealState !== 'idle'}
          />
        </Box>

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

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<WorkIcon />}
          onClick={handleStartWork}
          disabled={isWorking || characterEnergy < 20 || sealState !== 'idle'}
        >
          {isWorking ? 'Working...' : sealState !== 'idle' ? 'Seal is busy...' : 'Start Chase Session'}
        </Button>

        {characterEnergy < 20 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Too tired to chase fish! Rest or eat something first.
          </Alert>
        )}
      </Paper>

      {/* Stress Relief - Prank the Boss! */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#FFF9C4' }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
        >
          <EmojiEventsIcon color="primary" />
          Stress Relief Zone
        </Typography>
        <Typography variant="body2" paragraph>
          Feeling stressed from chasing fish all day? Watch the seal sneak up and spray the octopus boss with ink!
          <strong> -20 Stress, +10 Mood</strong>
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          size="large"
          startIcon={<SpaIcon />}
          onClick={handlePrankBoss}
          disabled={prankCooldown || characterStress < 30 || sealState !== 'idle'}
        >
          {prankCooldown
            ? 'Cooldown (30s)'
            : characterStress < 30
            ? 'Not stressed enough to prank'
            : sealState !== 'idle'
            ? 'Seal is busy...'
            : 'Prank the Octopus Boss! 💦'}
        </Button>
        {showPrankEffect && (
          <Alert severity="success" sx={{ mt: 2 }}>
            😂 You pranked the octopus! Ink sprayed everywhere! Stress -20, Mood +10
          </Alert>
        )}
      </Paper>
    </Box>
  );
}