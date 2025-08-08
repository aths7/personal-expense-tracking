'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Zap, 
  Clock, 
  Trophy, 
  Star, 
  Coins,
  TrendingUp,
  Calculator,
  Shuffle
} from 'lucide-react';

interface MiniGameResult {
  score: number;
  pointsEarned: number;
  accuracy?: number;
  timeBonus?: number;
}

interface MiniGameProps {
  onGameComplete: (result: MiniGameResult) => void;
  onGameClose: () => void;
  gameType: 'budget-blast' | 'expense-match' | 'savings-sprint' | 'math-master';
}

// Budget Blast - Click falling coins before they hit bottom
function BudgetBlastGame({ onGameComplete, onGameClose }: Omit<MiniGameProps, 'gameType'>) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [coins, setCoins] = useState<Array<{ id: number; x: number; y: number; value: number; speed: number }>>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  const spawnCoin = useCallback(() => {
    if (!isPlaying) return;
    
    const newCoin = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: 0,
      value: Math.random() > 0.7 ? 10 : 5,
      speed: Math.random() * 2 + 1
    };
    
    setCoins(prev => [...prev, newCoin]);
  }, [isPlaying]);

  const handleCoinClick = (coinId: number, value: number) => {
    setScore(prev => prev + value);
    setCoins(prev => prev.filter(coin => coin.id !== coinId));
  };

  useEffect(() => {
    if (!isPlaying) return;

    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          const result: MiniGameResult = {
            score,
            pointsEarned: Math.floor(score * 0.1),
            timeBonus: 0
          };
          onGameComplete(result);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnTimer = setInterval(spawnCoin, 1000);

    const moveCoins = setInterval(() => {
      setCoins(prev => prev
        .map(coin => ({ ...coin, y: coin.y + coin.speed }))
        .filter(coin => coin.y < 90)
      );
    }, 50);

    return () => {
      clearInterval(gameTimer);
      clearInterval(spawnTimer);
      clearInterval(moveCoins);
    };
  }, [isPlaying, score, spawnCoin, onGameComplete]);

  return (
    <div className="relative h-96 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <div className="flex space-x-4">
          <Badge className="bg-green-500">Score: {score}</Badge>
          <Badge className="bg-red-500">Time: {timeLeft}s</Badge>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Button size="sm" variant="outline" onClick={onGameClose}>
          Exit
        </Button>
      </div>

      {/* Falling Coins */}
      {coins.map(coin => (
        <motion.div
          key={coin.id}
          initial={{ y: 0 }}
          animate={{ y: `${coin.y}%` }}
          className="absolute cursor-pointer"
          style={{ left: `${coin.x}%`, top: 0 }}
          onClick={() => handleCoinClick(coin.id, coin.value)}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
            coin.value === 10 ? 'bg-yellow-500' : 'bg-blue-500'
          }`}>
            {coin.value}
          </div>
        </motion.div>
      ))}

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Game Over!</h3>
              <p>Final Score: {score}</p>
              <p>Points Earned: {Math.floor(score * 0.1)}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Expense Match - Memory card game with expense categories
function ExpenseMatchGame({ onGameComplete, onGameClose }: Omit<MiniGameProps, 'gameType'>) {
  const [cards, setCards] = useState<Array<{ id: number; category: string; emoji: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [moves, setMoves] = useState(0);

  const categories = [
    { category: 'Food', emoji: '🍕' },
    { category: 'Transport', emoji: '🚗' },
    { category: 'Entertainment', emoji: '🎮' },
    { category: 'Shopping', emoji: '🛍️' },
    { category: 'Bills', emoji: '📄' },
    { category: 'Healthcare', emoji: '💊' }
  ];

  useEffect(() => {
    // Initialize cards
    const gameCards = categories.flatMap((cat, index) => [
      { id: index * 2, category: cat.category, emoji: cat.emoji, flipped: false, matched: false },
      { id: index * 2 + 1, category: cat.category, emoji: cat.emoji, flipped: false, matched: false }
    ]).sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
  }, []);

  useEffect(() => {
    if (matches === categories.length) {
      const timeBonus = Math.max(0, timeLeft * 2);
      const accuracyBonus = Math.max(0, (12 - moves) * 5);
      const result: MiniGameResult = {
        score: matches * 10 + timeBonus + accuracyBonus,
        pointsEarned: matches * 2 + Math.floor(timeBonus / 10),
        accuracy: matches / moves,
        timeBonus
      };
      onGameComplete(result);
    }
  }, [matches, timeLeft, moves, onGameComplete]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const result: MiniGameResult = {
        score: matches * 10,
        pointsEarned: matches * 2
      };
      onGameComplete(result);
    }
  }, [timeLeft, matches, onGameComplete]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, flipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = newFlippedCards.map(id => cards.find(c => c.id === id)!);
      
      if (first.category === second.category) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlippedCards.includes(c.id) ? { ...c, matched: true } : c
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlippedCards.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Badge>Matches: {matches}/{categories.length}</Badge>
          <Badge>Moves: {moves}</Badge>
          <Badge>Time: {timeLeft}s</Badge>
        </div>
        <Button size="sm" variant="outline" onClick={onGameClose}>
          Exit
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
        {cards.map(card => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`aspect-square rounded-lg cursor-pointer flex items-center justify-center text-2xl font-bold ${
              card.matched 
                ? 'bg-green-200 border-green-400' 
                : card.flipped 
                  ? 'bg-blue-200 border-blue-400' 
                  : 'bg-gray-200 border-gray-400'
            } border-2`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.flipped || card.matched ? card.emoji : '?'}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Main Mini Games Component
export function MiniGames({ gameType, onGameComplete, onGameClose }: MiniGameProps) {
  const renderGame = () => {
    switch (gameType) {
      case 'budget-blast':
        return <BudgetBlastGame onGameComplete={onGameComplete} onGameClose={onGameClose} />;
      case 'expense-match':
        return <ExpenseMatchGame onGameComplete={onGameComplete} onGameClose={onGameClose} />;
      default:
        return <div>Game not implemented yet</div>;
    }
  };

  const getGameInfo = () => {
    const gameInfo = {
      'budget-blast': {
        title: 'Budget Blast',
        description: 'Click falling coins before they hit the bottom!',
        icon: Target
      },
      'expense-match': {
        title: 'Expense Match',
        description: 'Match expense categories in this memory game!',
        icon: Shuffle
      },
      'savings-sprint': {
        title: 'Savings Sprint',
        description: 'Race against time to reach your savings goal!',
        icon: TrendingUp
      },
      'math-master': {
        title: 'Math Master',
        description: 'Solve expense calculations quickly!',
        icon: Calculator
      }
    };

    return gameInfo[gameType] || gameInfo['budget-blast'];
  };

  const info = getGameInfo();
  const IconComponent = info.icon;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconComponent className="w-5 h-5" />
          {info.title}
        </CardTitle>
        <p className="text-sm text-gray-600">{info.description}</p>
      </CardHeader>
      <CardContent>
        {renderGame()}
      </CardContent>
    </Card>
  );
}

// Game Selection Menu
interface GameSelectionProps {
  onGameSelect: (gameType: MiniGameProps['gameType']) => void;
  onClose: () => void;
}

export function GameSelection({ onGameSelect, onClose }: GameSelectionProps) {
  const games = [
    {
      type: 'budget-blast' as const,
      title: 'Budget Blast',
      description: 'Click falling coins to score points!',
      difficulty: 'Easy',
      reward: '5-20 points',
      icon: Target,
      color: 'from-blue-400 to-blue-600'
    },
    {
      type: 'expense-match' as const,
      title: 'Expense Match',
      description: 'Memory game with expense categories',
      difficulty: 'Medium',
      reward: '10-30 points',
      icon: Shuffle,
      color: 'from-purple-400 to-purple-600'
    },
    {
      type: 'savings-sprint' as const,
      title: 'Savings Sprint',
      description: 'Race to reach your savings target!',
      difficulty: 'Hard',
      reward: '15-40 points',
      icon: TrendingUp,
      color: 'from-green-400 to-green-600'
    },
    {
      type: 'math-master' as const,
      title: 'Math Master',
      description: 'Quick expense calculations',
      difficulty: 'Expert',
      reward: '20-50 points',
      icon: Calculator,
      color: 'from-orange-400 to-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Mini Games
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <motion.div
                key={game.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-lg bg-gradient-to-br ${game.color} text-white cursor-pointer`}
                onClick={() => onGameSelect(game.type)}
              >
                <div className="flex items-start justify-between mb-4">
                  <IconComponent className="w-8 h-8" />
                  <Badge className="bg-white/20 text-white">{game.difficulty}</Badge>
                </div>
                
                <h3 className="text-lg font-bold mb-2">{game.title}</h3>
                <p className="text-sm opacity-90 mb-3">{game.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm">{game.reward}</span>
                  </div>
                  <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                    Play Now
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}