/**
 * Work Simulation Page
 * Interactive workplace scenarios based on health state
 */

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useCharacterStore } from '../store/characterStore';
import { getCharacter, updateCharacter } from '../services/characterService';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { generateWorkScenario } from '../services/aiService'; // TODO: Use for AI-generated scenarios

interface ScenarioChoice {
  id: number;
  text: string;
  emoji: string;
  effects: {
    stamina?: number;
    energy?: number;
    nutrition?: number;
    mood?: number;
    stress?: number;
    experience?: number;
  };
}

interface WorkScenario {
  title: string;
  description: string;
  situation: string;
  choices: ScenarioChoice[];
}

export default function Work() {
  const { character, setCharacter } = useCharacterStore();
  const [scenario, setScenario] = useState<WorkScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [scenarioHistory, setScenarioHistory] = useState<number>(0);

  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
    try {
      const data = await getCharacter();
      setCharacter({
        stamina: data.stamina,
        energy: data.energy,
        nutrition: data.nutrition,
        mood: data.mood,
        stress: data.stress,
        level: data.level,
        experience: data.experience,
        bodyType: data.body_type as any,
        emotionalState: data.emotional_state as any,
      });
    } catch (error) {
      console.error('Failed to load character:', error);
    }
  };

  const generateNewScenario = async () => {
    if (!character) return;

    setIsLoading(true);
    setResult(null);

    try {
      // For now, use fallback scenarios based on character health state
      // TODO: Enhance Gemini API to return structured scenario data
      const newScenario: WorkScenario = getFallbackScenario(character);

      setScenario(newScenario);
    } catch (error) {
      console.error('Failed to generate scenario:', error);
      // Fallback scenario if API fails
      setScenario(getFallbackScenario(character));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice: ScenarioChoice) => {
    if (!character) return;

    setIsLoading(true);

    try {
      // Calculate new stats
      const newStats = {
        stamina: Math.max(0, Math.min(100, character.stamina + (choice.effects.stamina || 0))),
        energy: Math.max(0, Math.min(100, character.energy + (choice.effects.energy || 0))),
        nutrition: Math.max(0, Math.min(100, character.nutrition + (choice.effects.nutrition || 0))),
        mood: Math.max(0, Math.min(100, character.mood + (choice.effects.mood || 0))),
        stress: Math.max(0, Math.min(100, character.stress + (choice.effects.stress || 0))),
      };

      const newExperience = character.experience + (choice.effects.experience || 0);
      const newLevel = Math.floor(newExperience / 100) + 1;

      // Update character on backend
      await updateCharacter(newStats);

      // Update local state
      setCharacter({
        ...character,
        ...newStats,
        experience: newExperience,
        level: newLevel,
      });

      // Show result
      setResult(getChoiceResult(choice));
      setScenarioHistory(scenarioHistory + 1);
      setScenario(null);
    } catch (error) {
      console.error('Failed to update character:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Use this function when implementing AI-generated scenarios with dynamic titles
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getScenarioTitle = (char: any): string => {
    if (char.energy < 30) return "😴 Low Energy Alert";
    if (char.stress > 70) return "😰 High Pressure Situation";
    if (char.mood < 40) return "😔 Challenging Moment";
    if (char.stamina < 40) return "💤 Fatigue Setting In";
    return "🏢 Another Day at Work";
  };

  const getFallbackScenario = (char: any): WorkScenario => {
    if (char.stress > 60) {
      return {
        title: "😰 Tight Deadline Pressure",
        description: "Your boss just moved up the deadline for a major project.",
        situation: "The project that was due next week is now due tomorrow. How do you respond?",
        choices: [
          {
            id: 1,
            text: "Pull an all-nighter to finish it",
            emoji: "🌙",
            effects: { stamina: -25, energy: -30, stress: 15, mood: -10, experience: 35 },
          },
          {
            id: 2,
            text: "Negotiate a more realistic timeline",
            emoji: "💬",
            effects: { stamina: -5, energy: -10, stress: -10, mood: 10, experience: 45 },
          },
          {
            id: 3,
            text: "Focus on core features only",
            emoji: "🎯",
            effects: { stamina: -10, energy: -15, stress: 5, mood: 5, experience: 40 },
          },
          {
            id: 4,
            text: "Get team members to help",
            emoji: "👥",
            effects: { stamina: -5, energy: -10, stress: -5, mood: 15, experience: 30 },
          },
        ],
      };
    }

    return {
      title: "🏢 Regular Workday",
      description: "Just another day at the office.",
      situation: "You have a normal workload today. How do you approach it?",
      choices: [
        {
          id: 1,
          text: "Hustle and get everything done quickly",
          emoji: "⚡",
          effects: { stamina: -15, energy: -20, stress: 10, mood: 5, experience: 30 },
        },
        {
          id: 2,
          text: "Take it steady and pace yourself",
          emoji: "🚶",
          effects: { stamina: -8, energy: -10, stress: -5, mood: 10, experience: 25 },
        },
        {
          id: 3,
          text: "Take breaks and maintain work-life balance",
          emoji: "⚖️",
          effects: { stamina: 5, energy: 5, stress: -15, mood: 20, experience: 20 },
        },
        {
          id: 4,
          text: "Slack off a bit (摸鱼 mode)",
          emoji: "🐟",
          effects: { stamina: 10, energy: 15, stress: -20, mood: 15, experience: 10 },
        },
      ],
    };
  };

  const getChoiceResult = (choice: ScenarioChoice): string => {
    const results = [
      `You chose to ${choice.text.toLowerCase()}. ${choice.emoji}`,
      "Your choice has affected your wellbeing.",
      choice.effects.experience ? `+${choice.effects.experience} XP gained!` : "",
    ];
    return results.filter(Boolean).join(" ");
  };

  if (!character) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
        >
          Work Simulator
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Navigate workplace challenges - your health affects your performance
        </Typography>

        {/* Character Status */}
        <Paper sx={{ p: { xs: 2, sm: 2, md: 3 }, mt: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">💪 Stamina</Typography>
                  <Typography variant="body2">{character.stamina}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.stamina}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">⚡ Energy</Typography>
                  <Typography variant="body2">{character.energy}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.energy}
                  sx={{ height: 8, borderRadius: 1 }}
                  color="secondary"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">😊 Mood</Typography>
                  <Typography variant="body2">{character.mood}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.mood}
                  sx={{ height: 8, borderRadius: 1 }}
                  color="success"
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">😰 Stress</Typography>
                  <Typography variant="body2">{character.stress}/100</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={character.stress}
                  sx={{ height: 8, borderRadius: 1 }}
                  color="error"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3 }}>
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label={`Level ${character.level}`}
                  color="primary"
                  variant="outlined"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    XP: {character.experience % 100}/100
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(character.experience % 100)}
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Scenarios completed: {scenarioHistory}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Result Message */}
        {result && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setResult(null)}>
            {result}
          </Alert>
        )}

        {/* Scenario or Generate Button */}
        {!scenario ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 5, md: 6 }, px: { xs: 2, sm: 0 } }}>
            <WorkIcon sx={{ fontSize: { xs: 60, sm: 70, md: 80 }, color: 'text.secondary', mb: 2 }} />
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              Ready for a workplace challenge?
            </Typography>
            <Typography
              color="text.secondary"
              paragraph
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Your health state will influence the scenarios you face
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesomeIcon />}
              onClick={generateNewScenario}
              disabled={isLoading}
              sx={{
                mt: 2,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                py: { xs: 1.25, sm: 1.5 },
                px: { xs: 3, sm: 4 }
              }}
            >
              {isLoading ? 'Generating...' : 'Generate Scenario'}
            </Button>
          </Box>
        ) : (
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              {scenario.title}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {scenario.description}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mt: { xs: 2, sm: 3 },
                mb: 2,
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}
            >
              {scenario.situation}
            </Typography>

            <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: { xs: 1, sm: 2 } }}>
              {scenario.choices.map((choice) => (
                <Grid size={{ xs: 12, sm: 6 }} key={choice.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      '&:hover': isLoading ? {} : {
                        borderColor: 'primary.main',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}
                      >
                        {choice.emoji}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' } }}
                      >
                        {choice.text}
                      </Typography>
                      <Box sx={{ mt: { xs: 1.5, sm: 2 }, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                        {Object.entries(choice.effects).map(([key, value]) => {
                          if (key === 'experience') {
                            return (
                              <Chip
                                key={key}
                                label={`+${value} XP`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            );
                          }
                          const icon = key === 'stamina' ? '💪' :
                                      key === 'energy' ? '⚡' :
                                      key === 'mood' ? '😊' :
                                      key === 'stress' ? '😰' : '🍎';
                          return (
                            <Chip
                              key={key}
                              label={`${icon} ${value > 0 ? '+' : ''}${value}`}
                              size="small"
                              color={value < 0 ? 'error' : 'success'}
                              variant="outlined"
                            />
                          );
                        })}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleChoice(choice)}
                        disabled={isLoading}
                      >
                        Choose This
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Box>
    </Container>
  );
}