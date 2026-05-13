import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

interface ProgressBarProps {
  current: number;
  target: number;
  unit: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, unit }) => {
  const progress = Math.min(current / target, 1);
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.label}>
        {current} / {target} {unit} • {percentage}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  track: {
    height: 8,
    backgroundColor: colors.progressTrack,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.progressFill,
    borderRadius: 4,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
});
