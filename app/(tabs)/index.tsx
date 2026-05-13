import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MonthlyActivityCard } from '@/src/components/cards/MonthlyActivityCard';
import { NextClassCard } from '@/src/components/cards/NextClassCard';
import { StudiosAttendedCard } from '@/src/components/cards/StudiosAttendedCard';
import { YearlyGoalCard } from '@/src/components/cards/YearlyGoalCard';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { classesSummary } from '@/src/data/mock';
import { colors, spacing } from '@/src/theme';

export default function ClassesScreen() {
  const insets = useSafeAreaInsets();
  const summary = classesSummary;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 140 + insets.bottom },
        ]}
        stickyHeaderIndices={[]}
      >
        <ScreenHeader title="Classes" />

        <View style={styles.cardStack}>
          <YearlyGoalCard
            monthValue={summary.monthValue}
            monthLabel={summary.monthLabel}
            yearValue={summary.yearValue}
            yearLabel={summary.yearLabel}
            goal={summary.yearGoal}
            unit="classes"
          />

          <NextClassCard upcoming={summary.nextClass} />

          <MonthlyActivityCard
            buckets={summary.monthlyActivity}
            currentLabel={summary.monthShort}
            currentValue={summary.monthValue}
          />

          <StudiosAttendedCard studios={summary.studios} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  cardStack: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xxl,
    gap: spacing.md,
  },
});
