export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type HabitFrequency = 'daily' | 'weekly' | 'specific_days' | 'custom'

export interface FrequencyConfig {
  days?: number[] // [0-6] for specific days (0=Sunday)
  times_per_week?: number
  times_per_day?: number
  custom_schedule?: string
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          date_of_birth: string | null
          gender: string | null
          timezone: string
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          date_of_birth?: string | null
          gender?: string | null
          timezone?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          date_of_birth?: string | null
          gender?: string | null
          timezone?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          frequency_type: HabitFrequency
          frequency_config: FrequencyConfig
          color: string
          icon: string
          target_duration: number | null
          reminder_time: string[] | null
          timezone: string
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          frequency_type: HabitFrequency
          frequency_config: FrequencyConfig
          color?: string
          icon?: string
          target_duration?: number | null
          reminder_time?: string[] | null
          timezone?: string
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          frequency_type?: HabitFrequency
          frequency_config?: FrequencyConfig
          color?: string
          icon?: string
          target_duration?: number | null
          reminder_time?: string[] | null
          timezone?: string
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completed_at: string
          completed_date: string
          duration: number | null
          notes: string | null
          mood_score: number | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completed_at?: string
          completed_date: string
          duration?: number | null
          notes?: string | null
          mood_score?: number | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completed_at?: string
          completed_date?: string
          duration?: number | null
          notes?: string | null
          mood_score?: number | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      user_streaks: {
        Row: {
          habit_id: string
          user_id: string
          current_streak: number
          streak_start: string
          last_completed: string
        }
      }
    }
    Functions: {
      get_current_streak: {
        Args: { p_habit_id: string }
        Returns: number
      }
      get_completion_rate: {
        Args: { p_habit_id: string; days?: number }
        Returns: number
      }
    }
  }
}
