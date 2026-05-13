import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, spacing, type } from '../../theme';

type CardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function Card({ children, style }: CardProps) {
  return <View style={[styles.root, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
});

type CardSectionHeaderProps = {
  icon: ReactNode;
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function CardSectionHeader({
  icon,
  title,
  actionLabel,
  onActionPress,
}: CardSectionHeaderProps) {
  return (
    <View style={headerStyles.row}>
      <View style={headerStyles.left}>
        {icon}
        <Text style={[type.cardTitle, headerStyles.title]}>{title}</Text>
      </View>
      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={12}>
          <Text style={headerStyles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.primary,
  },
  action: {
    ...type.micro,
    color: colors.textTertiary,
  },
});
