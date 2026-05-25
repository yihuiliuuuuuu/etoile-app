import {
  ONBOARDING_CTA_BOTTOM_TEXT,
  ONBOARDING_CTA_TOP_TEXT,
  ONBOARDING_SLIDES,
  ONBOARDING_STORY_DURATION_MS,
  type OnboardingSlide,
} from '@/constants/onboarding-slides';
import { letterTight, sfPro, weightSemibold } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandStoryBackground } from '@/components/onboarding/brand-story-background';
import { StoryProgressBars } from '@/components/onboarding/story-progress-bars';
import { setOnboardingCompleted } from '@/utils/onboarding-storage';

const SLIDE_COUNT = ONBOARDING_SLIDES.length;
const HOLD_THRESHOLD_MS = 220;
const { width: SCREEN_W } = Dimensions.get('window');

type OnboardingPhase = 'stories' | 'cta';

export function StoryOnboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<OnboardingPhase>('stories');
  const [index, setIndex] = useState(0);
  const progress = useSharedValue(0);
  const indexRef = useRef(0);
  const finishingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartedAtRef = useRef(0);
  const didNavigateOnPressRef = useRef(false);

  const clearStoryTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    cancelAnimation(progress);
  }, [progress]);

  const finishOnboarding = useCallback(async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    clearStoryTimer();
    try {
      await setOnboardingCompleted();
    } catch {
      // Still enter the app if persistence fails.
    }
    try {
      router.replace('/(tabs)/classes');
    } catch {
      finishingRef.current = false;
    }
  }, [clearStoryTimer, router]);

  const showCtaScreen = useCallback(() => {
    if (finishingRef.current) return;
    clearStoryTimer();
    progress.value = 1;
    setPhase('cta');
  }, [clearStoryTimer, progress]);

  const goToIndex = useCallback(
    (next: number) => {
      if (finishingRef.current) return;
      if (next >= SLIDE_COUNT) {
        showCtaScreen();
        return;
      }
      if (next < 0) return;

      clearStoryTimer();
      indexRef.current = next;
      setIndex(next);
    },
    [clearStoryTimer, showCtaScreen],
  );

  const startStoryTimer = useCallback(() => {
    clearStoryTimer();
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: ONBOARDING_STORY_DURATION_MS,
      easing: Easing.linear,
    });

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const onLastSlide = indexRef.current === SLIDE_COUNT - 1;
      if (onLastSlide) {
        showCtaScreen();
      } else {
        goToIndex(indexRef.current + 1);
      }
    }, ONBOARDING_STORY_DURATION_MS);
  }, [clearStoryTimer, goToIndex, progress, showCtaScreen]);

  useEffect(() => {
    if (phase !== 'stories') return;
    startStoryTimer();
    return () => clearStoryTimer();
  }, [index, phase, startStoryTimer, clearStoryTimer]);

  const handleTapAt = useCallback(
    (locationX: number) => {
      const onLastSlide = indexRef.current === SLIDE_COUNT - 1;
      if (onLastSlide) {
        if (locationX < SCREEN_W * 0.33) {
          goToIndex(indexRef.current - 1);
        } else {
          showCtaScreen();
        }
        return;
      }
      if (locationX < SCREEN_W * 0.33) {
        goToIndex(indexRef.current - 1);
      } else {
        goToIndex(indexRef.current + 1);
      }
    },
    [goToIndex, showCtaScreen],
  );

  const onPressIn = useCallback(() => {
    pressStartedAtRef.current = Date.now();
    didNavigateOnPressRef.current = false;
    clearStoryTimer();
  }, [clearStoryTimer]);

  const onPress = useCallback(
    (locationX: number) => {
      const heldMs = Date.now() - pressStartedAtRef.current;
      if (heldMs >= HOLD_THRESHOLD_MS) return;

      didNavigateOnPressRef.current = true;
      handleTapAt(locationX);
    },
    [handleTapAt],
  );

  const onPressOut = useCallback(() => {
    const heldMs = Date.now() - pressStartedAtRef.current;
    if (heldMs < HOLD_THRESHOLD_MS && didNavigateOnPressRef.current) {
      return;
    }
    if (heldMs >= HOLD_THRESHOLD_MS) {
      startStoryTimer();
    }
  }, [startStoryTimer]);

  if (phase === 'cta') {
    return (
      <View style={styles.screen}>
        <View style={[styles.top, { paddingTop: insets.top + 8 }]} pointerEvents="none">
          <StoryProgressBars
            count={SLIDE_COUNT}
            activeIndex={SLIDE_COUNT - 1}
            progress={progress}
          />
        </View>

        <View style={styles.content} pointerEvents="none">
          <View style={styles.ctaBlock}>
            <Text style={styles.bodyText}>{ONBOARDING_CTA_TOP_TEXT}</Text>
            <View style={styles.ctaFooter}>
              <Text style={styles.ctaArrow}>→</Text>
              <Text style={styles.bodyText}>{ONBOARDING_CTA_BOTTOM_TEXT}</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.tapSurface}
          onPress={() => void finishOnboarding()}
          accessibilityRole="button"
          accessibilityLabel="Let's begin your journey"
        />
      </View>
    );
  }

  const slide = ONBOARDING_SLIDES[index]!;
  const isBrandSlide = slide.kind === 'brand';

  return (
    <View style={styles.screen}>
      <BrandStoryBackground visible={isBrandSlide} />

      <View style={[styles.top, { paddingTop: insets.top + 8 }]} pointerEvents="none">
        <StoryProgressBars count={SLIDE_COUNT} activeIndex={index} progress={progress} />
      </View>

      <View style={styles.content} pointerEvents="none">
        <SlideContent slide={slide} />
      </View>

      <Pressable
        style={styles.tapSurface}
        onPressIn={onPressIn}
        onPress={(e) => onPress(e.nativeEvent.locationX)}
        onPressOut={onPressOut}
        accessibilityLabel="Story navigation"
      />
    </View>
  );
}

function SlideContent({ slide }: { slide: OnboardingSlide }) {
  if (slide.kind === 'brand') {
    return (
      <View style={styles.brandBlock}>
        <Text style={styles.brandTitle}>{slide.title}</Text>
        <Text style={styles.brandSubtitle}>{slide.subtitle}</Text>
      </View>
    );
  }

  return (
    <View style={styles.bodyBlock}>
      <Text style={styles.bodyText}>{slide.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  top: {
    paddingHorizontal: 8,
    zIndex: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'flex-start',
    zIndex: 1,
    position: 'relative',
  },
  tapSurface: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  brandBlock: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 120,
  },
  brandTitle: {
    fontFamily: 'AbrilFatface_400Regular',
    fontSize: 52,
    color: '#fff',
    letterSpacing: letterTight,
    marginBottom: 10,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontFamily: sfPro,
    fontSize: 18,
    fontWeight: weightSemibold,
    color: '#fff',
    letterSpacing: letterTight,
    textAlign: 'center',
  },
  bodyBlock: {
    paddingTop: 72,
  },
  bodyText: {
    fontFamily: sfPro,
    fontSize: 28,
    fontWeight: weightSemibold,
    color: '#fff',
    letterSpacing: letterTight,
    lineHeight: 36,
  },
  ctaBlock: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 72,
    paddingBottom: 100,
  },
  ctaFooter: {
    gap: 20,
  },
  ctaArrow: {
    fontFamily: sfPro,
    fontSize: 28,
    fontWeight: weightSemibold,
    color: '#fff',
    letterSpacing: letterTight,
  },
});
