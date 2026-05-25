import { getSupabase } from '@/lib/supabase';

export async function fetchUserSchools(userId: string): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from('user_schools')
    .select('name')
    .eq('user_id', userId)
    .order('name');

  if (error) throw error;
  return (data ?? []).map((row) => row.name);
}

export async function insertUserSchool(userId: string, name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) return;

  const { error } = await getSupabase()
    .from('user_schools')
    .insert({ user_id: userId, name: trimmed });

  if (error && error.code !== '23505') {
    throw error;
  }
}
