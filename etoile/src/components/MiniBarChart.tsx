import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface MiniBarChartProps {
  data: number[];
  height?: number;
  barWidth?: number;
}

export function MiniBarChart({ data, height = 48, barWidth = 8 }: MiniBarChartProps) {
  return (
    <View style={[styles.container, { height }]}>
      {data.map((value, index) => {
        const isLast = index === data.length - 1;
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: `${Math.max(value * 100, 8)}%`,
                width: isLast ? barWidth + 4 : barWidth,
                backgroundColor: isLast ? Colors.primary : Colors.textMuted,
                borderRadius: isLast ? BorderRadius.sm : barWidth / 2,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  bar: {
    borderRadius: 4,
  },
});
