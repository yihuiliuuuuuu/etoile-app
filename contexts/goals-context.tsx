import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '@/contexts/auth-context';
import { getSyncUserId } from '@/lib/get-sync-user-id';
import { isSupabaseConfigured } from '@/lib/env';
import { fetchUserGoals, upsertUserGoals } from '@/services/goals-api';

const STORAGE_KEY = 'etoile_goals_v1';

export const GOAL_CYCLES = ['weekly', 'monthly', 'yearly'] as const;
export type GoalCycle = (typeof GOAL_CYCLES)[number];

export type PracticeGoals = {
  cycle: GoalCycle;
  targetHours: number;
};

export type ClassGoals = {
  cycle: GoalCycle;
  targetClasses: number;
};

const DEFAULT_PRACTICE_GOALS: PracticeGoals = {
  cycle: 'yearly',
  targetHours: 400,
};

const DEFAULT_CLASS_GOALS: ClassGoals = {
  cycle: 'yearly',
  targetClasses: 100,
};

type GoalsContextValue = {
  loaded: boolean;
  practiceGoals: PracticeGoals;
  classGoals: ClassGoals;
  setPracticeGoals: (goals: PracticeGoals) => void;
  setClassGoals: (goals: ClassGoals) => void;
};

const GoalsContext = createContext<GoalsContextValue | null>(null);

type StoredGoals = {
  practice?: PracticeGoals;
  classes?: ClassGoals;
};

async function persistLocal(practice: PracticeGoals, classes: ClassGoals) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ practice, classes }));
}

export function GoalsProvider({ children }: { children: ReactNode }) {
  const { userId, syncVersion, syncedData } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [practiceGoals, setPracticeGoalsState] = useState<PracticeGoals>(DEFAULT_PRACTICE_GOALS);
  const [classGoals, setClassGoalsState] = useState<ClassGoals>(DEFAULT_CLASS_GOALS);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as StoredGoals;
          if (parsed.practice) setPracticeGoalsState(parsed.practice);
          if (parsed.classes) setClassGoalsState(parsed.classes);
        }
      } catch {
        /* keep defaults */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!userId || syncVersion === 0) return;
    let cancelled = false;
    void (async () => {
      try {
        if (syncedData?.practiceGoals && syncedData?.classGoals) {
          setPracticeGoalsState(syncedData.practiceGoals);
          setClassGoalsState(syncedData.classGoals);
          await persistLocal(syncedData.practiceGoals, syncedData.classGoals);
          return;
        }
        if (isSupabaseConfigured()) {
          const remote = await fetchUserGoals(userId);
          if (cancelled) return;
          if (remote) {
            setPracticeGoalsState(remote.practice);
            setClassGoalsState(remote.classes);
            await persistLocal(remote.practice, remote.classes);
            return;
          }
        }
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as StoredGoals;
          if (parsed.practice) setPracticeGoalsState(parsed.practice);
          if (parsed.classes) setClassGoalsState(parsed.classes);
        }
      } catch (err) {
        console.warn('[goals] reload after sync failed', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, syncVersion, syncedData]);

  const syncRemote = useCallback((practice: PracticeGoals, classes: ClassGoals) => {
    void (async () => {
      const uid = await getSyncUserId();
      if (!uid) return;
      try {
        await upsertUserGoals(uid, practice, classes);
      } catch (err) {
        console.warn('[goals] cloud save failed', err);
      }
    })();
  }, []);

  const setPracticeGoals = useCallback(
    (goals: PracticeGoals) => {
      setPracticeGoalsState(goals);
      setClassGoalsState((classes) => {
        void persistLocal(goals, classes);
        syncRemote(goals, classes);
        return classes;
      });
    },
    [syncRemote],
  );

  const setClassGoals = useCallback(
    (goals: ClassGoals) => {
      setClassGoalsState(goals);
      setPracticeGoalsState((practice) => {
        void persistLocal(practice, goals);
        syncRemote(practice, goals);
        return practice;
      });
    },
    [syncRemote],
  );

  const value = useMemo(
    () => ({
      loaded,
      practiceGoals,
      classGoals,
      setPracticeGoals,
      setClassGoals,
    }),
    [loaded, practiceGoals, classGoals, setPracticeGoals, setClassGoals],
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals() {
  const ctx = useContext(GoalsContext);
  if (!ctx) {
    throw new Error('useGoals must be used within GoalsProvider');
  }
  return ctx;
}

export function cycleLabel(c: GoalCycle) {
  return c.charAt(0).toUpperCase() + c.slice(1);
}
