import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { HeroHeader } from '../components/HeroHeader';
import { YearlyGoalCard } from '../components/YearlyGoalCard';
import { ActivityCard } from '../components/ActivityCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { colors, spacing } from '../theme';
import { practiceGoal, practiceMonthlyHours, practiceWeeklyHours } from '../data/mockData';

export const PracticeScreen: React.FC = () => (
  <View style={styles.container}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <HeroHeader title="Practice" />
      <View style={styles.cardsContainer}>
        <YearlyGoalCard goal={practiceGoal} />
        <ActivityCard
          icon="💃"
          title="Monthly Hours"
          value={practiceMonthlyHours.value}
          label={practiceMonthlyHours.month}
          bars={practiceMonthlyHours.weekBars}
        />
        <ActivityCard
          icon="💃"
          title="Weekly Hours"
          value={practiceWeeklyHours.value}
          label={practiceWeeklyHours.dateRange}
          bars={practiceWeeklyHours.weekBars}
        />
      </View>
    </ScrollView>
    <FloatingActionButton />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  cardsContainer: {
    paddingTop: spacing.sm,
  },
});
