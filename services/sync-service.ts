import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ClassLogEntry } from '@/contexts/class-log-context';
import type { PracticeGoals, ClassGoals } from '@/contexts/goals-context';
import type { PracticeLogEntry } from '@/contexts/practice-log-context';
import type { SyncedUserData } from '@/types/synced-user-data';
import { isSupabaseConfigured } from '@/lib/env';
import { createId } from '@/lib/id';
import { getSupabaseOrNull } from '@/lib/supabase';
import { upsertClassEntries, fetchClassEntries } from '@/services/class-log-api';
import { upsertUserGoals, fetchUserGoals } from '@/services/goals-api';
import { fetchUserSchools } from '@/services/schools-api';
import { flushSyncOutbox } from '@/services/sync-outbox';
import {
  upsertPracticeEntries,
  fetchPracticeEntries,
} from '@/services/practice-log-api';

const PRACTICE_KEY = 'etoile_practice_log_v1';
const CLASS_KEY = 'etoile_class_log_v1';
const GOALS_KEY = 'etoile_goals_v1';
const SCHOOLS_KEY = 'etoile_class_schools_v1';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function withValidUuid<T extends { id: string }>(entry: T): T {
  if (UUID_RE.test(entry.id)) return entry;
  return { ...entry, id: createId() };
}

/** Keep local rows created while sync was in flight (not yet on server). */
function mergeLocalOnly<T extends { id: string }>(remote: T[], local: T[]): T[] {
  const remoteIds = new Set(remote.map((e) => e.id));
  const onlyLocal = local.filter((e) => !remoteIds.has(e.id));
  if (onlyLocal.length === 0) return remote;
  return [...onlyLocal, ...remote];
}

function localOnlyEntries<T extends { id: string }>(remote: T[], local: T[]): T[] {
  const remoteIds = new Set(remote.map((e) => e.id));
  return local.filter((e) => !remoteIds.has(e.id)).map(withValidUuid);
}

type StoredGoals = {
  practice?: PracticeGoals;
  classes?: ClassGoals;
};

async function readLocalPractice(): Promise<PracticeLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(PRACTICE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as PracticeLogEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeLocalPractice(entries: PracticeLogEntry[]): Promise<void> {
  await AsyncStorage.setItem(PRACTICE_KEY, JSON.stringify(entries));
}

async function readLocalClasses(): Promise<ClassLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(CLASS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as ClassLogEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeLocalClasses(entries: ClassLogEntry[]): Promise<void> {
  await AsyncStorage.setItem(CLASS_KEY, JSON.stringify(entries));
}

async function readLocalGoals(): Promise<StoredGoals | null> {
  try {
    const raw = await AsyncStorage.getItem(GOALS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredGoals;
  } catch {
    return null;
  }
}

async function writeLocalGoals(practice: PracticeGoals, classes: ClassGoals): Promise<void> {
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify({ practice, classes }));
}

async function ensureAuthSession(userId: string): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session?.user?.id) {
    throw new Error('No active session — sign in again to sync your data.');
  }
  if (data.session.user.id !== userId) {
    throw new Error('Session user mismatch — sign out and sign in again.');
  }
}

/** Merge local device data with cloud after sign-in. Returns synced local caches. */
export async function syncAllUserData(userId: string): Promise<SyncedUserData> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  await ensureAuthSession(userId);
  await flushSyncOutbox(userId);

  const [localPractice, localClasses, localGoals] = await Promise.all([
    readLocalPractice(),
    readLocalClasses(),
    readLocalGoals(),
  ]);

  const [remotePractice, remoteClasses, remoteGoals] = await Promise.all([
    fetchPracticeEntries(userId),
    fetchClassEntries(userId),
    fetchUserGoals(userId),
  ]);

  const practiceToUpload = localOnlyEntries(remotePractice, localPractice);
  if (practiceToUpload.length > 0) {
    await upsertPracticeEntries(userId, practiceToUpload);
  }
  let practice = mergeLocalOnly(
    [...practiceToUpload, ...remotePractice],
    await readLocalPractice(),
  );
  await writeLocalPractice(practice);

  const classesToUpload = localOnlyEntries(remoteClasses, localClasses);
  if (classesToUpload.length > 0) {
    await upsertClassEntries(userId, classesToUpload);
  }
  let classes = mergeLocalOnly([...classesToUpload, ...remoteClasses], await readLocalClasses());
  await writeLocalClasses(classes);

  let practiceGoals = remoteGoals?.practice ?? localGoals?.practice ?? null;
  let classGoals = remoteGoals?.classes ?? localGoals?.classes ?? null;

  if (!remoteGoals && localGoals?.practice && localGoals?.classes) {
    await upsertUserGoals(userId, localGoals.practice, localGoals.classes);
    practiceGoals = localGoals.practice;
    classGoals = localGoals.classes;
  } else if (remoteGoals) {
    await writeLocalGoals(remoteGoals.practice, remoteGoals.classes);
    practiceGoals = remoteGoals.practice;
    classGoals = remoteGoals.classes;
  }

  try {
    const raw = await AsyncStorage.getItem(SCHOOLS_KEY);
    const localSchools: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    const remoteSchools = await fetchUserSchools(userId).catch(() => [] as string[]);
    const mergedSchools = [...new Set([...remoteSchools, ...localSchools])].filter(Boolean);
    if (mergedSchools.length > 0) {
      await AsyncStorage.setItem(SCHOOLS_KEY, JSON.stringify(mergedSchools));
    }
    const remoteSet = new Set(remoteSchools);
    const toInsert = localSchools
      .filter((name) => name.trim() && !remoteSet.has(name.trim()))
      .map((name) => name.trim());
    for (const name of toInsert) {
      const { insertUserSchool } = await import('@/services/schools-api');
      await insertUserSchool(userId, name).catch(() => {});
    }
  } catch {
    // non-fatal
  }

  return {
    practice,
    classes,
    practiceGoals,
    classGoals,
  };
}
