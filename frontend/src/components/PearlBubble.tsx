/**
 * Pearl Bubble Component
 * Small pearl-gradient speech bubble that appears for quick comments
 * Features wiggle animation when appearing
 */

import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { usePearlStore } from '../store/pearlStore';

export default function PearlBubble() {
  const { currentBubble, hideBubble } = usePearlStore();

  return (
    <AnimatePresence>
      {currentBubble && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 90, sm: 100 },
            right: { xs: 16, sm: 24 },
            zIndex: 1200,
            pointerEvents: 'none',
          }}
        >
          {/* Pearl character with wiggle */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{
              scale: 1,
              rotate: [0, -5, 5, -5, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              scale: { duration: 0.3 },
              rotate: { duration: 0.5, delay: 0.2 },
            }}
            style={{
              position: 'absolute',
              bottom: -8,
              right: 8,
              width: 36,
              height: 36,
            }}
          >
            <img
              src="/assets/pearl.png"
              alt="Pearl"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            />
          </motion.div>

          {/* Speech bubble */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            onClick={() => hideBubble()}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)',
                borderRadius: '16px 16px 4px 16px',
                padding: '8px 14px',
                maxWidth: { xs: 180, sm: 220 },
                boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 0 20px rgba(232,213,231,0.3)',
                position: 'relative',
                marginBottom: '12px',
                marginRight: '20px',
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  color: '#2D2D2D',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {currentBubble.message}
              </Typography>

              {/* Bubble tail */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -6,
                  right: 12,
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid #F0EDE8',
                }}
              />
            </Box>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
}