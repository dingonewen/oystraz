/**
 * Pearl Bubble Component
 * Small pearl-gradient speech bubble with wiggle animation
 */

import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { usePearlStore } from '../store/pearlStore';

export default function PearlBubble() {
  const { currentBubble, hideBubble } = usePearlStore();

  return (
    <AnimatePresence>
      {currentBubble && (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 20 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: 0,
            rotate: [0, -2, 2, -2, 0],  // Wiggle effect
          }}
          exit={{ scale: 0, opacity: 0, x: 20 }}
          transition={{
            scale: { duration: 0.25 },
            opacity: { duration: 0.25 },
            rotate: { duration: 0.4, delay: 0.2 },
          }}
          onClick={() => hideBubble()}
          style={{
            position: 'fixed',
            bottom: 90,
            right: 16,
            zIndex: 1200,
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)',
              borderRadius: '14px 14px 4px 14px',
              padding: '8px 12px',
              maxWidth: { xs: 160, sm: 200 },
              boxShadow: '0 3px 10px rgba(0,0,0,0.15), 0 0 15px rgba(232,213,231,0.3)',
              position: 'relative',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                fontFamily: '"Montserrat Alternates", sans-serif',
                color: '#2D2D2D',
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {currentBubble.message}
            </Typography>

            {/* Bubble tail pointing to Pearl button */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -5,
                right: 10,
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #F0EDE8',
              }}
            />
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}