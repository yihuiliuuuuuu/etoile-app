import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';
import { Studio } from '../types';

interface StudioBarProps {
  studios: Studio[];
}

export const StudioBar: React.FC<StudioBarProps> = ({ studios }) => (
  <View>
    <View style={styles.barContainer}>
      {studios.map((studio, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            {
              flex: studio.percentage,
              backgroundColor: studio.color,
              borderTopLeftRadius: index === 0 ? 4 : 0,
              borderBottomLeftRadius: index === 0 ? 4 : 0,
              borderTopRightRadius: index === studios.length - 1 ? 4 : 0,
              borderBottomRightRadius: index === studios.length - 1 ? 4 : 0,
            },
          ]}
        />
      ))}
    </View>
    <View style={styles.legend}>
      {studios.map((studio, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: studio.color }]} />
          <Text style={styles.legendText}>
            {studio.name}
            {studio.isMost ? ' (Most)' : ''}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    height: 14,
    gap: 2,
    marginBottom: 14,
  },
  segment: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    rowGap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    ...typography.label,
    color: colors.textSecondary,
  },
});
