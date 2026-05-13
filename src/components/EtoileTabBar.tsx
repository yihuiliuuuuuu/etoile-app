import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/src/components/AppText';
import { FloatingActionButton } from '@/src/components/FloatingActionButton';
import { colors, radii, shadows, spacing } from '@/src/theme';

interface TabConfig {
  routeName: string;
  label: string;
  Icon: (props: { active: boolean }) => React.ReactElement;
}

function DiamondIcon({ active }: { active: boolean }) {
  return (
    <View
      style={[
        styles.diamond,
        {
          backgroundColor: active ? colors.accent : '#1B1B1F',
        },
      ]}
    />
  );
}

function DotIcon({ active }: { active: boolean }) {
  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: active ? colors.accent : '#1B1B1F',
        },
      ]}
    />
  );
}

const TAB_CONFIG: TabConfig[] = [
  { routeName: 'index', label: 'Classes', Icon: DiamondIcon },
  { routeName: 'practice', label: 'Practice', Icon: DotIcon },
];

export function EtoileTabBar({ state, navigation, onAddPress }: BottomTabBarProps & { onAddPress?: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={[styles.pill, shadows.card]}>
        {TAB_CONFIG.map((tab, index) => {
          const route = state.routes.find((r) => r.name === tab.routeName);
          if (!route) return null;
          const isFocused = state.index === state.routes.indexOf(route);

          return (
            <Pressable
              key={tab.routeName}
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={tab.label}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Haptics.selectionAsync();
                }
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name as never);
                }
              }}
              style={[
                styles.tab,
                isFocused && styles.tabActive,
                index === 0 && { marginLeft: 0 },
              ]}
              hitSlop={6}
            >
              <tab.Icon active={isFocused} />
              <AppText
                variant="tabLabel"
                color={isFocused ? colors.textPrimary : colors.textSecondary}
                style={styles.tabLabel}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <FloatingActionButton onPress={onAddPress} bottomInset={Math.max(insets.bottom, 12) - 4} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    backgroundColor: 'transparent',
  },
  pill: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    padding: 6,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    marginLeft: 4,
    minWidth: 84,
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.surfaceMuted,
  },
  tabLabel: {
    marginLeft: spacing.xs,
  },
  diamond: {
    width: 14,
    height: 14,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
