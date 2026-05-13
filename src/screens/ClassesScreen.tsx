import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { HeroHeader } from '../components/HeroHeader';
import { YearlyGoalCard } from '../components/YearlyGoalCard';
import { NextClassCard } from '../components/NextClassCard';
import { ActivityCard } from '../components/ActivityCard';
import { StudiosCard } from '../components/StudiosCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { colors, spacing } from '../theme';
import {
  classesGoal,
  nextClass,
  classesMonthlyActivity,
  studiosAttended,
} from '../data/mockData';

export const ClassesScreen: React.FC = () => (
  <View style={styles.container}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <HeroHeader title="Classes" />
      <View style={styles.cardsContainer}>
        <YearlyGoalCard goal={classesGoal} />
        <NextClassCard nextClass={nextClass} />
        <ActivityCard
          icon="📊"
          title="Monthly Activity"
          value={classesMonthlyActivity.value}
          label={classesMonthlyActivity.month}
          bars={classesMonthlyActivity.weekBars}
        />
        <StudiosCard studios={studiosAttended} />
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
