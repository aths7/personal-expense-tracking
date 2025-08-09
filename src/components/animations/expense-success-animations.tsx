'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Sparkles, 
  Star,
  Zap,
  Heart,
  Target,
  Award
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface ExpenseSuccessAnimationProps {
  isActive: boolean;
  amount: number;
  category?: string;
  onComplete?: () => void;
  type?: 'success' | 'achievement' | 'streak' | 'milestone';
}

export function ExpenseSuccessAnimation({ 
  isActive, 
  amount, 
  category,
  onComplete,
  type = 'success'
}: ExpenseSuccessAnimationProps) {
  const [stage, setStage] = useState<'check' | 'amount' | 'sparkles' | 'complete'>('check');

  useEffect(() => {
    if (!isActive) return;

    const sequence = async () => {
      // Stage 1: Show check mark (500ms)
      setStage('check');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Stage 2: Show amount (1000ms)
      setStage('amount');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 3: Sparkles effect (1500ms)
      setStage('sparkles');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Stage 4: Complete
      setStage('complete');
      onComplete?.();
    };

    sequence();
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'achievement':
        return {
          icon: Award,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          message: 'Achievement Unlocked!'
        };
      case 'streak':
        return {
          icon: Zap,
          color: 'text-orange-500',
          bgColor: 'bg-orange-100',
          message: 'Streak Continued!'
        };
      case 'milestone':
        return {
          icon: Target,
          color: 'text-purple-500',
          bgColor: 'bg-purple-100',
          message: 'Milestone Reached!'
        };
      default:
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          message: 'Expense Added!'
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <AnimatePresence mode="wait">
        {/* Stage 1: Check Mark */}
        {stage === 'check' && (
          <motion.div
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.3, 1],
              opacity: 1,
              rotate: [0, -10, 10, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className={`${config.bgColor} rounded-full p-6 shadow-xl`}
          >
            <IconComponent className={`w-12 h-12 ${config.color}`} />
          </motion.div>
        )}

        {/* Stage 2: Amount Display */}
        {stage === 'amount' && (
          <motion.div
            key="amount"
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "backOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-200"
            >
              <div className="text-sm text-gray-600 mb-2">{config.message}</div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {formatCurrency(amount)}
              </div>
              {category && (
                <div className="text-sm text-gray-500">
                  added to {category}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Stage 3: Sparkles Effect */}
        {stage === 'sparkles' && (
          <motion.div
            key="sparkles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* Central Success Icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`${config.bgColor} rounded-full p-4 shadow-xl`}
            >
              <IconComponent className={`w-8 h-8 ${config.color}`} />
            </motion.div>

            {/* Sparkles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`sparkle-${Date.now()}-${i}`}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: Math.cos(i * 45 * Math.PI / 180) * 60,
                  y: Math.sin(i * 45 * Math.PI / 180) * 60,
                  opacity: [0, 1, 0],
                  rotate: 360
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            ))}

            {/* Floating Hearts/Stars */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`heart-${Date.now()}-${i}`}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 0
                }}
                animate={{
                  scale: [0, 1, 1, 0],
                  x: (Math.random() - 0.5) * 120,
                  y: [0, -30, -60, -90],
                  opacity: [0, 1, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 2,
                  delay: 0.3 + i * 0.15,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                {i % 2 === 0 ? (
                  <Heart className="w-3 h-3 text-pink-400" fill="currentColor" />
                ) : (
                  <Star className="w-3 h-3 text-blue-400" fill="currentColor" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Ripple Effect Animation
interface RippleEffectProps {
  isActive: boolean;
  origin?: { x: number; y: number };
  color?: string;
}

export function RippleEffect({ isActive, origin = { x: 50, y: 50 }, color = 'green' }: RippleEffectProps) {
  if (!isActive) return null;

  const timestamp = Date.now();

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`ripple-${timestamp}-${i}`}
          initial={{ 
            scale: 0,
            opacity: 0.6
          }}
          animate={{ 
            scale: 4,
            opacity: 0
          }}
          transition={{ 
            duration: 1,
            delay: i * 0.2,
            ease: "easeOut"
          }}
          className={`absolute rounded-full border-2 ${
            color === 'green' ? 'border-green-400' :
            color === 'blue' ? 'border-blue-400' :
            color === 'purple' ? 'border-purple-400' :
            'border-yellow-400'
          }`}
          style={{
            left: `${origin.x}%`,
            top: `${origin.y}%`,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
}

// Floating Number Animation
interface FloatingNumberProps {
  isActive: boolean;
  amount: number;
  type?: 'add' | 'subtract' | 'points' | 'streak';
  origin?: { x: number; y: number };
}

export function FloatingNumber({ 
  isActive, 
  amount, 
  type = 'add',
  origin = { x: 50, y: 50 }
}: FloatingNumberProps) {
  if (!isActive) return null;

  const getConfig = () => {
    switch (type) {
      case 'subtract':
        return {
          prefix: '-',
          color: 'text-red-500',
          bg: 'bg-red-100'
        };
      case 'points':
        return {
          prefix: '+',
          suffix: ' pts',
          color: 'text-blue-500',
          bg: 'bg-blue-100',
          icon: Star
        };
      case 'streak':
        return {
          prefix: '',
          suffix: ' day streak!',
          color: 'text-orange-500',
          bg: 'bg-orange-100',
          icon: Zap
        };
      default:
        return {
          prefix: '+',
          color: 'text-green-500',
          bg: 'bg-green-100'
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <motion.div
        initial={{ 
          scale: 0,
          opacity: 0,
          x: 0,
          y: 0
        }}
        animate={{ 
          scale: [0, 1.2, 1],
          opacity: [0, 1, 1, 0],
          y: [0, -50, -100],
          x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40]
        }}
        transition={{ 
          duration: 2,
          ease: "easeOut"
        }}
        className={`absolute ${config.bg} ${config.color} px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center space-x-1`}
        style={{
          left: `${origin.x}%`,
          top: `${origin.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {IconComponent && <IconComponent className="w-4 h-4" />}
        <span>
          {config.prefix}
          {type === 'points' || type === 'streak' ? amount : formatCurrency(amount)}
          {config.suffix}
        </span>
      </motion.div>
    </div>
  );
}

// Confetti Burst Animation
interface ConfettiBurstProps {
  isActive: boolean;
  intensity?: 'light' | 'normal' | 'heavy';
  colors?: string[];
}

export function ConfettiBurst({ 
  isActive, 
  intensity = 'normal',
  colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']
}: ConfettiBurstProps) {
  const getParticleCount = () => {
    switch (intensity) {
      case 'light': return 20;
      case 'heavy': return 60;
      default: return 40;
    }
  };

  if (!isActive) return null;

  const timestamp = Date.now();
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: getParticleCount() }).map((_, i) => (
        <motion.div
          key={`confetti-${timestamp}-${i}`}
          initial={{
            x: '50vw',
            y: '50vh',
            scale: 0,
            opacity: 1,
            rotate: 0
          }}
          animate={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
            rotate: Math.random() * 720
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)]
          }}
        />
      ))}
    </div>
  );
}