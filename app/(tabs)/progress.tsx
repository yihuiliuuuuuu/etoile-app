import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { Card } from '@/src/components/Card';
import { PracticeRing } from '@/src/components/PracticeRing';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { SectionTitle } from '@/src/components/SectionTitle';
import { WeeklyProgress, DayProgress } from '@/src/components/WeeklyProgress';
import { homeSnapshot } from '@/src/data/mock';
import { colors, spacing } from '@/src/theme';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface Stat {
  label: string;
  value: string;
  caption: string;
}

const STATS: Stat[] = [
  { label: 'This month', value: '14h 25m', caption: '+2h vs April' },
  { label: 'Best streak', value: '11 days', caption: 'Mar 12 → Mar 22' },
];

export default function ProgressScreen() {
  const snapshot = homeSnapshot;

  const weekDays: DayProgress[] = snapshot.week.days.map((day, idx) => ({
    label: DAY_LABELS[idx] ?? '',
    minutes: day.minutes,
    isToday: idx === snapshot.week.days.length - 1,
  }));

  const totalMinutes = snapshot.week.days.reduce((sum, d) => sum + d.minutes, 0);
  const goalWeekly = snapshot.goalMinutesPerDay * 7;
  const weeklyRatio = goalWeekly > 0 ? totalMinutes / goalWeekly : 0;

  return (
    <ScreenContainer bottomInset={96}>
      <View>
        <AppText variant="eyebrow" color={colors.textTertiary}>
          PROGRESS
        </AppText>
        <AppText variant="displaySerif" color={colors.textPrimary} style={styles.title}>
          Your rhythm
        </AppText>
      </View>

      <Card>
        <View style={styles.ringRow}>
          <PracticeRing
            progress={weeklyRatio}
            size={140}
            strokeWidth={12}
            centerLabel="WEEK"
            centerValue={`${Math.round(weeklyRatio * 100)}%`}
          />
          <View style={styles.ringCopy}>
            <AppText variant="cardLabel" color={colors.textTertiary}>
              GOAL
            </AppText>
            <AppText variant="metricM" color={colors.textPrimary}>
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
            </AppText>
            <AppText variant="bodyMuted" color={colors.textSecondary} style={styles.ringDetail}>
              of {Math.floor(goalWeekly / 60)} hours weekly
            </AppText>
          </View>
        </View>
      </Card>

      <View style={{ gap: spacing.md }}>
        <SectionTitle title="This week" />
        <WeeklyProgress
          days={weekDays}
          goalMinutes={snapshot.goalMinutesPerDay}
          totalMinutes={totalMinutes}
          streak={snapshot.week.streak}
        />
      </View>

      <View style={styles.statsRow}>
        {STATS.map((stat) => (
          <Card key={stat.label} variant="soft" style={styles.statCard}>
            <AppText variant="cardLabel" color={colors.textTertiary}>
              {stat.label.toUpperCase()}
            </AppText>
            <AppText variant="metricM" color={colors.textPrimary} style={styles.statValue}>
              {stat.value}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {stat.caption}
            </AppText>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.xs,
  },
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringCopy: {
    flex: 1,
    paddingLeft: spacing.xl,
  },
  ringDetail: {
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    gap: spacing.xs,
  },
  statValue: {
    marginTop: 2,
  },
});
