import type { PracticeLogEntry } from '@/contexts/practice-log-context';
import { getSupabase } from '@/lib/supabase';
import {
  practiceEntryToInsert,
  practiceRowToEntry,
} from '@/services/data-mappers';

export async function fetchPracticeEntries(userId: string): Promise<PracticeLogEntry[]> {
  const { data, error } = await getSupabase()
    .from('practice_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date_iso', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(practiceRowToEntry);
}

export async function insertPracticeEntry(
  userId: string,
  entry: PracticeLogEntry,
): Promise<void> {
  const { error } = await getSupabase()
    .from('practice_entries')
    .insert(practiceEntryToInsert(userId, entry));
  if (error) throw error;
}

export async function updatePracticeEntry(
  userId: string,
  entry: PracticeLogEntry,
): Promise<void> {
  const { error } = await getSupabase()
    .from('practice_entries')
    .update({
      date_iso: entry.dateISO,
      duration_minutes: entry.durationMinutes,
      techniques: entry.techniques,
      notes: entry.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', entry.id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function deletePracticeEntry(userId: string, id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('practice_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function upsertPracticeEntries(
  userId: string,
  entries: PracticeLogEntry[],
): Promise<void> {
  if (entries.length === 0) return;
  const { error } = await getSupabase()
    .from('practice_entries')
    .upsert(entries.map((e) => practiceEntryToInsert(userId, e)));
  if (error) throw error;
}
