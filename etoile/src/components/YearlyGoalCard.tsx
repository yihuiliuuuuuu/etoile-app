import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { ProgressBar } from './ProgressBar';
import { YearlyGoal } from '../types';
import { FontSize, Spacing, Colors } from '../constants/theme';

interface YearlyGoalCardProps {
  goal: YearlyGoal;
}

export function YearlyGoalCard({ goal }: YearlyGoalCardProps) {
  return (
    <Card>
      <SectionHeader icon="◎" title="Yearly Goal" action="Edit" />
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{goal.currentMonth}</Text>
          <Text style={styles.statLabel}>{goal.monthLabel}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{goal.yearTotal}</Text>
          <Text style={styles.statLabel}>{goal.yearLabel}</Text>
        </View>
      </View>
      <ProgressBar current={goal.yearTotal} target={goal.target} unit={goal.unit} />
    </Card>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.xxxl,
  },
  stat: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: FontSize.display,
    fontWeight: '300',
    color: Colors.text,
    letterSpacing: -1,
    lineHeight: FontSize.display * 1.1,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
