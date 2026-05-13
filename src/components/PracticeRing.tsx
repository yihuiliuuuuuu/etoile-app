import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { AppText } from '@/src/components/AppText';
import { colors } from '@/src/theme';

interface PracticeRingProps {
  /** Value between 0 and 1. */
  progress: number;
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  centerUnit?: string;
  /** Color override for the track (background ring). */
  trackColor?: string;
  /** Solid color override; ignored when `gradient` is true. */
  color?: string;
  /** Use a subtle rose → gold gradient on the progress stroke. */
  gradient?: boolean;
}

/**
 * Circular practice progress ring. Renders a soft gradient stroke that
 * sweeps clockwise from 12 o'clock, with the metric centered inside.
 */
export function PracticeRing({
  progress,
  size = 200,
  strokeWidth = 14,
  centerLabel,
  centerValue,
  centerUnit,
  trackColor,
  color,
  gradient = true,
}: PracticeRingProps) {
  const safe = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - safe);
  const halfSize = size / 2;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={styles.svg}
      >
        <Defs>
          <LinearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.primary} stopOpacity={1} />
            <Stop offset="1" stopColor={colors.gold} stopOpacity={1} />
          </LinearGradient>
        </Defs>

        <Circle
          cx={halfSize}
          cy={halfSize}
          r={radius}
          stroke={trackColor ?? colors.chart.track}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={halfSize}
          cy={halfSize}
          r={radius}
          stroke={gradient ? 'url(#ringGradient)' : (color ?? colors.primary)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          fill="none"
          transform={`rotate(-90 ${halfSize} ${halfSize})`}
        />
      </Svg>

      <View style={styles.center}>
        {centerLabel ? (
          <AppText variant="eyebrow" color={colors.textTertiary}>
            {centerLabel}
          </AppText>
        ) : null}
        {centerValue ? (
          <AppText variant="metricXL" color={colors.textPrimary} style={styles.value}>
            {centerValue}
          </AppText>
        ) : null}
        {centerUnit ? (
          <AppText variant="bodyMuted" color={colors.textSecondary}>
            {centerUnit}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    marginTop: 2,
  },
});
