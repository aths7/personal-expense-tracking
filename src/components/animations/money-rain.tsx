'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Coins } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface MoneyRainProps {
  isActive: boolean;
  duration?: number;
  intensity?: 'light' | 'normal' | 'heavy';
  onComplete?: () => void;
}

export function MoneyRain({ 
  isActive, 
  duration = 3000, 
  intensity = 'normal',
  onComplete 
}: MoneyRainProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; icon: 'dollar' | 'coin' }>>([]);

  const getParticleCount = () => {
    switch (intensity) {
      case 'light': return 15;
      case 'heavy': return 40;
      default: return 25;
    }
  };

  useEffect(() => {
    if (isActive) {
      const particleCount = getParticleCount();
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        icon: Math.random() > 0.7 ? 'coin' : 'dollar' as 'dollar' | 'coin',
      }));
      
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, intensity, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {isActive && particles.map((particle) => {
          const IconComponent = particle.icon === 'dollar' ? DollarSign : Coins;
          
          return (
            <motion.div
              key={particle.id}
              initial={{ 
                x: `${particle.x}vw`, 
                y: '-10vh',
                scale: 0,
                rotate: 0,
                opacity: 0
              }}
              animate={{ 
                y: '110vh',
                scale: [0, 1, 1, 0.8],
                rotate: 360,
                opacity: [0, 1, 1, 0]
              }}
              transition={{ 
                duration: duration / 1000,
                delay: particle.delay,
                ease: 'easeOut'
              }}
              className="absolute"
              style={{ left: 0 }}
            >
              <IconComponent 
                className="w-6 h-6 text-yellow-500 drop-shadow-lg" 
                fill="currentColor"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Coin Flip Animation
interface CoinFlipProps {
  isActive: boolean;
  amount: number;
  onComplete?: () => void;
}

export function CoinFlip({ isActive, amount, onComplete }: CoinFlipProps) {
  const [showAmount, setShowAmount] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setShowAmount(true);
        setTimeout(() => {
          onComplete?.();
          setShowAmount(false);
        }, 1000);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <motion.div
            initial={{ scale: 0, rotateY: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotateY: [0, 180, 360, 540, 720]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 1.2,
              times: [0, 0.3, 1],
              ease: 'easeOut'
            }}
            className="relative"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg flex items-center justify-center border-4 border-yellow-300">
              <DollarSign className="w-8 h-8 text-yellow-900" />
            </div>
            
            <AnimatePresence>
              {showAmount && (
                <motion.div
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: -40 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-lg shadow-lg"
                >
                  +{formatCurrency(amount)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Piggy Bank Fill Animation
interface PiggyBankFillProps {
  progress: number; // 0-100
  isAnimating?: boolean;
}

export function PiggyBankFill({ progress, isAnimating = false }: PiggyBankFillProps) {
  return (
    <div className="relative w-24 h-24">
      {/* Piggy Bank Body */}
      <motion.div
        animate={isAnimating ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : {}}
        transition={{ duration: 0.8, repeat: isAnimating ? Infinity : 0, repeatDelay: 2 }}
        className="w-full h-full bg-gradient-to-br from-pink-300 to-pink-500 rounded-full relative shadow-lg"
      >
        {/* Pig Snout */}
        <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-4 bg-pink-400 rounded-full">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-1">
            <div className="w-1 h-1 bg-pink-600 rounded-full"></div>
            <div className="w-1 h-1 bg-pink-600 rounded-full"></div>
          </div>
        </div>
        
        {/* Pig Eyes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-black rounded-full"></div>
        
        {/* Pig Ears */}
        <div className="absolute -top-2 left-1/4 w-3 h-3 bg-pink-400 rounded-full transform -rotate-12"></div>
        <div className="absolute -top-2 right-1/4 w-3 h-3 bg-pink-400 rounded-full transform rotate-12"></div>
        
        {/* Money Fill Level */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-full opacity-70"
          style={{ 
            clipPath: 'ellipse(90% 100% at 50% 100%)'
          }}
        />
        
        {/* Coin Slot */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-1.5 bg-pink-600 rounded-full"></div>
        
        {/* Floating Coins when filling */}
        {isAnimating && progress < 100 && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: -20 }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 40],
                  y: [-20, -40, -20]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2"
              >
                <Coins className="w-4 h-4 text-yellow-500" />
              </motion.div>
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
}