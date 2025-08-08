import type { LevelInfo } from '@/types/gamification';

export const LEVEL_SYSTEM: LevelInfo[] = [
  { level: 1, name: 'Beginner Budgeter', minPoints: 0, maxPoints: 199, color: '#10B981', icon: 'Seedling' },
  { level: 2, name: 'Casual Tracker', minPoints: 200, maxPoints: 499, color: '#3B82F6', icon: 'User' },
  { level: 3, name: 'Expense Explorer', minPoints: 500, maxPoints: 999, color: '#8B5CF6', icon: 'Compass' },
  { level: 4, name: 'Budget Warrior', minPoints: 1000, maxPoints: 1999, color: '#F59E0B', icon: 'Shield' },
  { level: 5, name: 'Financial Ninja', minPoints: 2000, maxPoints: 3999, color: '#EF4444', icon: 'Zap' },
  { level: 6, name: 'Money Master', minPoints: 4000, maxPoints: 7999, color: '#DC2626', icon: 'Crown' },
  { level: 7, name: 'Expense Legend', minPoints: 8000, maxPoints: 15999, color: '#7C3AED', icon: 'Star' },
  { level: 8, name: 'Budget Sage', minPoints: 16000, maxPoints: 31999, color: '#059669', icon: 'Award' },
  { level: 9, name: 'Financial Guru', minPoints: 32000, maxPoints: 63999, color: '#0891B2', icon: 'TrendingUp' },
  { level: 10, name: 'Expense Immortal', minPoints: 64000, maxPoints: Infinity, color: '#FFD700', icon: 'Trophy' },
];

export const ACHIEVEMENT_CATEGORIES = {
  getting_started: { name: 'Getting Started', color: '#10B981', icon: 'Play' },
  streaks: { name: 'Streaks', color: '#F59E0B', icon: 'Flame' },
  milestones: { name: 'Milestones', color: '#3B82F6', icon: 'Target' },
  variety: { name: 'Variety', color: '#8B5CF6', icon: 'Shuffle' },
  budgets: { name: 'Budgets', color: '#06B6D4', icon: 'DollarSign' },
  savings: { name: 'Savings', color: '#059669', icon: 'PiggyBank' },
  spending: { name: 'Spending', color: '#DC2626', icon: 'CreditCard' },
};

export const STREAK_REWARDS = [
  { days: 7, points: 100, title: 'Week Warrior!' },
  { days: 14, points: 200, title: 'Two Week Champion!' },
  { days: 30, points: 300, title: 'Monthly Master!' },
  { days: 50, points: 500, title: 'Consistency King!' },
  { days: 100, points: 1000, title: 'Century Champion!' },
];

export const MILESTONE_REWARDS = [
  { count: 1, points: 50, title: 'First Steps!' },
  { count: 10, points: 75, title: 'Getting Started!' },
  { count: 25, points: 100, title: 'Quarter Century!' },
  { count: 50, points: 150, title: 'Halfway Hero!' },
  { count: 100, points: 250, title: 'Century Club!' },
  { count: 250, points: 400, title: 'Quarter Master!' },
  { count: 500, points: 500, title: 'Tracking Titan!' },
];

export const CHALLENGE_TYPES = {
  SPENDING_LIMIT: 'spending_limit',
  EXPENSE_COUNT: 'expense_count',
  CATEGORY_USAGE: 'category_usage',
  STREAK_GOAL: 'streak_goal',
  BUDGET_ADHERENCE: 'budget_adherence',
} as const;

export const PERIOD_LABELS = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
} as const;