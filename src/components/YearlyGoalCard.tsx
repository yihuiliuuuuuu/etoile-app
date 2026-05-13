import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { ProgressBar } from './ProgressBar';
import { colors, typography } from '../theme';
import { YearlyGoal } from '../types';

interface YearlyGoalCardProps {
  goal: YearlyGoal;
}

export const YearlyGoalCard: React.FC<YearlyGoalCardProps> = ({ goal }) => (
  <Card>
    <SectionHeader icon="◎" title="Yearly Goal" actionLabel="Edit" />
    <View style={styles.statsRow}>
      <View style={styles.statBlock}>
        <Text style={styles.statValue}>{goal.currentMonthValue}</Text>
        <Text style={styles.statLabel}>{goal.currentMonth}</Text>
      </View>
      <View style={styles.statBlock}>
        <Text style={styles.statValue}>{goal.yearlyTotal}</Text>
        <Text style={styles.statLabel}>{goal.year}</Text>
      </View>
    </View>
    <ProgressBar current={goal.yearlyTotal} target={goal.target} unit={goal.unit} />
  </Card>
);

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 40,
  },
  statBlock: {
    alignItems: 'flex-start',
  },
  statValue: {
    ...typography.statLarge,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: -4,
  },
});
