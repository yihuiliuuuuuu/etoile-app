import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  SHEET_BACKDROP_CLOSE,
  SHEET_CLOSE,
  SHEET_OPEN,
} from '@/constants/bottom-sheet-transition';

const SCREEN_H = Dimensions.get('window').height;

export function useBottomSheetAnimation(onClose: () => void) {
  const translateY = useSharedValue(SCREEN_H);
  const backdropOpacity = useSharedValue(0);

  const openAnimated = useCallback(() => {
    backdropOpacity.value = withTiming(1, SHEET_OPEN);
    translateY.value = withTiming(0, SHEET_OPEN);
  }, [backdropOpacity, translateY]);

  const resetInstant = useCallback(() => {
    translateY.value = SCREEN_H;
    backdropOpacity.value = 0;
  }, [backdropOpacity, translateY]);

  const closeAnimated = useCallback(() => {
    backdropOpacity.value = withTiming(0, SHEET_BACKDROP_CLOSE);
    translateY.value = withTiming(SCREEN_H, SHEET_CLOSE, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  }, [backdropOpacity, onClose, translateY]);

  const backdropAnimStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return {
    translateY,
    closeAnimated,
    openAnimated,
    resetInstant,
    backdropAnimStyle,
    screenHeight: SCREEN_H,
  };
}
