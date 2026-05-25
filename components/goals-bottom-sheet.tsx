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

import { SheetBackdrop } from '@/components/sheet-backdrop';
import { useBottomSheetAnimation } from '@/hooks/use-bottom-sheet-animation';
import { CLASSES_ACCENT, CLASSES_ACCENT_SOFT, PRACTICE_ACCENT, PRACTICE_ACCENT_SOFT } from '@/constants/tab-colors';
import { letterTight, screenBackground, sfPro, weightSemibold } from '@/constants/typography';
import {
  GOAL_CYCLES,
  cycleLabel,
  useGoals,
  type ClassGoals,
  type GoalCycle,
  type PracticeGoals,
} from '@/contexts/goals-context';

const CLASS_TARGET_PRESETS = [30, 40, 80, 100] as const;
const PRACTICE_TARGET_PRESETS = [100, 200, 300, 400] as const;

export type GoalsSheetVariant = 'practice' | 'classes';

function parseTargetNumber(text: string): number | null {
  const t = text.trim().replace(/h$/i, '');
  if (/^\d+$/.test(t)) return parseInt(t, 10);
  return null;
}

type Props = {
  visible: boolean;
  variant: GoalsSheetVariant;
  onClose: () => void;
};

export function GoalsBottomSheet({ visible, variant, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();
  const { translateY, closeAnimated, openAnimated, resetInstant, backdropAnimStyle, screenHeight } =
    useBottomSheetAnimation(onClose);
  const topInset = insets.top;
  const { practiceGoals, classGoals, setPracticeGoals, setClassGoals } = useGoals();

  const accent = variant === 'practice' ? PRACTICE_ACCENT : CLASSES_ACCENT;
  const accentSoft = variant === 'practice' ? PRACTICE_ACCENT_SOFT : CLASSES_ACCENT_SOFT;
  const targetLabel = variant === 'practice' ? 'Practice Target' : 'Class Target';
  const presets =
    variant === 'practice' ? PRACTICE_TARGET_PRESETS : CLASS_TARGET_PRESETS;

  const [goalCycle, setGoalCycle] = useState<GoalCycle>('yearly');
  const [cycleMenuOpen, setCycleMenuOpen] = useState(false);
  const [targetText, setTargetText] = useState('');
  const [targetPreset, setTargetPreset] = useState<number | null>(null);

  const dismiss = useCallback(() => {
    Keyboard.dismiss();
    setCycleMenuOpen(false);
    closeAnimated();
  }, [closeAnimated]);

  useEffect(() => {
    if (!visible) {
      resetInstant();
      return;
    }

    const saved = variant === 'practice' ? practiceGoals : classGoals;
    const targetValue =
      variant === 'practice'
        ? (saved as PracticeGoals).targetHours
        : (saved as ClassGoals).targetClasses;

    setGoalCycle(saved.cycle);
    setCycleMenuOpen(false);
    setTargetText(String(targetValue));
    const matchesPreset = (presets as readonly number[]).includes(targetValue);
    setTargetPreset(matchesPreset ? targetValue : null);
    openAnimated();
  }, [visible, variant, practiceGoals, classGoals, presets, openAnimated, resetInstant]);

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

  const dismissCycleMenu = useCallback(() => {
    setCycleMenuOpen(false);
  }, []);

  const onConfirm = useCallback(() => {
    const parsed = targetPreset ?? parseTargetNumber(targetText);
    const target = parsed !== null && parsed > 0 ? parsed : null;

    if (target !== null) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (variant === 'practice') {
        setPracticeGoals({ cycle: goalCycle, targetHours: target });
      } else {
        setClassGoals({ cycle: goalCycle, targetClasses: target });
      }
    }
    dismiss();
  }, [
    dismiss,
    goalCycle,
    setClassGoals,
    setPracticeGoals,
    targetPreset,
    targetText,
    variant,
  ]);

  const toggleCycleMenu = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCycleMenuOpen((open) => {
      if (!open) Keyboard.dismiss();
      return !open;
    });
  }, []);

  const selectGoalCycle = useCallback((c: GoalCycle) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGoalCycle(c);
    setCycleMenuOpen(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    if (cycleMenuOpen) {
      dismissCycleMenu();
    } else {
      dismiss();
    }
  }, [cycleMenuOpen, dismiss, dismissCycleMenu]);

  const onHardwareBack = useCallback(() => {
    if (cycleMenuOpen) {
      dismissCycleMenu();
      return;
    }
    dismiss();
  }, [cycleMenuOpen, dismiss, dismissCycleMenu]);

  const onTargetTextChange = useCallback(
    (text: string) => {
      setTargetText(text);
      const parsed = parseTargetNumber(text);
      const matchesPreset = parsed !== null && (presets as readonly number[]).includes(parsed);
      setTargetPreset(matchesPreset ? parsed : null);
    },
    [presets],
  );

  const selectTargetPreset = useCallback(
    (value: number) => {
      dismissCycleMenu();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTargetText(String(value));
      setTargetPreset(value);
    },
    [dismissCycleMenu],
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
              accessibilityLabel="Save goals"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.headerCircle,
                { backgroundColor: accent },
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.checkGlyph}>✓</Text>
            </Pressable>
          </View>

          <View style={styles.heroBlock}>
            <Image
              source={require('@/assets/goals-hero.png')}
              style={styles.heroAvatar}
              contentFit="cover"
              accessibilityLabel="Goals"
            />
            <Text style={styles.heroTitle}>Goals</Text>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={dismissCycleMenu}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.fieldCard}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Goal cycle"
                accessibilityState={{ expanded: cycleMenuOpen }}
                onPress={toggleCycleMenu}
                style={({ pressed }) => [styles.fieldRowPressable, pressed && styles.pressed]}
              >
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Goal Cycle</Text>
                  <View style={[styles.valuePill, { backgroundColor: accentSoft }]}>
                    <Text style={[styles.valuePillText, { color: accent }]}>{cycleLabel(goalCycle)}</Text>
                  </View>
                </View>
              </Pressable>
              {cycleMenuOpen ? (
                <View style={styles.cycleDropdown} accessibilityRole="menu">
                  {GOAL_CYCLES.map((c, i) => {
                    const selected = goalCycle === c;
                    const last = i === GOAL_CYCLES.length - 1;
                    return (
                      <Pressable
                        key={c}
                        accessibilityRole="menuitem"
                        accessibilityState={{ selected }}
                        onPress={() => selectGoalCycle(c)}
                        style={({ pressed }) => [
                          styles.cycleOption,
                          last && styles.cycleOptionLast,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.cycleOptionLabel,
                            selected && { color: accent },
                          ]}
                        >
                          {cycleLabel(c)}
                        </Text>
                        {selected ? (
                          <Text style={[styles.cycleCheck, { color: accent }]}>✓</Text>
                        ) : (
                          <View style={styles.cycleCheckSpacer} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>

            <View style={styles.targetCard}>
              <Text style={styles.targetCardLabel}>{targetLabel}</Text>
              <TextInput
                style={styles.targetInput}
                placeholder={variant === 'practice' ? 'Hours' : 'Classes'}
                placeholderTextColor="#b7b7b7"
                value={targetText}
                onChangeText={onTargetTextChange}
                onFocus={dismissCycleMenu}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.targetQuickRow}>
                {presets.map((n) => {
                  const activeTarget = targetPreset ?? parseTargetNumber(targetText);
                  const on = activeTarget === n;
                  return (
                    <Pressable
                      key={n}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      onPress={() => selectTargetPreset(n)}
                      style={({ pressed }) => [
                        styles.targetQuick,
                        on ? { backgroundColor: accent } : styles.targetQuickOff,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.targetQuickLabel, on && styles.targetQuickLabelOn]}>
                        {n}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
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
    marginBottom: 22,
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
    marginBottom: 14,
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
  valuePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: '58%',
  },
  valuePillText: {
    fontFamily: sfPro,
    fontSize: 15,
    fontWeight: weightSemibold,
    letterSpacing: letterTight,
  },
  cycleDropdown: {
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cycleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  cycleOptionLast: {
    borderBottomWidth: 0,
  },
  cycleOptionLabel: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  cycleCheck: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    includeFontPadding: false,
  },
  cycleCheckSpacer: {
    width: 18,
  },
  targetCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    marginBottom: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
  },
  targetCardLabel: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    marginBottom: 4,
  },
  targetInput: {
    fontFamily: sfPro,
    fontSize: 28,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    paddingVertical: 8,
    marginBottom: 14,
  },
  targetQuickRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  targetQuick: {
    minWidth: 56,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 22,
  },
  targetQuickOff: {
    backgroundColor: '#f0f0f0',
  },
  targetQuickLabel: {
    fontFamily: sfPro,
    fontSize: 14,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  targetQuickLabelOn: {
    color: '#fff',
  },
  pressed: {
    opacity: 0.88,
  },
});
