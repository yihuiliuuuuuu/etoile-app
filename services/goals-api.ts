import type { PracticeGoals, ClassGoals } from '@/contexts/goals-context';
import { getSupabase } from '@/lib/supabase';
import { goalsRowToState, goalsStateToUpsert } from '@/services/data-mappers';

export async function fetchUserGoals(
  userId: string,
): Promise<{ practice: PracticeGoals; classes: ClassGoals } | null> {
  const { data, error } = await getSupabase()
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return goalsRowToState(data);
}

export async function upsertUserGoals(
  userId: string,
  practice: PracticeGoals,
  classes: ClassGoals,
): Promise<void> {
  const { error } = await getSupabase()
    .from('user_goals')
    .upsert(goalsStateToUpsert(userId, practice, classes));
  if (error) throw error;
}
