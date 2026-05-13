import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import CardHeader from './CardHeader';
import BarChart from './BarChart';
import { MonthlyActivity, WeeklyActivity } from '../types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import ActivityIcon from './icons/ActivityIcon';

interface ActivityCardProps {
  title: string;
  data: MonthlyActivity | WeeklyActivity;
  onView?: () => void;
}

function isWeekly(data: MonthlyActivity | WeeklyActivity): data is WeeklyActivity {
  return 'weekRange' in data;
}

export default function ActivityCard({ title, data, onView }: ActivityCardProps) {
  const subtitle = isWeekly(data) ? data.weekRange : data.month;

  return (
    <Card>
      <CardHeader
        icon={<ActivityIcon size={18} color={Colors.accent} />}
        title={title}
        actionLabel="View"
        onAction={onView}
      />
      <View style={styles.contentRow}>
        <View style={styles.leftCol}>
          <Text style={styles.value}>{data.value}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.chartCol}>
          <BarChart data={data.bars} height={52} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  leftCol: {
    justifyContent: 'flex-end',
  },
  value: {
    ...Typography.displayLarge,
    color: Colors.textPrimary,
    lineHeight: 52,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  chartCol: {
    flex: 1,
    marginLeft: 16,
  },
});
