export interface UserProfile {
  id: string;
  user_id: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  last_entry_date: string | null;
  level: number;
  total_expenses_tracked: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string | null;
  icon: string | null;
  points: number;
  badge_color: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  points_earned: number;
  achievement?: Achievement;
}

export interface BudgetGoal {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  target_amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface Challenge {
  id: string;
  name: string;
  description: string | null;
  challenge_type: string;
  target_value: number | null;
  reward_points: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  points_earned: number;
  joined_at: string;
  challenge?: Challenge;
}

export interface LevelInfo {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
}

export interface GameStats {
  profile: UserProfile;
  achievements: UserAchievement[];
  activeChallenges: UserChallenge[];
  budgetGoals: BudgetGoal[];
  levelInfo: LevelInfo;
  nextLevelInfo: LevelInfo | null;
  pointsToNextLevel: number;
}

export interface BudgetGoalFormData {
  name: string;
  target_amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category_id?: string;
  start_date: string;
  end_date: string;
}