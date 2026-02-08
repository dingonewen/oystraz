/**
 * Ocean Work Scene - Multi-Hook Version
 * Features:
 * - 3 fish hooks that seal patrols between
 * - Fish are hooked on the hook with fewest fish
 * - Octopus boss sprays black ink when pranked (3 times)
 * - Supports up to 16h work duration for overtime
 * - Persists session state when navigating away
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Slider, Button, Alert, Paper } from '@mui/material';
import { useWorkSessionStore } from '../../store/workSessionStore';

// Fish color types matching actual file names
const FISH_COLORS = ['blue', 'brown', 'green', 'grey', 'orange', 'pink', 'red'];

// Hook positions (left %, top %)
const HOOK_POSITIONS = [
  { x: 75, y: 25 },
  { x: 85, y: 30 },
  { x: 80, y: 20 },
];

interface Props {
  onWorkComplete: (hours: number, intensity: number, isPrank?: boolean) => void;
  characterStress: number;
  characterEnergy: number;
  characterStamina?: number;
  characterMood?: number;
}

interface Fish {
  id: number;
  color: string;
  x: number;
  y: number;
  speed: number;
  direction: number;
  caught: boolean;
}

interface HookedFishData {
  id: number;
  color: string;
  hookIndex: number;
}

type SealState = 'idle' | 'chasing' | 'carrying' | 'delivering' | 'patrolling';

const OceanWorkScene: React.FC<Props> = ({
  onWorkComplete,
  characterStress,
  characterEnergy,
  characterStamina: _characterStamina = 100,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Work session store for persistence
  const { session, startSession, updateSession, endSession } = useWorkSessionStore();

  // Work parameters
  const [workHours, setWorkHours] = useState(session?.workHours ?? 4);
  const [workIntensity, setWorkIntensity] = useState(session?.workIntensity ?? 3);
  const [isWorking, setIsWorking] = useState(session?.isActive ?? false);

  // Scene state
  const [sealState, setSealState] = useState<SealState>(session?.isActive ? 'patrolling' : 'idle');
  const [fishCaught, setFishCaught] = useState(session?.fishCaught ?? 0);
  const [fishList, setFishList] = useState<Fish[]>([]);
  const [hookedFish, setHookedFish] = useState<HookedFishData[]>(session?.hookedFish ?? []);
  const [isPranking, setIsPranking] = useState(false);
  const [prankCooldown, setPrankCooldown] = useState(false);
  const [prankCount, setPrankCount] = useState(0);
  const [currentTargetHook, setCurrentTargetHook] = useState(0);
  const [carryingFishId, setCarryingFishId] = useState<number | null>(null);

  // Seal position
  const [sealPos, setSealPos] = useState(session?.sealPos ?? { x: 20, y: 55 });
  const [sealDirection, setSealDirection] = useState(session?.sealDirection ?? 1);
  const sealPosRef = useRef(session?.sealPos ?? { x: 20, y: 55 });

  // Use ref to track hooked fish IDs to avoid duplicate hooks
  const hookedFishIdsRef = useRef<Set<number>>(new Set(session?.hookedFish?.map(f => f.id) ?? []));

  // Estimated impacts
  const estimatedStressIncrease = (workHours * workIntensity * 0.8).toFixed(1);
  const estimatedEnergyLoss = (workHours * workIntensity * 0.5).toFixed(1);
  const estimatedStaminaLoss = workHours > 8
    ? (workHours * 0.5 + (workHours - 8) * 5).toFixed(1)
    : (workHours * 0.5).toFixed(1);
  const estimatedXP = Math.round(workHours * workIntensity * 10);
  const totalFishGoal = Math.ceil(workHours * workIntensity);

  // Get hook with fewest fish
  const getHookWithFewestFish = (): number => {
    const counts = [0, 0, 0];
    hookedFish.forEach(f => {
      if (f.hookIndex >= 0 && f.hookIndex < 3) counts[f.hookIndex]++;
    });
    let minIndex = 0;
    let minCount = counts[0];
    for (let i = 1; i < 3; i++) {
      if (counts[i] < minCount) {
        minCount = counts[i];
        minIndex = i;
      }
    }
    return minIndex;
  };

  // Get fish count per hook
  const getFishCountForHook = (hookIndex: number): number => {
    return hookedFish.filter(f => f.hookIndex === hookIndex).length;
  };

  // Initialize fish
  const initFish = (count: number) => {
    return Array.from({ length: Math.max(8, count + 3) }).map((_, i) => ({
      id: Date.now() + i + Math.random() * 1000,
      color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
      x: 10 + Math.random() * 55,
      y: 25 + Math.random() * 50,
      speed: 0.08 + Math.random() * 0.15,
      direction: Math.random() > 0.5 ? 1 : -1,
      caught: false,
    }));
  };

  // Initialize fish and restore session on mount
  useEffect(() => {
    if (session?.isActive) {
      // Restore session state
      setFishList(initFish(session.totalFishGoal + 5));
    } else {
      setFishList(initFish(10));
    }
  }, []);

  // Save session state periodically when working
  useEffect(() => {
    if (isWorking && !isPranking) {
      const saveInterval = setInterval(() => {
        updateSession({
          fishCaught,
          hookedFish,
          sealPos: sealPosRef.current,
          sealDirection,
        });
      }, 1000);
      return () => clearInterval(saveInterval);
    }
  }, [isWorking, isPranking, fishCaught, hookedFish, sealDirection, updateSession]);

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

  // Core chase AI
  useEffect(() => {
    if (!isWorking) return;

    let animationId: number;
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const chaseSpeed = (workIntensity * 8 + 10) * deltaTime;
      const currentX = sealPosRef.current.x;
      const currentY = sealPosRef.current.y;

      let newX = currentX;
      let newY = currentY;
      let newDirection = sealDirection;

      if (sealState === 'chasing' || sealState === 'idle' || sealState === 'patrolling') {
        const available = fishList.filter((f) => !f.caught);
        if (available.length === 0) {
          if (fishCaught < totalFishGoal) {
            setFishList((prev) => [...prev, ...initFish(5)]);
          }
          animationId = requestAnimationFrame(tick);
          return;
        }

        // Find nearest fish
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
          // Catch the fish - mark it and store the ID
          setFishList((prev) => prev.map((f) => (f.id === nearest.id ? { ...f, caught: true } : f)));
          setCarryingFishId(nearest.id);
          setSealState('carrying');
          // Determine which hook to deliver to
          setCurrentTargetHook(getHookWithFewestFish());
        } else {
          newX = currentX + (dx / dist) * chaseSpeed;
          newY = currentY + (dy / dist) * chaseSpeed;
          newDirection = dx > 0 ? 1 : -1;
          if (sealState !== 'chasing') setSealState('chasing');
        }
      } else if (sealState === 'carrying' && carryingFishId !== null) {
        const targetHook = HOOK_POSITIONS[currentTargetHook];
        const dx = targetHook.x - currentX;
        const dy = targetHook.y - currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 6) {
          // Deliver fish to hook - use ref to prevent duplicates
          const caughtFish = fishList.find((f) => f.id === carryingFishId);
          if (caughtFish && !hookedFishIdsRef.current.has(caughtFish.id)) {
            hookedFishIdsRef.current.add(caughtFish.id);
            setHookedFish((prev) => [...prev, {
              id: caughtFish.id,
              color: caughtFish.color,
              hookIndex: currentTargetHook
            }]);
            setFishCaught((prev) => prev + 1);
          }
          setCarryingFishId(null);
          setSealState('delivering');
        } else {
          newX = currentX + (dx / dist) * chaseSpeed * 1.3;
          newY = currentY + (dy / dist) * chaseSpeed * 1.3;
          newDirection = dx > 0 ? 1 : -1;
        }
      } else if (sealState === 'delivering') {
        // Return to patrol position
        const patrolX = 25;
        const patrolY = 55;
        const dx = patrolX - currentX;
        const dy = patrolY - currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
          if (fishCaught >= totalFishGoal) {
            handleWorkDone();
            return;
          } else {
            setSealState('patrolling');
          }
        } else {
          newX = currentX + (dx / dist) * chaseSpeed;
          newY = currentY + (dy / dist) * chaseSpeed;
          newDirection = dx > 0 ? 1 : -1;
        }
      }

      // Update position
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
  }, [isWorking, sealState, fishList, workIntensity, fishCaught, totalFishGoal, sealDirection, currentTargetHook, carryingFishId]);

  // Auto-prank when overworked (24+ fish)
  useEffect(() => {
    if (hookedFish.length >= 24 && !isPranking && isWorking && !prankCooldown) {
      triggerPrank();
    }
  }, [hookedFish.length, isPranking, isWorking, prankCooldown]);

  const handleWorkDone = useCallback(() => {
    setIsWorking(false);
    setSealState('idle');
    endSession();  // Clear persisted session
    onWorkComplete(workHours, workIntensity);
    sealPosRef.current = { x: 20, y: 55 };
    setSealPos({ x: 20, y: 55 });
  }, [endSession, onWorkComplete, workHours, workIntensity]);

  const startWorkSession = () => {
    if (characterEnergy < 20) return;
    // Start new session in store
    startSession(workHours, workIntensity, totalFishGoal);
    setIsWorking(true);
    setFishCaught(0);
    setHookedFish([]);
    hookedFishIdsRef.current.clear();
    setCarryingFishId(null);
    setFishList(initFish(totalFishGoal + 5));
    setSealState('patrolling');
  };

  const triggerPrank = useCallback(() => {
    if (isPranking || prankCooldown) return;
    setIsPranking(true);
    setPrankCooldown(true);
    setPrankCount(0);

    // Move seal near octopus
    sealPosRef.current = { x: 80, y: 15 };
    setSealPos({ x: 80, y: 15 });

    // Ink spray animation - 3 times
    let count = 0;
    const inkInterval = setInterval(() => {
      count++;
      setPrankCount(count);
      if (count >= 3) {
        clearInterval(inkInterval);
        setTimeout(() => {
          endSession();  // Clear persisted session
          onWorkComplete(0, 0, true);
          setIsPranking(false);
          setPrankCount(0);
          sealPosRef.current = { x: 20, y: 55 };
          setSealPos({ x: 20, y: 55 });
        }, 500);
      }
    }, 600);

    setTimeout(() => setPrankCooldown(false), 30000);
  }, [isPranking, prankCooldown, endSession, onWorkComplete]);

  const getIntensityLabel = (value: number) => {
    const labels = ['Lazy', 'Casual', 'Normal', 'Fast', 'Turbo'];
    return labels[value - 1] || 'Normal';
  };

  // Get carrying fish color
  const getCarryingFishColor = () => {
    if (carryingFishId === null) return 'blue';
    const fish = fishList.find(f => f.id === carryingFishId);
    return fish?.color || 'blue';
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      {/* Ocean Scene */}
      <Paper
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          height: { xs: 380, sm: 450, md: 520 },
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

        {/* Decorations - Rocks */}
        <Box sx={{ position: 'absolute', bottom: '8%', left: '5%', opacity: 0.8 }}>
          <img src="/assets/ocean/rock_a.png" alt="" style={{ width: 50 }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: '6%', left: '18%', opacity: 0.7 }}>
          <img src="/assets/ocean/rock_b.png" alt="" style={{ width: 40 }} />
        </Box>

        {/* Decorations - Seaweeds */}
        <Box sx={{ position: 'absolute', bottom: '10%', left: '12%', opacity: 0.7 }}>
          <img src="/assets/ocean/seaweed_green_a.png" alt="" style={{ width: 35 }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: '12%', left: '28%', opacity: 0.6 }}>
          <img src="/assets/ocean/seaweed_pink_a.png" alt="" style={{ width: 30 }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: '8%', right: '30%', opacity: 0.6 }}>
          <img src="/assets/ocean/seaweed_orange_a.png" alt="" style={{ width: 28 }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: '14%', right: '18%', opacity: 0.5 }}>
          <img src="/assets/ocean/seaweed_green_b.png" alt="" style={{ width: 32 }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: '6%', right: '8%', opacity: 0.7 }}>
          <img src="/assets/ocean/seaweed_grass_a.png" alt="" style={{ width: 25 }} />
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

        {/* Three Fish Hooks */}
        {HOOK_POSITIONS.map((hookPos, hookIndex) => (
          <Box
            key={`hook-${hookIndex}`}
            sx={{
              position: 'absolute',
              left: `${hookPos.x}%`,
              top: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 10,
              transform: 'translateX(-50%)',
            }}
          >
            <Box sx={{ width: 2, height: 60 + hookIndex * 15, bgcolor: 'rgba(255,255,255,0.4)' }} />
            <Typography sx={{ fontSize: 28, mt: -1 }}>🪝</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column-reverse', mt: -1 }}>
              <AnimatePresence>
                {hookedFish
                  .filter(f => f.hookIndex === hookIndex)
                  .slice(-8)
                  .map((f) => (
                    <motion.div
                      key={`hooked-${f.id}`}
                      initial={{ scale: 0, y: -20 }}
                      animate={{ scale: 1, y: 0 }}
                      style={{ marginTop: -4 }}
                    >
                      <img src={`/assets/ocean/fish_${f.color}.png`} alt="fish" style={{ width: 18 }} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </Box>
            {getFishCountForHook(hookIndex) > 8 && (
              <Typography sx={{ fontSize: 9, color: 'white', mt: 0.5 }}>+{getFishCountForHook(hookIndex) - 8}</Typography>
            )}
          </Box>
        ))}

        {/* Swimming Fish */}
        {fishList.filter((f) => !f.caught).map((f) => (
          <motion.div
            key={f.id}
            style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%`, transform: `scaleX(${f.direction})` }}
            animate={{ y: [0, -3, 0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src={`/assets/ocean/fish_${f.color}.png`} alt="fish" style={{ width: 28 }} />
          </motion.div>
        ))}

        {/* Octopus Boss */}
        <motion.div
          style={{ position: 'absolute', right: '5%', top: '5%', zIndex: 20 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Box sx={{ position: 'relative', textAlign: 'center' }}>
            <img src="/assets/ocean/octopus.png" alt="boss" style={{ width: 90 }} />

            {/* Black Ink Spray Animation - from Octopus */}
            <AnimatePresence>
              {isPranking && prankCount > 0 && (
                <motion.div
                  key={`ink-${prankCount}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1.5, 2, 2.5],
                    y: [0, 20, 40, 60],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 40,
                    filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.8))',
                  }}
                >
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(20,20,30,0.9) 0%, rgba(10,10,20,0.7) 50%, transparent 70%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Typography sx={{ fontSize: 24 }}>🖤</Typography>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>

        {/* Seal Employee */}
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
            <img src="/assets/ocean/seal.png" alt="seal" style={{ width: 55 }} />
            {sealState === 'carrying' && carryingFishId !== null && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: -5, right: -8 }}>
                <img src={`/assets/ocean/fish_${getCarryingFishColor()}.png`} alt="carried" style={{ width: 20 }} />
              </motion.div>
            )}
          </motion.div>
        </Box>

        {/* Progress Bar */}
        {isWorking && (
          <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', width: '80%', maxWidth: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontSize: 10, color: '#b388ff', fontWeight: 'bold' }}>PROGRESS</Typography>
              <Typography sx={{ fontSize: 10, color: '#b388ff', fontWeight: 'bold' }}>{fishCaught} / {totalFishGoal} FISH</Typography>
            </Box>
            <Box sx={{ height: 6, bgcolor: 'rgba(138, 43, 226, 0.2)', borderRadius: 1, overflow: 'hidden' }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  boxShadow: '0 0 10px #764ba2'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (fishCaught / totalFishGoal) * 100)}%` }}
              />
            </Box>
            <Typography sx={{ fontSize: 9, color: 'rgba(200,180,255,0.8)', textAlign: 'center', mt: 1, textTransform: 'uppercase' }}>{sealState}</Typography>
          </Box>
        )}
      </Paper>

      {/* Controls */}
      {!isWorking && (
        <Paper sx={{ p: 3, mt: 2, borderRadius: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">DURATION (supports overtime!)</Typography>
              <Slider value={workHours} onChange={(_, v) => setWorkHours(v as number)} min={1} max={16} marks valueLabelDisplay="auto" valueLabelFormat={(v) => `${v}h`} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">INTENSITY: {getIntensityLabel(workIntensity)}</Typography>
              <Slider value={workIntensity} onChange={(_, v) => setWorkIntensity(v as number)} min={1} max={5} marks valueLabelDisplay="auto" />
            </Box>
          </Box>

          <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(138, 43, 226, 0.1)', borderRadius: 2, border: '1px solid rgba(138, 43, 226, 0.3)' }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ color: '#b388ff' }}>Estimated Impact:</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              <Typography variant="body2" color="error.main">Energy: -{estimatedEnergyLoss}</Typography>
              <Typography variant="body2" color="info.main">Stamina: -{estimatedStaminaLoss}</Typography>
              <Typography variant="body2" color="warning.main">Stress: +{estimatedStressIncrease}</Typography>
              <Typography variant="body2" color="success.main">XP: +{estimatedXP}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Fish to catch: {totalFishGoal}</Typography>
            {workHours > 8 && <Typography variant="caption" color="error">Overwork penalty applies for hours &gt; 8!</Typography>}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={startWorkSession}
              disabled={characterEnergy < 20}
              sx={{
                py: 1.5,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #5a6fd6 0%, #6a4190 100%)',
                }
              }}
            >
              START FISHING
            </Button>
            <Button
              variant="outlined"
              onClick={triggerPrank}
              disabled={isPranking || prankCooldown || characterStress < 30}
              sx={{
                minWidth: 60,
                borderColor: '#764ba2',
                color: '#b388ff',
                '&:hover': {
                  borderColor: '#9c27b0',
                  bgcolor: 'rgba(138, 43, 226, 0.1)',
                }
              }}
            >
              🖤
            </Button>
          </Box>

          {characterEnergy < 20 && <Alert severity="error" sx={{ mt: 2 }}>Low energy! Rest or eat first.</Alert>}
          {characterStress > 70 && <Alert severity="warning" sx={{ mt: 2 }}>High stress! Consider pranking the boss!</Alert>}
        </Paper>
      )}
    </Box>
  );
};

export default OceanWorkScene;