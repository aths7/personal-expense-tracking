'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  X, 
  Play, 
  CheckCircle, 
  ArrowRight,
  Wallet,
  Trophy,
  Gamepad2,
  BarChart3,
  Crown,
  Zap
} from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { formatCurrency } from '@/lib/currency';
import { useOnboarding, ONBOARDING_STEPS, FEATURE_HIGHLIGHTS } from '@/hooks/useOnboarding';

interface QuickStartGuideProps {
  onClose?: () => void;
}

export function QuickStartGuide({ onClose }: QuickStartGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    hasCompletedStep, 
    markStepCompleted, 
    showFeatureHighlight,
    startTutorial 
  } = useOnboarding();

  const quickTasks = [
    {
      id: ONBOARDING_STEPS.FIRST_EXPENSE_ADDED,
      title: '🎯 Add Your First Expense',
      description: 'Track your first spending to unlock achievements',
      reward: '+25 points',
      action: () => showFeatureHighlight(FEATURE_HIGHLIGHTS.ADD_EXPENSE_BUTTON),
      example: `Try adding: "Tea - ${formatCurrency(20)}"`
    },
    {
      id: ONBOARDING_STEPS.CATEGORY_EXPLORED,
      title: '📂 Explore Categories',
      description: 'Try different expense categories with animations',
      reward: '+15 points',
      action: () => showFeatureHighlight(FEATURE_HIGHLIGHTS.ADD_EXPENSE_BUTTON),
      example: 'Food, Transport, Entertainment, etc.'
    },
    {
      id: ONBOARDING_STEPS.CHARACTER_SELECTED,
      title: '👑 Choose Your Character',
      description: 'Pick a financial companion to guide you',
      reward: '+20 points',
      action: () => showFeatureHighlight(FEATURE_HIGHLIGHTS.GAMIFICATION_HUB),
      example: 'Piggy, Mario, Sonic, and more!'
    },
    {
      id: ONBOARDING_STEPS.MINI_GAME_PLAYED,
      title: '🎮 Play Your First Game',
      description: 'Earn extra points through mini-games',
      reward: '+30 points',
      action: () => showFeatureHighlight(FEATURE_HIGHLIGHTS.MINI_GAMES),
      example: 'Budget Blast, Expense Match, etc.'
    },
    {
      id: ONBOARDING_STEPS.DASHBOARD_VISITED,
      title: '📊 Check Your Dashboard',
      description: 'View spending insights and statistics',
      reward: '+10 points',
      action: () => window.location.href = '/dashboard',
      example: 'Charts, trends, and predictions'
    }
  ];

  const completedTasks = quickTasks.filter(task => hasCompletedStep(task.id));
  const remainingTasks = quickTasks.filter(task => !hasCompletedStep(task.id));

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <Card className="shadow-xl border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Quick Start</h3>
                <p className="text-sm text-blue-700">
                  {remainingTasks.length} tasks remaining
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsExpanded(true)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
                {onClose && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-4 z-50 flex items-center justify-center"
    >
      <div className="bg-black/50 absolute inset-0" onClick={() => setIsExpanded(false)} />
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Quick Start Guide</h2>
              <p className="text-blue-100">Get started with these simple tasks</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Progress</div>
              <div className="text-xl font-bold">
                {completedTasks.length}/{quickTasks.length}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <EnhancedButton
              onClick={startTutorial}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Full Tutorial
            </EnhancedButton>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 ml-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {quickTasks.map((task, index) => {
              const isCompleted = hasCompletedStep(task.id);
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200 opacity-75' 
                      : 'hover:shadow-md border-gray-200'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{task.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {task.reward}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <p className="text-xs text-gray-500">{task.example}</p>
                        </div>
                        
                        {!isCompleted && (
                          <EnhancedButton
                            size="sm"
                            onClick={task.action}
                            className="flex-shrink-0"
                          >
                            Try it
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </EnhancedButton>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
            <div className="text-center">
              <div className="text-2xl mb-2">
                {remainingTasks.length === 0 ? '🎉' : '🚀'}
              </div>
              <h3 className="font-semibold mb-1">
                {remainingTasks.length === 0 
                  ? 'All Done!' 
                  : `${remainingTasks.length} tasks to go`}
              </h3>
              <p className="text-sm text-gray-600">
                {remainingTasks.length === 0 
                  ? 'You\'re ready to track expenses like a pro!' 
                  : 'Complete these tasks to get the most out of the app'}
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Key Features to Explore
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Achievements & Badges</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Gamepad2 className="w-4 h-4 text-purple-500" />
                <span>Mini-Games</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Crown className="w-4 h-4 text-blue-500" />
                <span>Character System</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BarChart3 className="w-4 h-4 text-green-500" />
                <span>Smart Insights</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}