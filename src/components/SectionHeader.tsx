import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../theme';

interface SectionHeaderProps {
  icon?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  titleColor?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  actionLabel,
  onAction,
  titleColor = colors.primary,
}) => (
  <View style={styles.container}>
    <View style={styles.titleRow}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
    </View>
    {actionLabel ? (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.primary,
  },
  action: {
    ...typography.link,
    color: colors.textSecondary,
  },
});
