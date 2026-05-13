import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MonthlyActivityCard } from '@/src/components/cards/MonthlyActivityCard';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { YearlyGoalCard } from '@/src/components/cards/YearlyGoalCard';
import { colors, spacing } from '@/src/theme';
import { MonthBucket } from '@/src/types';

const PRACTICE_MONTHLY: MonthBucket[] = [
  { month: 'February', shortMonth: 'Feb', value: 22 },
  { month: 'March', shortMonth: 'Mar', value: 28 },
  { month: 'April', shortMonth: 'Apr', value: 35 },
  { month: 'May', shortMonth: 'May', value: 40 },
];

const PRACTICE_WEEKLY: MonthBucket[] = [
  { month: 'Week 1', shortMonth: 'W1', value: 3 },
  { month: 'Week 2', shortMonth: 'W2', value: 4.5 },
  { month: 'Week 3', shortMonth: 'W3', value: 4 },
  { month: 'Week 4', shortMonth: 'W4', value: 5 },
];

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 140 + insets.bottom },
        ]}
      >
        <ScreenHeader title="Practice" />

        <View style={styles.cardStack}>
          <YearlyGoalCard
            monthValue={5}
            monthLabel="May"
            yearValue={125.5}
            yearLabel="2026"
            goal={400}
            unit="hrs"
          />

          <MonthlyActivityCard
            title="Monthly Hours"
            buckets={PRACTICE_MONTHLY}
            currentLabel="May"
            currentValue={40}
          />

          <MonthlyActivityCard
            title="Weekly Hours"
            buckets={PRACTICE_WEEKLY}
            currentLabel="May 2–9"
            currentValue={5}
          />
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
