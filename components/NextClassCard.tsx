import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import CardHeader from './CardHeader';
import { NextClass } from '../types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import ClassIcon from './icons/ClassIcon';

interface NextClassCardProps {
  data: NextClass;
  onCalendar?: () => void;
}

export default function NextClassCard({ data, onCalendar }: NextClassCardProps) {
  return (
    <Card>
      <CardHeader
        icon={<ClassIcon size={18} color={Colors.accent} />}
        title="Next Class"
        actionLabel="Calendar"
        onAction={onCalendar}
      />
      <View style={styles.timeRow}>
        <Text style={styles.time}>{data.time}</Text>
        <Text style={styles.date}>
          {'  '}{data.dayOfWeek} {data.month} {data.day}
        </Text>
      </View>
      <View style={styles.seriesRow}>
        <ClassIcon size={14} color={Colors.textSecondary} />
        <Text style={styles.seriesName}>{data.seriesName}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  time: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
    color: Colors.textPrimary,
    lineHeight: 44,
  },
  date: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: Colors.textTertiary,
    lineHeight: 44,
  },
  seriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seriesName: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
});
