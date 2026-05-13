import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface ProgressBarProps {
  current: number;
  total: number;
  unit: string;
  percentage: number;
}

export default function ProgressBar({ current, total, unit, percentage }: ProgressBarProps) {
  const pct = Math.min(percentage / 100, 1);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` as any }]} />
      </View>
      <Text style={styles.label}>
        {current}/{total} {unit} • {percentage}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.chartBar,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'right',
  },
});
