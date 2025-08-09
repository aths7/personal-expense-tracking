'use client';

import { useState, useCallback } from 'react';
import { getExpenseContext } from '@/lib/currency';

interface AnimationTrigger {
  type: 'success' | 'ripple' | 'floating' | 'confetti' | 'money_rain';
  config: Record<string, unknown>;
  duration: number;
}

interface ExpenseAnimationContext {
  amount: number;
  category?: string;
  isFirstExpense?: boolean;
  currentStreak?: number;
  totalExpenses?: number;
  isLargeExpense?: boolean;
  isBudgetBreached?: boolean;
  achievementUnlocked?: string;
}

export const useExpenseAnimations = () => {
  const [activeAnimations, setActiveAnimations] = useState<{
    success: boolean;
    ripple: boolean;
    floating: boolean;
    confetti: boolean;
    moneyRain: boolean;
  }>({
    success: false,
    ripple: false,
    floating: false,
    confetti: false,
    moneyRain: false,
  });

  const [animationData, setAnimationData] = useState<{
    amount?: number;
    category?: string;
    type?: 'success' | 'achievement' | 'streak' | 'milestone';
    origin?: { x: number; y: number };
    color?: string;
    intensity?: 'light' | 'normal' | 'heavy';
  }>({});

  const clearAllAnimations = useCallback(() => {
    setActiveAnimations({
      success: false,
      ripple: false,
      floating: false,
      confetti: false,
      moneyRain: false,
    });
    setAnimationData({});
  }, []);

  const executeAnimationSequence = useCallback((animations: AnimationTrigger[]) => {
    animations.forEach((animation, index) => {
      setTimeout(() => {
        setAnimationData(animation.config);
        
        switch (animation.type) {
          case 'success':
            setActiveAnimations(prev => ({ ...prev, success: true }));
            break;
          case 'ripple':
            setActiveAnimations(prev => ({ ...prev, ripple: true }));
            break;
          case 'floating':
            setActiveAnimations(prev => ({ ...prev, floating: true }));
            break;
          case 'confetti':
            setActiveAnimations(prev => ({ ...prev, confetti: true }));
            break;
          case 'money_rain':
            setActiveAnimations(prev => ({ ...prev, moneyRain: true }));
            break;
        }

        // Auto-clear animation after duration
        setTimeout(() => {
          switch (animation.type) {
            case 'success':
              setActiveAnimations(prev => ({ ...prev, success: false }));
              break;
            case 'ripple':
              setActiveAnimations(prev => ({ ...prev, ripple: false }));
              break;
            case 'floating':
              setActiveAnimations(prev => ({ ...prev, floating: false }));
              break;
            case 'confetti':
              setActiveAnimations(prev => ({ ...prev, confetti: false }));
              break;
            case 'money_rain':
              setActiveAnimations(prev => ({ ...prev, moneyRain: false }));
              break;
          }
        }, animation.duration);
      }, index * 500); // Stagger animations by 500ms
    });
  }, []);

  const triggerExpenseAnimation = useCallback((context: ExpenseAnimationContext) => {
    const { 
      amount, 
      category, 
      isFirstExpense, 
      currentStreak, 
      totalExpenses,
      isLargeExpense,
      isBudgetBreached,
      achievementUnlocked
    } = context;

    // Clear any existing animations first
    clearAllAnimations();

    // Determine animation sequence based on context
    const expenseContext = getExpenseContext(amount);
    const animations: AnimationTrigger[] = [];

    // Base success animation (always shows)
    let successType: 'success' | 'achievement' | 'streak' | 'milestone' = 'success';
    
    if (achievementUnlocked) {
      successType = 'achievement';
    } else if (currentStreak && currentStreak >= 5) {
      successType = 'streak';
    } else if (totalExpenses && [10, 25, 50, 100, 200, 500].includes(totalExpenses)) {
      successType = 'milestone';
    }

    animations.push({
      type: 'success',
      config: { 
        amount, 
        category, 
        type: successType 
      },
      duration: successType === 'success' ? 3000 : 4000
    });

    // Ripple effect (always shows, color varies)
    let rippleColor = 'green';
    if (isBudgetBreached) rippleColor = 'red';
    else if (isLargeExpense) rippleColor = 'purple';
    else if (currentStreak && currentStreak >= 3) rippleColor = 'blue';

    animations.push({
      type: 'ripple',
      config: { color: rippleColor },
      duration: 1000
    });

    // Floating number animation
    animations.push({
      type: 'floating',
      config: { 
        amount, 
        type: 'add',
        origin: { x: 50 + (Math.random() - 0.5) * 20, y: 45 + (Math.random() - 0.5) * 10 }
      },
      duration: 2000
    });

    // Special animations based on context
    if (isFirstExpense) {
      // First expense - celebration!
      animations.push({
        type: 'confetti',
        config: { intensity: 'heavy' },
        duration: 3000
      });
    } else if (achievementUnlocked) {
      // Achievement unlocked
      animations.push({
        type: 'confetti',
        config: { 
          intensity: 'normal',
          colors: ['#F59E0B', '#FCD34D', '#FEF3C7']
        },
        duration: 2500
      });
    } else if (currentStreak && currentStreak >= 7) {
      // Long streak celebration
      animations.push({
        type: 'money_rain',
        config: { intensity: 'normal' },
        duration: 2000
      });
    } else if (totalExpenses && totalExpenses % 50 === 0 && totalExpenses > 0) {
      // Milestone celebrations
      animations.push({
        type: 'confetti',
        config: { intensity: 'light' },
        duration: 2000
      });
    }

    // Large expense warning (but still celebrate the tracking!)
    if (expenseContext.level === 'very_large' || expenseContext.level === 'extreme') {
      // Show a different success animation
      setTimeout(() => {
        setAnimationData({
          amount: 100, // Points for tracking large expense
          type: 'achievement',
          origin: { x: 75, y: 25 }
        });
        setActiveAnimations(prev => ({ ...prev, floating: true }));
      }, 3500);
    }

    // Execute animation sequence
    executeAnimationSequence(animations);
  }, [clearAllAnimations, executeAnimationSequence]);


  const triggerStreakAnimation = useCallback((streakDays: number) => {
    setAnimationData({
      amount: streakDays,
      type: 'streak',
      origin: { x: 70, y: 30 }
    });
    setActiveAnimations(prev => ({ ...prev, floating: true }));

    if (streakDays >= 7) {
      setTimeout(() => {
        setActiveAnimations(prev => ({ ...prev, confetti: true }));
      }, 500);
    }
  }, []);

  const triggerPointsAnimation = useCallback((points: number, origin?: { x: number; y: number }) => {
    setAnimationData({
      amount: points,
      type: 'achievement',
      origin: origin || { x: 50, y: 50 }
    });
    setActiveAnimations(prev => ({ ...prev, floating: true }));
  }, []);

  const triggerAchievementAnimation = useCallback((achievementName: string) => {
    setAnimationData({
      amount: 0,
      type: 'achievement',
      category: achievementName
    });
    setActiveAnimations(prev => ({ 
      ...prev, 
      success: true,
      confetti: true 
    }));
  }, []);

  const triggerCustomAnimation = useCallback((
    type: keyof typeof activeAnimations,
    config: Record<string, unknown> = {},
    duration: number = 2000
  ) => {
    setAnimationData(config);
    setActiveAnimations(prev => ({ ...prev, [type]: true }));
    
    setTimeout(() => {
      setActiveAnimations(prev => ({ ...prev, [type]: false }));
    }, duration);
  }, []);

  return {
    activeAnimations,
    animationData,
    triggerExpenseAnimation,
    triggerStreakAnimation,
    triggerPointsAnimation,
    triggerAchievementAnimation,
    triggerCustomAnimation,
    clearAllAnimations,
    
    // Helper methods for manual control
    startSuccessAnimation: (amount: number, category?: string, type?: 'success' | 'achievement' | 'streak' | 'milestone') => {
      setAnimationData({ amount, category, type: type || 'success' });
      setActiveAnimations(prev => ({ ...prev, success: true }));
    },
    
    startRippleAnimation: (color: string = 'green', origin?: { x: number; y: number }) => {
      setAnimationData({ color, origin });
      setActiveAnimations(prev => ({ ...prev, ripple: true }));
    },
    
    startConfettiAnimation: (intensity: 'light' | 'normal' | 'heavy' = 'normal') => {
      setAnimationData({ intensity });
      setActiveAnimations(prev => ({ ...prev, confetti: true }));
    },
    
    startMoneyRainAnimation: (intensity: 'light' | 'normal' | 'heavy' = 'normal') => {
      setAnimationData({ intensity });
      setActiveAnimations(prev => ({ ...prev, moneyRain: true }));
    }
  };
};