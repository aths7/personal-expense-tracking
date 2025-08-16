export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string | null
          badge_color: string | null
          category: string | null
          combo_requirements: Json | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_combo: boolean | null
          is_hidden: boolean | null
          key: string
          name: string
          points: number | null
          seasonal_event_id: string | null
        }
        Insert: {
          achievement_type?: string | null
          badge_color?: string | null
          category?: string | null
          combo_requirements?: Json | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_combo?: boolean | null
          is_hidden?: boolean | null
          key: string
          name: string
          points?: number | null
          seasonal_event_id?: string | null
        }
        Update: {
          achievement_type?: string | null
          badge_color?: string | null
          category?: string | null
          combo_requirements?: Json | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_combo?: boolean | null
          is_hidden?: boolean | null
          key?: string
          name?: string
          points?: number | null
          seasonal_event_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_seasonal_event_id_fkey"
            columns: ["seasonal_event_id"]
            isOneToOne: false
            referencedRelation: "seasonal_events"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      budget_goals: {
        Row: {
          category_id: string | null
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          period: string
          start_date: string
          target_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          period: string
          start_date: string
          target_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          period?: string
          start_date?: string
          target_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_goals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_default: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      challenge_invitations: {
        Row: {
          challenge_data: Json
          challenge_type: string
          challenged_id: string
          challenger_id: string
          created_at: string | null
          expires_at: string
          id: string
          status: string | null
        }
        Insert: {
          challenge_data: Json
          challenge_type: string
          challenged_id: string
          challenger_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          status?: string | null
        }
        Update: {
          challenge_data?: Json
          challenge_type?: string
          challenged_id?: string
          challenger_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          status?: string | null
        }
        Relationships: []
      }
      challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          reward_points: number | null
          start_date: string
          target_value: number | null
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          reward_points?: number | null
          start_date: string
          target_value?: number | null
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          reward_points?: number | null
          start_date?: string
          target_value?: number | null
        }
        Relationships: []
      }
      character_accessories: {
        Row: {
          character_type: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          rarity: string | null
          sprite_path: string | null
          type: string
          unlock_condition: string | null
          unlock_points: number | null
        }
        Insert: {
          character_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rarity?: string | null
          sprite_path?: string | null
          type: string
          unlock_condition?: string | null
          unlock_points?: number | null
        }
        Update: {
          character_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rarity?: string | null
          sprite_path?: string | null
          type?: string
          unlock_condition?: string | null
          unlock_points?: number | null
        }
        Relationships: []
      }
      characters: {
        Row: {
          animations: Json | null
          base_sprite: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          rarity: string | null
          type: string
          unlock_condition: string | null
          unlock_points: number | null
        }
        Insert: {
          animations?: Json | null
          base_sprite?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rarity?: string | null
          type: string
          unlock_condition?: string | null
          unlock_points?: number | null
        }
        Update: {
          animations?: Json | null
          base_sprite?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rarity?: string | null
          type?: string
          unlock_condition?: string | null
          unlock_points?: number | null
        }
        Relationships: []
      }
      expense_interactions: {
        Row: {
          animation_data: Json | null
          created_at: string | null
          expense_id: string
          id: string
          interaction_type: string
          user_id: string
        }
        Insert: {
          animation_data?: Json | null
          created_at?: string | null
          expense_id: string
          id?: string
          interaction_type: string
          user_id: string
        }
        Update: {
          animation_data?: Json | null
          created_at?: string | null
          expense_id?: string
          id?: string
          interaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_interactions_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_connections: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          created_at: string | null
          id: string
          leaderboard_id: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          leaderboard_id?: string | null
          score?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          leaderboard_id?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_leaderboard_id_fkey"
            columns: ["leaderboard_id"]
            isOneToOne: false
            referencedRelation: "leaderboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      mini_games: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_level: number | null
          game_type: string
          id: string
          is_active: boolean | null
          name: string
          reward_points: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          game_type: string
          id?: string
          is_active?: boolean | null
          name: string
          reward_points?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          game_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          reward_points?: number | null
        }
        Relationships: []
      }
      points: {
        Row: {
          created_at: string | null
          id: string
          points: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          points?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          points?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_expense_templates: {
        Row: {
          amount: number
          category_name: string
          color: string | null
          created_at: string | null
          icon: string
          id: string
          label: string
          sort_order: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category_name: string
          color?: string | null
          created_at?: string | null
          icon?: string
          id?: string
          label: string
          sort_order?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category_name?: string
          color?: string | null
          created_at?: string | null
          icon?: string
          id?: string
          label?: string
          sort_order?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seasonal_events: {
        Row: {
          bonus_multiplier: number | null
          created_at: string | null
          description: string | null
          end_date: string
          event_type: string
          id: string
          is_active: boolean | null
          name: string
          special_achievements: Json | null
          start_date: string
          theme_overrides: Json | null
        }
        Insert: {
          bonus_multiplier?: number | null
          created_at?: string | null
          description?: string | null
          end_date: string
          event_type: string
          id?: string
          is_active?: boolean | null
          name: string
          special_achievements?: Json | null
          start_date: string
          theme_overrides?: Json | null
        }
        Update: {
          bonus_multiplier?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          event_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          special_achievements?: Json | null
          start_date?: string
          theme_overrides?: Json | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          points_earned: number | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          points_earned?: number | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          points_earned?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          awarded_at: string | null
          badge_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          badge_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          badge_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string
          completed: boolean | null
          completed_at: string | null
          id: string
          joined_at: string | null
          points_earned: number | null
          progress: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          joined_at?: string | null
          points_earned?: number | null
          progress?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          joined_at?: string | null
          points_earned?: number | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_character_accessories: {
        Row: {
          accessory_id: string
          id: string
          is_equipped: boolean | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          accessory_id: string
          id?: string
          is_equipped?: boolean | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          accessory_id?: string
          id?: string
          is_equipped?: boolean | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_character_accessories_accessory_id_fkey"
            columns: ["accessory_id"]
            isOneToOne: false
            referencedRelation: "character_accessories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_characters: {
        Row: {
          character_id: string
          id: string
          is_active: boolean | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          character_id: string
          id?: string
          is_active?: boolean | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          character_id?: string
          id?: string
          is_active?: boolean | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_characters_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mini_game_scores: {
        Row: {
          completion_time: unknown | null
          id: string
          mini_game_id: string
          played_at: string | null
          points_earned: number | null
          score: number
          user_id: string
        }
        Insert: {
          completion_time?: unknown | null
          id?: string
          mini_game_id: string
          played_at?: string | null
          points_earned?: number | null
          score: number
          user_id: string
        }
        Update: {
          completion_time?: unknown | null
          id?: string
          mini_game_id?: string
          played_at?: string | null
          points_earned?: number | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mini_game_scores_mini_game_id_fkey"
            columns: ["mini_game_id"]
            isOneToOne: false
            referencedRelation: "mini_games"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          animation_level: string | null
          background_effects: boolean | null
          character_reactions: boolean | null
          created_at: string | null
          current_mood: string | null
          id: string
          sound_enabled: boolean | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          animation_level?: string | null
          background_effects?: boolean | null
          character_reactions?: boolean | null
          created_at?: string | null
          current_mood?: string | null
          id?: string
          sound_enabled?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          animation_level?: string | null
          background_effects?: boolean | null
          character_reactions?: boolean | null
          created_at?: string | null
          current_mood?: string | null
          id?: string
          sound_enabled?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_entry_date: string | null
          level: number | null
          longest_streak: number | null
          total_expenses_tracked: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_entry_date?: string | null
          level?: number | null
          longest_streak?: number | null
          total_expenses_tracked?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_entry_date?: string | null
          level?: number | null
          longest_streak?: number | null
          total_expenses_tracked?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_seasonal_events: {
        Row: {
          event_id: string
          id: string
          joined_at: string | null
          progress: Json | null
          rewards_claimed: Json | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          joined_at?: string | null
          progress?: Json | null
          rewards_claimed?: Json | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          joined_at?: string | null
          progress?: Json | null
          rewards_claimed?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_seasonal_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "seasonal_events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_user_points: {
        Args: {
          user_id_param: string
          points_to_add: number
        }
        Returns: undefined
      }
      update_user_streaks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
