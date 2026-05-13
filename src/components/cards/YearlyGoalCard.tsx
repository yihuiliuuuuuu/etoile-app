import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { Card } from '@/src/components/Card';
import { CardHeader } from '@/src/components/CardHeader';
import { ProgressBar } from '@/src/components/ProgressBar';
import { colors, spacing } from '@/src/theme';

interface YearlyGoalCardProps {
  monthValue: number;
  monthLabel: string;
  yearValue: number;
  yearLabel: string;
  goal: number;
  unit?: string;
  onEditPress?: () => void;
}

export function YearlyGoalCard({
  monthValue,
  monthLabel,
  yearValue,
  yearLabel,
  goal,
  unit = 'classes',
  onEditPress,
}: YearlyGoalCardProps) {
  const progress = goal > 0 ? yearValue / goal : 0;
  const pct = Math.round(progress * 100);

  return (
    <Card>
      <CardHeader
        icon="locate-outline"
        title="Yearly Goal"
        action="Edit"
        onActionPress={onEditPress}
      />

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <AppText variant="metricLarge">{formatNumber(monthValue)}</AppText>
          <AppText variant="bodyMuted" color={colors.textTertiary} style={styles.metricLabel}>
            {monthLabel}
          </AppText>
        </View>
        <View style={[styles.metric, styles.metricRight]}>
          <AppText variant="metricLarge">{formatNumber(yearValue)}</AppText>
          <AppText variant="bodyMuted" color={colors.textTertiary} style={styles.metricLabel}>
            {yearLabel}
          </AppText>
        </View>
      </View>

      <View style={styles.progressWrapper}>
        <ProgressBar progress={progress} />
      </View>

      <AppText variant="caption" color={colors.textTertiary} style={styles.footer}>
        {formatNumber(yearValue)} / {goal} {unit} · {pct}%
      </AppText>
    </Card>
  );
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: spacing.xs,
  },
  metric: {
    alignItems: 'center',
    marginRight: spacing.xxxl,
  },
  metricRight: {
    marginRight: 0,
  },
  metricLabel: {
    marginTop: spacing.xs,
  },
  progressWrapper: {
    marginTop: spacing.xl,
  },
  footer: {
    marginTop: spacing.sm,
    textAlign: 'right',
  },
});
