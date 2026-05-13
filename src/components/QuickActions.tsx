import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { colors, radii, shadows, spacing } from '@/src/theme';

export interface QuickAction {
  id: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

/**
 * Row of three rounded action cards. The icons sit inside a soft blush
 * circle to keep visual weight consistent and the cards equal-width.
 */
export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Haptics.selectionAsync();
            }
            action.onPress?.();
          }}
          style={({ pressed }) => [
            styles.tile,
            shadows.card,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name={action.icon} size={20} color={colors.primary} />
          </View>
          <AppText
            variant="cardLabel"
            color={colors.textPrimary}
            style={styles.label}
            numberOfLines={2}
          >
            {action.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-start',
    minHeight: 100,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  label: {
    marginTop: spacing.xs,
  },
});
