'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Clock, 
  Trophy,
  Calendar,
  Star,
  ChevronRight
} from 'lucide-react';
import { useSeasonalEvents } from '@/hooks/useSeasonalEvents';
import { SeasonalDashboard } from './seasonal-dashboard';

export function SeasonalWidget() {
  const [showDashboard, setShowDashboard] = useState(false);
  const {
    currentEvent,
    loading,
    userPoints,
    getTimeUntilEventEnd
  } = useSeasonalEvents();

  if (loading || !currentEvent) {
    return null;
  }

  const timeLeft = getTimeUntilEventEnd(currentEvent);
  const completedChallenges = currentEvent.challenges.filter(c => c.is_completed).length;
  const totalChallenges = currentEvent.challenges.length;
  const completionPercentage = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

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

  return (
    <>
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br" 
        style={{
          background: `linear-gradient(135deg, ${currentEvent.theme_colors.primary}20 0%, ${currentEvent.theme_colors.secondary}20 100%)`
        }}>
        
        {/* Decorative background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              animate={{
                x: [Math.random() * 300, Math.random() * 300],
                y: [Math.random() * 200, Math.random() * 200],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-2xl mr-2"
              >
                {getFestivalEmoji(currentEvent.theme)}
              </motion.div>
              <div>
                <div className="font-bold">Seasonal Event</div>
                <div className="text-sm font-normal text-muted-foreground">
                  {currentEvent.name}
                </div>
              </div>
            </CardTitle>
            
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-gray-700 border-white/30"
            >
              <Clock className="w-3 h-3 mr-1" />
              {timeLeft}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0 relative z-10">
          <div className="space-y-4">
            {/* Progress Section */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Challenge Progress</span>
                <span className="font-medium">
                  {completedChallenges} / {totalChallenges} completed
                </span>
              </div>
              <Progress 
                value={completionPercentage} 
                className="h-2"
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/50 backdrop-blur rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{userPoints}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Star className="w-3 h-3 mr-1" />
                  Points
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">{totalChallenges}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Trophy className="w-3 h-3 mr-1" />
                  Challenges
                </div>
              </div>
            </div>

            {/* Next Challenge Preview */}
            {currentEvent.challenges.length > 0 && (
              <div className="bg-white/30 backdrop-blur rounded-lg p-3">
                <div className="text-sm font-medium mb-1">Active Challenge</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {currentEvent.challenges.find(c => !c.is_completed)?.title || 
                   currentEvent.challenges[0].title}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button 
              onClick={() => setShowDashboard(true)}
              className="w-full"
              variant="secondary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View Seasonal Events
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>

        {/* Subtle glow effect */}
        <motion.div
          animate={{
            boxShadow: [
              `0 0 0 ${currentEvent.theme_colors.primary}00`,
              `0 0 20px ${currentEvent.theme_colors.primary}30`,
              `0 0 0 ${currentEvent.theme_colors.primary}00`,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-lg pointer-events-none"
        />
      </Card>

      {/* Seasonal Dashboard Modal */}
      <SeasonalDashboard
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
      />
    </>
  );
}