export interface Character {
  id: string;
  name: string;
  type: 'pig' | 'mario' | 'sonic' | 'cat' | 'robot' | 'dragon' | 'wizard';
  description: string;
  unlock_condition: string;
  unlock_points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  base_sprite: string;
  animations: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface CharacterAccessory {
  id: string;
  name: string;
  type: 'hat' | 'color' | 'accessory' | 'background';
  character_type?: string;
  sprite_path: string;
  unlock_condition: string;
  unlock_points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  is_active: boolean;
  created_at: string;
}

export interface UserCharacter {
  id: string;
  user_id: string;
  character_id: string;
  is_active: boolean;
  unlocked_at: string;
  character?: Character;
}

export interface UserCharacterAccessory {
  id: string;
  user_id: string;
  accessory_id: string;
  is_equipped: boolean;
  unlocked_at: string;
  accessory?: CharacterAccessory;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  current_mood: 'happy' | 'neutral' | 'worried' | 'excited';
  theme_preference: 'auto' | 'always_light' | 'always_dark' | 'mood_based';
  animation_level: 'minimal' | 'reduced' | 'full';
  sound_enabled: boolean;
  character_reactions: boolean;
  background_effects: boolean;
  created_at: string;
  updated_at: string;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  event_type: 'holiday' | 'monthly_challenge' | 'special';
  start_date: string;
  end_date: string;
  special_achievements: string[];
  theme_overrides: Record<string, any>;
  bonus_multiplier: number;
  is_active: boolean;
  created_at: string;
}

export interface UserSeasonalEvent {
  id: string;
  user_id: string;
  event_id: string;
  progress: Record<string, any>;
  rewards_claimed: string[];
  joined_at: string;
  event?: SeasonalEvent;
}

export interface ExpenseInteraction {
  id: string;
  user_id: string;
  expense_id: string;
  interaction_type: 'coin_flip' | 'category_chomp' | 'character_reaction';
  animation_data: Record<string, any>;
  created_at: string;
}

export interface MiniGame {
  id: string;
  name: string;
  game_type: 'prediction' | 'sorting' | 'budgeting' | 'memory' | 'quiz';
  description: string;
  reward_points: number;
  difficulty_level: number;
  is_active: boolean;
  created_at: string;
}

export interface UserMiniGameScore {
  id: string;
  user_id: string;
  mini_game_id: string;
  score: number;
  completion_time?: string;
  points_earned: number;
  played_at: string;
  mini_game?: MiniGame;
}

export interface FriendConnection {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
}

export interface ChallengeInvitation {
  id: string;
  challenger_id: string;
  challenged_id: string;
  challenge_type: 'savings_goal' | 'streak_battle' | 'category_limit';
  challenge_data: Record<string, any>;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  expires_at: string;
  created_at: string;
}

export interface AdvancedGameStats {
  currentCharacter: UserCharacter | null;
  unlockedCharacters: UserCharacter[];
  equippedAccessories: UserCharacterAccessory[];
  availableAccessories: CharacterAccessory[];
  preferences: UserPreferences;
  activeEvents: SeasonalEvent[];
  miniGameScores: UserMiniGameScore[];
  currentMood: 'happy' | 'neutral' | 'worried' | 'excited';
  characterReaction: string;
  themeColors: {
    primary: string;
    background: string;
    accent: string;
  };
}

export interface AnimationConfig {
  type: 'coin_flip' | 'money_rain' | 'piggy_bank_fill' | 'treasure_chest' | 'rocket_launch' | 'plant_grow';
  duration: number;
  trigger: 'expense_add' | 'goal_complete' | 'level_up' | 'streak_milestone';
  particles?: {
    count: number;
    color: string;
    size: number;
  };
  sound?: string;
  intensity: 'minimal' | 'normal' | 'intense';
}

export interface CharacterMood {
  mood: 'happy' | 'neutral' | 'worried' | 'excited' | 'angry' | 'sleepy';
  expression: string;
  animation: string;
  trigger: 'under_budget' | 'over_budget' | 'big_expense' | 'achievement' | 'idle';
  duration: number;
}

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    accent: string;
  };
  mood: 'happy' | 'neutral' | 'worried' | 'excited';
  particles?: {
    type: 'snow' | 'rain' | 'sparkles' | 'leaves';
    intensity: number;
  };
}