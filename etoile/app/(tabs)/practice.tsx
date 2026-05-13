import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBanner } from '../../src/components/HeaderBanner';
import { YearlyGoalCard } from '../../src/components/YearlyGoalCard';
import { ActivityCard } from '../../src/components/ActivityCard';
import {
  practiceGoal,
  practiceMonthlyHours,
  practiceWeeklyHours,
} from '../../src/data/mockData';
import { Colors, Spacing } from '../../src/constants/theme';

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <HeaderBanner title="Practice" />
        <View style={styles.cards}>
          <YearlyGoalCard goal={practiceGoal} />
          <ActivityCard
            icon="✦"
            title="Monthly Hours"
            value={practiceMonthlyHours.count}
            label={practiceMonthlyHours.month}
            data={practiceMonthlyHours.weekData}
          />
          <ActivityCard
            icon="✦"
            title="Weekly Hours"
            value={practiceWeeklyHours.hours}
            label={practiceWeeklyHours.dateRange}
            data={practiceWeeklyHours.weekData}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  cards: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
});
