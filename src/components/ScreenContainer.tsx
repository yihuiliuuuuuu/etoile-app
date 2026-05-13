import { ReactNode } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/src/theme';

interface ScreenContainerProps {
  children: ReactNode;
  scroll?: boolean;
  /** Extra bottom padding (e.g. to clear the tab bar). */
  bottomInset?: number;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
}

/**
 * Standard layout wrapper used by every tab screen. Applies the ivory
 * canvas, respects safe-area insets, and gives content a comfortable
 * gutter without each screen having to repeat the same boilerplate.
 */
export function ScreenContainer({
  children,
  scroll = true,
  bottomInset = 24,
  contentContainerStyle,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + spacing.lg;
  const paddingBottom = bottomInset + spacing.xxl;

  const inner = (
    <View style={[styles.inner, { paddingTop, paddingBottom }]}>{children}</View>
  );

  if (!scroll) {
    return <View style={styles.root}>{inner}</View>;
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {inner}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
});
