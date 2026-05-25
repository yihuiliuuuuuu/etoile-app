import { letterTight, sfPro, weightSemibold } from '@/constants/typography';
import type { PracticeLogEntry } from '@/contexts/practice-log-context';
import { usePracticeLog } from '@/contexts/practice-log-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type View as RNView,
} from 'react-native';

const MENU_WIDTH = 148;
const { width: SCREEN_W } = Dimensions.get('window');

function weekGroupKey(d: Date) {
  const day = d.getDate();
  const week = Math.ceil(day / 7);
  return `${d.getFullYear()}-${d.getMonth()}-${week}`;
}

function weekGroupLabel(d: Date) {
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const day = d.getDate();
  const week = Math.ceil(day / 7);
  return `${month} week ${week}`;
}

function formatEntryDayLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

type WeekGroup = {
  key: string;
  label: string;
  entries: PracticeLogEntry[];
  order: number;
};

function buildWeekGroups(entries: PracticeLogEntry[]): WeekGroup[] {
  const map = new Map<string, { label: string; entries: PracticeLogEntry[] }>();
  for (const e of entries) {
    const d = new Date(e.dateISO);
    const key = weekGroupKey(d);
    const label = weekGroupLabel(d);
    if (!map.has(key)) {
      map.set(key, { label, entries: [] });
    }
    map.get(key)!.entries.push(e);
  }
  for (const g of map.values()) {
    g.entries.sort((a, b) => {
      const da = new Date(a.dateISO).getTime();
      const db = new Date(b.dateISO).getTime();
      if (db !== da) return db - da;
      return b.createdAtISO.localeCompare(a.createdAtISO);
    });
  }
  const groups: WeekGroup[] = [...map.entries()].map(([key, v]) => ({
    key,
    label: v.label,
    entries: v.entries,
    order: Math.max(...v.entries.map((e) => new Date(e.dateISO).getTime())),
  }));
  groups.sort((a, b) => b.order - a.order);
  return groups;
}

type MenuAnchor = { top: number; left: number };

function LogCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: PracticeLogEntry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const menuBtnRef = useRef<RNView>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor>({ top: 0, left: 0 });

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const openMenu = useCallback(() => {
    menuBtnRef.current?.measureInWindow((x, y, width, height) => {
      const left = Math.min(Math.max(8, x + width - MENU_WIDTH), SCREEN_W - MENU_WIDTH - 8);
      setMenuAnchor({ top: y + height + 6, left });
      setMenuOpen(true);
    });
  }, []);

  const handleEdit = useCallback(() => {
    closeMenu();
    onEdit(entry.id);
  }, [closeMenu, entry.id, onEdit]);

  const handleDelete = useCallback(() => {
    closeMenu();
    Alert.alert('Remove this entry?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => void onDelete(entry.id) },
    ]);
  }, [closeMenu, entry.id, onDelete]);

  return (
    <>
      <View style={styles.logCard}>
        <Image
          source={require('@/assets/goals-hero.png')}
          style={styles.logAvatar}
          contentFit="cover"
          accessibilityLabel="Practice"
        />
        <View style={styles.logBody}>
          <Text style={styles.logDate}>{formatEntryDayLabel(entry.dateISO)}</Text>
          <Text style={styles.logDuration}>{formatDuration(entry.durationMinutes)}</Text>
          {entry.techniques.length > 0 ? (
            <View style={styles.chipRow}>
              {entry.techniques.map((t) => (
                <View key={t} style={styles.logChip}>
                  <Text style={styles.logChipText}>{t}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
        <View ref={menuBtnRef} collapsable={false}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Practice options"
            accessibilityState={{ expanded: menuOpen }}
            onPress={openMenu}
            style={({ pressed }) => [styles.menuBtn, pressed && styles.pressed]}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#888" />
          </Pressable>
        </View>
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={closeMenu}>
        <Pressable style={styles.menuBackdrop} onPress={closeMenu} accessibilityLabel="Dismiss menu" />
        <View style={[styles.contextMenu, { top: menuAnchor.top, left: menuAnchor.left }]}>
          <Pressable
            accessibilityRole="button"
            onPress={handleEdit}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
          >
            <Text style={styles.menuItemText}>Edit</Text>
          </Pressable>
          <View style={styles.menuDivider} />
          <Pressable
            accessibilityRole="button"
            onPress={handleDelete}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
          >
            <Text style={styles.menuItemTextDestructive}>Delete</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

export function PracticeLogSection() {
  const { entries, loaded, openEdit, deleteEntry } = usePracticeLog();

  const groups = useMemo(() => buildWeekGroups(entries), [entries]);

  if (!loaded || entries.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      {groups.map((g) => (
        <View key={g.key} style={styles.weekBlock}>
          <Text style={styles.weekHeader}>{g.label}</Text>
          {g.entries.map((entry) => (
            <LogCard
              key={entry.id}
              entry={entry}
              onEdit={openEdit}
              onDelete={(id) => void deleteEntry(id)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 36,
    marginBottom: 8,
  },
  weekBlock: {
    marginBottom: 20,
  },
  weekHeader: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    marginBottom: 10,
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8e6ed',
  },
  logBody: {
    flex: 1,
    minWidth: 0,
  },
  logDate: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    marginBottom: 4,
  },
  logDuration: {
    fontFamily: sfPro,
    fontSize: 14,
    fontWeight: weightSemibold,
    color: '#b7b7b7',
    letterSpacing: letterTight,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  logChip: {
    backgroundColor: '#111',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  logChipText: {
    fontFamily: sfPro,
    fontSize: 12,
    fontWeight: weightSemibold,
    color: '#fff',
    letterSpacing: letterTight,
  },
  menuBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginTop: -2,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  contextMenu: {
    position: 'absolute',
    width: MENU_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ebebeb',
    marginHorizontal: 12,
  },
  menuItemText: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  menuItemTextDestructive: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#e53935',
    letterSpacing: letterTight,
  },
  pressed: {
    opacity: 0.7,
  },
});
