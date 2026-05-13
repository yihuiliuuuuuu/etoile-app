import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { colors, typography } from '../theme';
import { NextClass } from '../types';

interface NextClassCardProps {
  nextClass: NextClass;
}

export const NextClassCard: React.FC<NextClassCardProps> = ({ nextClass }) => (
  <Card>
    <SectionHeader icon="💃" title="Next Class" actionLabel="Calendar" />
    <View style={styles.timeRow}>
      <Text style={styles.time}>{nextClass.time}</Text>
      <Text style={styles.date}>
        {' '}{nextClass.dayOfWeek}{' '}
        <Text style={styles.dateMonth}>{nextClass.monthDay}</Text>
      </Text>
    </View>
    <View style={styles.subtitleRow}>
      <Text style={styles.subtitleIcon}>🩰</Text>
      <Text style={styles.subtitle}>{nextClass.subtitle}</Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  time: {
    ...typography.timeDisplay,
    color: colors.text,
  },
  date: {
    ...typography.dateDisplay,
    color: colors.primary,
  },
  dateMonth: {
    color: colors.primary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  subtitleIcon: {
    fontSize: 14,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
