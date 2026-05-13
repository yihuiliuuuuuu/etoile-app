import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

const ROUTES = ['index', 'practice'];
const LABELS = ['Classes', 'Practice'];

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const label = LABELS[index] ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isFocused && styles.iconWrapperActive,
                ]}
              >
                <TabIcon name={route.name} active={isFocused} />
              </View>
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? Colors.accent : Colors.textSecondary },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}

        {/* FAB */}
        <Pressable style={styles.fab} accessibilityLabel="Add">
          <Text style={styles.fabIcon}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TabIcon({ name, active }: { name: string; active: boolean }) {
  if (name === 'index') {
    return (
      <View
        style={[
          styles.diamond,
          { backgroundColor: active ? Colors.accent : Colors.textPrimary },
        ]}
      />
    );
  }
  return (
    <View
      style={[
        styles.circle,
        {
          backgroundColor: active ? Colors.accent : Colors.textPrimary,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.cardBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.separator,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 32,
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: Colors.accentMuted,
    borderRadius: 16,
  },
  label: {
    ...Typography.caption,
    fontWeight: '500',
  },
  diamond: {
    width: 12,
    height: 12,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  fab: {
    position: 'absolute',
    right: 20,
    top: -18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 26,
    fontWeight: '300',
    color: Colors.textInverse,
    lineHeight: 30,
    marginTop: -2,
  },
});
