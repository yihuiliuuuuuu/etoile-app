import { isSupabaseConfigured } from '@/lib/env';
import { isAvatarsBucketMissingError, isSchemaMissingError } from '@/lib/supabase-errors';
import { getSupabaseOrNull } from '@/lib/supabase';

const REQUIRED_TABLES = [
  'profiles',
  'class_entries',
  'practice_entries',
  'user_goals',
] as const;

export type SupabaseHealth = {
  envConfigured: boolean;
  schemaReady: boolean;
  avatarsBucketReady: boolean;
  missingTables: string[];
};

export function getSchemaSetupMessage(missingTables: string[]): string {
  const list = missingTables.length > 0 ? missingTables.join(', ') : 'database tables';
  return `Missing Supabase tables (${list}). In the Supabase Dashboard open SQL → New query, paste the full contents of supabase/schema.sql from this project, and run it. Then create a public Storage bucket named avatars.`;
}

/** Probes API so we can warn before cloud save/restore silently fails. */
export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  if (!isSupabaseConfigured()) {
    return {
      envConfigured: false,
      schemaReady: false,
      avatarsBucketReady: false,
      missingTables: [...REQUIRED_TABLES],
    };
  }

  const supabase = getSupabaseOrNull();
  if (!supabase) {
    return {
      envConfigured: false,
      schemaReady: false,
      avatarsBucketReady: false,
      missingTables: [...REQUIRED_TABLES],
    };
  }

  const missingTables: string[] = [];

  await Promise.all(
    REQUIRED_TABLES.map(async (table) => {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (error && isSchemaMissingError(error)) {
        missingTables.push(table);
      }
    }),
  );

  const { error: bucketError } = await supabase.storage.from('avatars').list('', { limit: 1 });
  const avatarsBucketReady = !bucketError || !isAvatarsBucketMissingError(bucketError);

  return {
    envConfigured: true,
    schemaReady: missingTables.length === 0,
    avatarsBucketReady,
    missingTables,
  };
}
