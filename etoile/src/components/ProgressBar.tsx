import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, BorderRadius, FontSize, Spacing } from '../constants/theme';

interface ProgressBarProps {
  current: number;
  target: number;
  unit: string;
}

export function ProgressBar({ current, target, unit }: ProgressBarProps) {
  const pct = Math.min((current / target) * 100, 100);
  const label = `${current} / ${target} ${unit} • ${Math.round(pct)}%`;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  track: {
    height: 8,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
});
