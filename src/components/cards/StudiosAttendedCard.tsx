import { StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { CardHeader } from '@/src/components/CardHeader';
import { LegendDot } from '@/src/components/LegendDot';
import { StackedBar } from '@/src/components/StackedBar';
import { spacing } from '@/src/theme';
import { Studio } from '@/src/types';

interface StudiosAttendedCardProps {
  studios: Studio[];
  onViewPress?: () => void;
}

export function StudiosAttendedCard({ studios, onViewPress }: StudiosAttendedCardProps) {
  return (
    <Card>
      <CardHeader
        icon="happy-outline"
        title="Studios Attended"
        action="View"
        onActionPress={onViewPress}
      />

      <StackedBar
        segments={studios.map((s) => ({ id: s.id, color: s.color, value: s.classes }))}
      />

      <View style={styles.legend}>
        {studios.map((studio) => (
          <LegendDot key={studio.id} label={studio.name} color={studio.color} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
});
