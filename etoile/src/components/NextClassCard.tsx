import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { NextClass } from '../types';
import { FontSize, Spacing, Colors } from '../constants/theme';

interface NextClassCardProps {
  nextClass: NextClass;
}

export function NextClassCard({ nextClass }: NextClassCardProps) {
  return (
    <Card>
      <SectionHeader icon="✦" title="Next Class" action="Calendar" />
      <View style={styles.timeRow}>
        <Text style={styles.time}>{nextClass.time}</Text>
        <Text style={styles.date}>
          {nextClass.day} {nextClass.date}
        </Text>
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.icon}>♫</Text>
        <Text style={styles.label}>{nextClass.label}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.md,
  },
  time: {
    fontSize: FontSize.display,
    fontWeight: '300',
    color: Colors.text,
    letterSpacing: -1,
    lineHeight: FontSize.display * 1.1,
  },
  date: {
    fontSize: FontSize.xl,
    fontWeight: '400',
    color: Colors.primary,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  icon: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
