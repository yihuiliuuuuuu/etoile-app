import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { Card } from '@/src/components/Card';
import { colors, radii, spacing } from '@/src/theme';

export interface DayProgress {
  /** Single-character label, e.g. "M". */
  label: string;
  /** Minutes practiced; 0 means rest day. */
  minutes: number;
  /** Whether this is the current day. */
  isToday?: boolean;
}

interface WeeklyProgressProps {
  days: DayProgress[];
  /** Daily goal used to normalize the bar heights. */
  goalMinutes: number;
  totalMinutes: number;
  streak: number;
}

const BAR_MAX_HEIGHT = 60;
const BAR_MIN_HEIGHT = 4;

/**
 * Seven-day mini chart with M T W T F S S labels.
 *
 * Each day is rendered as a soft blush track with a dusty-rose fill,
 * scaled relative to the daily goal. The current day gets an outline
 * so it reads as "now" without changing the color story.
 */
export function WeeklyProgress({
  days,
  goalMinutes,
  totalMinutes,
  streak,
}: WeeklyProgressProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View>
          <AppText variant="eyebrow" color={colors.textTertiary}>
            THIS WEEK
          </AppText>
          <AppText variant="metricM" color={colors.textPrimary} style={styles.total}>
            {totalMinutes} min
          </AppText>
        </View>
        <View style={styles.streak}>
          <AppText variant="cardLabel" color={colors.primary}>
            ✦ {streak}-day streak
          </AppText>
        </View>
      </View>

      <View style={styles.row}>
        {days.map((day, idx) => {
          const ratio = goalMinutes > 0 ? day.minutes / goalMinutes : 0;
          const fillHeight = Math.max(
            day.minutes === 0 ? 0 : BAR_MIN_HEIGHT,
            Math.min(1, ratio) * BAR_MAX_HEIGHT,
          );
          return (
            <View key={`${day.label}-${idx}`} style={styles.dayCol}>
              <View
                style={[
                  styles.barTrack,
                  day.isToday && styles.barTrackToday,
                ]}
              >
                <View style={[styles.barFill, { height: fillHeight }]} />
              </View>
              <AppText
                variant="caption"
                color={day.isToday ? colors.textPrimary : colors.textTertiary}
                style={styles.dayLabel}
              >
                {day.label}
              </AppText>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  total: {
    marginTop: 2,
  },
  streak: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 18,
    height: BAR_MAX_HEIGHT,
    borderRadius: radii.sm,
    backgroundColor: colors.chart.track,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barTrackToday: {
    backgroundColor: colors.primarySoft,
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
  },
  dayLabel: {
    marginTop: spacing.sm,
  },
});
