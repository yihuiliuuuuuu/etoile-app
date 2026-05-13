import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { colors, radii, spacing } from '@/src/theme';

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  icon?: ComponentProps<typeof Ionicons>['name'];
  variant?: 'solid' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

/**
 * Pill-shaped CTA used across the app. The solid variant uses the
 * dusty-rose primary; outline sits on cards; ghost is for tertiary
 * actions like "View progress".
 */
export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = 'solid',
  fullWidth,
}: PrimaryButtonProps) {
  const isSolid = variant === 'solid';
  const isOutline = variant === 'outline';

  const labelColor = isSolid
    ? colors.textOnPrimary
    : isOutline
      ? colors.textPrimary
      : colors.primary;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === 'ios') {
          Haptics.selectionAsync();
        }
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        isSolid && styles.solid,
        isOutline && styles.outline,
        variant === 'ghost' && styles.ghost,
        fullWidth && styles.fullWidth,
        pressed && { opacity: 0.85 },
      ]}
    >
      {icon ? <Ionicons name={icon} size={16} color={labelColor} style={styles.icon} /> : null}
      <AppText variant="button" color={labelColor}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
  },
  solid: {
    backgroundColor: colors.primaryDeep,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  icon: {
    marginRight: spacing.sm,
  },
});
