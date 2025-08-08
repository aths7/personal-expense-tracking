'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Category } from '@/types';
import { formatCurrency } from '@/lib/currency';
import { 
  UtensilsCrossed, 
  Car, 
  Gamepad2, 
  Receipt, 
  ShoppingBag,
  Heart,
  GraduationCap,
  Plane,
  Apple,
  MoreHorizontal
} from 'lucide-react';

interface InteractiveCategoryProps {
  category: Category;
  amount: number;
  isEating?: boolean;
  onEatingComplete?: () => void;
}

export function InteractiveCategory({ 
  category, 
  amount, 
  isEating = false,
  onEatingComplete 
}: InteractiveCategoryProps) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [showAmount, setShowAmount] = useState(false);

  const getIconComponent = () => {
    const iconName = category.icon || 'MoreHorizontal';
    const icons = {
      UtensilsCrossed, Car, Gamepad2, Receipt, ShoppingBag,
      Heart, GraduationCap, Plane, Apple, MoreHorizontal
    };
    return icons[iconName as keyof typeof icons] || MoreHorizontal;
  };

  const IconComponent = getIconComponent();

  useEffect(() => {
    if (isEating) {
      // Start eating animation sequence
      setMouthOpen(true);
      setShowAmount(true);

      const sequence = async () => {
        // Chomp animation
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setMouthOpen(false);
          await new Promise(resolve => setTimeout(resolve, 200));
          setMouthOpen(true);
        }

        // Show satisfied state
        setTimeout(() => {
          setMouthOpen(false);
          setShowAmount(false);
          onEatingComplete?.();
        }, 500);
      };

      sequence();
    }
  }, [isEating, onEatingComplete]);

  const getCategoryPersonality = () => {
    const categoryPersonalities = {
      'Food & Dining': { emoji: '😋', eatSound: 'nom nom', satisfaction: 'Delicious!' },
      'Transportation': { emoji: '🚗', eatSound: 'vroom', satisfaction: 'Fueled up!' },
      'Entertainment': { emoji: '🎮', eatSound: 'beep boop', satisfaction: 'Fun times!' },
      'Bills & Utilities': { emoji: '📄', eatSound: 'crunch', satisfaction: 'Bills paid!' },
      'Shopping': { emoji: '🛍️', eatSound: 'ka-ching', satisfaction: 'Great buy!' },
      'Healthcare': { emoji: '💊', eatSound: 'gulp', satisfaction: 'Healthy choice!' },
      'Education': { emoji: '📚', eatSound: 'flip', satisfaction: 'Knowledge gained!' },
      'Travel': { emoji: '✈️', eatSound: 'whoosh', satisfaction: 'Adventure!' },
      'Groceries': { emoji: '🍎', eatSound: 'crunch', satisfaction: 'Nutritious!' },
      'Other': { emoji: '💰', eatSound: 'clink', satisfaction: 'Organized!' }
    };

    return categoryPersonalities[category.name as keyof typeof categoryPersonalities] || 
           categoryPersonalities['Other'];
  };

  const personality = getCategoryPersonality();

  return (
    <div className="relative">
      {/* Category Monster/Character */}
      <motion.div
        animate={isEating ? {
          scale: [1, 1.1, 1.05, 1],
          rotate: [0, -2, 2, 0]
        } : {}}
        transition={{ duration: 0.6, repeat: isEating ? 3 : 0 }}
        className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
        style={{ 
          backgroundColor: category.color || '#D5DBDB',
          backgroundImage: isEating ? 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)' : 'none'
        }}
      >
        {/* Character Face */}
        <div className="relative">
          <IconComponent className="w-8 h-8 text-white" />
          
          {/* Eyes */}
          <div className="absolute -top-2 -left-1 flex space-x-2">
            <motion.div 
              animate={isEating ? { scaleY: [1, 0.3, 1] } : {}}
              transition={{ duration: 0.3, repeat: isEating ? Infinity : 0 }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
            <motion.div 
              animate={isEating ? { scaleY: [1, 0.3, 1] } : {}}
              transition={{ duration: 0.3, repeat: isEating ? Infinity : 0, delay: 0.1 }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
          
          {/* Mouth */}
          <motion.div
            animate={mouthOpen ? { scaleY: 2, scaleX: 1.5 } : { scaleY: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-1.5 bg-black rounded-full"
          />
          
          {/* Teeth when mouth is open */}
          <AnimatePresence>
            {mouthOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-0.5 flex space-x-0.5"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-0.5 h-1 bg-white" />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Eating particles */}
        <AnimatePresence>
          {isEating && Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                scale: 0, 
                x: 0, 
                y: 0,
                rotate: 0
              }}
              animate={{ 
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 60],
                y: [0, -20 - Math.random() * 20],
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 1,
                delay: i * 0.2,
                repeat: 2
              }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs"
            >
              💸
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Amount being "eaten" */}
      <AnimatePresence>
        {showAmount && (
          <motion.div
            initial={{ scale: 1, y: 0, opacity: 1 }}
            animate={{ 
              scale: [1, 0.8, 0],
              y: [0, -10, -40],
              opacity: [1, 1, 0]
            }}
            transition={{ duration: 1.5 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-sm font-bold"
            style={{ color: category.color }}
          >
            {formatCurrency(amount)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Satisfaction bubble */}
      <AnimatePresence>
        {isEating && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-green-100 border-2 border-green-300 px-2 py-1 rounded-lg text-xs text-green-800 font-medium whitespace-nowrap"
          >
            {personality.satisfaction}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category name */}
      <div className="mt-2 text-center text-xs font-medium text-gray-600 dark:text-gray-300">
        {category.name}
      </div>
    </div>
  );
}

// Expense Category Selector with Animations
interface AnimatedCategorySelectorProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (categoryId: string) => void;
  recentExpenseAmount?: number;
}

export function AnimatedCategorySelector({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  recentExpenseAmount 
}: AnimatedCategorySelectorProps) {
  const [eatingCategory, setEatingCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    
    // Trigger eating animation if there's a recent expense amount
    if (recentExpenseAmount && recentExpenseAmount > 0) {
      setEatingCategory(categoryId);
    }
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 p-4">
      {categories.map((category) => (
        <motion.div
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`cursor-pointer ${
            selectedCategory === category.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`}
          onClick={() => handleCategoryClick(category.id)}
        >
          <InteractiveCategory
            category={category}
            amount={recentExpenseAmount || 0}
            isEating={eatingCategory === category.id}
            onEatingComplete={() => setEatingCategory(null)}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Growing Plant Animation for Streaks
interface StreakPlantProps {
  streakDays: number;
  maxGrowth?: number;
}

export function StreakPlant({ streakDays, maxGrowth = 30 }: StreakPlantProps) {
  const growth = Math.min(streakDays / maxGrowth, 1);
  const stage = Math.floor(growth * 5); // 0-4 growth stages

  const getPlantStage = () => {
    switch (stage) {
      case 0: return { emoji: '🌱', name: 'Seedling' };
      case 1: return { emoji: '🌿', name: 'Sprout' };
      case 2: return { emoji: '🌾', name: 'Growing' };
      case 3: return { emoji: '🌳', name: 'Tree' };
      case 4: return { emoji: '🌸', name: 'Blooming' };
      default: return { emoji: '🌱', name: 'Seedling' };
    }
  };

  const plant = getPlantStage();

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 1 }}
        className="relative"
      >
        <div className="text-6xl">{plant.emoji}</div>
        
        {/* Growth sparkles */}
        {streakDays > 0 && Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 40],
              y: [0, -20 - Math.random() * 20]
            }}
            transition={{ 
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            ✨
          </motion.div>
        ))}
      </motion.div>
      
      <div className="text-sm font-medium text-center mt-2">
        <div>{plant.name}</div>
        <div className="text-xs text-gray-500">{streakDays} day streak</div>
      </div>
      
      {/* Growth bar */}
      <div className="w-16 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${growth * 100}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
        />
      </div>
    </div>
  );
}