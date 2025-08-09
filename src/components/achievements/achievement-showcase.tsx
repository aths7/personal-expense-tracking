'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy,
  Star,
  Lock,
  Eye,
  EyeOff,
  Crown,
  Zap,
  Calendar,
  Target,
  Gift,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

import { AnimatedCard } from '@/components/ui/animated-card';
import { ProgressRing, AnimatedCounter } from '@/components/ui/progress-ring';
import { AchievementUnlock } from '@/components/animations/character-animations';
import { useGamification } from '@/hooks/useGamification';
import { advancedAchievementService } from '@/services/advanced-achievements';

interface AchievementCardProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    badge: string;
    points: number;
    rarity: string;
    unlocked_at?: string;
    progress?: number;
    hint?: string;
    hidden?: boolean;
    category: string;
  };
  isUnlocked: boolean;
  progress?: number;
  isHidden?: boolean;
  onUnlock?: () => void;
}

function AchievementCard({ achievement, isUnlocked, progress = 0, isHidden = false, onUnlock }: AchievementCardProps) {
  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-300 bg-yellow-50'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityGlow = (rarity: string) => {
    const glows = {
      common: 'shadow-gray-200',
      rare: 'shadow-blue-200',
      epic: 'shadow-purple-200',
      legendary: 'shadow-yellow-200'
    };
    return glows[rarity as keyof typeof glows] || glows.common;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative overflow-hidden`}
    >
      <AnimatedCard 
        className={`${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)} ${
          isUnlocked ? 'shadow-lg' : 'opacity-60'
        }`}
        hoverEffect="glow"
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Achievement Badge */}
            <div className="relative">
              <motion.div
                animate={isUnlocked ? { 
                  rotate: [0, -10, 10, -5, 5, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  isUnlocked ? 'bg-white shadow-md' : 'bg-gray-200'
                }`}
              >
                {isHidden && !isUnlocked ? (
                  <Lock className="w-6 h-6 text-gray-400" />
                ) : (
                  achievement.badge || '🏆'
                )}
              </motion.div>
              
              {/* Rarity indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isUnlocked ? 1 : 0.7 }}
                className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                  achievement.rarity === 'legendary' ? 'bg-yellow-400' :
                  achievement.rarity === 'epic' ? 'bg-purple-400' :
                  achievement.rarity === 'rare' ? 'bg-blue-400' : 'bg-gray-400'
                }`}
              >
                {achievement.rarity === 'legendary' && <Crown className="w-3 h-3 text-white" />}
                {achievement.rarity === 'epic' && <Star className="w-3 h-3 text-white" />}
                {achievement.rarity === 'rare' && <Zap className="w-3 h-3 text-white" />}
                {achievement.rarity === 'common' && <Award className="w-3 h-3 text-white" />}
              </motion.div>

              {/* Unlock animation particles */}
              {isUnlocked && (
                <>
                  {Array.from({ length: 4 }).map((_, i) => (
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
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    >
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Achievement Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-semibold ${isHidden && !isUnlocked ? 'text-gray-500' : 'text-gray-900'}`}>
                  {isHidden && !isUnlocked ? '???' : achievement.name}
                </h3>
                <Badge 
                  variant={isUnlocked ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  +{achievement.points}
                </Badge>
              </div>

              <p className={`text-sm mb-2 ${isHidden && !isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                {isHidden && !isUnlocked ? achievement.hint || 'Hidden achievement' : achievement.description}
              </p>

              {/* Progress bar for incomplete achievements */}
              {!isUnlocked && progress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Unlock date */}
              {isUnlocked && achievement.unlocked_at && (
                <div className="text-xs text-gray-500 mt-2">
                  Unlocked: {new Date(achievement.unlocked_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Shine effect for legendary achievements */}
        {achievement.rarity === 'legendary' && isUnlocked && (
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'linear'
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
          />
        )}
      </AnimatedCard>
    </motion.div>
  );
}

interface AchievementStatsProps {
  totalAchievements: number;
  unlockedAchievements: number;
  totalPoints: number;
  rarityBreakdown: Record<string, number>;
}

function AchievementStats({ totalAchievements, unlockedAchievements, totalPoints, rarityBreakdown }: AchievementStatsProps) {
  const completionRate = (unlockedAchievements / totalAchievements) * 100;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <AnimatedCard>
        <CardContent className="p-4 text-center">
          <div className="mb-2">
            <ProgressRing
              progress={completionRate}
              size={60}
              strokeWidth={6}
              color="#10b981"
              showText={false}
            />
          </div>
          <div className="text-sm font-medium">Completion</div>
          <div className="text-xs text-gray-500">
            {unlockedAchievements}/{totalAchievements}
          </div>
        </CardContent>
      </AnimatedCard>

      <AnimatedCard>
        <CardContent className="p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-lg font-bold">
            <AnimatedCounter from={0} to={totalPoints} duration={1.5} />
          </div>
          <div className="text-xs text-gray-500">Total Points</div>
        </CardContent>
      </AnimatedCard>

      <AnimatedCard>
        <CardContent className="p-4 text-center">
          <Crown className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-lg font-bold">{rarityBreakdown.legendary || 0}</div>
          <div className="text-xs text-gray-500">Legendary</div>
        </CardContent>
      </AnimatedCard>

      <AnimatedCard>
        <CardContent className="p-4 text-center">
          <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-lg font-bold">{rarityBreakdown.epic || 0}</div>
          <div className="text-xs text-gray-500">Epic</div>
        </CardContent>
      </AnimatedCard>
    </div>
  );
}

export function AchievementShowcase() {
  const [showHidden, setShowHidden] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<{
    id: string;
    name: string;
    points: number;
    badge: string;
  } | null>(null);
  
  const { gameStats } = useGamification();
  const achievements = gameStats?.achievements;
  const userProfile = gameStats?.profile;

  // Mock data for demonstration
  const mockAchievements = [
    {
      id: 'first-expense',
      name: 'Getting Started',
      description: 'Log your first expense',
      badge: '🎯',
      points: 10,
      rarity: 'common',
      category: 'basic',
      unlocked_at: '2024-01-15',
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Maintain a 30-day logging streak',
      badge: '🔥',
      points: 100,
      rarity: 'epic',
      category: 'streak',
      progress: 73,
    },
    {
      id: 'fibonacci-financier',
      name: 'Fibonacci Financier',
      description: 'A mathematical mystery awaits...',
      hint: "Nature's numbers hide in your spending patterns",
      badge: '🌀',
      points: 150,
      rarity: 'legendary',
      category: 'hidden',
      hidden: true,
    },
    {
      id: 'budget-master',
      name: 'Budget Master',
      description: 'Stay under budget for 3 consecutive months',
      badge: '💰',
      points: 200,
      rarity: 'epic',
      category: 'budget',
      unlocked_at: '2024-02-01',
    }
  ];

  const unlockedAchievements = mockAchievements.filter(a => a.unlocked_at);
  const hiddenAchievements = mockAchievements.filter(a => a.hidden);
  
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
  const rarityBreakdown = unlockedAchievements.reduce((acc, a) => {
    acc[a.rarity] = (acc[a.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredAchievements = mockAchievements.filter(achievement => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'unlocked') return achievement.unlocked_at;
    if (selectedCategory === 'hidden') return achievement.hidden;
    return achievement.category === selectedCategory;
  });

  const achievementCategories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'unlocked', label: 'Unlocked', icon: Star },
    { id: 'basic', label: 'Basic', icon: Target },
    { id: 'streak', label: 'Streaks', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: TrendingUp },
    { id: 'hidden', label: 'Hidden', icon: Eye },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Achievement Gallery</h2>
          <p className="text-gray-600">Track your financial milestones and unlock rewards</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHidden(!showHidden)}
          className="flex items-center gap-2"
        >
          {showHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showHidden ? 'Hide Secrets' : 'Show Hints'}
        </Button>
      </div>

      {/* Stats Overview */}
      <AchievementStats
        totalAchievements={mockAchievements.length}
        unlockedAchievements={unlockedAchievements.length}
        totalPoints={totalPoints}
        rarityBreakdown={rarityBreakdown}
      />

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {achievementCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {category.label}
            </motion.button>
          );
        })}
      </div>

      {/* Hidden Achievement Hints */}
      {showHidden && hiddenAchievements.length > 0 && (
        <AnimatedCard className="border-dashed border-2 border-purple-300 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Gift className="w-5 h-5" />
              Secret Achievement Hints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advancedAchievementService.getHiddenAchievementHints().map((hint, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">?</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-700">{hint.hint}</div>
                    <div className="text-xs text-purple-600 mt-1">
                      {hint.rarity} • {hint.points} points
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>
      )}

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <AchievementCard
                achievement={achievement}
                isUnlocked={!!achievement.unlocked_at}
                progress={achievement.progress}
                isHidden={achievement.hidden}
                onUnlock={() => setShowUnlockAnimation(achievement)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
          <p className="text-gray-500">Try adjusting your filters or start tracking expenses to earn achievements!</p>
        </div>
      )}

      {/* Unlock Animation */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <AchievementUnlock
            key="achievement-showcase-unlock"
            achievementName={showUnlockAnimation.name}
            points={showUnlockAnimation.points}
            badge={showUnlockAnimation.badge}
            onComplete={() => setShowUnlockAnimation(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}