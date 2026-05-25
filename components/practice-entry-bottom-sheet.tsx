import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
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
import { PRACTICE_ACCENT, PRACTICE_ACCENT_SOFT } from '@/constants/tab-colors';
import { letterTight, screenBackground, sfPro, weightSemibold } from '@/constants/typography';
import type { PracticeLogEntry } from '@/contexts/practice-log-context';
import { useAuth } from '@/contexts/auth-context';
import { usePracticeLog } from '@/contexts/practice-log-context';

const ACCENT = PRACTICE_ACCENT;
const ACCENT_PILL_BG = PRACTICE_ACCENT_SOFT;
const TECH_OPTIONS = [
  'Plié',
  'Tendu',
  'Dégagé',
  'Rond de jambe',
  'Frappé',
  'Fondu',
  'Adagio',
  'Grand battement',
  'Pirouette',
  'Allegro',
  'Pointe work',
  'Barre work',
  'Center work',
  'Jumps',
  'Turns',
] as const;

const DURATION_PRESETS = [30, 60, 90, 120] as const;

function parseDurationMinutes(text: string): number | null {
  const t = text.trim().toLowerCase().replace(/\s+/g, '');
  const m = t.match(/^(\d+)m$/);
  if (m) return parseInt(m[1], 10);
  if (/^\d+$/.test(t)) return parseInt(t, 10);
  return null;
}

function formatSheetDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toStartOfDayISO(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
}

function todayAtStartOfDay() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

type Props = {
  visible: boolean;
  editingEntry: PracticeLogEntry | null;
  onClose: () => void;
};

export function PracticeEntryBottomSheet({ visible, editingEntry, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { addEntry, updateEntry } = usePracticeLog();
  const { notifyEntryCreated, isSignedIn } = useAuth();
  const keyboard = useAnimatedKeyboard();
  const { translateY, closeAnimated, openAnimated, resetInstant, backdropAnimStyle, screenHeight } =
    useBottomSheetAnimation(onClose);
  const topInset = insets.top;
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayAtStartOfDay);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calViewYear, setCalViewYear] = useState(() => new Date().getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(() => new Date().getMonth());
  const [durationText, setDurationText] = useState('');
  const [durationPreset, setDurationPreset] = useState<number | null>(null);

  const dismiss = useCallback(() => {
    Keyboard.dismiss();
    closeAnimated();
  }, [closeAnimated]);

  useEffect(() => {
    if (!visible) {
      resetInstant();
      return;
    }
    const initial = editingEntry ? new Date(editingEntry.dateISO) : todayAtStartOfDay();
    setSelectedTech(editingEntry ? [...editingEntry.techniques] : []);
    const mins = editingEntry?.durationMinutes ?? null;
    if (mins !== null) {
      const matchesPreset = DURATION_PRESETS.includes(mins as (typeof DURATION_PRESETS)[number]);
      setDurationText(`${mins}m`);
      setDurationPreset(matchesPreset ? mins : null);
    } else {
      setDurationText('');
      setDurationPreset(null);
    }
    setSelectedDate(initial);
    setCalViewYear(initial.getFullYear());
    setCalViewMonth(initial.getMonth());
    setCalendarOpen(false);
    openAnimated();
  }, [visible, editingEntry, openAnimated, resetInstant]);

  const sheetAnim = useAnimatedStyle(() => {
    const kb = keyboard.height.value;
    const lift = kb;
    const maxCollapsed = screenHeight * 0.92;
    const maxExpanded =
      kb > 12 ? Math.min(screenHeight * 0.97, screenHeight - kb - topInset - 8) : maxCollapsed;
    return {
      transform: [{ translateY: translateY.value - lift }],
      maxHeight: maxExpanded,
    };
  }, [topInset]);

  const onConfirm = useCallback(() => {
    const minutes = durationPreset ?? parseDurationMinutes(durationText);
    if (minutes !== null && minutes > 0) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const payload = {
        dateISO: toStartOfDayISO(selectedDate),
        durationMinutes: minutes,
        techniques: [...selectedTech],
        notes: editingEntry?.notes ?? '',
      };
      const isCreate = !editingEntry;
      if (editingEntry) {
        void updateEntry(editingEntry.id, payload);
      } else {
        void addEntry(payload);
      }
      dismiss();
      if (isCreate && !isSignedIn) {
        notifyEntryCreated('practice', true);
      }
      return;
    }
    dismiss();
  }, [
    addEntry,
    dismiss,
    durationPreset,
    durationText,
    editingEntry,
    isSignedIn,
    notifyEntryCreated,
    selectedDate,
    selectedTech,
    updateEntry,
  ]);

  const dismissCalendar = useCallback(() => {
    setCalendarOpen(false);
  }, []);

  const toggleTech = (name: string) => {
    dismissCalendar();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTech((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    );
  };

  const toggleCalendar = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (calendarOpen) {
      setCalendarOpen(false);
    } else {
      setCalViewYear(selectedDate.getFullYear());
      setCalViewMonth(selectedDate.getMonth());
      setCalendarOpen(true);
    }
  }, [calendarOpen, selectedDate]);

  const onBackdropPress = useCallback(() => {
    if (calendarOpen) {
      dismissCalendar();
    } else {
      dismiss();
    }
  }, [calendarOpen, dismiss, dismissCalendar]);

  const onHardwareBack = useCallback(() => {
    if (calendarOpen) {
      dismissCalendar();
      return;
    }
    dismiss();
  }, [calendarOpen, dismiss, dismissCalendar]);

  const onDurationTextChange = useCallback((text: string) => {
    setDurationText(text);
    const parsed = parseDurationMinutes(text);
    const matchesPreset =
      parsed !== null && DURATION_PRESETS.includes(parsed as (typeof DURATION_PRESETS)[number]);
    setDurationPreset(matchesPreset ? parsed : null);
  }, []);

  const selectDurationPreset = useCallback((minutes: (typeof DURATION_PRESETS)[number]) => {
    dismissCalendar();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDurationText(`${minutes}m`);
    setDurationPreset(minutes);
  }, [dismissCalendar]);

  const onPickDay = useCallback(
    (day: number) => {
      setSelectedDate(new Date(calViewYear, calViewMonth, day));
      dismissCalendar();
    },
    [calViewYear, calViewMonth, dismissCalendar],
  );

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
          style={[
            styles.sheet,
            sheetAnim,
            { paddingBottom: Math.max(insets.bottom, 16) + 8 },
          ]}
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
              accessibilityLabel="Save practice"
              onPress={onConfirm}
              style={({ pressed }) => [styles.headerCircle, styles.confirmCircle, pressed && styles.pressed]}
            >
              <Text style={styles.checkGlyph}>✓</Text>
            </Pressable>
          </View>

          <View style={styles.heroBlock}>
            <Image
              source={require('@/assets/goals-hero.png')}
              style={styles.heroAvatar}
              contentFit="cover"
              accessibilityLabel="Practice"
            />
            <Text style={styles.heroTitle}>Practice</Text>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={dismissCalendar}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.fieldCard}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choose date"
                accessibilityState={{ expanded: calendarOpen }}
                onPress={toggleCalendar}
                style={({ pressed }) => [styles.fieldRowPressable, pressed && styles.pressed]}
              >
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Date</Text>
                  <View style={styles.dateValuePill}>
                    <Text style={styles.dateValuePillText}>{formatSheetDate(selectedDate)}</Text>
                  </View>
                </View>
              </Pressable>
              {calendarOpen ? (
                <InlineMonthCalendar
                  viewYear={calViewYear}
                  viewMonth={calViewMonth}
                  onViewChange={(y, m) => {
                    setCalViewYear(y);
                    setCalViewMonth(m);
                  }}
                  selectedDate={selectedDate}
                  onSelectDay={onPickDay}
                  accentColor={PRACTICE_ACCENT}
                  accentSoftColor={PRACTICE_ACCENT_SOFT}
                />
              ) : null}
            </View>

            <View style={styles.durationCard}>
              <TextInput
                style={styles.durationInput}
                placeholder="Duration"
                placeholderTextColor="#b7b7b7"
                value={durationText}
                onChangeText={onDurationTextChange}
                onFocus={dismissCalendar}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.durationQuickRow}>
                {DURATION_PRESETS.map((m) => {
                  const on = durationPreset === m;
                  return (
                    <Pressable
                      key={m}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      onPress={() => selectDurationPreset(m)}
                      style={({ pressed }) => [
                        styles.durationQuick,
                        on ? styles.durationQuickOn : styles.durationQuickOff,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.durationQuickLabel, on && styles.durationQuickLabelOn]}>{m}m</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Techniques Practiced</Text>
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
                    {on ? (
                      <Text style={styles.chipRemove} accessibilityLabel={`Remove ${name}`}>
                        {' '}
                        ×
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>
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
  scrollContent: {
    paddingBottom: 24,
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
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  fieldRowPressable: {
    borderRadius: 12,
  },
  fieldLabel: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  dateValuePill: {
    backgroundColor: ACCENT_PILL_BG,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: '58%',
  },
  dateValuePillText: {
    fontFamily: sfPro,
    fontSize: 15,
    fontWeight: weightSemibold,
    color: ACCENT,
    letterSpacing: letterTight,
  },
  durationCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    marginBottom: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
  },
  durationInput: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    paddingVertical: 10,
    marginBottom: 14,
  },
  durationQuickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationQuick: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
  },
  durationQuickOn: {
    backgroundColor: ACCENT,
  },
  durationQuickOff: {
    backgroundColor: '#f0f0f0',
  },
  durationQuickLabel: {
    fontFamily: sfPro,
    fontSize: 14,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  durationQuickLabelOn: {
    color: '#fff',
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
    flexDirection: 'row',
    alignItems: 'center',
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
  chipRemove: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#fff',
    marginLeft: 2,
    includeFontPadding: false,
  },
  pressed: {
    opacity: 0.88,
  },
});
