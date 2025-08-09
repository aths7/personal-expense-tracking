'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Clock, 
  Trophy, 
  Star, 
  CheckCircle2,
  AlertCircle,
  Calendar,
  Zap,
  Gift,
  Flame
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import type { SeasonalChallenge, SeasonalEvent } from '@/services/seasonal-events';

interface SeasonalChallengesProps {
  event: SeasonalEvent;
  challenges: SeasonalChallenge[];
  onChallengeAccept?: (challengeId: string) => void;
  onChallengeComplete?: (challengeId: string) => void;
}

export function SeasonalChallenges({ 
  event, 
  challenges, 
  onChallengeAccept, 
  onChallengeComplete 
}: SeasonalChallengesProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      hard: 'bg-orange-100 text-orange-700 border-orange-200',
      expert: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const getChallengeIcon = (type: string) => {
    const icons = {
      spending_limit: Target,
      category_focus: Zap,
      streak: Flame,
      savings_goal: Trophy,
      mini_game: Star
    };
    return icons[type as keyof typeof icons] || Target;
  };

  const getTimeRemaining = (timeLimit?: string) => {
    if (!timeLimit) return null;
    
    const now = new Date().getTime();
    const end = new Date(timeLimit).getTime();
    const distance = end - now;
    
    if (distance <= 0) return 'Expired';
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const isNearDeadline = (timeLimit?: string) => {
    if (!timeLimit) return false;
    const now = new Date().getTime();
    const end = new Date(timeLimit).getTime();
    const distance = end - now;
    return distance > 0 && distance < 24 * 60 * 60 * 1000; // Less than 24 hours
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Target className="w-6 h-6 mr-2" style={{ color: event.theme_colors.primary }} />
          Seasonal Challenges
        </h2>
        <Badge variant="outline" className="text-sm">
          {challenges.filter(c => c.is_completed).length} / {challenges.length} Completed
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map((challenge) => {
          const Icon = getChallengeIcon(challenge.type);
          const progressPercentage = Math.min((challenge.current_progress / challenge.target_value) * 100, 100);
          const timeRemaining = getTimeRemaining(challenge.time_limit);
          const isExpired = timeRemaining === 'Expired';
          const nearDeadline = isNearDeadline(challenge.time_limit);

          return (
            <motion.div
              key={challenge.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative ${selectedChallenge === challenge.id ? 'ring-2' : ''}`}
              style={{
                '--tw-ring-color': selectedChallenge === challenge.id ? event.theme_colors.primary : 'transparent'
              } as React.CSSProperties}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  challenge.is_completed ? 'bg-green-50 border-green-200' : 
                  isExpired ? 'bg-gray-50 border-gray-200 opacity-60' : ''
                }`}
                onClick={() => setSelectedChallenge(
                  selectedChallenge === challenge.id ? null : challenge.id
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${event.theme_colors.primary}20` }}
                      >
                        <Icon 
                          className="w-5 h-5" 
                          style={{ color: event.theme_colors.primary }} 
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center">
                          {challenge.title}
                          {challenge.is_completed && (
                            <CheckCircle2 className="w-4 h-4 ml-2 text-green-500" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      {timeRemaining && (
                        <Badge 
                          variant={nearDeadline ? "destructive" : "outline"}
                          className="text-xs"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {timeRemaining}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Progress Section */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {challenge.type === 'spending_limit' ? (
                          <>
                            {formatCurrency(challenge.current_progress)} / {formatCurrency(challenge.target_value)}
                          </>
                        ) : (
                          `${challenge.current_progress} / ${challenge.target_value}`
                        )}
                      </span>
                    </div>
                    
                    <Progress 
                      value={progressPercentage} 
                      className="h-2"
                      style={{
                        '--progress-background': event.theme_colors.primary
                      } as React.CSSProperties}
                    />
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{Math.round(progressPercentage)}% complete</span>
                      <span className="flex items-center">
                        <Trophy className="w-3 h-3 mr-1" />
                        {challenge.reward_points} points
                      </span>
                    </div>
                  </div>

                  {/* Challenge Type Specific Info */}
                  {challenge.type === 'spending_limit' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center text-yellow-700 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Remaining budget: {formatCurrency(challenge.target_value - challenge.current_progress)}
                      </div>
                    </div>
                  )}

                  {challenge.type === 'streak' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center text-blue-700 text-sm">
                        <Flame className="w-4 h-4 mr-2" />
                        Current streak: {challenge.current_progress} days
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <AnimatePresence>
                    {selectedChallenge === challenge.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t pt-4"
                      >
                        {challenge.is_completed ? (
                          <Button 
                            disabled 
                            className="w-full bg-green-500 text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Completed
                          </Button>
                        ) : isExpired ? (
                          <Button 
                            disabled 
                            variant="outline" 
                            className="w-full"
                          >
                            Challenge Expired
                          </Button>
                        ) : progressPercentage >= 100 ? (
                          <Button 
                            className="w-full"
                            style={{ backgroundColor: event.theme_colors.primary }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onChallengeComplete?.(challenge.id);
                            }}
                          >
                            <Gift className="w-4 h-4 mr-2" />
                            Claim Reward
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            style={{ 
                              borderColor: event.theme_colors.primary,
                              color: event.theme_colors.primary
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onChallengeAccept?.(challenge.id);
                            }}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Track Progress
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Completion Celebration */}
              {challenge.is_completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                    <Trophy className="w-4 h-4" />
                  </div>
                </motion.div>
              )}

              {/* Urgent Deadline Indicator */}
              {nearDeadline && !challenge.is_completed && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-1 -right-1"
                >
                  <div className="bg-red-500 text-white rounded-full p-1 shadow-lg">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {challenges.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Active Challenges
            </h3>
            <p className="text-gray-500">
              Check back later for new seasonal challenges and rewards!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}