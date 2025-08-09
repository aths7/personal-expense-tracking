import { useState, useEffect, useCallback } from 'react';
import { gamificationService } from '@/services/gamification';
import type { GameStats, BudgetGoalFormData } from '@/types/gamification';
import { toast } from 'sonner';

export const useGamification = () => {
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGameStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await gamificationService.getGameStats();
      
      if (error) {
        setError(error.message || 'Failed to fetch game stats');
        toast.error('Failed to fetch game stats');
        return;
      }
      
      setGameStats(data);
    } catch {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAchievements = async () => {
    try {
      await gamificationService.checkAchievements();
      // Refresh stats to show new achievements
      await fetchGameStats();
    } catch {
      // Silently handle achievement check failures
    }
  };

  const createBudgetGoal = async (data: BudgetGoalFormData) => {
    try {
      const result = await gamificationService.createBudgetGoal(data);
      
      if (result.error) {
        toast.error(result.error.message || 'Failed to create budget goal');
        return { success: false, error: result.error };
      }
      
      if (result.data) {
        toast.success('Budget goal created successfully!');
        await fetchGameStats(); // Refresh to show new budget goal
        return { success: true, data: result.data };
      }
      
      // Fallback in case result.data is null but no error
      return { success: false, error: new Error('Unknown error occurred') };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    }
  };

  const updateBudgetGoal = async (id: string, data: Partial<BudgetGoalFormData>) => {
    try {
      const result = await gamificationService.updateBudgetGoal(id, data);
      
      if (result.error) {
        toast.error(result.error.message || 'Failed to update budget goal');
        return { success: false, error: result.error };
      }
      
      if (result.data) {
        toast.success('Budget goal updated successfully!');
        await fetchGameStats();
        return { success: true, data: result.data };
      }
      
      // Fallback in case result.data is null but no error
      return { success: false, error: new Error('Unknown error occurred') };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    }
  };

  const deleteBudgetGoal = async (id: string) => {
    try {
      const { error } = await gamificationService.deleteBudgetGoal(id);
      
      if (error) {
        toast.error(error.message || 'Failed to delete budget goal');
        return { success: false, error };
      }
      
      toast.success('Budget goal deleted successfully!');
      await fetchGameStats();
      return { success: true };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    }
  };

  const joinChallenge = async (challengeId: string) => {
    try {
      const result = await gamificationService.joinChallenge(challengeId);
      
      if (result.success) {
        toast.success('Successfully joined challenge!');
        await fetchGameStats();
        return { success: true };
      } else {
        toast.error('Failed to join challenge');
        return { success: false };
      }
    } catch {
      toast.error('An unexpected error occurred');
      return { success: false };
    }
  };

  const awardPoints = async (points: number, reason: string) => {
    toast.success(`+${points} points! ${reason}`, {
      icon: '🎉',
      duration: 3000,
    });
    await fetchGameStats();
  };

  const showAchievementUnlocked = (achievementName: string, points: number) => {
    toast.success(`🏆 Achievement Unlocked: ${achievementName}! (+${points} points)`, {
      duration: 5000,
    });
  };

  useEffect(() => {
    fetchGameStats();
  }, [fetchGameStats]);

  return {
    gameStats,
    loading,
    error,
    refetch: fetchGameStats,
    checkAchievements,
    createBudgetGoal,
    updateBudgetGoal,
    deleteBudgetGoal,
    joinChallenge,
    awardPoints,
    showAchievementUnlocked,
  };
};