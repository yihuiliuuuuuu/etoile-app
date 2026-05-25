import type { ClassLogEntry } from '@/contexts/class-log-context';
import type { ClassGoals, PracticeGoals } from '@/contexts/goals-context';
import type { PracticeLogEntry } from '@/contexts/practice-log-context';

/** Result of syncAllUserData, passed to log providers after sign-in. */
export type SyncedUserData = {
  classes: ClassLogEntry[];
  practice: PracticeLogEntry[];
  practiceGoals: PracticeGoals | null;
  classGoals: ClassGoals | null;
};
