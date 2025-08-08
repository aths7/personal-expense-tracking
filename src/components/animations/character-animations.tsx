'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Character, CharacterMood } from '@/types/advanced-gamification';
import { formatCurrency } from '@/lib/currency';
import { 
  Heart, 
  Zap, 
  AlertCircle, 
  Smile, 
  Frown, 
  Meh,
  Star,
  Sparkles
} from 'lucide-react';

interface AnimatedCharacterProps {
  character: Character;
  mood: CharacterMood;
  size?: 'small' | 'medium' | 'large';
  showReaction?: boolean;
}

export function AnimatedCharacter({ 
  character, 
  mood, 
  size = 'medium',
  showReaction = true 
}: AnimatedCharacterProps) {
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [showMoodBubble, setShowMoodBubble] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const getMoodIcon = () => {
    switch (mood.mood) {
      case 'happy': return <Smile className="w-6 h-6 text-green-500" />;
      case 'excited': return <Star className="w-6 h-6 text-yellow-500" />;
      case 'worried': return <AlertCircle className="w-6 h-6 text-orange-500" />;
      case 'angry': return <Frown className="w-6 h-6 text-red-500" />;
      case 'sleepy': return <Meh className="w-6 h-6 text-blue-400" />;
      default: return <Meh className="w-6 h-6 text-gray-500" />;
    }
  };

  const getCharacterEmoji = () => {
    switch (character.type) {
      case 'pig': return '🐷';
      case 'mario': return '🍄';
      case 'sonic': return '💨';
      case 'cat': return '🐱';
      case 'robot': return '🤖';
      case 'dragon': return '🐲';
      case 'wizard': return '🧙‍♂️';
      default: return '💰';
    }
  };

  const getAnimationForMood = () => {
    switch (mood.mood) {
      case 'happy':
        return {
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0],
          transition: { duration: 1, repeat: Infinity, repeatDelay: 2 }
        };
      case 'excited':
        return {
          y: [0, -10, 0],
          scale: [1, 1.05, 1],
          transition: { duration: 0.6, repeat: Infinity }
        };
      case 'worried':
        return {
          x: [0, -3, 3, 0],
          transition: { duration: 0.4, repeat: Infinity, repeatDelay: 1 }
        };
      case 'angry':
        return {
          scale: [1, 0.95, 1.05, 1],
          rotate: [0, -2, 2, 0],
          transition: { duration: 0.3, repeat: Infinity, repeatDelay: 0.5 }
        };
      case 'sleepy':
        return {
          scale: [1, 0.98, 1],
          transition: { duration: 3, repeat: Infinity }
        };
      default:
        return {
          scale: [1, 1.02, 1],
          transition: { duration: 4, repeat: Infinity }
        };
    }
  };

  useEffect(() => {
    if (mood.trigger !== 'idle') {
      setShowMoodBubble(true);
      const timer = setTimeout(() => setShowMoodBubble(false), mood.duration);
      return () => clearTimeout(timer);
    }
  }, [mood]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Character Base */}
      <motion.div
        animate={getAnimationForMood()}
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-4xl shadow-lg border-2 border-white relative overflow-hidden`}
      >
        {/* Character Emoji/Sprite */}
        <span className="text-2xl">{getCharacterEmoji()}</span>
        
        {/* Sparkle Effect for Happy/Excited */}
        {(mood.mood === 'happy' || mood.mood === 'excited') && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 60],
                  y: [0, (Math.random() - 0.5) * 60]
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute"
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Mood Bubble */}
      <AnimatePresence>
        {showReaction && showMoodBubble && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: -10 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200"
          >
            {getMoodIcon()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Name */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-center whitespace-nowrap">
        {character.name}
      </div>
    </div>
  );
}

// Expense Amount Animation Component
interface ExpenseAmountAnimationProps {
  amount: number;
  type: 'add' | 'remove';
  onComplete?: () => void;
}

export function ExpenseAmountAnimation({ 
  amount, 
  type, 
  onComplete 
}: ExpenseAmountAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const getAmountSize = () => {
    if (amount > 1000) return 'large';
    if (amount > 100) return 'medium';
    return 'small';
  };

  const getSizeClasses = () => {
    switch (getAmountSize()) {
      case 'large': return 'text-3xl';
      case 'medium': return 'text-2xl';
      default: return 'text-xl';
    }
  };

  const getColorClasses = () => {
    if (type === 'add') {
      return amount > 500 ? 'text-red-500' : amount > 100 ? 'text-orange-500' : 'text-green-500';
    }
    return 'text-blue-500';
  };

  const getAnimationIntensity = () => {
    switch (getAmountSize()) {
      case 'large':
        return {
          scale: [0, 1.3, 1.1, 1],
          y: [0, -30, -20, -40],
          rotate: [0, -10, 5, 0],
        };
      case 'medium':
        return {
          scale: [0, 1.2, 1],
          y: [0, -20, -30],
          rotate: [0, -5, 0],
        };
      default:
        return {
          scale: [0, 1.1, 1],
          y: [0, -15, -25],
        };
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 0 }}
      animate={{
        ...getAnimationIntensity(),
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration: 2,
        times: [0, 0.2, 0.8, 1],
        ease: 'easeOut'
      }}
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${getSizeClasses()} ${getColorClasses()} font-bold pointer-events-none z-50 drop-shadow-lg`}
    >
      {type === 'add' ? '+' : '-'}{formatCurrency(amount)}
    </motion.div>
  );
}

// Achievement Unlock Animation
interface AchievementUnlockProps {
  achievementName: string;
  points: number;
  badge: string;
  onComplete?: () => void;
}

export function AchievementUnlock({ 
  achievementName, 
  points, 
  badge, 
  onComplete 
}: AchievementUnlockProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0, y: -100 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-6 rounded-xl shadow-2xl z-50 max-w-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <div className="text-4xl mb-2">🏆</div>
        <div className="text-lg font-bold mb-1">Achievement Unlocked!</div>
        <div className="text-xl font-semibold mb-2">{achievementName}</div>
        <div className="text-sm opacity-90">+{points} points earned!</div>
        
        {/* Confetti particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, (Math.random() - 0.5) * 200]
            }}
            transition={{ 
              duration: 2,
              delay: 0.5 + i * 0.1,
            }}
            className="absolute inset-0 pointer-events-none"
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: ['#fbbf24', '#f59e0b', '#d97706', '#92400e'][i % 4]
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// Level Up Animation
interface LevelUpAnimationProps {
  newLevel: number;
  levelName: string;
  onComplete?: () => void;
}

export function LevelUpAnimation({ 
  newLevel, 
  levelName, 
  onComplete 
}: LevelUpAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', duration: 1 }}
        className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-2xl text-center relative overflow-hidden"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🚀
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-2">LEVEL UP!</h2>
        <div className="text-xl mb-2">Level {newLevel}</div>
        <div className="text-lg opacity-90">{levelName}</div>
        
        {/* Background particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 400],
              y: [0, (Math.random() - 0.5) * 400]
            }}
            transition={{ 
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="absolute inset-0 pointer-events-none"
          >
            <Star className="w-4 h-4 text-yellow-300" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}