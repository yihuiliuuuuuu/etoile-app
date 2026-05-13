import { ReactNode } from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '@/src/theme';

type Variant = 'surface' | 'soft' | 'primary';

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: Variant;
  padded?: boolean;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Generic surface used everywhere. Three flavors:
 *   - `surface`: white card with a soft shadow
 *   - `soft`: warm blush wash, no shadow (for secondary blocks)
 *   - `primary`: deep dusty rose, used for the hero CTA card
 */
export function Card({
  children,
  variant = 'surface',
  padded = true,
  style,
  ...rest
}: CardProps) {
  const variantStyle =
    variant === 'primary'
      ? styles.primary
      : variant === 'soft'
        ? styles.soft
        : styles.surface;

  const shadow = variant === 'surface' ? shadows.card : undefined;

  return (
    <View
      {...rest}
      style={[styles.base, variantStyle, shadow, padded && styles.padded, style]}
      accessibilityRole={rest.accessibilityRole ?? 'summary'}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
  },
  padded: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  surface: {
    backgroundColor: colors.surface,
  },
  soft: {
    backgroundColor: colors.surfaceAlt,
  },
  primary: {
    backgroundColor: colors.primary,
  },
});
