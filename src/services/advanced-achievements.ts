import { createClient } from '@/lib/supabase/client';
import type { Achievement, UserAchievement } from '@/types/gamification';

interface ComboAchievement {
  id: string;
  name: string;
  description: string;
  requiredAchievements: string[];
  badge: string;
  points: number;
  rarity: 'rare' | 'epic' | 'legendary';
  hidden: boolean;
}

interface StreakCombo {
  name: string;
  description: string;
  conditions: {
    streakDays: number;
    categoryDiversity?: number; // Number of different categories used
    budgetCompliance?: boolean; // Stayed under budget
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  multiplier: number;
}

interface HiddenAchievement {
  id: string;
  name: string;
  description: string;
  hint: string;
  unlockCondition: (userStats: any, expenses: any[]) => boolean;
  points: number;
  badge: string;
  rarity: 'epic' | 'legendary';
}

export class AdvancedAchievementService {
  private supabase = createClient();

  // Combo Achievements - unlock when multiple related achievements are earned
  private readonly comboAchievements: ComboAchievement[] = [
    {
      id: 'financial-wizard',
      name: 'Financial Wizard',
      description: 'Master of all financial disciplines',
      requiredAchievements: ['budget-master', 'streak-legend', 'category-explorer', 'savings-guru'],
      badge: '🧙‍♂️',
      points: 500,
      rarity: 'legendary',
      hidden: false
    },
    {
      id: 'triple-threat',
      name: 'Triple Threat',
      description: 'Excel in budgeting, streaks, and savings',
      requiredAchievements: ['budget-keeper', 'streak-master', 'penny-pincher'],
      badge: '⚡',
      points: 200,
      rarity: 'epic',
      hidden: false
    },
    {
      id: 'data-detective',
      name: 'Data Detective',
      description: 'Analyzed spending patterns across all categories',
      requiredAchievements: ['category-explorer', 'trend-spotter', 'insight-seeker'],
      badge: '🔍',
      points: 150,
      rarity: 'rare',
      hidden: true
    }
  ];

  // Streak Combos - special bonuses for maintaining streaks with additional conditions
  private readonly streakCombos: StreakCombo[] = [
    {
      name: 'Morning Ritual',
      description: 'Logged expenses every morning for 7 days',
      conditions: {
        streakDays: 7,
        timeOfDay: 'morning'
      },
      multiplier: 1.5
    },
    {
      name: 'Diverse Spender',
      description: 'Used 5+ different categories during a 14-day streak',
      conditions: {
        streakDays: 14,
        categoryDiversity: 5
      },
      multiplier: 2.0
    },
    {
      name: 'Budget Perfectionist',
      description: 'Maintained streak while staying under budget',
      conditions: {
        streakDays: 21,
        budgetCompliance: true
      },
      multiplier: 2.5
    }
  ];

  // Hidden Achievements - secret unlocks with unique conditions
  private readonly hiddenAchievements: HiddenAchievement[] = [
    {
      id: 'penny-perfectionist',
      name: 'Penny Perfectionist',
      description: 'Recorded an expense ending in exactly .00',
      hint: 'Sometimes perfect amounts hide in plain sight...',
      unlockCondition: (userStats, expenses) => {
        return expenses.some(expense => expense.amount % 1 === 0);
      },
      points: 25,
      badge: '💰',
      rarity: 'epic'
    },
    {
      id: 'time-traveler',
      name: 'Time Traveler',
      description: 'Logged expenses at exactly midnight',
      hint: 'When today becomes tomorrow...',
      unlockCondition: (userStats, expenses) => {
        return expenses.some(expense => {
          const date = new Date(expense.created_at);
          return date.getHours() === 0 && date.getMinutes() === 0;
        });
      },
      points: 50,
      badge: '🕐',
      rarity: 'epic'
    },
    {
      id: 'fibonacci-financier',
      name: 'Fibonacci Financier',
      description: 'Spent amounts following the Fibonacci sequence',
      hint: 'Nature\'s numbers hide in your spending...',
      unlockCondition: (userStats, expenses) => {
        const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
        const amounts = expenses.map(e => Math.floor(e.amount)).sort((a, b) => a - b);
        
        // Check if any 3 consecutive amounts match Fibonacci sequence
        for (let i = 0; i < amounts.length - 2; i++) {
          for (let j = 0; j < fibonacci.length - 2; j++) {
            if (amounts[i] === fibonacci[j] && 
                amounts[i + 1] === fibonacci[j + 1] && 
                amounts[i + 2] === fibonacci[j + 2]) {
              return true;
            }
          }
        }
        return false;
      },
      points: 100,
      badge: '🌀',
      rarity: 'legendary'
    },
    {
      id: 'category-completionist',
      name: 'Category Completionist',
      description: 'Used every available category in a single month',
      hint: 'Explore every corner of your spending universe...',
      unlockCondition: async (userStats, expenses) => {
        const { data: categories } = await this.supabase
          .from('categories')
          .select('id');
        
        const thisMonth = new Date();
        const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
        const monthExpenses = expenses.filter(e => new Date(e.created_at) >= monthStart);
        
        const usedCategories = new Set(monthExpenses.map(e => e.category_id));
        return categories ? usedCategories.size >= categories.length : false;
      },
      points: 150,
      badge: '🎯',
      rarity: 'legendary'
    },
    {
      id: 'palindrome-prophet',
      name: 'Palindrome Prophet',
      description: 'Recorded expenses on palindrome dates',
      hint: 'When dates read the same forwards and backwards...',
      unlockCondition: (userStats, expenses) => {
        return expenses.some(expense => {
          const dateStr = new Date(expense.created_at).toISOString().split('T')[0].replace(/-/g, '');
          return dateStr === dateStr.split('').reverse().join('');
        });
      },
      points: 75,
      badge: '📅',
      rarity: 'epic'
    }
  ];

  async checkComboAchievements(userId: string): Promise<ComboAchievement[]> {
    try {
      // Get user's current achievements
      const { data: userAchievements } = await this.supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      if (!userAchievements) return [];

      const earnedIds = new Set(userAchievements.map(ua => ua.achievement_id));
      const newCombos: ComboAchievement[] = [];

      for (const combo of this.comboAchievements) {
        // Check if user already has this combo
        if (earnedIds.has(combo.id)) continue;

        // Check if all required achievements are earned
        const hasAllRequired = combo.requiredAchievements.every(reqId => earnedIds.has(reqId));
        
        if (hasAllRequired) {
          newCombos.push(combo);
          
          // Award the combo achievement
          await this.awardComboAchievement(userId, combo);
        }
      }

      return newCombos;
    } catch (error) {
      console.error('Error checking combo achievements:', error);
      return [];
    }
  }

  async checkStreakCombos(userId: string, currentStreak: number, recentExpenses: any[]): Promise<StreakCombo[]> {
    const qualifiedCombos: StreakCombo[] = [];

    for (const combo of this.streakCombos) {
      if (currentStreak >= combo.conditions.streakDays) {
        let qualifies = true;

        // Check time of day condition
        if (combo.conditions.timeOfDay) {
          const timeQualifies = recentExpenses.some(expense => {
            const hour = new Date(expense.created_at).getHours();
            const timeOfDay = this.getTimeOfDay(hour);
            return timeOfDay === combo.conditions.timeOfDay;
          });
          qualifies = qualifies && timeQualifies;
        }

        // Check category diversity
        if (combo.conditions.categoryDiversity) {
          const uniqueCategories = new Set(recentExpenses.map(e => e.category_id));
          qualifies = qualifies && (uniqueCategories.size >= combo.conditions.categoryDiversity);
        }

        // Check budget compliance (would need budget data)
        if (combo.conditions.budgetCompliance) {
          // This would require budget data to implement properly
          qualifies = qualifies && true; // Placeholder
        }

        if (qualifies) {
          qualifiedCombos.push(combo);
        }
      }
    }

    return qualifiedCombos;
  }

  async checkHiddenAchievements(userId: string): Promise<HiddenAchievement[]> {
    try {
      // Get user's expenses and stats
      const { data: expenses } = await this.supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const { data: userProfile } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!expenses || !userProfile) return [];

      // Get already earned achievements
      const { data: userAchievements } = await this.supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      const earnedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);
      const newHiddenAchievements: HiddenAchievement[] = [];

      for (const hidden of this.hiddenAchievements) {
        if (earnedIds.has(hidden.id)) continue;

        try {
          const unlocked = await hidden.unlockCondition(userProfile, expenses);
          if (unlocked) {
            newHiddenAchievements.push(hidden);
            await this.awardHiddenAchievement(userId, hidden);
          }
        } catch (error) {
          console.error(`Error checking hidden achievement ${hidden.id}:`, error);
        }
      }

      return newHiddenAchievements;
    } catch (error) {
      console.error('Error checking hidden achievements:', error);
      return [];
    }
  }

  async calculateComboMultiplier(achievements: string[]): Promise<number> {
    let multiplier = 1.0;

    // Achievement synergy bonuses
    const synergies = [
      { achievements: ['streak-master', 'budget-keeper'], bonus: 0.2 },
      { achievements: ['category-explorer', 'trend-spotter'], bonus: 0.15 },
      { achievements: ['penny-pincher', 'savings-guru'], bonus: 0.25 },
    ];

    for (const synergy of synergies) {
      if (synergy.achievements.every(req => achievements.includes(req))) {
        multiplier += synergy.bonus;
      }
    }

    return Math.min(multiplier, 3.0); // Cap at 3x multiplier
  }

  private async awardComboAchievement(userId: string, combo: ComboAchievement) {
    try {
      await this.supabase.from('user_achievements').insert([{
        user_id: userId,
        achievement_id: combo.id,
        unlocked_at: new Date().toISOString(),
      }]);

      // Update user points
      await this.supabase.rpc('add_user_points', {
        user_id: userId,
        points_to_add: combo.points
      });
    } catch (error) {
      console.error('Error awarding combo achievement:', error);
    }
  }

  private async awardHiddenAchievement(userId: string, hidden: HiddenAchievement) {
    try {
      await this.supabase.from('user_achievements').insert([{
        user_id: userId,
        achievement_id: hidden.id,
        unlocked_at: new Date().toISOString(),
      }]);

      // Update user points
      await this.supabase.rpc('add_user_points', {
        user_id: userId,
        points_to_add: hidden.points
      });
    } catch (error) {
      console.error('Error awarding hidden achievement:', error);
    }
  }

  private getTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  // Get achievements with hints for UI
  getHiddenAchievementHints(): Array<{ hint: string; rarity: string; points: number }> {
    return this.hiddenAchievements.map(achievement => ({
      hint: achievement.hint,
      rarity: achievement.rarity,
      points: achievement.points
    }));
  }

  // Special event achievements (seasonal, temporary)
  async checkEventAchievements(userId: string, eventType: 'halloween' | 'christmas' | 'new-year'): Promise<any[]> {
    const eventAchievements = {
      halloween: [
        {
          id: 'spooky-spender',
          name: 'Spooky Spender',
          description: 'Tracked expenses on Halloween',
          condition: (expenses: any[]) => 
            expenses.some(e => {
              const date = new Date(e.created_at);
              return date.getMonth() === 9 && date.getDate() === 31;
            }),
          badge: '🎃',
          points: 31
        }
      ],
      christmas: [
        {
          id: 'holiday-tracker',
          name: 'Holiday Tracker',
          description: 'Stayed on budget during the holiday season',
          condition: () => true, // Would check December budget compliance
          badge: '🎄',
          points: 100
        }
      ],
      'new-year': [
        {
          id: 'resolution-keeper',
          name: 'Resolution Keeper',
          description: 'First expense logged in the new year',
          condition: (expenses: any[]) => {
            const newYearExpense = expenses.find(e => {
              const date = new Date(e.created_at);
              return date.getMonth() === 0 && date.getDate() === 1;
            });
            return !!newYearExpense;
          },
          badge: '🎊',
          points: 50
        }
      ]
    };

    // Implementation would check current date and award seasonal achievements
    return [];
  }
}

export const advancedAchievementService = new AdvancedAchievementService();