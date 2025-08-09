'use client';

import { useState, useEffect, useCallback } from 'react';
import { seasonalEventsService } from '@/services/seasonal-events';
import type { SeasonalEvent, SeasonalReward, UserSeasonalProgress } from '@/services/seasonal-events';
import { toast } from 'sonner';

export const useSeasonalEvents = () => {
  const [events, setEvents] = useState<SeasonalEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<SeasonalEvent | null>(null);
  const [userProgress, setUserProgress] = useState<UserSeasonalProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const fetchActiveEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const activeEvents = await seasonalEventsService.getActiveEvents();
      setEvents(activeEvents);
      
      if (activeEvents.length > 0) {
        const primaryEvent = activeEvents[0];
        setCurrentEvent(primaryEvent);
        
        // Fetch user progress for the current event
        const progress = await seasonalEventsService.getUserEventProgress(primaryEvent.id);
        if (progress) {
          setUserProgress(progress);
          setUserPoints(progress.points_earned);
          setClaimedRewards(progress.rewards_unlocked);
        }
      }
    } catch (error) {
      console.error('Failed to load seasonal events:', error);
      const errorMessage = 'Failed to load seasonal events';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptChallenge = async (_challengeId: string) => {
    try {
      // In a real app, this would update the database
      toast.success('Challenge accepted! Track your progress in the challenges tab.');
      return { success: true };
    } catch (error) {
      console.error('Failed to accept challenge:', error);
      toast.error('Failed to accept challenge');
      return { success: false, error };
    }
  };

  const completeChallenge = async (challengeId: string) => {
    try {
      const result = await seasonalEventsService.completeChallenge(challengeId);
      
      if (result.success && result.reward) {
        // Update user points
        setUserPoints(prev => prev + result.reward!.value);
        
        // Update current event challenges
        if (currentEvent) {
          const updatedChallenges = currentEvent.challenges.map(challenge =>
            challenge.id === challengeId 
              ? { ...challenge, is_completed: true, current_progress: challenge.target_value }
              : challenge
          );
          
          setCurrentEvent({
            ...currentEvent,
            challenges: updatedChallenges
          });
        }
        
        toast.success(
          `Challenge Complete! You earned ${result.reward.value} points for completing this challenge!`
        );
        
        return { success: true, reward: result.reward };
      } else {
        toast.error('Failed to complete challenge');
        return { success: false };
      }
    } catch (error) {
      console.error('Failed to complete challenge:', error);
      toast.error('Failed to complete challenge');
      return { success: false, error };
    }
  };

  const claimReward = async (rewardId: string) => {
    try {
      // Find the reward
      const mockRewards: SeasonalReward[] = [
        {
          id: 'diwali_badge_1',
          event_id: currentEvent?.id || '',
          type: 'badge',
          name: 'Diwali Light Keeper',
          description: 'Successfully managed expenses during Diwali celebrations',
          value: 100,
          unlock_condition: 'complete_any_challenge',
          icon: '🪔',
          rarity: 'common'
        },
        {
          id: 'diwali_character_1',
          event_id: currentEvent?.id || '',
          type: 'character',
          name: 'Festival Ganesha',
          description: 'A special Ganesha character that brings good fortune to your savings',
          value: 500,
          unlock_condition: 'complete_3_challenges',
          icon: '🐘',
          rarity: 'epic'
        },
        {
          id: 'diwali_accessory_1',
          event_id: currentEvent?.id || '',
          type: 'accessory',
          name: 'Golden Sparkler',
          description: 'A sparkler accessory that adds festival magic to your character',
          value: 300,
          unlock_condition: 'spend_wisely',
          icon: '✨',
          rarity: 'rare'
        },
        {
          id: 'diwali_bonus_1',
          event_id: currentEvent?.id || '',
          type: 'currency_bonus',
          name: 'Festival Bonus Points',
          description: 'Bonus points to boost your expense tracking journey',
          value: 1000,
          unlock_condition: 'complete_all_challenges',
          icon: '🎁',
          rarity: 'legendary'
        },
        {
          id: 'diwali_badge_2',
          event_id: currentEvent?.id || '',
          type: 'badge',
          name: 'Smart Shopper',
          description: 'Stayed within budget during festival shopping',
          value: 200,
          unlock_condition: 'budget_achievement',
          icon: '🛍️',
          rarity: 'rare'
        }
      ];

      const reward = mockRewards.find(r => r.id === rewardId);
      
      if (!reward) {
        toast.error('Reward not found');
        return { success: false };
      }

      if (userPoints < reward.value) {
        toast.error(`Not enough points! You need ${reward.value - userPoints} more points to claim this reward.`);
        return { success: false };
      }

      if (claimedRewards.includes(rewardId)) {
        toast.error('Reward already claimed');
        return { success: false };
      }

      // Deduct points and add to claimed rewards
      setUserPoints(prev => prev - reward.value);
      setClaimedRewards(prev => [...prev, rewardId]);
      
      // Update user progress
      if (userProgress) {
        setUserProgress({
          ...userProgress,
          points_earned: userPoints - reward.value,
          rewards_unlocked: [...userProgress.rewards_unlocked, rewardId]
        });
      }

      toast.success(
        `Reward Claimed! You've successfully claimed ${reward.name}!`
      );
      
      return { success: true, reward };
    } catch (error) {
      console.error('Failed to claim reward:', error);
      toast.error('Failed to claim reward');
      return { success: false, error };
    }
  };

  const updateChallengeProgress = (challengeId: string, progress: number) => {
    if (!currentEvent) return;

    const updatedChallenges = currentEvent.challenges.map(challenge =>
      challenge.id === challengeId 
        ? { 
            ...challenge, 
            current_progress: Math.min(progress, challenge.target_value),
            is_completed: progress >= challenge.target_value
          }
        : challenge
    );

    setCurrentEvent({
      ...currentEvent,
      challenges: updatedChallenges
    });

    // Check if challenge is completed
    const challenge = updatedChallenges.find(c => c.id === challengeId);
    if (challenge && progress >= challenge.target_value && !challenge.is_completed) {
      toast.success(`Challenge Progress! You're making great progress on ${challenge.title}!`);
    }
  };

  const checkAchievements = async (expenses: Array<{ date: string; amount: number; }>) => {
    try {
      const achievements = await seasonalEventsService.checkSeasonalAchievements(expenses);
      
      if (achievements.length > 0) {
        // Award points for achievements
        const bonusPoints = achievements.length * 50;
        setUserPoints(prev => prev + bonusPoints);
        
        toast.success(
          `Achievements Unlocked! You earned ${achievements.length} seasonal achievements and ${bonusPoints} bonus points!`
        );
      }
      
      return achievements;
    } catch (error) {
      console.error('Failed to check seasonal achievements:', error);
      return [];
    }
  };

  const getEventTheme = () => {
    if (!currentEvent) return null;
    return seasonalEventsService.getEventTheme(currentEvent.theme);
  };

  const getSeasonalOffers = () => {
    if (!currentEvent) return [];
    return seasonalEventsService.getSeasonalOffers(currentEvent);
  };

  const isEventActive = (event: SeasonalEvent) => {
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    return now >= start && now <= end && event.is_active;
  };

  const getTimeUntilEventEnd = (event: SeasonalEvent) => {
    const now = new Date().getTime();
    const end = new Date(event.end_date).getTime();
    const distance = end - now;
    
    if (distance <= 0) return 'Event ended';
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  useEffect(() => {
    fetchActiveEvents();
  }, [fetchActiveEvents]);

  // Auto-refresh events every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchActiveEvents();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchActiveEvents]);

  return {
    events,
    currentEvent,
    userProgress,
    loading,
    error,
    userPoints,
    claimedRewards,
    acceptChallenge,
    completeChallenge,
    claimReward,
    updateChallengeProgress,
    checkAchievements,
    getEventTheme,
    getSeasonalOffers,
    isEventActive,
    getTimeUntilEventEnd,
    refetch: fetchActiveEvents,
  };
};