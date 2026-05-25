import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PRACTICE_ACCENT, PRACTICE_ACCENT_SOFT } from '@/constants/tab-colors';
import { letterTight, sfPro, weightSemibold } from '@/constants/typography';

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

type Props = {
  viewYear: number;
  viewMonth: number;
  onViewChange: (year: number, month: number) => void;
  selectedDate: Date;
  onSelectDay: (day: number) => void;
  accentColor?: string;
  accentSoftColor?: string;
};

export function InlineMonthCalendar({
  viewYear,
  viewMonth,
  onViewChange,
  selectedDate,
  onSelectDay,
  accentColor = PRACTICE_ACCENT,
  accentSoftColor = PRACTICE_ACCENT_SOFT,
}: Props) {
  const accentStyles = useMemo(
    () =>
      StyleSheet.create({
        navGlyph: { color: accentColor },
        dayBubbleSelected: { backgroundColor: accentSoftColor },
        dayNumSelected: { color: accentColor },
      }),
    [accentColor, accentSoftColor],
  );
  const rows = useMemo(() => {
    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    const dim = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: ({ day: number } | null)[] = [];
    for (let i = 0; i < firstDow; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= dim; d++) {
      cells.push({ day: d });
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    const out: ({ day: number } | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      out.push(cells.slice(i, i + 7));
    }
    return out;
  }, [viewYear, viewMonth]);

  const goPrev = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const d = new Date(viewYear, viewMonth - 1, 1);
    onViewChange(d.getFullYear(), d.getMonth());
  };

  const goNext = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const d = new Date(viewYear, viewMonth + 1, 1);
    onViewChange(d.getFullYear(), d.getMonth());
  };

  const pickDay = (day: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectDay(day);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.calTopRule} />
      <View style={styles.monthRow}>
        <Text style={styles.monthTitle}>
          {MONTH_LABELS[viewMonth]} {viewYear}
        </Text>
        <View style={styles.monthNav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            onPress={goPrev}
            hitSlop={10}
            style={({ pressed }) => [styles.navHit, pressed && styles.pressed]}
          >
            <Text style={[styles.navGlyph, accentStyles.navGlyph]}>‹</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next month"
            onPress={goNext}
            hitSlop={10}
            style={({ pressed }) => [styles.navHit, pressed && styles.pressed]}
          >
            <Text style={[styles.navGlyph, accentStyles.navGlyph]}>›</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.weekRow}>
        {WEEK_DAYS.map((w) => (
          <Text key={w} style={styles.weekLabel}>
            {w}
          </Text>
        ))}
      </View>

      {rows.map((week, wi) => (
        <View key={wi} style={styles.weekCells}>
          {week.map((cell, di) => {
            const key = `${wi}-${di}`;
            if (!cell) {
              return <View key={key} style={styles.cell} />;
            }
            const d = new Date(viewYear, viewMonth, cell.day);
            const selected = sameDay(d, selectedDate);
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={d.toDateString()}
                onPress={() => pickDay(cell.day)}
                style={({ pressed }) => [styles.cell, styles.cellHit, pressed && styles.pressed]}
              >
                <View style={[styles.dayBubble, selected && accentStyles.dayBubbleSelected]}>
                  <Text style={[styles.dayNum, selected && accentStyles.dayNumSelected]}>
                    {cell.day}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 12,
    paddingHorizontal: 2,
  },
  calTopRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ebebeb',
    marginBottom: 12,
    marginHorizontal: -4,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthTitle: {
    fontFamily: sfPro,
    fontSize: 17,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    flexShrink: 1,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navHit: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navGlyph: {
    fontFamily: sfPro,
    fontSize: 22,
    fontWeight: weightSemibold,
    includeFontPadding: false,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: sfPro,
    fontSize: 11,
    fontWeight: weightSemibold,
    color: '#b7b7b7',
    letterSpacing: 0.2,
  },
  weekCells: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  cellHit: {
    padding: 2,
  },
  dayBubble: {
    minWidth: 36,
    minHeight: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  pressed: {
    opacity: 0.75,
  },
});
