import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function CardHeader({ icon, title, actionLabel, onAction }: CardHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.titleGroup}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionLabel && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...Typography.headingMedium,
    color: Colors.accent,
  },
  action: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
});
