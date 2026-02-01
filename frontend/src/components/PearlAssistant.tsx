/**
 * Pearl AI Assistant - Global Floating Chat Widget
 * A laid-back, WLB-focused AI assistant that cares about your health
 * Dynamic context-aware greetings based on user state
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { chatWithPearl } from '../services/pearlService';
import { useCharacterStore } from '../store/characterStore';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Fade,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MinimizeIcon from '@mui/icons-material/Minimize';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Pearl iridescent gradient - soft pearlescent colors
const pearlGradient = 'linear-gradient(135deg, #FEFEFE 0%, #F8E8EE 20%, #E8D5E7 40%, #D5E5F0 60%, #F0EDE8 80%, #FFFEF8 100%)';
const pearlGradientHover = 'linear-gradient(135deg, #FFFEF8 0%, #F0EDE8 20%, #D5E5F0 40%, #E8D5E7 60%, #F8E8EE 80%, #FEFEFE 100%)';
const pearlHeaderGradient = 'linear-gradient(135deg, #F5E6E8 0%, #E8E0F0 25%, #E0EBF5 50%, #F0EDE5 75%, #F8F0E8 100%)';

// Dynamic greeting generator based on user context
interface GreetingContext {
  timeOfDay: 'morning' | 'midday' | 'evening' | 'night';
  stress: number;
  energy: number;
  isOverworking: boolean;
  isSedentary: boolean;
}

const getGreeting = (ctx: GreetingContext): { opening: string; nudge: string } => {
  const hour = new Date().getHours();

  // Late Night / Overwork (22:00 - 05:00 or low energy + late)
  if (ctx.isOverworking || (hour >= 22 || hour < 5)) {
    return {
      opening: "Still here? The moon called; it wants its shift back. I'm reading a book on anti-gravity. It's impossible to put down.",
      nudge: "Your brain needs a reboot, not more coffee. Close your eyes for a second. That project will still be there tomorrow."
    };
  }

  // High Stress (stress > 60)
  if (ctx.stress > 60) {
    return {
      opening: "Steady as she goes. Life is a marathon, but I'm currently in 'power-save mode.' What do you call a fake noodle? An impasta.",
      nudge: "Seriously though, un-clench your jaw. Take a sip of water. The world won't end if you take five minutes to just... exist."
    };
  }

  // Low Activity / Sedentary
  if (ctx.isSedentary || ctx.energy < 30) {
    return {
      opening: "I've been watching the clouds. They're great at doing nothing. Why did the scarecrow win an award? Because he was outstanding in his field.",
      nudge: "You've been 'outstandingly' still for a while. How about a 2-minute walk? Even a stroll to the fridge counts as an adventure."
    };
  }

  // Morning / Startup (05:00 - 11:00)
  if (hour >= 5 && hour < 11) {
    return {
      opening: "Hey. You're actually awake. I was just thinking... Why don't scientists trust atoms? Because they make up everything.",
      nudge: "Don't rush into the chaos. Rotate your neck a bit. Your spine isn't a question mark, so let's not treat it like one today."
    };
  }

  // Default / Midday
  return {
    opening: "Hey there 💎 Taking a break? Smart move. Did you hear about the claustrophobic astronaut? He just needed a little space.",
    nudge: "Remember: hydration is key. Your body is mostly water, not coffee... unfortunately."
  };
};

export default function PearlAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { character } = useCharacterStore();

  // Generate context-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const ctx: GreetingContext = {
      timeOfDay: hour >= 5 && hour < 12 ? 'morning' :
                 hour >= 12 && hour < 17 ? 'midday' :
                 hour >= 17 && hour < 21 ? 'evening' : 'night',
      stress: character?.stress || 50,
      energy: character?.energy || 50,
      isOverworking: (hour >= 22 || hour < 5) && (character?.energy || 50) < 40,
      isSedentary: (character?.stamina || 50) < 30,
    };
    return getGreeting(ctx);
  }, [character?.stress, character?.energy, character?.stamina]);

  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize messages with dynamic greeting
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `${greeting.opening}\n\n${greeting.nudge}`,
        timestamp: new Date(),
      },
    ]);
  }, [greeting]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithPearl(userInput);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: "Oops, something went wrong. Even I need a break sometimes",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button with Pearl Iridescent Gradient Border */}
      {!isOpen && (
        <Box
          onClick={handleToggle}
          sx={{
            position: 'fixed',
            bottom: { xs: 12, sm: 20 },
            right: { xs: 12, sm: 20 },
            width: { xs: 52, sm: 60 },
            height: { xs: 52, sm: 60 },
            borderRadius: '50%',
            background: pearlGradient,
            padding: '3px',
            cursor: 'pointer',
            zIndex: 1400,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(232, 213, 231, 0.6)',
            '&:hover': {
              background: pearlGradientHover,
              transform: 'scale(1.05)',
              boxShadow: '0 6px 28px rgba(213, 229, 240, 0.7)',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#1E1F20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>💎</Typography>
          </Box>
        </Box>
      )}

      {/* Chat Window - fits screen, no bottom-right radius */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: { xs: '100vw', sm: 320 },
            height: { xs: 'calc(100vh - 56px)', sm: 450 },
            maxWidth: { xs: '100vw', sm: 320 },
            maxHeight: { xs: 'calc(100vh - 56px)', sm: 450 },
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            // Top corners rounded, bottom-right corner sharp
            borderTopLeftRadius: { xs: 16, sm: 20 },
            borderTopRightRadius: { xs: 16, sm: 20 },
            borderBottomLeftRadius: { xs: 0, sm: 20 },
            borderBottomRightRadius: 0,
            overflow: 'hidden',
            zIndex: 1400,
            backgroundColor: '#F0F7FB',
            border: '1px solid #B8D4E8',
            borderBottom: 'none',
            borderRight: { xs: 'none', sm: '1px solid #B8D4E8' },
            boxShadow: '0 -4px 32px rgba(74, 144, 217, 0.15)',
          }}
        >
          {/* Header with Pearl Iridescent Gradient */}
          <Box
            sx={{
              background: pearlHeaderGradient,
              color: '#3C3C3C',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.6)', width: 36, height: 36 }}>💎</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: '"Roboto", sans-serif', color: '#2D2D2D', lineHeight: 1.2 }}>
                  Pearl
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontFamily: '"Roboto", sans-serif', color: '#5C5C5C', fontSize: '0.7rem' }}>
                  Your chill health buddy
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={handleToggle}
              sx={{ color: '#5C5C5C' }}
            >
              <MinimizeIcon />
            </IconButton>
          </Box>

          {/* Messages - Ocean blue theme */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 1.5,
              bgcolor: '#E8F4FC',
              background: 'linear-gradient(180deg, #E8F4FC 0%, #D4EAF7 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    px: 2,
                    maxWidth: '88%',
                    bgcolor: message.role === 'user' ? '#4A90D9' : '#FFFFFF',
                    color: message.role === 'user' ? '#FFFFFF' : '#2C3E50',
                    borderRadius: 2,
                    border: message.role === 'assistant' ? '1px solid #B8D4E8' : 'none',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    boxShadow: message.role === 'user'
                      ? '0 2px 8px rgba(74, 144, 217, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: '"Roboto", "Noto Color Emoji", sans-serif',
                      lineHeight: 1.5,
                      fontSize: '0.85rem',
                    }}
                  >
                    {message.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.6,
                      display: 'block',
                      mt: 0.5,
                      fontSize: '0.6rem',
                      color: message.role === 'user' ? 'rgba(255,255,255,0.8)' : '#7F8C9A',
                      fontFamily: '"Roboto", sans-serif',
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Paper>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#FFFFFF',
                    border: '1px solid #B8D4E8',
                  }}
                >
                  <CircularProgress size={18} sx={{ color: '#4A90D9' }} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input with Pearl-style border */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: '#F0F7FB',
              borderTop: '1px solid #B8D4E8',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                p: '2px',
                borderRadius: 2,
                background: pearlGradient,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  flex: 1,
                  bgcolor: '#FFFFFF',
                  borderRadius: 1.5,
                  p: 0.5,
                  alignItems: 'center',
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={2}
                  size="small"
                  placeholder="Ask Pearl anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      bgcolor: 'transparent',
                      color: '#2C3E50',
                      fontFamily: '"Roboto", "Noto Color Emoji", sans-serif',
                      fontSize: '0.85rem',
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#7F8C9A',
                      opacity: 1,
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: '0.85rem',
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  sx={{
                    background: pearlGradient,
                    color: '#3C3C3C',
                    width: 36,
                    height: 36,
                    '&:hover': {
                      background: pearlGradientHover,
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#D4E5F2',
                      color: '#9AA0A6',
                    },
                  }}
                >
                  <SendIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </>
  );
}