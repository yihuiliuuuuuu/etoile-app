import type { ClassLogEntry } from '@/contexts/class-log-context';
import type { PracticeGoals, ClassGoals } from '@/contexts/goals-context';
import type { PracticeLogEntry } from '@/contexts/practice-log-context';
import type { Database } from '@/types/database';

type PracticeRow = Database['public']['Tables']['practice_entries']['Row'];
type ClassRow = Database['public']['Tables']['class_entries']['Row'];
type GoalsRow = Database['public']['Tables']['user_goals']['Row'];

export function practiceRowToEntry(row: PracticeRow): PracticeLogEntry {
  return {
    id: row.id,
    dateISO: row.date_iso,
    durationMinutes: row.duration_minutes,
    techniques: row.techniques ?? [],
    notes: row.notes ?? '',
    createdAtISO: row.created_at,
  };
}

export function practiceEntryToInsert(
  userId: string,
  entry: PracticeLogEntry,
): Database['public']['Tables']['practice_entries']['Insert'] {
  return {
    id: entry.id,
    user_id: userId,
    date_iso: entry.dateISO,
    duration_minutes: entry.durationMinutes,
    techniques: entry.techniques,
    notes: entry.notes,
    created_at: entry.createdAtISO,
    updated_at: new Date().toISOString(),
  };
}

export function classRowToEntry(row: ClassRow): ClassLogEntry {
  return {
    id: row.id,
    dateTimeISO: row.date_time_iso,
    school: row.school,
    techniques: row.techniques ?? [],
    createdAtISO: row.created_at,
    updatedAtISO: row.updated_at,
  };
}

export function classEntryToInsert(
  userId: string,
  entry: ClassLogEntry,
): Database['public']['Tables']['class_entries']['Insert'] {
  return {
    id: entry.id,
    user_id: userId,
    date_time_iso: entry.dateTimeISO,
    school: entry.school,
    techniques: entry.techniques,
    created_at: entry.createdAtISO,
    updated_at: entry.updatedAtISO,
  };
}

export function goalsRowToState(row: GoalsRow): {
  practice: PracticeGoals;
  classes: ClassGoals;
} {
  return {
    practice: {
      cycle: row.practice_cycle,
      targetHours: Number(row.practice_target_hours),
    },
    classes: {
      cycle: row.class_cycle,
      targetClasses: row.class_target_classes,
    },
  };
}

export function goalsStateToUpsert(
  userId: string,
  practice: PracticeGoals,
  classes: ClassGoals,
): Database['public']['Tables']['user_goals']['Insert'] {
  return {
    user_id: userId,
    practice_cycle: practice.cycle,
    practice_target_hours: practice.targetHours,
    class_cycle: classes.cycle,
    class_target_classes: classes.targetClasses,
    updated_at: new Date().toISOString(),
  };
}
