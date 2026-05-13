import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { StudioVisit } from '../types';
import { FontSize, Spacing, Colors, BorderRadius } from '../constants/theme';

interface StudiosCardProps {
  studios: StudioVisit[];
}

export function StudiosCard({ studios }: StudiosCardProps) {
  const total = studios.reduce((sum, s) => sum + s.count, 0);
  const mostVisited = studios[0];

  return (
    <Card>
      <SectionHeader icon="☺" title="Studios Attended" action="View" />
      <View style={styles.barContainer}>
        {studios.map((studio) => (
          <View
            key={studio.name}
            style={[
              styles.barSegment,
              {
                flex: studio.count / total,
                backgroundColor: studio.color,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {studios.map((studio) => (
          <View key={studio.name} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: studio.color }]} />
            <Text style={styles.legendText}>
              {studio.name}
              {studio.name === mostVisited.name ? ' (Most)' : ''}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    height: 16,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    gap: 2,
  },
  barSegment: {
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});
