import { StyleSheet, View } from 'react-native';
import { colors, radii } from '../../theme';

type ProgressTrackProps = {
  progress: number;
};

export function ProgressTrack({ progress }: ProgressTrackProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: radii.bar,
    backgroundColor: colors.barInactive,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.bar,
    backgroundColor: colors.primary,
  },
});
