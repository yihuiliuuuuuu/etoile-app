import { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors, spacing } from '@/src/theme';

import { AppText } from './AppText';

interface CardHeaderProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  action?: string;
  onActionPress?: () => void;
}

export function CardHeader({ icon, title, action, onActionPress }: CardHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Ionicons name={icon} size={18} color={colors.accent} />
        <AppText variant="sectionTitle" style={styles.title}>
          {title}
        </AppText>
      </View>
      {action ? (
        <Pressable
          onPress={onActionPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`${action} ${title}`}
        >
          <AppText variant="bodyMuted" color={colors.textTertiary}>
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
    marginBottom: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    marginLeft: 2,
  },
});
