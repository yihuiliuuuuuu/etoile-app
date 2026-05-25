import { CLASSES_ACCENT, CLASSES_ACCENT_SOFT } from '@/constants/tab-colors';
import { letterTight, sfPro, weightSemibold } from '@/constants/typography';
import type { ClassLogEntry } from '@/contexts/class-log-context';
import { useClassLog } from '@/contexts/class-log-context';
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

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isClassUpcoming(dateTimeISO: string) {
  const classDay = startOfDay(new Date(dateTimeISO));
  const today = startOfDay(new Date());
  return classDay.getTime() > today.getTime();
}

function formatEntryDayLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

type MonthGroup = {
  key: string;
  label: string;
  entries: ClassLogEntry[];
  order: number;
};

function buildMonthGroups(entries: ClassLogEntry[]): MonthGroup[] {
  const map = new Map<string, { label: string; entries: ClassLogEntry[] }>();
  for (const e of entries) {
    const d = new Date(e.dateTimeISO);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = d.toLocaleDateString('en-US', { month: 'long' });
    if (!map.has(key)) {
      map.set(key, { label, entries: [] });
    }
    map.get(key)!.entries.push(e);
  }
  for (const g of map.values()) {
    g.entries.sort((a, b) => {
      const ta = new Date(a.dateTimeISO).getTime();
      const tb = new Date(b.dateTimeISO).getTime();
      if (tb !== ta) return tb - ta;
      return b.updatedAtISO.localeCompare(a.updatedAtISO);
    });
  }
  return [...map.entries()]
    .map(([key, v]) => ({
      key,
      label: v.label,
      entries: v.entries,
      order: Math.max(...v.entries.map((e) => new Date(e.dateTimeISO).getTime())),
    }))
    .sort((a, b) => b.order - a.order);
}

type MenuAnchor = { top: number; left: number };

function ClassLogCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: ClassLogEntry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const upcoming = isClassUpcoming(entry.dateTimeISO);
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
    Alert.alert('Delete this class?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void onDelete(entry.id) },
    ]);
  }, [closeMenu, entry.id, onDelete]);

  return (
    <>
      <View style={styles.logCard}>
        <Image
          source={require('@/assets/class-hero.png')}
          style={styles.logAvatar}
          contentFit="cover"
          accessibilityLabel="Class"
        />
        <View style={styles.logBody}>
          <View style={styles.dateRow}>
            <Text style={styles.logDate}>{formatEntryDayLabel(entry.dateTimeISO)}</Text>
            {upcoming ? (
              <View style={styles.upcomingBadge}>
                <Text style={styles.upcomingText}>Upcoming</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.logSchool}>📍 {entry.school}</Text>
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
            accessibilityLabel="Class options"
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
            style={({ pressed }) => [styles.menuItem, styles.menuItemFirst, pressed && styles.pressed]}
          >
            <Text style={styles.menuItemText}>Edit</Text>
          </Pressable>
          <View style={styles.menuDivider} />
          <Pressable
            accessibilityRole="button"
            onPress={handleDelete}
            style={({ pressed }) => [styles.menuItem, styles.menuItemLast, pressed && styles.pressed]}
          >
            <Text style={styles.menuItemTextDestructive}>Delete</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

export function ClassLogSection() {
  const { entries, loaded, openEdit, deleteEntry } = useClassLog();
  const groups = useMemo(() => buildMonthGroups(entries), [entries]);

  if (!loaded || entries.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      {groups.map((g) => (
        <View key={g.key} style={styles.monthBlock}>
          <Text style={styles.monthHeader}>{g.label}</Text>
          {g.entries.map((entry) => (
            <ClassLogCard
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
  monthBlock: {
    marginBottom: 20,
  },
  monthHeader: {
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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  logDate: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  upcomingBadge: {
    backgroundColor: CLASSES_ACCENT_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingText: {
    fontFamily: sfPro,
    fontSize: 12,
    fontWeight: weightSemibold,
    color: CLASSES_ACCENT,
    letterSpacing: letterTight,
  },
  logSchool: {
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
  menuItemFirst: {},
  menuItemLast: {},
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
