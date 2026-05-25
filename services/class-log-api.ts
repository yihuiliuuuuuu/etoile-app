import type { ClassLogEntry } from '@/contexts/class-log-context';
import { getSupabase } from '@/lib/supabase';
import { classEntryToInsert, classRowToEntry } from '@/services/data-mappers';

export async function fetchClassEntries(userId: string): Promise<ClassLogEntry[]> {
  const { data, error } = await getSupabase()
    .from('class_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date_time_iso', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(classRowToEntry);
}

export async function insertClassEntry(userId: string, entry: ClassLogEntry): Promise<void> {
  const { error } = await getSupabase().from('class_entries').insert(classEntryToInsert(userId, entry));
  if (error) throw error;
}

export async function updateClassEntry(userId: string, entry: ClassLogEntry): Promise<void> {
  const { error } = await getSupabase()
    .from('class_entries')
    .update({
      date_time_iso: entry.dateTimeISO,
      school: entry.school,
      techniques: entry.techniques,
      updated_at: entry.updatedAtISO,
    })
    .eq('id', entry.id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function deleteClassEntry(userId: string, id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('class_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function upsertClassEntries(userId: string, entries: ClassLogEntry[]): Promise<void> {
  if (entries.length === 0) return;
  const { error } = await getSupabase()
    .from('class_entries')
    .upsert(entries.map((e) => classEntryToInsert(userId, e)));
  if (error) throw error;
}
