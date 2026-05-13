import { StyleSheet, View } from 'react-native';

import { colors, radii } from '@/src/theme';

interface ProgressBarProps {
  /** Value between 0 and 1. */
  progress: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
}

export function ProgressBar({
  progress,
  height = 10,
  trackColor = colors.chart.track,
  fillColor = colors.accent,
}: ProgressBarProps) {
  const safe = Math.max(0, Math.min(1, progress));
  return (
    <View
      style={[
        styles.track,
        { height, backgroundColor: trackColor, borderRadius: height / 2 },
      ]}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(safe * 100), min: 0, max: 100 }}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${safe * 100}%`,
            backgroundColor: fillColor,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderTopRightRadius: radii.sm,
    borderBottomRightRadius: radii.sm,
  },
});
