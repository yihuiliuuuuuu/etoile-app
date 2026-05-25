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
import { createId } from '@/lib/id';
import { isSupabaseConfigured } from '@/lib/env';
import {
  deletePracticeEntry as deletePracticeEntryRemote,
  fetchPracticeEntries,
  upsertPracticeEntries,
  updatePracticeEntry as updatePracticeEntryRemote,
} from '@/services/practice-log-api';
import { enqueuePracticeUpsert } from '@/services/sync-outbox';

const STORAGE_KEY = 'etoile_practice_log_v1';

export type PracticeLogEntry = {
  id: string;
  dateISO: string;
  durationMinutes: number;
  techniques: string[];
  notes: string;
  createdAtISO: string;
};

type PracticeLogContextValue = {
  entries: PracticeLogEntry[];
  loaded: boolean;
  isEditorVisible: boolean;
  editingEntry: PracticeLogEntry | null;
  openCreate: () => void;
  openEdit: (id: string) => void;
  closeEditor: () => void;
  addEntry: (entry: Omit<PracticeLogEntry, 'id' | 'createdAtISO'>) => Promise<void>;
  updateEntry: (
    id: string,
    patch: Omit<PracticeLogEntry, 'id' | 'createdAtISO'>,
  ) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
};

const PracticeLogContext = createContext<PracticeLogContextValue | null>(null);

async function persistLocal(entries: PracticeLogEntry[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function PracticeLogProvider({ children }: { children: ReactNode }) {
  const { userId, syncVersion, syncedData } = useAuth();
  const [entries, setEntries] = useState<PracticeLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PracticeLogEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          setEntries(Array.isArray(parsed) ? (parsed as PracticeLogEntry[]) : []);
        }
      } catch {
        if (!cancelled) setEntries([]);
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
        if (syncedData?.practice) {
          setEntries(syncedData.practice);
          await persistLocal(syncedData.practice);
          return;
        }
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          setEntries(Array.isArray(parsed) ? (parsed as PracticeLogEntry[]) : []);
          return;
        }
        if (isSupabaseConfigured()) {
          const remote = await fetchPracticeEntries(userId);
          if (cancelled) return;
          setEntries(remote);
          await persistLocal(remote);
        }
      } catch (err) {
        console.warn('[practice-log] reload after sync failed', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, syncVersion, syncedData]);

  const openCreate = useCallback(() => {
    setEditingEntry(null);
    setIsEditorVisible(true);
  }, []);

  const openEdit = useCallback(
    (id: string) => {
      const entry = entries.find((e) => e.id === id) ?? null;
      if (!entry) return;
      setEditingEntry(entry);
      setIsEditorVisible(true);
    },
    [entries],
  );

  const closeEditor = useCallback(() => {
    setIsEditorVisible(false);
    setEditingEntry(null);
  }, []);

  const addEntry = useCallback(
    async (partial: Omit<PracticeLogEntry, 'id' | 'createdAtISO'>) => {
      const item: PracticeLogEntry = {
        ...partial,
        id: createId(),
        createdAtISO: new Date().toISOString(),
      };

      setEntries((prev) => {
        const next = [item, ...prev];
        void persistLocal(next);
        return next;
      });

      const uid = await getSyncUserId();
      if (uid) {
        try {
          await upsertPracticeEntries(uid, [item]);
        } catch (err) {
          console.warn('[practice-log] cloud save failed', err);
          await enqueuePracticeUpsert(uid, item).catch(() => {});
        }
      }
    },
    [],
  );

  const updateEntry = useCallback(
    async (id: string, patch: Omit<PracticeLogEntry, 'id' | 'createdAtISO'>) => {
      let updated: PracticeLogEntry | null = null;

      setEntries((prev) => {
        const next = prev.map((e) => {
          if (e.id !== id) return e;
          updated = { ...e, ...patch };
          return updated;
        });
        void persistLocal(next);
        return next;
      });

      if (updated) {
        const uid = await getSyncUserId();
        if (uid) {
          try {
            await updatePracticeEntryRemote(uid, updated);
          } catch (err) {
            console.warn('[practice-log] cloud update failed', err);
            await enqueuePracticeUpsert(uid, updated).catch(() => {});
          }
        }
      }
    },
    [],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      setEntries((prev) => {
        const next = prev.filter((e) => e.id !== id);
        void persistLocal(next);
        return next;
      });

      const uid = await getSyncUserId();
      if (uid) {
        try {
          await deletePracticeEntryRemote(uid, id);
        } catch (err) {
          console.warn('[practice-log] cloud delete failed', err);
        }
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      entries,
      loaded,
      isEditorVisible,
      editingEntry,
      openCreate,
      openEdit,
      closeEditor,
      addEntry,
      updateEntry,
      deleteEntry,
    }),
    [
      entries,
      loaded,
      isEditorVisible,
      editingEntry,
      openCreate,
      openEdit,
      closeEditor,
      addEntry,
      updateEntry,
      deleteEntry,
    ],
  );

  return <PracticeLogContext.Provider value={value}>{children}</PracticeLogContext.Provider>;
}

export function usePracticeLog() {
  const ctx = useContext(PracticeLogContext);
  if (!ctx) {
    throw new Error('usePracticeLog must be used within PracticeLogProvider');
  }
  return ctx;
}
