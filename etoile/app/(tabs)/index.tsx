import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBanner } from '../../src/components/HeaderBanner';
import { YearlyGoalCard } from '../../src/components/YearlyGoalCard';
import { NextClassCard } from '../../src/components/NextClassCard';
import { ActivityCard } from '../../src/components/ActivityCard';
import { StudiosCard } from '../../src/components/StudiosCard';
import {
  classesGoal,
  nextClass,
  classesMonthlyActivity,
  studiosAttended,
} from '../../src/data/mockData';
import { Colors, Spacing } from '../../src/constants/theme';

export default function ClassesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <HeaderBanner title="Classes" />
        <View style={styles.cards}>
          <YearlyGoalCard goal={classesGoal} />
          <NextClassCard nextClass={nextClass} />
          <ActivityCard
            icon="▦"
            title="Monthly Activity"
            value={classesMonthlyActivity.count}
            label={classesMonthlyActivity.month}
            data={classesMonthlyActivity.weekData}
          />
          <StudiosCard studios={studiosAttended} />
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
