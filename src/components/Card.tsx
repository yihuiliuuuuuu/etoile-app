import { ReactNode } from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '@/src/theme';

interface CardProps extends ViewProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function Card({ children, style, ...rest }: CardProps) {
  return (
    <View
      {...rest}
      style={[styles.card, shadows.card, style]}
      accessibilityRole={rest.accessibilityRole ?? 'summary'}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg + 2,
  },
});
