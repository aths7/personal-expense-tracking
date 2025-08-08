'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Lightbulb } from 'lucide-react';
import { useOnboarding, FEATURE_HIGHLIGHTS } from '@/hooks/useOnboarding';

interface FeatureHighlightProps {
  feature: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: { x?: number; y?: number };
}

export function FeatureHighlight({ 
  feature, 
  title, 
  description, 
  position = 'bottom',
  offset = { x: 0, y: 0 }
}: FeatureHighlightProps) {
  const { currentFeature, dismissFeatureHighlight } = useOnboarding();

  if (currentFeature !== feature) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default:
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-blue-500 border-x-transparent border-b-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-blue-500 border-x-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-blue-500 border-y-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-blue-500 border-y-transparent border-l-transparent';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-blue-500 border-x-transparent border-t-transparent';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-40"
        onClick={dismissFeatureHighlight}
      />

      {/* Highlight Box */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <div className="relative w-full h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute ${getPositionClasses()} pointer-events-auto`}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px)`,
            }}
          >
            {/* Arrow */}
            <div className={`absolute w-0 h-0 border-[8px] ${getArrowClasses()}`} />
            
            {/* Content */}
            <div className="bg-blue-500 text-white rounded-lg p-4 shadow-xl max-w-sm min-w-[280px]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{title}</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">{description}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1 h-auto"
                  onClick={dismissFeatureHighlight}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={dismissFeatureHighlight}
                >
                  Got it!
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Spotlight effect around the target element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 60px, rgba(0,0,0,0.5) 120px)`,
        }}
      />
    </>
  );
}

// Pre-built highlight components for common features
export function AddExpenseHighlight() {
  return (
    <FeatureHighlight
      feature={FEATURE_HIGHLIGHTS.ADD_EXPENSE_BUTTON}
      title="Add Your First Expense"
      description="Start tracking your expenses by clicking here. Each expense you add earns points and helps your character react!"
      position="bottom"
    />
  );
}

export function GamificationHubHighlight() {
  return (
    <FeatureHighlight
      feature={FEATURE_HIGHLIGHTS.GAMIFICATION_HUB}
      title="Gamification Hub"
      description="Explore achievements, play mini-games, and customize your character. Make expense tracking fun!"
      position="bottom"
    />
  );
}

export function AchievementsHighlight() {
  return (
    <FeatureHighlight
      feature={FEATURE_HIGHLIGHTS.ACHIEVEMENTS_PANEL}
      title="Your Achievements"
      description="Track your financial milestones and earn badges. Some achievements are hidden - discover them!"
      position="left"
    />
  );
}

export function CharacterHighlight() {
  return (
    <FeatureHighlight
      feature={FEATURE_HIGHLIGHTS.CHARACTER_SELECTOR}
      title="Choose Your Character"
      description="Select and customize your financial companion. Different characters have unique personalities!"
      position="top"
    />
  );
}

export function MiniGamesHighlight() {
  return (
    <FeatureHighlight
      feature={FEATURE_HIGHLIGHTS.MINI_GAMES}
      title="Play Mini-Games"
      description="Earn extra points through fun financial games. Test your skills and knowledge!"
      position="right"
    />
  );
}

export function InsightsHighlight() {
  return (
    <FeatureHighlight
      feature={FEATURE_HIGHLIGHTS.INSIGHTS_PANEL}
      title="Smart Insights"
      description="Get AI-powered predictions about your spending patterns and personalized recommendations."
      position="bottom"
    />
  );
}

export function MoodIndicatorHighlight() {
  return (
    <FeatureHighlight
      feature={FEATURE_HIGHLIGHTS.MOOD_INDICATOR}
      title="Character Mood"
      description="Your character's mood changes based on your spending habits. Keep them happy by staying on budget!"
      position="left"
      offset={{ x: -20, y: -20 }}
    />
  );
}

// Wrapper component to handle all highlights
export function FeatureHighlights() {
  return (
    <AnimatePresence>
      <AddExpenseHighlight />
      <GamificationHubHighlight />
      <AchievementsHighlight />
      <CharacterHighlight />
      <MiniGamesHighlight />
      <InsightsHighlight />
      <MoodIndicatorHighlight />
    </AnimatePresence>
  );
}