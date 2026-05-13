import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { MiniBarChart } from './MiniBarChart';
import { colors, typography } from '../theme';

interface ActivityCardProps {
  icon?: string;
  title: string;
  value: number;
  label: string;
  bars: number[];
  actionLabel?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  icon = '📊',
  title,
  value,
  label,
  bars,
  actionLabel = 'View',
}) => (
  <Card>
    <SectionHeader icon={icon} title={title} actionLabel={actionLabel} />
    <View style={styles.content}>
      <View style={styles.valueBlock}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <MiniBarChart bars={bars} height={52} />
    </View>
  </Card>
);

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  valueBlock: {
    alignItems: 'flex-start',
  },
  value: {
    ...typography.statMedium,
    color: colors.text,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: -2,
  },
});
