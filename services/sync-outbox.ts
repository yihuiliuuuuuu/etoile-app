import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ClassLogEntry } from '@/contexts/class-log-context';
import type { PracticeLogEntry } from '@/contexts/practice-log-context';
import { upsertClassEntries } from '@/services/class-log-api';
import { upsertPracticeEntries } from '@/services/practice-log-api';

const OUTBOX_KEY = 'etoile_sync_outbox_v1';

type ClassUpsertOp = { op: 'class_upsert'; userId: string; entry: ClassLogEntry };
type PracticeUpsertOp = { op: 'practice_upsert'; userId: string; entry: PracticeLogEntry };

type OutboxOp = ClassUpsertOp | PracticeUpsertOp;

async function readOutbox(): Promise<OutboxOp[]> {
  try {
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as OutboxOp[]) : [];
  } catch {
    return [];
  }
}

async function writeOutbox(ops: OutboxOp[]): Promise<void> {
  if (ops.length === 0) {
    await AsyncStorage.removeItem(OUTBOX_KEY);
    return;
  }
  await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(ops));
}

export async function enqueueClassUpsert(userId: string, entry: ClassLogEntry): Promise<void> {
  const ops = await readOutbox();
  const without = ops.filter(
    (o) => !(o.op === 'class_upsert' && o.userId === userId && o.entry.id === entry.id),
  );
  without.push({ op: 'class_upsert', userId, entry });
  await writeOutbox(without);
}

export async function enqueuePracticeUpsert(userId: string, entry: PracticeLogEntry): Promise<void> {
  const ops = await readOutbox();
  const without = ops.filter(
    (o) =>
      !(o.op === 'practice_upsert' && o.userId === userId && o.entry.id === entry.id),
  );
  without.push({ op: 'practice_upsert', userId, entry });
  await writeOutbox(without);
}

/** Push queued writes after sign-in or when a prior cloud save failed. */
export async function flushSyncOutbox(userId: string): Promise<void> {
  const ops = await readOutbox();
  const mine = ops.filter((o) => o.userId === userId);
  if (mine.length === 0) return;

  const remaining = ops.filter((o) => o.userId !== userId);
  const classEntries: ClassLogEntry[] = [];
  const practiceEntries: PracticeLogEntry[] = [];

  for (const item of mine) {
    if (item.op === 'class_upsert') classEntries.push(item.entry);
    if (item.op === 'practice_upsert') practiceEntries.push(item.entry);
  }

  if (classEntries.length > 0) {
    await upsertClassEntries(userId, classEntries);
  }
  if (practiceEntries.length > 0) {
    await upsertPracticeEntries(userId, practiceEntries);
  }

  await writeOutbox(remaining);
}

export async function clearSyncOutbox(): Promise<void> {
  await AsyncStorage.removeItem(OUTBOX_KEY);
}
