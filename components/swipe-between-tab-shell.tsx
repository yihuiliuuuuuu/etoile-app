import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { type ReactNode, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import type { FloatingTabId } from '@/components/tab-nav-types';

type Props = {
  active: FloatingTabId;
  children: ReactNode;
};

export function SwipeBetweenTabShell({ active, children }: Props) {
  const router = useRouter();

  const goToPractice = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/practice' as never);
  }, [router]);

  const goToClasses = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/classes' as never);
  }, [router]);

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .activeOffsetX([-40, 40])
      .failOffsetY([-32, 32]);

    if (active === 'classes') {
      return pan.onEnd((e) => {
        const { translationX, velocityX } = e;
        if (translationX < -72 || velocityX < -750) {
          runOnJS(goToPractice)();
        }
      });
    }

    return pan.onEnd((e) => {
      const { translationX, velocityX } = e;
      if (translationX > 72 || velocityX > 750) {
        runOnJS(goToClasses)();
      }
    });
  }, [active, goToClasses, goToPractice]);

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.fill}>{children}</View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
