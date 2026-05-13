import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { MiniBarChart } from './MiniBarChart';
import { FontSize, Spacing, Colors } from '../constants/theme';

interface ActivityCardProps {
  icon?: string;
  title: string;
  value: number;
  label: string;
  data: number[];
}

export function ActivityCard({ icon, title, value, label, data }: ActivityCardProps) {
  return (
    <Card>
      <SectionHeader icon={icon || '▦'} title={title} action="View" />
      <View style={styles.content}>
        <View style={styles.left}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
        <MiniBarChart data={data} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  left: {
    flexShrink: 1,
  },
  value: {
    fontSize: FontSize.display,
    fontWeight: '300',
    color: Colors.text,
    letterSpacing: -1,
    lineHeight: FontSize.display * 1.1,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
