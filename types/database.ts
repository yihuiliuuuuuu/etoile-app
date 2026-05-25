export type GoalCycle = 'weekly' | 'monthly' | 'yearly';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          avatar_url: string | null;
          sign_up_prompt_shown: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          avatar_url?: string | null;
          sign_up_prompt_shown?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          avatar_url?: string | null;
          sign_up_prompt_shown?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      practice_entries: {
        Row: {
          id: string;
          user_id: string;
          date_iso: string;
          duration_minutes: number;
          techniques: string[];
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date_iso: string;
          duration_minutes: number;
          techniques?: string[];
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          date_iso?: string;
          duration_minutes?: number;
          techniques?: string[];
          notes?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      class_entries: {
        Row: {
          id: string;
          user_id: string;
          date_time_iso: string;
          school: string;
          techniques: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date_time_iso: string;
          school: string;
          techniques?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          date_time_iso?: string;
          school?: string;
          techniques?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      user_goals: {
        Row: {
          user_id: string;
          practice_cycle: GoalCycle;
          practice_target_hours: number;
          class_cycle: GoalCycle;
          class_target_classes: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          practice_cycle: GoalCycle;
          practice_target_hours: number;
          class_cycle: GoalCycle;
          class_target_classes: number;
          updated_at?: string;
        };
        Update: {
          practice_cycle?: GoalCycle;
          practice_target_hours?: number;
          class_cycle?: GoalCycle;
          class_target_classes?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_schools: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
