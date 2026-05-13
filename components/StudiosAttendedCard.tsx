import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import CardHeader from './CardHeader';
import { StudiosAttended } from '../types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import StudioIcon from './icons/StudioIcon';

interface StudiosAttendedCardProps {
  data: StudiosAttended;
  onView?: () => void;
}

export default function StudiosAttendedCard({ data, onView }: StudiosAttendedCardProps) {
  return (
    <Card>
      <CardHeader
        icon={<StudioIcon size={18} color={Colors.accent} />}
        title="Studios Attended"
        actionLabel="View"
        onAction={onView}
      />

      {/* Segmented bar */}
      <View style={styles.segmentBar}>
        {data.studios.map((studio, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              {
                flex: studio.percentage,
                backgroundColor: studio.color,
                borderTopLeftRadius: i === 0 ? 4 : 0,
                borderBottomLeftRadius: i === 0 ? 4 : 0,
                borderTopRightRadius: i === data.studios.length - 1 ? 4 : 0,
                borderBottomRightRadius: i === data.studios.length - 1 ? 4 : 0,
              },
            ]}
          />
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {data.studios.map((studio, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: studio.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>
              {i === 0 ? `${studio.name} (Most)` : studio.name}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  segmentBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 14,
  },
  segment: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    rowGap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
