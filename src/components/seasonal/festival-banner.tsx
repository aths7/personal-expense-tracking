'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Calendar, 
  Target, 
  Trophy, 
  Star,
  Clock,
  Gift,
  Flame
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import type { SeasonalEvent, SeasonalChallenge } from '@/services/seasonal-events';

interface FestivalBannerProps {
  event: SeasonalEvent;
  onChallengeClick?: (challenge: SeasonalChallenge) => void;
  onViewRewards?: () => void;
}

export function FestivalBanner({ event, onChallengeClick, onViewRewards }: FestivalBannerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [activeParticles, setActiveParticles] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(event.end_date).getTime();
      const distance = end - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft('Event ended');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event.end_date]);

  const getFestivalEmoji = (theme: string) => {
    const emojis = {
      diwali: '🪔',
      holi: '🎨',
      eid: '🌙',
      christmas: '🎄',
      new_year: '🎆',
      dussehra: '🏹',
      navratri: '💃',
      general: '🎉'
    };
    return emojis[theme as keyof typeof emojis] || '🎉';
  };

  const getParticleEffect = () => {
    if (!activeParticles) return null;

    const particleCount = 20;
    const timestamp = Date.now();
    const particles = Array.from({ length: particleCount }, (_, i) => (
      <motion.div
        key={`festival-particle-${timestamp}-${i}`}
        className={`absolute w-2 h-2 rounded-full ${
          event.theme === 'diwali' ? 'bg-yellow-400' :
          event.theme === 'holi' ? 'bg-pink-400' :
          event.theme === 'eid' ? 'bg-green-400' :
          event.theme === 'christmas' ? 'bg-red-400' :
          'bg-purple-400'
        }`}
        initial={{
          x: Math.random() * 400,
          y: 400,
          opacity: 1,
          scale: Math.random() * 0.5 + 0.5,
        }}
        animate={{
          y: -100,
          x: Math.random() * 400,
          opacity: 0,
          rotate: 360,
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeOut",
        }}
        style={{
          left: `${Math.random() * 100}%`,
        }}
      />
    ));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Card 
        className="relative overflow-hidden border-0"
        style={{
          background: event.theme_colors.background,
        }}
      >
        {getParticleEffect()}
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-4xl"
              >
                {getFestivalEmoji(event.theme)}
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  {event.name}
                </h2>
                <p className="text-white/90 text-sm">
                  {event.description}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <Badge 
                variant="secondary" 
                className="bg-white/20 text-white border-white/30"
              >
                <Clock className="w-3 h-3 mr-1" />
                {timeLeft}
              </Badge>
            </div>
          </div>

          {/* Event Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {event.challenges.length}
              </div>
              <div className="text-white/80 text-sm">Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {event.rewards.length || 5}
              </div>
              <div className="text-white/80 text-sm">Rewards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {Math.floor(Math.random() * 1000) + 500}
              </div>
              <div className="text-white/80 text-sm">Points Available</div>
            </div>
          </div>

          {/* Featured Challenges */}
          <div className="space-y-3 mb-6">
            <h3 className="text-white font-semibold flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Active Challenges
            </h3>
            {event.challenges.slice(0, 2).map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {challenge.title}
                    </h4>
                    <p className="text-white/80 text-xs">
                      {challenge.description}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-white/30 text-white"
                  >
                    {challenge.reward_points} pts
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/80">
                    <span>Progress</span>
                    <span>
                      {challenge.type === 'spending_limit' ? 
                        `${formatCurrency(challenge.current_progress)} / ${formatCurrency(challenge.target_value)}` :
                        `${challenge.current_progress} / ${challenge.target_value}`
                      }
                    </span>
                  </div>
                  <Progress 
                    value={(challenge.current_progress / challenge.target_value) * 100} 
                    className="h-2 bg-white/20"
                  />
                </div>
                
                {challenge.time_limit && (
                  <div className="flex items-center mt-2 text-xs text-white/70">
                    <Clock className="w-3 h-3 mr-1" />
                    Ends in {new Date(challenge.time_limit).toLocaleDateString()}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button 
              variant="secondary"
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => event.challenges.length > 0 && onChallengeClick?.(event.challenges[0])}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View Challenges
            </Button>
            <Button 
              variant="outline"
              className="flex-1 bg-transparent hover:bg-white/10 text-white border-white/30"
              onClick={onViewRewards}
            >
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </Button>
          </div>

          {/* Decorative Elements */}
          {event.theme === 'diwali' && (
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Flame className="w-6 h-6 text-yellow-300" />
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}