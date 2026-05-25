import AsyncStorage from '@react-native-async-storage/async-storage';

import { getSupabaseOrNull } from '@/lib/supabase';
import { clearAuthSnapshot } from '@/utils/auth-storage';
import { clearOnboardingCompleted } from '@/utils/onboarding-storage';
import { clearSyncOutbox } from '@/services/sync-outbox';
import { clearPersistedAvatar } from '@/utils/profile-avatar';

const DATA_KEYS = [
  'etoile_practice_log_v1',
  'etoile_class_log_v1',
  'etoile_goals_v1',
  'etoile_class_schools_v1',
] as const;

/**
 * Clears onboarding, auth, logs, and cloud session so you can replay:
 * onboarding → empty tabs → sign-up prompt after first log.
 */
export async function resetAppToFreshExperience(): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (supabase) {
    await supabase.auth.signOut();
  }

  await Promise.all([
    clearOnboardingCompleted(),
    clearAuthSnapshot(),
    clearPersistedAvatar(),
    clearSyncOutbox(),
    ...DATA_KEYS.map((key) => AsyncStorage.removeItem(key)),
  ]);
}
