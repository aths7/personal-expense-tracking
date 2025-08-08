import { createClient } from '@/lib/supabase/client';
import type { 
  Character, 
  UserCharacter, 
  CharacterAccessory, 
  UserCharacterAccessory,
  UserPreferences,
  CharacterMood,
  AdvancedGameStats
} from '@/types/advanced-gamification';

export interface CharacterSystemService {
  getAvailableCharacters: () => Promise<{ data: Character[] | null; error: Error | null }>;
  getUserCharacters: () => Promise<{ data: UserCharacter[] | null; error: Error | null }>;
  unlockCharacter: (characterId: string) => Promise<{ success: boolean; error?: Error }>;
  setActiveCharacter: (characterId: string) => Promise<{ success: boolean; error?: Error }>;
  getAvailableAccessories: () => Promise<{ data: CharacterAccessory[] | null; error: Error | null }>;
  getUserAccessories: () => Promise<{ data: UserCharacterAccessory[] | null; error: Error | null }>;
  unlockAccessory: (accessoryId: string) => Promise<{ success: boolean; error?: Error }>;
  equipAccessory: (accessoryId: string) => Promise<{ success: boolean; error?: Error }>;
  getUserPreferences: () => Promise<{ data: UserPreferences | null; error: Error | null }>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<{ success: boolean; error?: Error }>;
  getCharacterMood: (spendingData: any) => CharacterMood;
  getAdvancedGameStats: () => Promise<{ data: AdvancedGameStats | null; error: Error | null }>;
}

export const characterSystemService: CharacterSystemService = {
  getAvailableCharacters: async () => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('is_active', true)
      .order('unlock_points', { ascending: true });

    return { data, error };
  },

  getUserCharacters: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('user_characters')
      .select(`
        *,
        character:characters(*)
      `)
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false });

    return { data, error };
  },

  unlockCharacter: async (characterId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('user_characters')
        .insert([{
          user_id: user.id,
          character_id: characterId,
        }]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  setActiveCharacter: async (characterId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      // First, set all characters as inactive
      await supabase
        .from('user_characters')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Then, set the selected character as active
      const { error } = await supabase
        .from('user_characters')
        .update({ is_active: true })
        .eq('user_id', user.id)
        .eq('character_id', characterId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  getAvailableAccessories: async () => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('character_accessories')
      .select('*')
      .eq('is_active', true)
      .order('unlock_points', { ascending: true });

    return { data, error };
  },

  getUserAccessories: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('user_character_accessories')
      .select(`
        *,
        accessory:character_accessories(*)
      `)
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false });

    return { data, error };
  },

  unlockAccessory: async (accessoryId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('user_character_accessories')
        .insert([{
          user_id: user.id,
          accessory_id: accessoryId,
        }]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  equipAccessory: async (accessoryId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      // Get accessory type to unequip others of the same type
      const { data: accessory } = await supabase
        .from('character_accessories')
        .select('type')
        .eq('id', accessoryId)
        .single();

      if (accessory) {
        // Unequip other accessories of the same type
        await supabase
          .from('user_character_accessories')
          .update({ is_equipped: false })
          .eq('user_id', user.id)
          .in('accessory_id', 
            supabase
              .from('character_accessories')
              .select('id')
              .eq('type', accessory.type)
          );
      }

      // Equip the selected accessory
      const { error } = await supabase
        .from('user_character_accessories')
        .update({ is_equipped: true })
        .eq('user_id', user.id)
        .eq('accessory_id', accessoryId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  getUserPreferences: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return { data, error };
  },

  updateUserPreferences: async (preferences: Partial<UserPreferences>) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert([{
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  getCharacterMood: (spendingData: any): CharacterMood => {
    const { monthlyBudget, currentSpending, recentExpense } = spendingData;
    
    // Calculate spending ratio
    const spendingRatio = monthlyBudget > 0 ? currentSpending / monthlyBudget : 0;
    
    // Determine mood based on spending patterns
    if (spendingRatio < 0.5) {
      return {
        mood: 'happy',
        expression: '😊',
        animation: 'bounce',
        trigger: 'under_budget',
        duration: 3000
      };
    } else if (spendingRatio < 0.8) {
      return {
        mood: 'neutral',
        expression: '😐',
        animation: 'idle',
        trigger: 'under_budget',
        duration: 2000
      };
    } else if (spendingRatio < 1.0) {
      return {
        mood: 'worried',
        expression: '😟',
        animation: 'shake',
        trigger: 'over_budget',
        duration: 4000
      };
    } else {
      return {
        mood: 'angry',
        expression: '😠',
        animation: 'pulse',
        trigger: 'over_budget',
        duration: 5000
      };
    }
  },

  getAdvancedGameStats: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    try {
      // Get all necessary data in parallel
      const [
        userCharactersResult,
        userAccessoriesResult,
        preferencesResult,
        availableAccessoriesResult
      ] = await Promise.all([
        characterSystemService.getUserCharacters(),
        characterSystemService.getUserAccessories(),
        characterSystemService.getUserPreferences(),
        characterSystemService.getAvailableAccessories()
      ]);

      const currentCharacter = userCharactersResult.data?.find(uc => uc.is_active) || null;
      const equippedAccessories = userAccessoriesResult.data?.filter(ua => ua.is_equipped) || [];
      
      // Get current mood based on recent spending
      const currentMood = characterSystemService.getCharacterMood({
        monthlyBudget: 50000, // This would come from actual budget data
        currentSpending: 37500,
        recentExpense: null
      });

      // Generate theme colors based on mood
      const themeColors = {
        happy: { primary: '#10B981', background: '#F0FDF4', accent: '#34D399' },
        neutral: { primary: '#6B7280', background: '#F9FAFB', accent: '#9CA3AF' },
        worried: { primary: '#F59E0B', background: '#FFFBEB', accent: '#FBBF24' },
        excited: { primary: '#8B5CF6', background: '#FAF5FF', accent: '#A78BFA' },
        angry: { primary: '#EF4444', background: '#FEF2F2', accent: '#F87171' }
      };

      const advancedStats: AdvancedGameStats = {
        currentCharacter,
        unlockedCharacters: userCharactersResult.data || [],
        equippedAccessories,
        availableAccessories: availableAccessoriesResult.data || [],
        preferences: preferencesResult.data || {
          id: '',
          user_id: user.id,
          current_mood: 'neutral',
          theme_preference: 'auto',
          animation_level: 'full',
          sound_enabled: true,
          character_reactions: true,
          background_effects: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        activeEvents: [], // Would be populated from seasonal events
        miniGameScores: [], // Would be populated from mini-game data
        currentMood: currentMood.mood,
        characterReaction: currentMood.expression,
        themeColors: themeColors[currentMood.mood]
      };

      return { data: advancedStats, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
};

// Utility functions for character system
export const CharacterUtils = {
  checkUnlockConditions: (condition: string, userStats: any): boolean => {
    switch (condition) {
      case 'default':
        return true;
      case 'first_expense':
        return userStats.totalExpenses >= 1;
      case 'expenses_10':
        return userStats.totalExpenses >= 10;
      case 'expenses_50':
        return userStats.totalExpenses >= 50;
      case 'expenses_100':
        return userStats.totalExpenses >= 100;
      case 'expenses_500':
        return userStats.totalExpenses >= 500;
      case 'streak_7':
        return userStats.longestStreak >= 7;
      case 'streak_14':
        return userStats.longestStreak >= 14;
      case 'streak_30':
        return userStats.longestStreak >= 30;
      case 'level_3':
        return userStats.level >= 3;
      case 'level_5':
        return userStats.level >= 5;
      case 'level_8':
        return userStats.level >= 8;
      case 'budget_setter':
        return userStats.budgetGoalsCreated >= 1;
      case 'budget_achiever':
        return userStats.budgetGoalsAchieved >= 1;
      case 'category_explorer':
        return userStats.categoriesUsed >= 5;
      case 'big_spender':
        return userStats.maxSingleExpense >= 500;
      default:
        return false;
    }
  },

  getRarityColor: (rarity: string): string => {
    const rarityColors = {
      common: '#9CA3AF',
      rare: '#3B82F6',
      epic: '#8B5CF6',
      legendary: '#F59E0B'
    };
    return rarityColors[rarity as keyof typeof rarityColors] || rarityColors.common;
  },

  getCharacterPersonality: (characterType: string) => {
    const personalities = {
      pig: {
        reactions: {
          happy: ['Oink oink! Great savings!', 'This piggy is happy!', 'More money for the bank!'],
          worried: ['Oink... spending too much?', 'This little piggy is concerned', 'Maybe save a bit more?'],
          excited: ['OINK OINK! Achievement unlocked!', 'This piggy is thrilled!', 'Dancing pig time!']
        },
        animations: {
          idle: 'gentle_bounce',
          happy: 'spin_jump',
          worried: 'shake_head',
          excited: 'party_bounce'
        }
      },
      mario: {
        reactions: {
          happy: ['Wahoo! Great job!', 'Mamma mia! Nice spending!', "Let's-a go save money!"],
          worried: ['Uh oh! Watch the coins!', 'Mamma mia! Too much spending!', 'Time to-a save more!'],
          excited: ['WAHOO! Level up!', "It's-a me! Celebrating!", 'Yahoo! Achievement unlocked!']
        },
        animations: {
          idle: 'hat_tip',
          happy: 'jump_punch',
          worried: 'scratch_head',
          excited: 'victory_dance'
        }
      },
      // Add more character personalities...
    };

    return personalities[characterType as keyof typeof personalities] || personalities.pig;
  }
};