import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

type Props = {
  count: number;
  activeIndex: number;
  progress: SharedValue<number>;
};

export function StoryProgressBars({ count, activeIndex, progress }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.track}>
          {index < activeIndex ? <View style={styles.fillComplete} /> : null}
          {index === activeIndex ? <ActiveFill progress={progress} /> : null}
        </View>
      ))}
    </View>
  );
}

function ActiveFill({ progress }: { progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    width: `${Math.min(100, Math.max(0, progress.value * 100))}%`,
  }));

  return (
    <Animated.View style={[styles.fillActive, style]} />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
  },
  track: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    overflow: 'hidden',
  },
  fillComplete: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
  },
  fillActive: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
});
