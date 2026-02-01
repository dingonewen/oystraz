/**
 * Pearl AI Assistant - Global Floating Chat Widget
 * A laid-back, WLB-focused AI assistant that cares about your health
 * Material Design 3 Dark Theme with Gemini-inspired styling
 */

import { useState, useRef, useEffect } from 'react';
import { chatWithPearl } from '../services/pearlService';
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

export default function PearlAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! I'm Pearl 💎 Your chill health buddy. No pressure, no corporate BS - just here to help you take care of yourself. What's on your mind?",
      timestamp: new Date(),
    },
  ]);
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
      // Call Pearl API with conversation history
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
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            width: { xs: 56, sm: 68 },
            height: { xs: 56, sm: 68 },
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
            <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>💎</Typography>
          </Box>
        </Box>
      )}

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: { xs: 8, sm: 24 },
            right: { xs: 8, sm: 24 },
            width: { xs: 'calc(100vw - 16px)', sm: 360 },
            height: { xs: 'calc(100vh - 80px)', sm: 520 },
            maxWidth: { xs: '100%', sm: 360 },
            maxHeight: { xs: 'calc(100vh - 80px)', sm: 520 },
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            borderRadius: { xs: 3, sm: 4 },
            overflow: 'hidden',
            zIndex: 1400,
            backgroundColor: '#F0F7FB',
            border: '1px solid #B8D4E8',
            boxShadow: '0 8px 32px rgba(74, 144, 217, 0.15)',
          }}
        >
          {/* Header with Pearl Iridescent Gradient */}
          <Box
            sx={{
              background: pearlHeaderGradient,
              color: '#3C3C3C',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.6)', width: 40, height: 40 }}>💎</Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: '"Roboto", sans-serif', color: '#2D2D2D' }}>
                  Pearl
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontFamily: '"Roboto", sans-serif', color: '#5C5C5C' }}>
                  Your chill health buddy
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={handleToggle}
                sx={{ color: '#5C5C5C' }}
              >
                <MinimizeIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages - Ocean blue theme */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: '#E8F4FC',
              background: 'linear-gradient(180deg, #E8F4FC 0%, #D4EAF7 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
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
                    maxWidth: '85%',
                    bgcolor: message.role === 'user' ? '#4A90D9' : '#FFFFFF',
                    color: message.role === 'user' ? '#FFFFFF' : '#2C3E50',
                    borderRadius: 2.5,
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
                      fontSize: '0.65rem',
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
                    borderRadius: 2.5,
                    bgcolor: '#FFFFFF',
                    border: '1px solid #B8D4E8',
                  }}
                >
                  <CircularProgress size={20} sx={{ color: '#4A90D9' }} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input with Pearl-style border */}
          <Box
            sx={{
              p: 2,
              bgcolor: '#F0F7FB',
              borderTop: '1px solid #B8D4E8',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                p: '2px',
                borderRadius: 2.5,
                background: pearlGradient,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flex: 1,
                  bgcolor: '#FFFFFF',
                  borderRadius: 2,
                  p: 0.5,
                  alignItems: 'center',
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  size="small"
                  placeholder="Ask Pearl anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'transparent',
                      color: '#2C3E50',
                      fontFamily: '"Roboto", "Noto Color Emoji", sans-serif',
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#7F8C9A',
                      opacity: 1,
                      fontFamily: '"Roboto", sans-serif',
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
                    width: 40,
                    height: 40,
                    '&:hover': {
                      background: pearlGradientHover,
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#D4E5F2',
                      color: '#9AA0A6',
                    },
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </>
  );
}
