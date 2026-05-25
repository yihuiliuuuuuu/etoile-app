import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InlineMonthCalendar } from '@/components/inline-month-calendar';
import { SheetBackdrop } from '@/components/sheet-backdrop';
import { useBottomSheetAnimation } from '@/hooks/use-bottom-sheet-animation';
import { CLASSES_ACCENT, CLASSES_ACCENT_SOFT } from '@/constants/tab-colors';
import { letterTight, screenBackground, sfPro, weightSemibold } from '@/constants/typography';
import type { ClassLogEntry } from '@/contexts/class-log-context';
import { useAuth } from '@/contexts/auth-context';
import { useClassLog } from '@/contexts/class-log-context';
import { isSupabaseConfigured } from '@/lib/env';
import { fetchUserSchools, insertUserSchool } from '@/services/schools-api';

const ACCENT = CLASSES_ACCENT;
const SCHOOLS_STORAGE_KEY = 'etoile_class_schools_v1';
const DEFAULT_SCHOOLS = ['Dock 11', 'Center of Dance', "Fit' Ballet", 'House of Healing'] as const;

const TECH_OPTIONS = [
  'Barre work',
  'Center work',
  'Jumps',
  'Turns',
  'Plié',
  'Tendu',
  'Adagio',
  'Allegro',
  'Pointe work',
] as const;

const WHEEL_ITEM_H = 44;
const WHEEL_VISIBLE = 5;
const WHEEL_PAD = ((WHEEL_VISIBLE - 1) / 2) * WHEEL_ITEM_H;

type ActivePanel = 'none' | 'date' | 'time' | 'school';

function formatSheetDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatSheetTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function withTime(date: Date, hours: number, minutes: number) {
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

type TimeWheelColumnProps = {
  values: number[];
  selected: number;
  onSelect: (v: number) => void;
  format: (v: number) => string;
};

function TimeWheelColumn({ values, selected, onSelect, format }: TimeWheelColumnProps) {
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = values.indexOf(selected);

  useEffect(() => {
    if (selectedIndex < 0) return;
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: selectedIndex * WHEEL_ITEM_H, animated: false });
    }, 0);
    return () => clearTimeout(t);
  }, [selectedIndex]);

  const onScrollEnd = (y: number) => {
    const idx = Math.round(y / WHEEL_ITEM_H);
    const clamped = Math.max(0, Math.min(values.length - 1, idx));
    if (values[clamped] !== selected) {
      void Haptics.selectionAsync();
      onSelect(values[clamped]!);
    }
  };

  return (
    <View style={wheelStyles.column}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={WHEEL_ITEM_H}
        decelerationRate="fast"
        nestedScrollEnabled
        contentContainerStyle={{ paddingVertical: WHEEL_PAD }}
        onMomentumScrollEnd={(e) => onScrollEnd(e.nativeEvent.contentOffset.y)}
        onScrollEndDrag={(e) => onScrollEnd(e.nativeEvent.contentOffset.y)}
      >
        {values.map((v) => {
          const on = v === selected;
          return (
            <View key={v} style={wheelStyles.item}>
              <Text style={[wheelStyles.itemText, on && wheelStyles.itemTextOn]}>{format(v)}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function TimeWheelPicker({ value, onChange }: { value: Date; onChange: (d: Date) => void }) {
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  return (
    <View style={wheelStyles.wrap}>
      <View style={wheelStyles.highlight} pointerEvents="none" />
      <View style={wheelStyles.row}>
        <TimeWheelColumn
          values={hours}
          selected={value.getHours()}
          onSelect={(h) => onChange(withTime(value, h, value.getMinutes()))}
          format={(v) => String(v).padStart(2, '0')}
        />
        <Text style={wheelStyles.colon}>:</Text>
        <TimeWheelColumn
          values={minutes}
          selected={value.getMinutes()}
          onSelect={(m) => onChange(withTime(value, value.getHours(), m))}
          format={(v) => String(v).padStart(2, '0')}
        />
      </View>
    </View>
  );
}

const wheelStyles = StyleSheet.create({
  wrap: {
    height: WHEEL_ITEM_H * WHEEL_VISIBLE,
    marginTop: 4,
    marginBottom: 8,
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: WHEEL_PAD,
    height: WHEEL_ITEM_H,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    width: 72,
    height: WHEEL_ITEM_H * WHEEL_VISIBLE,
  },
  item: {
    height: WHEEL_ITEM_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontFamily: sfPro,
    fontSize: 22,
    fontWeight: weightSemibold,
    color: 'rgba(0,0,0,0.28)',
    letterSpacing: letterTight,
  },
  itemTextOn: {
    color: '#111',
  },
  colon: {
    fontFamily: sfPro,
    fontSize: 22,
    fontWeight: weightSemibold,
    color: '#111',
    marginHorizontal: 4,
    marginBottom: 2,
  },
});

function defaultClassDateTime() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  if (d.getHours() < 9) d.setHours(10, 0, 0, 0);
  return d;
}

type Props = {
  visible: boolean;
  editingEntry: ClassLogEntry | null;
  onClose: () => void;
};

export function ClassEntryBottomSheet({ visible, editingEntry, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { addEntry, updateEntry } = useClassLog();
  const { notifyEntryCreated, isSignedIn, userId } = useAuth();
  const keyboard = useAnimatedKeyboard();
  const { translateY, closeAnimated, openAnimated, resetInstant, backdropAnimStyle, screenHeight } =
    useBottomSheetAnimation(onClose);
  const topInset = insets.top;

  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedDateTime, setSelectedDateTime] = useState(() => {
    const d = new Date(2026, 3, 20, 10, 0, 0, 0);
    return d;
  });
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [calViewYear, setCalViewYear] = useState(2026);
  const [calViewMonth, setCalViewMonth] = useState(3);
  const [schools, setSchools] = useState<string[]>([...DEFAULT_SCHOOLS]);
  const [selectedSchool, setSelectedSchool] = useState<string>(DEFAULT_SCHOOLS[0]);
  const [addSchoolOpen, setAddSchoolOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');

  const dismiss = useCallback(() => {
    Keyboard.dismiss();
    setActivePanel('none');
    setAddSchoolOpen(false);
    closeAnimated();
  }, [closeAnimated]);

  useEffect(() => {
    if (!visible) return;
    void (async () => {
      try {
        let names: string[] = [];
        if (userId && isSupabaseConfigured()) {
          names = await fetchUserSchools(userId).catch(() => []);
        }
        if (names.length === 0) {
          const raw = await AsyncStorage.getItem(SCHOOLS_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as unknown;
            if (Array.isArray(parsed) && parsed.every((s) => typeof s === 'string')) {
              names = parsed;
            }
          }
        }
        const merged = [...new Set([...DEFAULT_SCHOOLS, ...names])];
        if (editingEntry?.school && !merged.includes(editingEntry.school)) {
          merged.push(editingEntry.school);
        }
        if (merged.length > 0) {
          setSchools(merged);
          if (!editingEntry) {
            setSelectedSchool(merged[0]!);
          }
        }
      } catch {
        /* keep defaults */
      }
    })();
  }, [visible, editingEntry, userId]);

  useEffect(() => {
    if (!visible) {
      resetInstant();
      return;
    }
    const initial = editingEntry
      ? new Date(editingEntry.dateTimeISO)
      : defaultClassDateTime();
    setSelectedTech(editingEntry ? [...editingEntry.techniques] : []);
    setSelectedDateTime(initial);
    setCalViewYear(initial.getFullYear());
    setCalViewMonth(initial.getMonth());
    setSelectedSchool(editingEntry?.school ?? DEFAULT_SCHOOLS[0]);
    setActivePanel('none');
    setAddSchoolOpen(false);
    setNewSchoolName('');
    openAnimated();
  }, [visible, editingEntry, openAnimated, resetInstant]);

  const persistSchools = useCallback(
    (list: string[], addedName?: string) => {
      void AsyncStorage.setItem(SCHOOLS_STORAGE_KEY, JSON.stringify(list));
      if (addedName && userId && isSupabaseConfigured()) {
        void insertUserSchool(userId, addedName).catch(() => {});
      }
    },
    [userId],
  );

  const sheetAnim = useAnimatedStyle(() => {
    const kb = keyboard.height.value;
    const maxCollapsed = screenHeight * 0.92;
    const maxExpanded =
      kb > 12 ? Math.min(screenHeight * 0.97, screenHeight - kb - topInset - 8) : maxCollapsed;
    return {
      transform: [{ translateY: translateY.value - kb }],
      maxHeight: maxExpanded,
    };
  }, [topInset]);

  const dismissPanels = useCallback(() => {
    setActivePanel('none');
    setAddSchoolOpen(false);
  }, []);

  const onConfirm = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const payload = {
      dateTimeISO: selectedDateTime.toISOString(),
      school: selectedSchool,
      techniques: [...selectedTech],
    };
    const isCreate = !editingEntry;
    if (editingEntry) {
      void updateEntry(editingEntry.id, payload);
    } else {
      void addEntry(payload);
    }
    dismiss();
    if (isCreate && !isSignedIn) {
      notifyEntryCreated('classes', true);
    }
  }, [
    addEntry,
    dismiss,
    editingEntry,
    isSignedIn,
    notifyEntryCreated,
    selectedDateTime,
    selectedSchool,
    selectedTech,
    updateEntry,
  ]);

  const toggleTech = (name: string) => {
    dismissPanels();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTech((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    );
  };

  const openDatePanel = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCalViewYear(selectedDateTime.getFullYear());
    setCalViewMonth(selectedDateTime.getMonth());
    setActivePanel((p) => (p === 'date' ? 'none' : 'date'));
    setAddSchoolOpen(false);
  }, [selectedDateTime]);

  const openTimePanel = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActivePanel((p) => (p === 'time' ? 'none' : 'time'));
    setAddSchoolOpen(false);
  }, []);

  const openSchoolPanel = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActivePanel((p) => (p === 'school' ? 'none' : 'school'));
    setAddSchoolOpen(false);
  }, []);

  const onPickDay = useCallback(
    (day: number) => {
      const next = new Date(
        calViewYear,
        calViewMonth,
        day,
        selectedDateTime.getHours(),
        selectedDateTime.getMinutes(),
        0,
        0,
      );
      setSelectedDateTime(next);
    },
    [calViewYear, calViewMonth, selectedDateTime],
  );

  const selectSchool = useCallback((name: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSchool(name);
    setActivePanel('none');
  }, []);

  const submitNewSchool = useCallback(() => {
    const name = newSchoolName.trim();
    if (!name) {
      setAddSchoolOpen(false);
      return;
    }
    setSchools((prev) => {
      if (prev.includes(name)) return prev;
      const next = [...prev, name];
      persistSchools(next, name);
      return next;
    });
    setSelectedSchool(name);
    setNewSchoolName('');
    setAddSchoolOpen(false);
    setActivePanel('school');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newSchoolName, persistSchools]);

  const promptAddSchool = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Add school',
        undefined,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add',
            onPress: (text?: string) => {
              const name = text?.trim();
              if (!name) return;
              setSchools((prev) => {
                if (prev.includes(name)) return prev;
                const next = [...prev, name];
                persistSchools(next, name);
                return next;
              });
              setSelectedSchool(name);
            },
          },
        ],
        'plain-text',
      );
    } else {
      setAddSchoolOpen(true);
    }
  }, [persistSchools]);

  const onBackdropPress = useCallback(() => {
    if (activePanel !== 'none' || addSchoolOpen) {
      dismissPanels();
    } else {
      dismiss();
    }
  }, [activePanel, addSchoolOpen, dismiss, dismissPanels]);

  const onHardwareBack = useCallback(() => {
    if (addSchoolOpen) {
      setAddSchoolOpen(false);
      return;
    }
    if (activePanel !== 'none') {
      dismissPanels();
      return;
    }
    dismiss();
  }, [activePanel, addSchoolOpen, dismiss, dismissPanels]);

  const datePillActive = activePanel === 'date';
  const timePillActive = activePanel === 'time';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onHardwareBack}
    >
      <View style={styles.modalRoot}>
        <SheetBackdrop animatedStyle={backdropAnimStyle} onPress={onBackdropPress} />

        <Animated.View
          style={[styles.sheet, sheetAnim, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}
        >
          <View style={styles.handle} accessibilityLabel="Sheet handle" />

          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={dismiss}
              style={({ pressed }) => [styles.headerCircle, pressed && styles.pressed]}
            >
              <Text style={styles.closeGlyph}>×</Text>
            </Pressable>
            <View style={styles.headerSpacer} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save class"
              onPress={onConfirm}
              style={({ pressed }) => [styles.headerCircle, styles.confirmCircle, pressed && styles.pressed]}
            >
              <Text style={styles.checkGlyph}>✓</Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={dismissPanels}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.heroBlock}>
              <Image
                source={require('@/assets/class-hero.png')}
                style={styles.heroAvatar}
                contentFit="cover"
                accessibilityLabel="Class"
              />
              <Text style={styles.heroTitle}>Class</Text>
            </View>

            <View style={styles.fieldCard}>
              <View style={styles.dateTimeRow}>
                <Text style={styles.fieldLabel}>Date</Text>
                <View style={styles.dateTimePills}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: datePillActive }}
                    onPress={openDatePanel}
                    style={({ pressed }) => [
                      styles.valuePill,
                      datePillActive ? styles.valuePillActive : styles.valuePillIdle,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.valuePillText,
                        datePillActive ? styles.valuePillTextActive : styles.valuePillTextIdle,
                      ]}
                    >
                      {formatSheetDate(selectedDateTime)}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: timePillActive }}
                    onPress={openTimePanel}
                    style={({ pressed }) => [
                      styles.valuePill,
                      timePillActive ? styles.valuePillActive : styles.valuePillIdle,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.valuePillText,
                        timePillActive ? styles.valuePillTextActive : styles.valuePillTextIdle,
                      ]}
                    >
                      {formatSheetTime(selectedDateTime)}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {activePanel === 'date' ? (
                <InlineMonthCalendar
                  viewYear={calViewYear}
                  viewMonth={calViewMonth}
                  onViewChange={(y, m) => {
                    setCalViewYear(y);
                    setCalViewMonth(m);
                  }}
                  selectedDate={selectedDateTime}
                  onSelectDay={onPickDay}
                  accentColor={CLASSES_ACCENT}
                  accentSoftColor={CLASSES_ACCENT_SOFT}
                />
              ) : null}

              {activePanel === 'time' ? (
                <TimeWheelPicker value={selectedDateTime} onChange={setSelectedDateTime} />
              ) : null}

              <View style={styles.fieldDivider} />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choose school"
                accessibilityState={{ expanded: activePanel === 'school' }}
                onPress={openSchoolPanel}
                style={({ pressed }) => [styles.schoolRowPressable, pressed && styles.pressed]}
              >
                <View style={styles.schoolRow}>
                  <Text style={styles.fieldLabel}>School</Text>
                  <View style={styles.valuePillIdleOnly}>
                    <Text style={styles.valuePillTextIdleOnly} numberOfLines={1}>
                      {selectedSchool}
                    </Text>
                  </View>
                </View>
              </Pressable>

              {activePanel === 'school' ? (
                <View style={styles.schoolMenu}>
                  {schools.map((school) => {
                    const selected = school === selectedSchool;
                    return (
                      <Pressable
                        key={school}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        onPress={() => selectSchool(school)}
                        style={({ pressed }) => [styles.schoolMenuRow, pressed && styles.pressed]}
                      >
                        <Text style={styles.schoolMenuLabel}>{school}</Text>
                        {selected ? <Text style={styles.schoolMenuCheck}>✓</Text> : null}
                      </Pressable>
                    );
                  })}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Add school"
                    onPress={promptAddSchool}
                    style={({ pressed }) => [styles.schoolMenuAdd, pressed && styles.pressed]}
                  >
                    <Text style={styles.schoolMenuAddText}>+ Add schools</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>

            <Text style={styles.sectionTitle}>Practiced</Text>
            <View style={styles.chipWrap}>
              {TECH_OPTIONS.map((name) => {
                const on = selectedTech.includes(name);
                return (
                  <Pressable
                    key={name}
                    onPress={() => toggleTech(name)}
                    style={({ pressed }) => [
                      styles.chip,
                      on ? styles.chipOn : styles.chipOff,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={[styles.chipText, on && styles.chipTextOn]}>{name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>

        {addSchoolOpen ? (
          <View style={styles.addSchoolOverlay}>
            <Pressable style={styles.addSchoolBackdrop} onPress={() => setAddSchoolOpen(false)} />
            <View style={styles.addSchoolCard}>
              <Text style={styles.addSchoolTitle}>Add school</Text>
              <TextInput
                style={styles.addSchoolInput}
                placeholder="School name"
                placeholderTextColor="#b7b7b7"
                value={newSchoolName}
                onChangeText={setNewSchoolName}
                autoFocus
                autoCapitalize="words"
              />
              <View style={styles.addSchoolActions}>
                <Pressable
                  onPress={() => setAddSchoolOpen(false)}
                  style={({ pressed }) => [styles.addSchoolBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.addSchoolBtnCancel}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={submitNewSchool}
                  style={({ pressed }) => [styles.addSchoolBtn, styles.addSchoolBtnPrimary, pressed && styles.pressed]}
                >
                  <Text style={styles.addSchoolBtnAdd}>Add</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: screenBackground,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerSpacer: {
    width: 44,
  },
  headerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8e8ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCircle: {
    backgroundColor: ACCENT,
  },
  closeGlyph: {
    fontFamily: sfPro,
    fontSize: 26,
    color: '#333',
    fontWeight: weightSemibold,
    marginTop: -2,
    includeFontPadding: false,
  },
  checkGlyph: {
    fontFamily: sfPro,
    fontSize: 20,
    color: '#fff',
    fontWeight: weightSemibold,
    includeFontPadding: false,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#e8e6ed',
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: sfPro,
    fontSize: 22,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  fieldCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  dateTimePills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  fieldLabel: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  valuePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  valuePillIdle: {
    backgroundColor: '#f0f0f0',
  },
  valuePillActive: {
    backgroundColor: CLASSES_ACCENT_SOFT,
  },
  valuePillText: {
    fontFamily: sfPro,
    fontSize: 15,
    fontWeight: weightSemibold,
    letterSpacing: letterTight,
  },
  valuePillTextIdle: {
    color: '#333',
  },
  valuePillTextActive: {
    color: ACCENT,
  },
  fieldDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ebebeb',
  },
  schoolRowPressable: {
    borderRadius: 12,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 12,
  },
  valuePillIdleOnly: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: '58%',
  },
  valuePillTextIdleOnly: {
    fontFamily: sfPro,
    fontSize: 15,
    fontWeight: weightSemibold,
    color: '#333',
    letterSpacing: letterTight,
  },
  schoolMenu: {
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
  },
  schoolMenuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ebebeb',
  },
  schoolMenuLabel: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    flex: 1,
  },
  schoolMenuCheck: {
    fontFamily: sfPro,
    fontSize: 18,
    fontWeight: weightSemibold,
    color: ACCENT,
    marginLeft: 8,
  },
  schoolMenuAdd: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  schoolMenuAddText: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: ACCENT,
    letterSpacing: letterTight,
  },
  sectionTitle: {
    fontFamily: sfPro,
    fontSize: 17,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },
  chipOn: {
    backgroundColor: ACCENT,
  },
  chipOff: {
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e4e4e4',
  },
  chipText: {
    fontFamily: sfPro,
    fontSize: 14,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  chipTextOn: {
    color: '#fff',
  },
  pressed: {
    opacity: 0.88,
  },
  addSchoolOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  addSchoolBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  addSchoolCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    zIndex: 1,
  },
  addSchoolTitle: {
    fontFamily: sfPro,
    fontSize: 17,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    marginBottom: 12,
  },
  addSchoolInput: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e4e4e4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  addSchoolActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  addSchoolBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  addSchoolBtnPrimary: {},
  addSchoolBtnCancel: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#888',
    letterSpacing: letterTight,
  },
  addSchoolBtnAdd: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: ACCENT,
    letterSpacing: letterTight,
  },
});
