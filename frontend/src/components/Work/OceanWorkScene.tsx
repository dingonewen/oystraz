/**
 * Ocean Work Scene - Smooth CSS Transition Version
 * Uses CSS transitions for buttery smooth seal movement
 * Uses our custom image assets
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Slider, Button, Alert, Paper } from '@mui/material';

interface Props {
  onWorkComplete: (hours: number, intensity: number, isPrank?: boolean) => void;
  characterStress: number;
  characterEnergy: number;
  characterStamina?: number;
  characterMood?: number;
}

interface Fish {
  id: number;
  type: number; // 1-4 for different fish images
  x: number;
  y: number;
  speed: number;
  direction: number;
  caught: boolean;
}

type SealState = 'idle' | 'chasing' | 'carrying' | 'delivering';

const OceanWorkScene: React.FC<Props> = ({
  onWorkComplete,
  characterStress,
  characterEnergy,
  characterStamina = 100,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Work parameters
  const [workHours, setWorkHours] = useState(4);
  const [workIntensity, setWorkIntensity] = useState(3);
  const [isWorking, setIsWorking] = useState(false);

  // Scene state
  const [sealState, setSealState] = useState<SealState>('idle');
  const [fishCaught, setFishCaught] = useState(0);
  const [fishList, setFishList] = useState<Fish[]>([]);
  const [hookedFish, setHookedFish] = useState<{ id: number; type: number }[]>([]);
  const [isPranking, setIsPranking] = useState(false);
  const [prankCooldown, setPrankCooldown] = useState(false);

  // Seal position - use refs for smooth updates without re-renders
  const [sealPos, setSealPos] = useState({ x: 20, y: 55 });
  const [sealDirection, setSealDirection] = useState(1);
  const sealPosRef = useRef({ x: 20, y: 55 });

  // Estimated impacts (matching health_calculator formulas)
  const estimatedStressIncrease = Math.round(workHours * workIntensity * 0.8);
  const estimatedEnergyLoss = Math.round(workHours * workIntensity * 0.5);
  const estimatedStaminaLoss = workHours > 8
    ? Math.round(workHours * 0.5 + (workHours - 8) * 5)
    : Math.round(workHours * 0.5);
  const estimatedXP = Math.round(workHours * workIntensity * 10);
  const totalFishGoal = Math.ceil(workHours * workIntensity);

  // Initialize fish
  const initFish = (count: number) => {
    return Array.from({ length: Math.max(8, count + 3) }).map((_, i) => ({
      id: i,
      type: Math.floor(Math.random() * 4) + 1,
      x: 10 + Math.random() * 55,
      y: 25 + Math.random() * 50,
      speed: 0.08 + Math.random() * 0.15,
      direction: Math.random() > 0.5 ? 1 : -1,
      caught: false,
    }));
  };

  useEffect(() => {
    setFishList(initFish(10));
  }, []);

  // Fish swimming animation
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setFishList((prev) =>
        prev.map((f) => {
          if (f.caught) return f;
          let nx = f.x + f.speed * f.direction;
          let nd = f.direction;
          if (nx > 70) { nx = 70; nd = -1; }
          else if (nx < 5) { nx = 5; nd = 1; }
          return { ...f, x: nx, direction: nd };
        })
      );
    }, 50);
    return () => clearInterval(moveInterval);
  }, []);

  // Core chase AI - smooth movement with requestAnimationFrame
  useEffect(() => {
    if (!isWorking) return;

    let animationId: number;
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      const chaseSpeed = (workIntensity * 8 + 10) * deltaTime; // Speed per second
      const hookX = 85;
      const hookY = 30;
      const currentX = sealPosRef.current.x;
      const currentY = sealPosRef.current.y;

      let newX = currentX;
      let newY = currentY;
      let newDirection = sealDirection;

      if (sealState === 'chasing' || sealState === 'idle') {
        const available = fishList.filter((f) => !f.caught);
        if (available.length === 0) {
          if (fishCaught < totalFishGoal) {
            setFishList((prev) => [...prev, ...initFish(5).map((f, i) => ({ ...f, id: prev.length + i }))]);
          }
          animationId = requestAnimationFrame(tick);
          return;
        }

        let nearest = available[0];
        let minDist = Infinity;
        available.forEach((f) => {
          const d = Math.sqrt(Math.pow(f.x - currentX, 2) + Math.pow(f.y - currentY, 2));
          if (d < minDist) { minDist = d; nearest = f; }
        });

        const dx = nearest.x - currentX;
        const dy = nearest.y - currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 6) {
          setFishList((prev) => prev.map((f) => (f.id === nearest.id ? { ...f, caught: true } : f)));
          setSealState('carrying');
        } else {
          newX = currentX + (dx / dist) * chaseSpeed;
          newY = currentY + (dy / dist) * chaseSpeed;
          newDirection = dx > 0 ? 1 : -1;
          if (sealState === 'idle') setSealState('chasing');
        }
      } else if (sealState === 'carrying') {
        const dx = hookX - currentX;
        const dy = hookY - currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 6) {
          const caughtFish = fishList.find((f) => f.caught && !hookedFish.some((h) => h.id === f.id));
          if (caughtFish) {
            setHookedFish((prev) => [...prev, { id: caughtFish.id, type: caughtFish.type }]);
            setFishCaught((prev) => prev + 1);
          }
          setSealState('delivering');
        } else {
          newX = currentX + (dx / dist) * chaseSpeed * 1.3;
          newY = currentY + (dy / dist) * chaseSpeed * 1.3;
          newDirection = dx > 0 ? 1 : -1;
        }
      } else if (sealState === 'delivering') {
        const dx = 25 - currentX;
        const dy = 55 - currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
          if (fishCaught >= totalFishGoal) {
            handleWorkDone();
            return;
          } else {
            setSealState('chasing');
          }
        } else {
          newX = currentX + (dx / dist) * chaseSpeed;
          newY = currentY + (dy / dist) * chaseSpeed;
          newDirection = dx > 0 ? 1 : -1;
        }
      }

      // Update position ref and state
      if (newX !== currentX || newY !== currentY) {
        sealPosRef.current = { x: newX, y: newY };
        setSealPos({ x: newX, y: newY });
        if (newDirection !== sealDirection) {
          setSealDirection(newDirection);
        }
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [isWorking, sealState, fishList, workIntensity, fishCaught, totalFishGoal, hookedFish, sealDirection]);

  // Auto-prank when overworked (24+ fish)
  useEffect(() => {
    if (hookedFish.length >= 24 && !isPranking && isWorking && !prankCooldown) {
      triggerPrank();
    }
  }, [hookedFish.length, isPranking, isWorking, prankCooldown]);

  const handleWorkDone = () => {
    setIsWorking(false);
    setSealState('idle');
    onWorkComplete(workHours, workIntensity);
    sealPosRef.current = { x: 20, y: 55 };
    setSealPos({ x: 20, y: 55 });
  };

  const startSession = () => {
    if (characterEnergy < 20) return;
    setIsWorking(true);
    setFishCaught(0);
    setHookedFish([]);
    setFishList(initFish(totalFishGoal + 5));
    setSealState('chasing');
  };

  const triggerPrank = () => {
    if (isPranking || prankCooldown) return;
    setIsPranking(true);
    setPrankCooldown(true);

    sealPosRef.current = { x: 80, y: 15 };
    setSealPos({ x: 80, y: 15 });

    setTimeout(() => {
      onWorkComplete(0, 0, true);
      setIsPranking(false);
      sealPosRef.current = { x: 20, y: 55 };
      setSealPos({ x: 20, y: 55 });
    }, 1500);

    setTimeout(() => setPrankCooldown(false), 30000);
  };

  const getIntensityLabel = (value: number) => {
    const labels = ['Lazy', 'Casual', 'Normal', 'Fast', 'Turbo'];
    return labels[value - 1] || 'Normal';
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      {/* Ocean Scene */}
      <Paper
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          height: { xs: 320, sm: 380, md: 420 },
          background: 'linear-gradient(180deg, #1a3a5c 0%, #0d2137 50%, #0a192f 100%)',
        }}
      >
        {/* Ocean floor */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '25%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(139, 90, 43, 0.2) 100%)',
            backgroundImage: 'url(/assets/ocean/background_terrain.png)',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'bottom',
            backgroundSize: 'auto 80%',
          }}
        />

        {/* Decorations */}
        <Box sx={{ position: 'absolute', bottom: '8%', left: '8%', opacity: 0.7 }}>
          <img src="/assets/ocean/rock_1.png" alt="" style={{ width: 50, imageRendering: 'pixelated' }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: '10%', left: '35%', opacity: 0.6 }}>
          <img src="/assets/ocean/seaweed_1.png" alt="" style={{ width: 30, imageRendering: 'pixelated' }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: '12%', right: '25%', opacity: 0.5 }}>
          <img src="/assets/ocean/seaweed_2.png" alt="" style={{ width: 25, imageRendering: 'pixelated' }} />
        </Box>

        {/* Bubbles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            style={{
              position: 'absolute',
              left: `${15 + i * 18}%`,
              bottom: 0,
              width: 8 + Math.random() * 6,
              height: 8 + Math.random() * 6,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
            }}
            animate={{ y: [0, -300], opacity: [0.6, 0] }}
            transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}

        {/* Fish Hook */}
        <Box sx={{ position: 'absolute', right: '10%', top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          <Box sx={{ width: 2, height: 80, bgcolor: 'rgba(255,255,255,0.4)' }} />
          <Typography sx={{ fontSize: 32, mt: -1 }}>🪝</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column-reverse', mt: -1 }}>
            <AnimatePresence>
              {hookedFish.slice(-12).map((f) => (
                <motion.div
                  key={`hooked-${f.id}`}
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  style={{ marginTop: -4 }}
                >
                  <img src={`/assets/ocean/fish_${f.type}.png`} alt="fish" style={{ width: 22, imageRendering: 'pixelated' }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
          {hookedFish.length > 12 && (
            <Typography sx={{ fontSize: 10, color: 'white', mt: 1 }}>+{hookedFish.length - 12}</Typography>
          )}
        </Box>

        {/* Swimming Fish */}
        {fishList.filter((f) => !f.caught).map((f) => (
          <motion.div
            key={f.id}
            style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%`, transform: `scaleX(${f.direction})` }}
            animate={{ y: [0, -3, 0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src={`/assets/ocean/fish_${f.type}.png`} alt="fish" style={{ width: 28, imageRendering: 'pixelated' }} />
          </motion.div>
        ))}

        {/* Octopus Boss */}
        <motion.div
          style={{ position: 'absolute', right: '5%', top: '5%', zIndex: 20 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Box sx={{ position: 'relative', textAlign: 'center' }}>
            <img src="/assets/ocean/octopus.png" alt="boss" style={{ width: 65 }} />
            <Typography sx={{ fontSize: 9, fontWeight: 'bold', px: 1, py: 0.3, borderRadius: 2, bgcolor: 'grey.700', color: 'white', mt: 0.5 }}>BOSS</Typography>
          </Box>
        </motion.div>

        {/* Seal Employee - CSS transition for smooth movement */}
        <Box
          sx={{
            position: 'absolute',
            left: `${sealPos.x}%`,
            top: `${sealPos.y}%`,
            zIndex: 30,
            transition: 'left 0.05s linear, top 0.05s linear',
            transform: `scaleX(${sealDirection})`,
          }}
        >
          <motion.div
            animate={{ rotate: isWorking ? [0, -5, 5, 0] : [-2, 2, -2] }}
            transition={{ duration: isWorking ? 0.3 : 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative' }}
          >
            <img src="/assets/ocean/seal.png" alt="seal" style={{ width: 70 }} />
            {sealState === 'carrying' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: -5, right: -10 }}>
                <img src={`/assets/ocean/fish_${fishList.find((f) => f.caught && !hookedFish.some((h) => h.id === f.id))?.type || 1}.png`} alt="carried" style={{ width: 24 }} />
              </motion.div>
            )}
            {isPranking && (
              <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: -40 }} style={{ position: 'absolute', top: 0, left: '50%', fontSize: 32 }}>💦</motion.div>
            )}
            <Typography sx={{ position: 'absolute', bottom: -12, left: '50%', transform: `translateX(-50%) scaleX(${sealDirection})`, fontSize: 10, fontWeight: 'bold', color: 'white', textShadow: '1px 1px 2px black' }}>You</Typography>
          </motion.div>
        </Box>

        {/* Progress Bar */}
        {isWorking && (
          <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', width: '80%', maxWidth: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontSize: 10, color: 'cyan', fontWeight: 'bold' }}>PROGRESS</Typography>
              <Typography sx={{ fontSize: 10, color: 'cyan', fontWeight: 'bold' }}>{fishCaught} / {totalFishGoal} FISH</Typography>
            </Box>
            <Box sx={{ height: 6, bgcolor: 'rgba(0,100,150,0.3)', borderRadius: 1, overflow: 'hidden' }}>
              <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #00bcd4, #4dd0e1)', boxShadow: '0 0 10px #00bcd4' }} initial={{ width: 0 }} animate={{ width: `${Math.min(100, (fishCaught / totalFishGoal) * 100)}%` }} />
            </Box>
            <Typography sx={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', textAlign: 'center', mt: 1, textTransform: 'uppercase' }}>{sealState}</Typography>
          </Box>
        )}
      </Paper>

      {/* Controls */}
      {!isWorking && (
        <Paper sx={{ p: 3, mt: 2, borderRadius: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">DURATION</Typography>
              <Slider value={workHours} onChange={(_, v) => setWorkHours(v as number)} min={1} max={8} marks valueLabelDisplay="auto" valueLabelFormat={(v) => `${v}h`} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">INTENSITY: {getIntensityLabel(workIntensity)}</Typography>
              <Slider value={workIntensity} onChange={(_, v) => setWorkIntensity(v as number)} min={1} max={5} marks valueLabelDisplay="auto" />
            </Box>
          </Box>

          <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>Estimated Impact:</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              <Typography variant="body2" color="error.main">Energy: -{estimatedEnergyLoss}</Typography>
              <Typography variant="body2" color="info.main">Stamina: -{estimatedStaminaLoss}</Typography>
              <Typography variant="body2" color="warning.main">Stress: +{estimatedStressIncrease}</Typography>
              <Typography variant="body2" color="success.main">XP: +{estimatedXP}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Fish to catch: {totalFishGoal}</Typography>
            {workHours > 8 && <Typography variant="caption" color="error">⚠️ Overwork penalty!</Typography>}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" fullWidth size="large" onClick={startSession} disabled={characterEnergy < 20} sx={{ py: 1.5 }}>
              🦭 START FISHING
            </Button>
            <Button variant="outlined" onClick={triggerPrank} disabled={isPranking || prankCooldown || characterStress < 30} sx={{ minWidth: 60 }}>💦</Button>
          </Box>

          {characterEnergy < 20 && <Alert severity="error" sx={{ mt: 2 }}>Low energy! Rest or eat first.</Alert>}
          {characterStress > 70 && <Alert severity="warning" sx={{ mt: 2 }}>High stress! Consider pranking the boss!</Alert>}
        </Paper>
      )}
    </Box>
  );
};

export default OceanWorkScene;