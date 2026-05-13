import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { colors, spacing } from '@/src/theme';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: string;
  onActionPress?: () => void;
}

/**
 * Light-weight section header used between Home screen blocks.
 * Title is in the serif cut to keep the editorial tone going below
 * the hero greeting.
 */
export function SectionTitle({ title, subtitle, action, onActionPress }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <AppText variant="titleSerif" color={colors.textPrimary}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="bodyMuted" color={colors.textTertiary} style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {action ? (
        <Pressable
          onPress={onActionPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`${action} ${title}`}
        >
          <AppText variant="cardLabel" color={colors.primary}>
            {action}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
    paddingRight: spacing.md,
  },
  subtitle: {
    marginTop: 2,
  },
});
