'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calculator, 
  Target, 
  Clock, 
  CheckCircle,
  X,
  Plus,
  Minus,
  DollarSign,
  Zap
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface MiniGameResult {
  score: number;
  pointsEarned: number;
  accuracy?: number;
  timeBonus?: number;
}

// Savings Sprint - Race to reach savings goal
interface SavingsSprintGameProps {
  onGameComplete: (result: MiniGameResult) => void;
  onGameClose: () => void;
}

function SavingsSprintGame({ onGameComplete, onGameClose }: SavingsSprintGameProps) {
  const [currentSavings, setCurrentSavings] = useState(0);
  const [targetSavings] = useState(25000); // ₹25,000 savings goal
  const [timeLeft, setTimeLeft] = useState(60);
  const [opportunities, setOpportunities] = useState<Array<{
    id: number;
    description: string;
    amount: number;
    timeLimit: number;
    type: 'save' | 'earn' | 'avoid';
  }>>([]);
  const [score, setScore] = useState(0);

  const opportunityTypes = [
    { description: 'Skip tea/coffee today', amount: 150, type: 'avoid' as const },
    { description: 'Use coupon at grocery store', amount: 300, type: 'save' as const },
    { description: 'Sell unused item', amount: 800, type: 'earn' as const },
    { description: 'Cook at home instead', amount: 450, type: 'avoid' as const },
    { description: 'Take public transport', amount: 200, type: 'save' as const },
    { description: 'Cancel unused subscription', amount: 500, type: 'avoid' as const },
    { description: 'Freelance work', amount: 1500, type: 'earn' as const },
  ];

  const spawnOpportunity = useCallback(() => {
    if (timeLeft <= 0) return;

    const template = opportunityTypes[Math.floor(Math.random() * opportunityTypes.length)];
    const newOpportunity = {
      id: Date.now() + Math.random(),
      ...template,
      timeLimit: 8 + Math.random() * 4, // 8-12 seconds
    };

    setOpportunities(prev => [...prev, newOpportunity]);

    // Remove opportunity after time limit
    setTimeout(() => {
      setOpportunities(prev => prev.filter(o => o.id !== newOpportunity.id));
    }, newOpportunity.timeLimit * 1000);
  }, [timeLeft]);

  const handleOpportunityClick = (opportunity: any) => {
    setCurrentSavings(prev => prev + opportunity.amount);
    setScore(prev => prev + opportunity.amount);
    setOpportunities(prev => prev.filter(o => o.id !== opportunity.id));
  };

  useEffect(() => {
    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const progress = (currentSavings / targetSavings) * 100;
          const result: MiniGameResult = {
            score,
            pointsEarned: Math.floor(score * 0.1) + (progress >= 100 ? 50 : 0),
            accuracy: Math.min(progress, 100) / 100,
            timeBonus: Math.max(0, (60 - (60 - prev)) * 2)
          };
          onGameComplete(result);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnTimer = setInterval(spawnOpportunity, 2000);

    return () => {
      clearInterval(gameTimer);
      clearInterval(spawnTimer);
    };
  }, [currentSavings, targetSavings, score, spawnOpportunity, onGameComplete]);

  const progress = (currentSavings / targetSavings) * 100;

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'save': return 'from-green-400 to-green-600';
      case 'earn': return 'from-blue-400 to-blue-600';
      case 'avoid': return 'from-orange-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="relative h-96 bg-gradient-to-b from-green-100 to-blue-100 rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <Badge className="bg-green-500">Saved: {formatCurrency(currentSavings)}</Badge>
          <Badge className="bg-blue-500">Goal: {formatCurrency(targetSavings)}</Badge>
          <Badge className="bg-red-500">Time: {timeLeft}s</Badge>
        </div>
        <Button size="sm" variant="outline" onClick={onGameClose}>Exit</Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress to Goal</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={Math.min(progress, 100)} className="h-3" />
      </div>

      {/* Opportunities */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {opportunities.map((opportunity) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg bg-gradient-to-r ${getOpportunityColor(opportunity.type)} text-white cursor-pointer shadow-lg`}
              onClick={() => handleOpportunityClick(opportunity)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{opportunity.description}</div>
                  <div className="text-sm opacity-90">+{formatCurrency(opportunity.amount)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20">{opportunity.type}</Badge>
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Success Message */}
      {progress >= 100 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-green-500/90 text-white"
        >
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Goal Reached!</h3>
            <p>You saved {formatCurrency(currentSavings)}!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Math Master - Quick expense calculations
interface MathMasterGameProps {
  onGameComplete: (result: MiniGameResult) => void;
  onGameClose: () => void;
}

function MathMasterGame({ onGameComplete, onGameClose }: MathMasterGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string;
    answer: number;
    options: number[];
  } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const generateQuestion = useCallback(() => {
    const questionTypes = [
      () => {
        // Simple addition/subtraction with INR
        const a = Math.floor(Math.random() * 2000) + 100; // ₹100-2100
        const b = Math.floor(Math.random() * 1000) + 50;  // ₹50-1050
        const operation = Math.random() > 0.5 ? '+' : '-';
        const answer = operation === '+' ? a + b : a - b;
        return {
          question: `₹${a} ${operation} ₹${b} = ?`,
          answer,
          options: [answer, answer + Math.floor(Math.random() * 100) + 10, answer - Math.floor(Math.random() * 100) - 10, answer + Math.floor(Math.random() * 200) - 100].sort(() => Math.random() - 0.5)
        };
      },
      () => {
        // Tip calculation (Service charge in restaurants)
        const bill = Math.floor(Math.random() * 2000) + 500; // ₹500-2500
        const tipPercent = [10, 12, 15, 18][Math.floor(Math.random() * 4)];
        const answer = Math.round((bill * tipPercent / 100));
        return {
          question: `${tipPercent}% service charge on ₹${bill} = ?`,
          answer,
          options: [answer, answer + 50, answer - 30, answer + 100].sort(() => Math.random() - 0.5)
        };
      },
      () => {
        // GST calculation
        const price = Math.floor(Math.random() * 5000) + 1000; // ₹1000-6000
        const gstRate = [5, 12, 18, 28][Math.floor(Math.random() * 4)];
        const answer = Math.round((price * (1 + gstRate / 100)));
        return {
          question: `₹${price} + ${gstRate}% GST = ?`,
          answer,
          options: [answer, answer + 100, answer - 50, answer + 200].sort(() => Math.random() - 0.5)
        };
      }
    ];

    const questionGenerator = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    setCurrentQuestion(questionGenerator());
  }, []);

  const handleAnswer = (selectedAnswer: number) => {
    setQuestionsAnswered(prev => prev + 1);
    
    if (currentQuestion && selectedAnswer === currentQuestion.answer) {
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
      const points = 10 + (streak * 2);
      setScore(prev => prev + points);
    } else {
      setStreak(0);
    }

    generateQuestion();
  };

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const accuracy = questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0;
      const result: MiniGameResult = {
        score,
        pointsEarned: Math.floor(score * 0.2),
        accuracy,
        timeBonus: streak * 5
      };
      onGameComplete(result);
    }
  }, [timeLeft, score, questionsAnswered, correctAnswers, streak, onGameComplete]);

  return (
    <div className="p-6 text-center">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Badge>Score: {score}</Badge>
          <Badge>Streak: {streak}</Badge>
          <Badge>Time: {timeLeft}s</Badge>
        </div>
        <Button size="sm" variant="outline" onClick={onGameClose}>Exit</Button>
      </div>

      {currentQuestion && (
        <motion.div
          key={currentQuestion.question}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="text-2xl font-bold text-center p-6 bg-blue-50 rounded-lg border">
            {currentQuestion.question}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-white border-2 border-gray-200 rounded-lg font-semibold text-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                onClick={() => handleAnswer(option)}
              >
                ₹{option.toLocaleString('en-IN')}
              </motion.button>
            ))}
          </div>

          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <span>Questions: {questionsAnswered}</span>
            <span>Correct: {correctAnswers}</span>
            <span>Accuracy: {questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}%</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Export additional games
export function AdditionalMiniGames({ 
  gameType, 
  onGameComplete, 
  onGameClose 
}: {
  gameType: 'savings-sprint' | 'math-master';
  onGameComplete: (result: MiniGameResult) => void;
  onGameClose: () => void;
}) {
  switch (gameType) {
    case 'savings-sprint':
      return <SavingsSprintGame onGameComplete={onGameComplete} onGameClose={onGameClose} />;
    case 'math-master':
      return <MathMasterGame onGameComplete={onGameComplete} onGameClose={onGameClose} />;
    default:
      return <div>Game not found</div>;
  }
}