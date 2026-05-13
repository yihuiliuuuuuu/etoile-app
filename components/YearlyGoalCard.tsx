import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import CardHeader from './CardHeader';
import ProgressBar from './ProgressBar';
import { YearlyGoal } from '../types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import GoalIcon from './icons/GoalIcon';

interface YearlyGoalCardProps {
  data: YearlyGoal;
  onEdit?: () => void;
}

export default function YearlyGoalCard({ data, onEdit }: YearlyGoalCardProps) {
  const percentage = Math.round((data.yearValue / data.totalGoal) * 100);

  return (
    <Card>
      <CardHeader
        icon={<GoalIcon size={18} color={Colors.accent} />}
        title="Yearly Goal"
        actionLabel="Edit"
        onAction={onEdit}
      />
      <View style={styles.statsRow}>
        <View style={styles.statGroup}>
          <Text style={styles.statValue}>{data.monthValue}</Text>
          <Text style={styles.statLabel}>{data.month}</Text>
        </View>
        <View style={styles.statGroup}>
          <Text style={styles.statValue}>{data.yearValue}</Text>
          <Text style={styles.statLabel}>{data.year}</Text>
        </View>
      </View>
      <ProgressBar
        current={data.yearValue}
        total={data.totalGoal}
        unit={data.unit}
        percentage={percentage}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 28,
    marginBottom: 4,
  },
  statGroup: {
    alignItems: 'flex-start',
  },
  statValue: {
    ...Typography.displayMedium,
    color: Colors.textPrimary,
    lineHeight: 44,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
