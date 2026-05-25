import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/env';
import type { Database } from '@/types/database';

let client: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env',
    );
  }
  if (!client) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}

/** Safe accessor when env vars may be missing (offline / local-only mode). */
export function getSupabaseOrNull(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;
  return getSupabase();
}
