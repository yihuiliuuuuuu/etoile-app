import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface MiniBarChartProps {
  bars: number[];
  height?: number;
  activeIndex?: number;
}

export const MiniBarChart: React.FC<MiniBarChartProps> = ({
  bars,
  height = 48,
  activeIndex,
}) => {
  const lastIndex = bars.length - 1;
  const active = activeIndex ?? lastIndex;

  return (
    <View style={[styles.container, { height }]}>
      {bars.map((value, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height: `${Math.max(value * 100, 12)}%`,
              backgroundColor: index === active ? colors.primary : colors.textMuted,
              borderRadius: 3,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    width: 6,
    minHeight: 6,
  },
});
