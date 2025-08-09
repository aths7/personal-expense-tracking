export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          color: string | null
          icon: string | null
          user_id: string | null
          is_default: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          icon?: string | null
          user_id?: string | null
          is_default?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string | null
          icon?: string | null
          user_id?: string | null
          is_default?: boolean | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          amount: number
          description: string | null
          date: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          amount: number
          description?: string | null
          date: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          amount?: number
          description?: string | null
          date?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      characters: {
        Row: {
          id: string
          name: string
          type: string
          description: string | null
          unlock_condition: string | null
          unlock_points: number | null
          rarity: string | null
          base_sprite: string | null
          animations: Json | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          description?: string | null
          unlock_condition?: string | null
          unlock_points?: number | null
          rarity?: string | null
          base_sprite?: string | null
          animations?: Json | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          description?: string | null
          unlock_condition?: string | null
          unlock_points?: number | null
          rarity?: string | null
          base_sprite?: string | null
          animations?: Json | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      character_accessories: {
        Row: {
          id: string
          name: string
          type: string
          character_type: string | null
          sprite_path: string | null
          unlock_condition: string | null
          unlock_points: number | null
          rarity: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          character_type?: string | null
          sprite_path?: string | null
          unlock_condition?: string | null
          unlock_points?: number | null
          rarity?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          character_type?: string | null
          sprite_path?: string | null
          unlock_condition?: string | null
          unlock_points?: number | null
          rarity?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_characters: {
        Row: {
          id: string
          user_id: string
          character_id: string
          is_active: boolean | null
          unlocked_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          character_id: string
          is_active?: boolean | null
          unlocked_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          character_id?: string
          is_active?: boolean | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_characters_character_id_fkey"
            columns: ["character_id"]
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_characters_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_character_accessories: {
        Row: {
          id: string
          user_id: string
          accessory_id: string
          is_equipped: boolean | null
          unlocked_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          accessory_id: string
          is_equipped?: boolean | null
          unlocked_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          accessory_id?: string
          is_equipped?: boolean | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_character_accessories_accessory_id_fkey"
            columns: ["accessory_id"]
            referencedRelation: "character_accessories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_character_accessories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          total_points: number | null
          current_streak: number | null
          longest_streak: number | null
          last_entry_date: string | null
          level: number | null
          total_expenses_tracked: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          total_points?: number | null
          current_streak?: number | null
          longest_streak?: number | null
          last_entry_date?: string | null
          level?: number | null
          total_expenses_tracked?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          total_points?: number | null
          current_streak?: number | null
          longest_streak?: number | null
          last_entry_date?: string | null
          level?: number | null
          total_expenses_tracked?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      achievements: {
        Row: {
          id: string
          key: string
          name: string
          description: string | null
          icon: string | null
          points: number | null
          badge_color: string | null
          category: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          key: string
          name: string
          description?: string | null
          icon?: string | null
          points?: number | null
          badge_color?: string | null
          category?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          key?: string
          name?: string
          description?: string | null
          icon?: string | null
          points?: number | null
          badge_color?: string | null
          category?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string | null
          points_earned: number | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string | null
          points_earned?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string | null
          points_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          current_mood: string | null
          theme_preference: string | null
          animation_level: string | null
          notification_settings: Json | null
          privacy_settings: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          current_mood?: string | null
          theme_preference?: string | null
          animation_level?: string | null
          notification_settings?: Json | null
          privacy_settings?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          current_mood?: string | null
          theme_preference?: string | null
          animation_level?: string | null
          notification_settings?: Json | null
          privacy_settings?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      budget_goals: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          name: string
          target_amount: number
          period: 'daily' | 'weekly' | 'monthly' | 'yearly'
          start_date: string
          end_date: string
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          name: string
          target_amount: number
          period: 'daily' | 'weekly' | 'monthly' | 'yearly'
          start_date: string
          end_date: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          name?: string
          target_amount?: number
          period?: 'daily' | 'weekly' | 'monthly' | 'yearly'
          start_date?: string
          end_date?: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_goals_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_goals_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      challenges: {
        Row: {
          id: string
          name: string
          description: string | null
          challenge_type: string
          target_value: number | null
          reward_points: number | null
          start_date: string
          end_date: string
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          challenge_type: string
          target_value?: number | null
          reward_points?: number | null
          start_date: string
          end_date: string
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          challenge_type?: string
          target_value?: number | null
          reward_points?: number | null
          start_date?: string
          end_date?: string
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          progress: number | null
          completed: boolean | null
          completed_at: string | null
          points_earned: number | null
          joined_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          progress?: number | null
          completed?: boolean | null
          completed_at?: string | null
          points_earned?: number | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          progress?: number | null
          completed?: boolean | null
          completed_at?: string | null
          points_earned?: number | null
          joined_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          }
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}