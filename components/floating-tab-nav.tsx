import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import type { ComponentType } from 'react';
import { useCallback, useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { isExpoUINativeModuleAvailable } from '@/components/is-expo-ui-available';
import type { FloatingTabId } from '@/components/tab-nav-types';
import { CLASSES_ACCENT, PRACTICE_ACCENT } from '@/constants/tab-colors';
import { letterTight, sfPro, weightSemibold } from '@/constants/typography';

export type { FloatingTabId };

type Props = {
  active: FloatingTabId;
};

function BlurFloatingTabNav({ active }: Props) {
  const router = useRouter();

  const goClasses = useCallback(() => {
    if (active === 'classes') return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/classes' as never);
  }, [active, router]);

  const goPractice = useCallback(() => {
    if (active === 'practice') return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/practice' as never);
  }, [active, router]);

  return (
    <View style={styles.shellShadow} pointerEvents="box-none">
      <BlurView
        intensity={Platform.OS === 'ios' ? 68 : 54}
        tint="systemChromeMaterialLight"
        style={styles.blurShell}
      >
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: active === 'classes' }}
          onPress={goClasses}
          style={styles.hit}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.fallbackGlass,
                active === 'classes' && styles.fallbackGlassActive,
                pressed && styles.segmentPressed,
              ]}
            >
              <Text
                style={[
                  styles.glyph,
                  active === 'classes' && { color: CLASSES_ACCENT },
                ]}
              >
                ◆
              </Text>
              <Text
                style={[
                  styles.label,
                  active === 'classes' && { color: CLASSES_ACCENT },
                ]}
              >
                Classes
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: active === 'practice' }}
          onPress={goPractice}
          style={styles.hit}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.fallbackGlass,
                active === 'practice' && styles.fallbackGlassActive,
                pressed && styles.segmentPressed,
              ]}
            >
              <Text
                style={[
                  styles.glyph,
                  active === 'practice' && { color: PRACTICE_ACCENT },
                ]}
              >
                ●
              </Text>
              <Text
                style={[
                  styles.label,
                  active === 'practice' && { color: PRACTICE_ACCENT },
                ]}
              >
                Practice
              </Text>
            </View>
          )}
        </Pressable>
      </BlurView>
    </View>
  );
}

function useSwiftTabNavIfAvailable(): ComponentType<Props> | null {
  return useMemo(() => {
    if (!isExpoUINativeModuleAvailable()) return null;
    // Dynamic require so Expo Go never evaluates @expo/ui / ExpoUI views at load time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./swift-ui-floating-tab-nav.ios').SwiftUIFloatingTabNav as ComponentType<Props>;
  }, []);
}

export function FloatingTabNav(props: Props) {
  const SwiftNav = useSwiftTabNavIfAvailable();
  if (SwiftNav) {
    return <SwiftNav {...props} />;
  }
  return <BlurFloatingTabNav {...props} />;
}

const styles = StyleSheet.create({
  shellShadow: {
    position: 'absolute',
    left: 16,
    bottom: 28,
    width: 216,
    height: 62,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  blurShell: {
    flex: 1,
    borderRadius: 31,
    flexDirection: 'row',
    padding: 4,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...(Platform.OS === 'ios' ? { borderCurve: 'continuous' as const } : {}),
  },
  hit: {
    flex: 1,
    justifyContent: 'center',
  },
  segmentPressed: {
    transform: [{ scale: 0.97 }],
  },
  fallbackGlass: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  fallbackGlassActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  glyph: {
    fontFamily: sfPro,
    color: '#333',
    fontSize: 22,
    letterSpacing: letterTight,
  },
  label: {
    fontFamily: sfPro,
    color: '#222',
    fontSize: 10,
    fontWeight: weightSemibold,
    letterSpacing: -0.35,
  },
});
