'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet,
  Trophy,
  Target,
  Sparkles,
  Users,
  BarChart3,
  BookOpen,
  Gamepad2,
  Crown,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Gift,
  Zap
} from 'lucide-react';

import { AnimatedCard } from '@/components/ui/animated-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { formatCurrency } from '@/lib/currency';

interface WelcomeStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  color: string;
}

interface WelcomeTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function WelcomeTutorial({ onComplete, onSkip }: WelcomeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps: WelcomeStep[] = [
    {
      id: 0,
      title: 'Welcome to Your Financial Journey! 🎉',
      description: 'Transform expense tracking into an exciting adventure',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      content: (
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl">
              💰
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold">Personal Expense Tracker</h2>
          <p className="text-gray-600">
            Make managing your money fun with gamification, characters, achievements, and smart insights!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              🎯 <strong>Quick Start:</strong> Track expenses → Earn points → Unlock characters → Level up!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: 'Track Your Expenses',
      description: 'Log your daily spending with beautiful animations',
      icon: Wallet,
      color: 'from-green-500 to-teal-500',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">How to Add Expenses:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
              <li>Click the "Add Expense" button or floating action button</li>
              <li>Enter the amount (in Indian Rupees ₹)</li>
              <li>Choose a category with fun animations</li>
              <li>Add a description and date</li>
              <li>Watch your character react to your spending!</li>
            </ol>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white border rounded p-3 text-center">
              <div className="text-2xl mb-1">🍕</div>
              <div className="font-medium">Food</div>
              <div className="text-gray-500">{formatCurrency(150)}</div>
            </div>
            <div className="bg-white border rounded p-3 text-center">
              <div className="text-2xl mb-1">🚗</div>
              <div className="font-medium">Transport</div>
              <div className="text-gray-500">{formatCurrency(80)}</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-700">
              💡 <strong>Pro Tip:</strong> Regular tracking unlocks achievements and keeps your character happy!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Meet Your Character',
      description: 'Choose and customize your financial companion',
      icon: Crown,
      color: 'from-blue-500 to-indigo-500',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <motion.div
              animate={{ bounce: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-3xl border-2 border-white shadow-lg mb-4"
            >
              🐷
            </motion.div>
            <h3 className="font-semibold">Piggy - The Saver</h3>
            <p className="text-sm text-gray-600">Your default financial companion</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Character Features:</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Reacts to your spending with emotions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Unlockable accessories and customizations
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Different characters have unique personalities
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Unlock more characters by tracking expenses
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['🍄 Mario', '💨 Sonic', '🐱 Cat'].map((char, index) => (
              <div key={index} className="bg-white border rounded p-2 text-center text-xs">
                <div className="opacity-50">{char}</div>
                <div className="text-gray-400">Locked</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Earn Achievements',
      description: 'Unlock badges and rewards for your financial habits',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
              <div className="text-center">
                <div className="text-2xl mb-1">🎯</div>
                <div className="font-medium text-sm">First Expense</div>
                <Badge className="bg-green-500 text-xs mt-1">+10 points</Badge>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
              <div className="text-center">
                <div className="text-2xl mb-1">🔥</div>
                <div className="font-medium text-sm">7-Day Streak</div>
                <Badge className="bg-blue-500 text-xs mt-1">+50 points</Badge>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Achievement Types:</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li><span className="font-medium">Basic:</span> First expense, category usage</li>
              <li><span className="font-medium">Streak:</span> Daily tracking consistency</li>
              <li><span className="font-medium">Budget:</span> Staying within spending limits</li>
              <li><span className="font-medium">Hidden:</span> Secret achievements with cryptic hints</li>
              <li><span className="font-medium">Combo:</span> Unlock multiple related achievements</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs text-purple-700 text-center">
              🏆 <strong>Pro Tip:</strong> Some achievements are hidden - discover them through unique spending patterns!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Play Mini-Games',
      description: 'Earn extra points through fun financial games',
      icon: Gamepad2,
      color: 'from-pink-500 to-rose-500',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">🎯</div>
              <div className="font-medium text-sm">Budget Blast</div>
              <div className="text-xs opacity-90">Click falling coins</div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">🧠</div>
              <div className="font-medium text-sm">Expense Match</div>
              <div className="text-xs opacity-90">Memory game</div>
            </div>
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <h3 className="font-semibold text-pink-800 mb-2">Available Games:</h3>
            <ul className="space-y-2 text-sm text-pink-700">
              <li className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span><strong>Budget Blast:</strong> Quick reflexes game</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span><strong>Expense Match:</strong> Memory challenge</span>
              </li>
              <li className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span><strong>Savings Sprint:</strong> Goal-reaching race</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span><strong>Math Master:</strong> Quick calculations</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-700 text-center">
              ⚡ <strong>Bonus:</strong> Higher scores earn more points and can unlock special achievements!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Smart Insights & Predictions',
      description: 'AI-powered analysis of your spending patterns',
      icon: Zap,
      color: 'from-indigo-500 to-purple-500',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-indigo-800">AI Predictions</h3>
            </div>
            <div className="space-y-2 text-sm text-indigo-700">
              <div className="flex justify-between items-center">
                <span>Next likely expense:</span>
                <span className="font-medium">Food - {formatCurrency(120)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Confidence:</span>
                <Badge className="bg-green-500 text-xs">85%</Badge>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Smart Features:</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>📈 Spending pattern analysis</li>
              <li>⚠️ Budget alerts and warnings</li>
              <li>💡 Personalized saving suggestions</li>
              <li>📊 Weekly and monthly insights</li>
              <li>🔮 Expense predictions based on history</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 text-center">
              🧠 <strong>AI learns from you:</strong> The more you track, the smarter the predictions become!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Ready to Start!',
      description: 'Your financial adventure awaits',
      icon: Gift,
      color: 'from-emerald-500 to-cyan-500',
      content: (
        <div className="text-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl">
              🚀
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800">You're All Set!</h2>
          <p className="text-gray-600">
            Start tracking your expenses and watch your financial journey come to life with characters, achievements, and insights.
          </p>

          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-800 mb-2">Quick Start Checklist:</h3>
            <ul className="space-y-2 text-sm text-emerald-700 text-left">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Add your first expense to unlock achievements
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Explore different expense categories
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Check out the gamification hub
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Try a mini-game when you have time
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Set a daily tracking streak goal
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-700">
              🎁 <strong>Starter Bonus:</strong> Complete your first day to earn 25 bonus points!
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const IconComponent = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentStepData.color} text-white p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{currentStepData.title}</h1>
                <p className="text-white/80 text-sm">{currentStepData.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              Skip Tutorial
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : completedSteps.has(index) || index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <EnhancedButton
              onClick={nextStep}
              className="flex items-center gap-2"
              glow={true}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <Star className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </EnhancedButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}