import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/src/theme';

import { AppText } from './AppText';

interface LegendDotProps {
  label: string;
  color: string;
}

export function LegendDot({ label, color }: LegendDotProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
    marginTop: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
});
