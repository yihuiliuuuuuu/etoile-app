import { BlurView } from 'expo-blur';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

type Props = {
  animatedStyle: AnimatedStyle<ViewStyle>;
  onPress: () => void;
};

export function SheetBackdrop({ animatedStyle, onPress }: Props) {
  return (
    <Pressable style={styles.backdropPress} onPress={onPress}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 36 : 28}
          tint="systemChromeMaterialLight"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.backdropDim} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
});
