import { createClient } from '@/lib/supabase/client';
import type { 
  UserProfile, 
  Achievement, 
  UserAchievement, 
  BudgetGoal, 
  BudgetGoalFormData,
  Challenge,
  UserChallenge,
  GameStats,
  LevelInfo
} from '@/types/gamification';
import { LEVEL_SYSTEM } from '@/constants/gamification';

export interface GamificationService {
  getUserProfile: () => Promise<{ data: UserProfile | null; error: Error | null }>;
  createUserProfile: () => Promise<{ data: UserProfile | null; error: Error | null }>;
  getUserAchievements: () => Promise<{ data: UserAchievement[] | null; error: Error | null }>;
  getAvailableAchievements: () => Promise<{ data: Achievement[] | null; error: Error | null }>;
  awardAchievement: (achievementKey: string) => Promise<{ success: boolean; points: number }>;
  checkAchievements: () => Promise<void>;
  getBudgetGoals: () => Promise<{ data: BudgetGoal[] | null; error: Error | null }>;
  createBudgetGoal: (data: BudgetGoalFormData) => Promise<{ data: BudgetGoal | null; error: Error | null }>;
  updateBudgetGoal: (id: string, data: Partial<BudgetGoalFormData>) => Promise<{ data: BudgetGoal | null; error: Error | null }>;
  deleteBudgetGoal: (id: string) => Promise<{ error: Error | null }>;
  getActiveChallenges: () => Promise<{ data: Challenge[] | null; error: Error | null }>;
  getUserChallenges: () => Promise<{ data: UserChallenge[] | null; error: Error | null }>;
  joinChallenge: (challengeId: string) => Promise<{ success: boolean }>;
  getGameStats: () => Promise<{ data: GameStats | null; error: Error | null }>;
}

export const gamificationService: GamificationService = {
  getUserProfile: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return { data, error };
  },

  createUserProfile: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{ user_id: user.id }])
      .select()
      .single();

    return { data, error };
  },

  getUserAchievements: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    return { data, error };
  },

  getAvailableAchievements: async () => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    return { data, error };
  },

  awardAchievement: async (achievementKey: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, points: 0 };
    }

    try {
      // Get achievement details
      const { data: achievement } = await supabase
        .from('achievements')
        .select('*')
        .eq('key', achievementKey)
        .single();

      if (!achievement) {
        return { success: false, points: 0 };
      }

      // Check if user already has this achievement
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_id', achievement.id)
        .single();

      if (existing) {
        return { success: false, points: 0 };
      }

      // Award achievement
      await supabase
        .from('user_achievements')
        .insert([{
          user_id: user.id,
          achievement_id: achievement.id,
          points_earned: achievement.points,
        }]);

      // Update user profile points
      await supabase.rpc('increment_user_points', {
        user_id_param: user.id,
        points_to_add: achievement.points,
      });

      return { success: true, points: achievement.points };
    } catch {
      return { success: false, points: 0 };
    }
  },

  checkAchievements: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    // Get user stats
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) return;

    // Get user expenses
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id);

    if (!expenses) return;

    // Check for various achievements
    const achievementsToAward: string[] = [];

    // First expense
    if (profile.total_expenses_tracked === 1) {
      achievementsToAward.push('first_expense');
    }

    // Milestone achievements
    if (profile.total_expenses_tracked === 10) achievementsToAward.push('expenses_10');
    if (profile.total_expenses_tracked === 50) achievementsToAward.push('expenses_50');
    if (profile.total_expenses_tracked === 100) achievementsToAward.push('expenses_100');
    if (profile.total_expenses_tracked === 500) achievementsToAward.push('expenses_500');

    // Streak achievements
    if (profile.current_streak === 7) achievementsToAward.push('expense_streak_7');
    if (profile.current_streak === 30) achievementsToAward.push('expense_streak_30');
    if (profile.current_streak === 100) achievementsToAward.push('expense_streak_100');

    // Category variety
    const uniqueCategories = new Set(expenses.map(e => e.category_id).filter(Boolean));
    if (uniqueCategories.size >= 5) {
      achievementsToAward.push('category_explorer');
    }

    // Award achievements
    for (const key of achievementsToAward) {
      await gamificationService.awardAchievement(key);
    }
  },

  getBudgetGoals: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('budget_goals')
      .select(`
        *,
        category:categories(id, name, color)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  createBudgetGoal: async (formData: BudgetGoalFormData) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('budget_goals')
      .insert([{
        ...formData,
        user_id: user.id,
      }])
      .select(`
        *,
        category:categories(id, name, color)
      `)
      .single();

    // Award achievement for setting first budget
    if (data) {
      gamificationService.awardAchievement('budget_setter');
    }

    return { data, error };
  },

  updateBudgetGoal: async (id: string, formData: Partial<BudgetGoalFormData>) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('budget_goals')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        category:categories(id, name, color)
      `)
      .single();

    return { data, error };
  },

  deleteBudgetGoal: async (id: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('budget_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    return { error };
  },

  getActiveChallenges: async () => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString().split('T')[0])
      .order('created_at', { ascending: false });

    return { data, error };
  },

  getUserChallenges: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('user_challenges')
      .select(`
        *,
        challenge:challenges(*)
      `)
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false });

    return { data, error };
  },

  joinChallenge: async (challengeId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false };
    }

    try {
      await supabase
        .from('user_challenges')
        .insert([{
          user_id: user.id,
          challenge_id: challengeId,
        }]);

      return { success: true };
    } catch {
      return { success: false };
    }
  },

  getGameStats: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    try {
      // Get or create user profile
      let { data: profile } = await gamificationService.getUserProfile();
      if (!profile) {
        const result = await gamificationService.createUserProfile();
        profile = result.data;
      }

      if (!profile) {
        return { data: null, error: new Error('Could not create user profile') };
      }

      // Get achievements
      const { data: achievements } = await gamificationService.getUserAchievements();
      
      // Get active challenges
      const { data: userChallenges } = await gamificationService.getUserChallenges();
      
      // Get budget goals
      const { data: budgetGoals } = await gamificationService.getBudgetGoals();

      // Calculate level info
      const levelInfo = LEVEL_SYSTEM.find(l => 
        profile.total_points >= l.minPoints && profile.total_points <= l.maxPoints
      ) || LEVEL_SYSTEM[0];

      const nextLevelInfo = LEVEL_SYSTEM.find(l => l.level === levelInfo.level + 1) || null;
      const pointsToNextLevel = nextLevelInfo ? nextLevelInfo.minPoints - profile.total_points : 0;

      const gameStats: GameStats = {
        profile,
        achievements: achievements || [],
        activeChallenges: userChallenges?.filter(uc => uc.challenge?.is_active && !uc.completed) || [],
        budgetGoals: budgetGoals || [],
        levelInfo,
        nextLevelInfo,
        pointsToNextLevel,
      };

      return { data: gameStats, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },
};