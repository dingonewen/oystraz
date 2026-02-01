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

// Gemini gradient colors
const geminiGradient = 'linear-gradient(135deg, #4285F4 0%, #9B72CB 25%, #D96570 50%, #D96570 75%, #FFC857 100%)';
const geminiGradientHover = 'linear-gradient(135deg, #FFC857 0%, #D96570 25%, #9B72CB 50%, #4285F4 100%)';

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
      {/* Floating Button with Gemini Gradient Border */}
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
            background: geminiGradient,
            padding: '3px',
            cursor: 'pointer',
            zIndex: 1400,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(66, 133, 244, 0.4)',
            '&:hover': {
              background: geminiGradientHover,
              transform: 'scale(1.05)',
              boxShadow: '0 6px 28px rgba(155, 114, 203, 0.5)',
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
            backgroundColor: '#1E1F20',
            border: '1px solid #3C4043',
          }}
        >
          {/* Header with Gemini Gradient */}
          <Box
            sx={{
              background: geminiGradient,
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>💎</Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                  Pearl
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Your chill health buddy
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={handleToggle}
                sx={{ color: 'white' }}
              >
                <MinimizeIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: '#131314',
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
                  elevation={0}
                  sx={{
                    p: 1.5,
                    maxWidth: '85%',
                    bgcolor: message.role === 'user' ? '#394457' : '#2D2E30',
                    color: '#E3E3E3',
                    borderRadius: 3,
                    border: message.role === 'assistant' ? '1px solid #3C4043' : 'none',
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.5,
                      display: 'block',
                      mt: 0.5,
                      fontSize: '0.65rem',
                      color: '#9AA0A6',
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
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: '#2D2E30',
                    border: '1px solid #3C4043',
                  }}
                >
                  <CircularProgress size={20} sx={{ color: '#8AB4F8' }} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input with Gemini-style border */}
          <Box
            sx={{
              p: 2,
              bgcolor: '#1E1F20',
              borderTop: '1px solid #3C4043',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                p: '3px',
                borderRadius: 3,
                background: 'linear-gradient(90deg, #4285F4, #9B72CB, #D96570)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flex: 1,
                  bgcolor: '#1E1F20',
                  borderRadius: 2.5,
                  p: 0.5,
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
                      color: '#E3E3E3',
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#9AA0A6',
                      opacity: 1,
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  sx={{
                    background: geminiGradient,
                    color: 'white',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      background: geminiGradientHover,
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#3C4043',
                      color: '#5F6368',
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
