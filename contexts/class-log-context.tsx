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
  deleteClassEntry as deleteClassEntryRemote,
  fetchClassEntries,
  upsertClassEntries,
  updateClassEntry as updateClassEntryRemote,
} from '@/services/class-log-api';
import { enqueueClassUpsert } from '@/services/sync-outbox';

const STORAGE_KEY = 'etoile_class_log_v1';

export type ClassLogEntry = {
  id: string;
  dateTimeISO: string;
  school: string;
  techniques: string[];
  createdAtISO: string;
  updatedAtISO: string;
};

type ClassLogContextValue = {
  entries: ClassLogEntry[];
  loaded: boolean;
  isEditorVisible: boolean;
  editingEntry: ClassLogEntry | null;
  openCreate: () => void;
  openEdit: (id: string) => void;
  closeEditor: () => void;
  addEntry: (entry: Omit<ClassLogEntry, 'id' | 'createdAtISO' | 'updatedAtISO'>) => Promise<void>;
  updateEntry: (
    id: string,
    patch: Omit<ClassLogEntry, 'id' | 'createdAtISO' | 'updatedAtISO'>,
  ) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
};

const ClassLogContext = createContext<ClassLogContextValue | null>(null);

async function persistLocal(entries: ClassLogEntry[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function ClassLogProvider({ children }: { children: ReactNode }) {
  const { userId, syncVersion, syncedData } = useAuth();
  const [entries, setEntries] = useState<ClassLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ClassLogEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          setEntries(Array.isArray(parsed) ? (parsed as ClassLogEntry[]) : []);
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
        if (syncedData?.classes) {
          setEntries(syncedData.classes);
          await persistLocal(syncedData.classes);
          return;
        }
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          setEntries(Array.isArray(parsed) ? (parsed as ClassLogEntry[]) : []);
          return;
        }
        if (isSupabaseConfigured()) {
          const remote = await fetchClassEntries(userId);
          if (cancelled) return;
          setEntries(remote);
          await persistLocal(remote);
        }
      } catch (err) {
        console.warn('[class-log] reload after sync failed', err);
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
    async (partial: Omit<ClassLogEntry, 'id' | 'createdAtISO' | 'updatedAtISO'>) => {
      const now = new Date().toISOString();
      const item: ClassLogEntry = {
        ...partial,
        id: createId(),
        createdAtISO: now,
        updatedAtISO: now,
      };

      setEntries((prev) => {
        const next = [item, ...prev];
        void persistLocal(next);
        return next;
      });

      const uid = await getSyncUserId();
      if (uid) {
        try {
          await upsertClassEntries(uid, [item]);
        } catch (err) {
          const hint =
            typeof err === 'object' &&
            err !== null &&
            'code' in err &&
            (err as { code?: string }).code === 'PGRST205'
              ? ' — run supabase/schema.sql in Supabase SQL Editor'
              : '';
          console.warn('[class-log] cloud save failed' + hint, err);
          await enqueueClassUpsert(uid, item).catch(() => {});
        }
      }
    },
    [],
  );

  const updateEntry = useCallback(
    async (id: string, patch: Omit<ClassLogEntry, 'id' | 'createdAtISO' | 'updatedAtISO'>) => {
      const now = new Date().toISOString();
      let updated: ClassLogEntry | null = null;

      setEntries((prev) => {
        const next = prev.map((e) => {
          if (e.id !== id) return e;
          updated = { ...e, ...patch, updatedAtISO: now };
          return updated;
        });
        void persistLocal(next);
        return next;
      });

      if (updated) {
        const uid = await getSyncUserId();
        if (uid) {
          try {
            await updateClassEntryRemote(uid, updated);
          } catch (err) {
            console.warn('[class-log] cloud update failed', err);
            await enqueueClassUpsert(uid, updated).catch(() => {});
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
          await deleteClassEntryRemote(uid, id);
        } catch (err) {
          console.warn('[class-log] cloud delete failed', err);
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

  return <ClassLogContext.Provider value={value}>{children}</ClassLogContext.Provider>;
}

export function useClassLog() {
  const ctx = useContext(ClassLogContext);
  if (!ctx) {
    throw new Error('useClassLog must be used within ClassLogProvider');
  }
  return ctx;
}
