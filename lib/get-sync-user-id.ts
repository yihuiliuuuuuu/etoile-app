import { isSupabaseConfigured } from '@/lib/env';
import { getSupabaseOrNull } from '@/lib/supabase';

/** Active Supabase user id from the auth session (not React state). */
export async function getSyncUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('[auth] getSession failed:', error.message);
    return null;
  }
  return data.session?.user?.id ?? null;
}
