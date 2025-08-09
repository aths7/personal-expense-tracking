import { createClient } from '@/lib/supabase/client';

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  type: 'festival' | 'challenge' | 'bonus' | 'celebration';
  theme: 'diwali' | 'holi' | 'eid' | 'christmas' | 'new_year' | 'dussehra' | 'navratri' | 'general';
  start_date: string;
  end_date: string;
  is_active: boolean;
  rewards: SeasonalReward[];
  challenges: SeasonalChallenge[];
  theme_colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  special_effects: {
    particle_effect: string;
    background_animation: string;
    sound_effect?: string;
  };
}

export interface SeasonalReward {
  id: string;
  event_id: string;
  type: 'points' | 'badge' | 'character' | 'accessory' | 'currency_bonus';
  name: string;
  description: string;
  value: number;
  unlock_condition: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SeasonalChallenge {
  id: string;
  event_id: string;
  title: string;
  description: string;
  type: 'spending_limit' | 'category_focus' | 'streak' | 'savings_goal' | 'mini_game';
  target_value: number;
  current_progress: number;
  reward_points: number;
  time_limit?: string; // ISO date string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  is_completed: boolean;
}

export interface UserSeasonalProgress {
  user_id: string;
  event_id: string;
  points_earned: number;
  challenges_completed: number;
  rewards_unlocked: string[];
  participation_date: string;
  special_achievements: string[];
}

class SeasonalEventsService {
  private supabase = createClient();

  // Get currently active seasonal events
  async getActiveEvents(): Promise<SeasonalEvent[]> {
    try {
      const currentDate = new Date().toISOString();

      // In a real app, this would fetch from database
      // For now, we'll return mock seasonal events based on current date
      return this.getMockActiveEvents(currentDate);
    } catch (error) {
      console.error('Error fetching active events:', error);
      return [];
    }
  }

  // Get user's progress in seasonal events
  async getUserEventProgress(_eventId: string): Promise<UserSeasonalProgress | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return null;

      // Mock progress data - in real app would fetch from database
      return {
        user_id: user.id,
        event_id: _eventId,
        points_earned: Math.floor(Math.random() * 500) + 100,
        challenges_completed: Math.floor(Math.random() * 3) + 1,
        rewards_unlocked: ['diwali_badge', 'sparkler_accessory'],
        participation_date: new Date().toISOString(),
        special_achievements: ['festival_spender', 'light_saver']
      };
    } catch (error) {
      console.error('Error fetching user event progress:', error);
      return null;
    }
  }

  // Complete a seasonal challenge
  async completeChallenge(challengeId: string): Promise<{ success: boolean; reward?: SeasonalReward }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return { success: false };

      // Mock challenge completion
      const mockReward: SeasonalReward = {
        id: `reward_${challengeId}`,
        event_id: 'diwali_2024',
        type: 'points',
        name: 'Festival Challenge Complete',
        description: 'Completed a special Diwali challenge!',
        value: 100,
        unlock_condition: 'complete_challenge',
        icon: '🎆',
        rarity: 'rare'
      };

      return { success: true, reward: mockReward };
    } catch (error) {
      console.error('Error completing challenge:', error);
      return { success: false };
    }
  }

  // Get seasonal themes and decorations
  getEventTheme(eventType: string): SeasonalEvent['theme_colors'] & SeasonalEvent['special_effects'] {
    const themes = {
      diwali: {
        primary: '#FF6B35',
        secondary: '#F7931E',
        accent: '#FFD23F',
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%)',
        particle_effect: 'golden_sparks',
        background_animation: 'floating_diyas',
        sound_effect: 'temple_bells'
      },
      holi: {
        primary: '#E91E63',
        secondary: '#9C27B0',
        accent: '#FF9800',
        background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 50%, #FF9800 100%)',
        particle_effect: 'color_powder',
        background_animation: 'color_splash',
        sound_effect: 'dhol_beats'
      },
      eid: {
        primary: '#00BCD4',
        secondary: '#4CAF50',
        accent: '#FFD700',
        background: 'linear-gradient(135deg, #00BCD4 0%, #4CAF50 50%, #FFD700 100%)',
        particle_effect: 'crescent_stars',
        background_animation: 'mosque_silhouette',
        sound_effect: 'call_to_prayer'
      },
      christmas: {
        primary: '#C62828',
        secondary: '#2E7D32',
        accent: '#FFD700',
        background: 'linear-gradient(135deg, #C62828 0%, #2E7D32 50%, #FFD700 100%)',
        particle_effect: 'snow_flakes',
        background_animation: 'christmas_tree',
        sound_effect: 'jingle_bells'
      },
      new_year: {
        primary: '#6A1B9A',
        secondary: '#FF6F00',
        accent: '#FFD700',
        background: 'linear-gradient(135deg, #6A1B9A 0%, #FF6F00 50%, #FFD700 100%)',
        particle_effect: 'fireworks',
        background_animation: 'countdown_timer',
        sound_effect: 'celebration_horn'
      }
    };

    return themes[eventType as keyof typeof themes] || themes.diwali;
  }

  // Generate time-limited challenges based on current events
  generateTimeLimitedChallenges(event: SeasonalEvent): SeasonalChallenge[] {
    const challenges: SeasonalChallenge[] = [];

    // Festival spending challenge
    if (event.theme === 'diwali') {
      challenges.push({
        id: 'diwali_smart_spending',
        event_id: event.id,
        title: 'Smart Diwali Spending',
        description: 'Keep your Diwali shopping under ₹15,000 this week',
        type: 'spending_limit',
        target_value: 15000,
        current_progress: Math.floor(Math.random() * 10000),
        reward_points: 200,
        time_limit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'medium',
        is_completed: false
      });

      challenges.push({
        id: 'diwali_category_focus',
        event_id: event.id,
        title: 'Festival Essentials Only',
        description: 'Spend only on Food & Shopping categories during Diwali week',
        type: 'category_focus',
        target_value: 2, // 2 categories
        current_progress: 1,
        reward_points: 150,
        time_limit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'easy',
        is_completed: false
      });

      challenges.push({
        id: 'diwali_savings_streak',
        event_id: event.id,
        title: 'Pre-Diwali Savings Streak',
        description: 'Track expenses for 5 consecutive days before Diwali',
        type: 'streak',
        target_value: 5,
        current_progress: 3,
        reward_points: 300,
        time_limit: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'hard',
        is_completed: false
      });
    }

    return challenges;
  }

  // Check for seasonal achievement unlocks
  async checkSeasonalAchievements(expenses: { date: string; amount: number }[]): Promise<string[]> {
    const achievements: string[] = [];
    const currentEvent = (await this.getActiveEvents())[0];

    if (!currentEvent) return achievements;

    // Festival-specific achievements
    if (currentEvent.theme === 'diwali') {
      // Check if user spent wisely during Diwali
      const diwaliExpenses = expenses.filter(e =>
        new Date(e.date) >= new Date(currentEvent.start_date) &&
        new Date(e.date) <= new Date(currentEvent.end_date)
      );

      const totalDiwaliSpending = diwaliExpenses.reduce((sum, e) => sum + e.amount, 0);

      if (totalDiwaliSpending < 10000) {
        achievements.push('diwali_smart_spender');
      }

      if (diwaliExpenses.length >= 10) {
        achievements.push('diwali_tracker_champion');
      }
    }

    return achievements;
  }

  // Get special offers during seasonal events
  getSeasonalOffers(event: SeasonalEvent): Array<{
    title: string;
    description: string;
    discount: number;
    type: string;
  }> {
    const offers = [];

    if (event.theme === 'diwali') {
      offers.push({
        title: 'Double Points on Food Expenses',
        description: 'Get 2x points for all food and dining expenses during Diwali',
        discount: 100,
        type: 'points_multiplier'
      });

      offers.push({
        title: 'Festival Bonus Characters',
        description: 'Unlock special Diwali-themed characters at 50% fewer points',
        discount: 50,
        type: 'character_discount'
      });
    }

    return offers;
  }

  // Private helper method to generate mock active events
  private getMockActiveEvents(_currentDate: string): SeasonalEvent[] {
    const events: SeasonalEvent[] = [];
    const now = new Date();
    const currentMonth = now.getMonth();

    // Determine which festival is active based on current date
    let activeTheme: SeasonalEvent['theme'] = 'general';

    // Indian festival calendar (approximate dates)
    if (currentMonth === 9 || currentMonth === 10) { // Oct-Nov - Diwali season
      activeTheme = 'diwali';
    } else if (currentMonth === 2 || currentMonth === 3) { // Mar-Apr - Holi season
      activeTheme = 'holi';
    } else if (currentMonth === 11) { // December - Christmas
      activeTheme = 'christmas';
    } else if (currentMonth === 0) { // January - New Year
      activeTheme = 'new_year';
    }

    // Create active seasonal event
    const mockEvent: SeasonalEvent = {
      id: `${activeTheme}_${now.getFullYear()}`,
      name: this.getFestivalName(activeTheme),
      description: this.getFestivalDescription(activeTheme),
      type: 'festival',
      theme: activeTheme,
      start_date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      rewards: [],
      challenges: [],
      theme_colors: this.getEventTheme(activeTheme),
      special_effects: this.getEventTheme(activeTheme)
    };

    mockEvent.challenges = this.generateTimeLimitedChallenges(mockEvent);
    events.push(mockEvent);

    return events;
  }

  private getFestivalName(theme: SeasonalEvent['theme']): string {
    const names = {
      diwali: 'Festival of Lights - Diwali Special',
      holi: 'Festival of Colors - Holi Celebration',
      eid: 'Eid Mubarak - Blessed Celebration',
      christmas: 'Christmas Joy & Savings',
      new_year: 'New Year New Financial Goals',
      dussehra: 'Victory of Good - Dussehra',
      navratri: 'Nine Nights of Saving - Navratri',
      general: 'Seasonal Savings Challenge'
    };
    return names[theme];
  }

  private getFestivalDescription(theme: SeasonalEvent['theme']): string {
    const descriptions = {
      diwali: 'Celebrate Diwali while keeping your finances bright! Complete challenges, earn festive rewards, and manage your celebration expenses wisely.',
      holi: 'Add colors to your savings this Holi! Play financial mini-games, track your expenses, and unlock colorful rewards.',
      eid: 'Blessed Eid celebrations with mindful spending. Track your festive expenses and earn special rewards for smart financial choices.',
      christmas: 'Ho ho ho! Manage your Christmas spending with joy. Complete holiday challenges and unlock festive characters.',
      new_year: 'Start the new year with strong financial habits! Set goals, track progress, and earn resolution-based rewards.',
      dussehra: 'Victory over poor spending habits! Celebrate Dussehra with smart financial choices and earn triumph badges.',
      navratri: 'Dance your way to financial success over nine nights! Daily challenges and colorful rewards await.',
      general: 'Seasonal financial challenges to keep you motivated throughout the year!'
    };
    return descriptions[theme];
  }
}

export const seasonalEventsService = new SeasonalEventsService();