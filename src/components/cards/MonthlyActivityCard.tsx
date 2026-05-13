import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { Card } from '@/src/components/Card';
import { CardHeader } from '@/src/components/CardHeader';
import { MiniBarChart } from '@/src/components/MiniBarChart';
import { colors, spacing } from '@/src/theme';
import { MonthBucket } from '@/src/types';

interface MonthlyActivityCardProps {
  title?: string;
  buckets: MonthBucket[];
  currentLabel: string;
  currentValue: number | string;
  unit?: string;
  onViewPress?: () => void;
}

export function MonthlyActivityCard({
  title = 'Monthly Activity',
  buckets,
  currentLabel,
  currentValue,
  unit,
  onViewPress,
}: MonthlyActivityCardProps) {
  return (
    <Card>
      <CardHeader
        icon="calendar-outline"
        title={title}
        action="View"
        onActionPress={onViewPress}
      />

      <View style={styles.row}>
        <View style={styles.leftBlock}>
          <View style={styles.metricRow}>
            <AppText variant="metricLarge">{currentValue}</AppText>
            <AppText
              variant="bodyMuted"
              color={colors.textTertiary}
              style={styles.metricUnit}
            >
              {currentLabel}
            </AppText>
          </View>
          {unit ? (
            <AppText variant="caption" color={colors.textTertiary}>
              {unit}
            </AppText>
          ) : null}
        </View>

        <MiniBarChart values={buckets.map((b) => b.value)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  leftBlock: {
    flex: 1,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricUnit: {
    marginLeft: spacing.sm,
  },
});
