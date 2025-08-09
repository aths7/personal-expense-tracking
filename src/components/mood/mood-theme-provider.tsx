'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ThemeConfig, CharacterMood } from '@/types/advanced-gamification';
import { characterSystemService } from '@/services/character-system';

interface MoodThemeContextType {
  currentMood: CharacterMood['mood'];
  themeConfig: ThemeConfig;
  updateMood: (spendingData: { monthlyBudget: number; currentSpending: number; recentExpense: number | null }) => void;
  backgroundEffects: boolean;
  setBackgroundEffects: (enabled: boolean) => void;
}

const MoodThemeContext = createContext<MoodThemeContextType | undefined>(undefined);

export const useMoodTheme = () => {
  const context = useContext(MoodThemeContext);
  if (!context) {
    throw new Error('useMoodTheme must be used within a MoodThemeProvider');
  }
  return context;
};

const MOOD_THEMES: Record<CharacterMood['mood'], ThemeConfig> = {
  happy: {
    name: 'Happy Green',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
      surface: '#F0FDF4',
      accent: '#059669'
    },
    mood: 'happy',
    particles: {
      type: 'sparkles',
      intensity: 0.3
    }
  },
  excited: {
    name: 'Excited Purple',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
      surface: '#FAF5FF',
      accent: '#7C3AED'
    },
    mood: 'excited',
    particles: {
      type: 'sparkles',
      intensity: 0.6
    }
  },
  neutral: {
    name: 'Calm Blue',
    colors: {
      primary: '#6B7280',
      secondary: '#9CA3AF',
      background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
      surface: '#F9FAFB',
      accent: '#4B5563'
    },
    mood: 'neutral',
    particles: {
      type: 'snow',
      intensity: 0.1
    }
  },
  worried: {
    name: 'Cautious Orange',
    colors: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
      surface: '#FFFBEB',
      accent: '#D97706'
    },
    mood: 'worried',
    particles: {
      type: 'leaves',
      intensity: 0.2
    }
  },
  angry: {
    name: 'Alert Red',
    colors: {
      primary: '#EF4444',
      secondary: '#F87171',
      background: 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)',
      surface: '#FEF2F2',
      accent: '#DC2626'
    },
    mood: 'worried', // Map angry to worried for theme consistency
    particles: {
      type: 'rain',
      intensity: 0.4
    }
  },
  sleepy: {
    name: 'Dreamy Blue',
    colors: {
      primary: '#60A5FA',
      secondary: '#93C5FD',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      surface: '#EFF6FF',
      accent: '#3B82F6'
    },
    mood: 'neutral', // Map sleepy to neutral for theme consistency
    particles: {
      type: 'snow',
      intensity: 0.15
    }
  }
};

interface BackgroundParticlesProps {
  type: 'sparkles' | 'snow' | 'rain' | 'leaves';
  intensity: number;
  enabled: boolean;
}

function BackgroundParticles({ type, intensity, enabled }: BackgroundParticlesProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    const particleCount = Math.floor(20 * intensity);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    
    setParticles(newParticles);
  }, [enabled, intensity]);

  if (!enabled) return null;

  const getParticleEmoji = () => {
    switch (type) {
      case 'sparkles': return '✨';
      case 'snow': return '❄️';
      case 'rain': return '💧';
      case 'leaves': return '🍃';
      default: return '✨';
    }
  };

  const getAnimationConfig = () => {
    switch (type) {
      case 'rain':
        return {
          duration: 1.5,
          y: ['0vh', '110vh'],
          rotate: [0, 15]
        };
      case 'snow':
        return {
          duration: 8,
          y: ['0vh', '110vh'],
          x: ['-10vw', '10vw']
        };
      case 'leaves':
        return {
          duration: 6,
          y: ['0vh', '110vh'],
          rotate: [0, 360],
          x: ['-5vw', '5vw']
        };
      default: // sparkles
        return {
          duration: 4,
          y: ['-5vh', '105vh'],
          scale: [0, 1, 1, 0],
          rotate: [0, 180]
        };
    }
  };

  const animation = getAnimationConfig();

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: '-10vh',
              scale: 0,
              rotate: 0,
              opacity: 0.7
            }}
            animate={{ 
              y: animation.y,
              x: animation.x || `${particle.x}vw`,
              scale: animation.scale || 1,
              rotate: animation.rotate,
              opacity: [0.7, 1, 0.7, 0]
            }}
            transition={{ 
              duration: animation.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
              ease: 'easeOut'
            }}
            className="absolute text-lg"
            style={{ left: 0 }}
          >
            {getParticleEmoji()}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface MoodThemeProviderProps {
  children: React.ReactNode;
}

export function MoodThemeProvider({ children }: MoodThemeProviderProps) {
  const [currentMood, setCurrentMood] = useState<CharacterMood['mood']>('neutral');
  const [backgroundEffects, setBackgroundEffects] = useState(true);

  const themeConfig = MOOD_THEMES[currentMood];

  const updateMood = (spendingData: { monthlyBudget: number; currentSpending: number; recentExpense: number | null }) => {
    const moodData = characterSystemService.getCharacterMood(spendingData);
    setCurrentMood(moodData.mood);
  };

  // Apply CSS custom properties for theme colors
  useEffect(() => {
    const root = document.documentElement;
    const colors = themeConfig.colors;
    
    root.style.setProperty('--mood-primary', colors.primary);
    root.style.setProperty('--mood-secondary', colors.secondary);
    root.style.setProperty('--mood-accent', colors.accent);
    root.style.setProperty('--mood-surface', colors.surface);
    
    // Apply background gradient
    if (colors.background.includes('gradient')) {
      root.style.setProperty('--mood-background', colors.background);
    } else {
      root.style.setProperty('--mood-background', colors.background);
    }
  }, [themeConfig]);

  return (
    <MoodThemeContext.Provider
      value={{
        currentMood,
        themeConfig,
        updateMood,
        backgroundEffects,
        setBackgroundEffects,
      }}
    >
      <div 
        className="min-h-screen transition-all duration-1000 ease-in-out"
        style={{ 
          background: themeConfig.colors.background 
        }}
      >
        {/* Background Particles */}
        {themeConfig.particles && (
          <BackgroundParticles
            type={themeConfig.particles.type}
            intensity={themeConfig.particles.intensity}
            enabled={backgroundEffects}
          />
        )}
        
        {children}
      </div>
    </MoodThemeContext.Provider>
  );
}

// Mood Indicator Component
export function MoodIndicator() {
  const { currentMood, themeConfig } = useMoodTheme();

  const getMoodEmoji = () => {
    const moodEmojis = {
      happy: '😊',
      excited: '🤩',
      neutral: '😐',
      worried: '😟',
      angry: '😠',
      sleepy: '😴'
    };
    return moodEmojis[currentMood];
  };

  return (
    <motion.div
      key={currentMood}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', duration: 0.6 }}
      className="fixed bottom-4 right-4 z-30"
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform"
        style={{ backgroundColor: themeConfig.colors.primary }}
        title={`Current mood: ${currentMood} (${themeConfig.name})`}
      >
        {getMoodEmoji()}
      </div>
    </motion.div>
  );
}

// Mood-aware Button Component
interface MoodButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export function MoodButton({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '' 
}: MoodButtonProps) {
  const { themeConfig } = useMoodTheme();
  
  const getButtonStyles = () => {
    const colors = themeConfig.colors;
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          color: 'white',
          boxShadow: `0 4px 14px 0 ${colors.primary}40`
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          color: 'white',
          boxShadow: `0 4px 14px 0 ${colors.secondary}40`
        };
      case 'accent':
        return {
          backgroundColor: colors.accent,
          color: 'white',
          boxShadow: `0 4px 14px 0 ${colors.accent}40`
        };
      default:
        return {};
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${className}`}
      style={getButtonStyles()}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}