import { StyleSheet, View } from 'react-native';

import { colors, radii } from '@/src/theme';

interface MiniBarChartProps {
  /** Numeric values, one per bar. */
  values: number[];
  /** Index of the bar that should be highlighted (defaults to the last). */
  highlightIndex?: number;
  width?: number;
  height?: number;
  barWidth?: number;
  trackColor?: string;
  highlightColor?: string;
}

/**
 * Minimal four-bar chart used in the "Monthly Activity" and "Weekly Hours" cards.
 *
 * Bars are aligned to the bottom. The currently selected bar (defaulting to the
 * most recent) is rendered in the accent color while the rest use a muted track
 * color so the eye lands on the highlight.
 */
export function MiniBarChart({
  values,
  highlightIndex,
  width = 96,
  height = 64,
  barWidth = 12,
  trackColor = colors.chart.track,
  highlightColor = colors.accent,
}: MiniBarChartProps) {
  if (values.length === 0) return null;

  const max = Math.max(...values, 1);
  const highlight = highlightIndex ?? values.length - 1;

  return (
    <View style={[styles.container, { width, height }]}>
      {values.map((value, index) => {
        const ratio = Math.max(0.08, value / max);
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                width: barWidth,
                height: Math.round(height * ratio),
                backgroundColor: index === highlight ? highlightColor : trackColor,
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
    justifyContent: 'space-between',
  },
  bar: {
    borderRadius: radii.sm,
  },
});
