import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, CardSectionHeader } from '../ui/Card';
import { ProgressTrack } from '../ui/ProgressTrack';
import { colors, spacing, type } from '../../theme';
import type { YearlyGoal } from '../../types/home';

type YearlyGoalCardProps = {
  data: YearlyGoal;
};

export function YearlyGoalCard({ data }: YearlyGoalCardProps) {
  const progress = data.currentCount / data.goalCount;
  const pct = Math.round(progress * 100);
  return (
    <Card style={styles.card}>
      <CardSectionHeader
        icon={
          <MaterialCommunityIcons name="bullseye" size={22} color={colors.primary} />
        }
        title="Yearly Goal"
        actionLabel="Edit"
      />
      <View style={styles.statsRow}>
        <View>
          <Text style={[type.statLarge, styles.statNum]}>{data.monthValue}</Text>
          <Text style={[type.statLabel, styles.statCap]}>{data.monthLabel}</Text>
        </View>
        <View style={styles.statRight}>
          <Text style={[type.statLarge, styles.statNum]}>{data.yearValue}</Text>
          <Text style={[type.statLabel, styles.statCap]}>{data.yearLabel}</Text>
        </View>
      </View>
      <ProgressTrack progress={progress} />
      <Text style={styles.footer}>
        {data.currentCount} / {data.goalCount} classes · {pct}%
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statRight: {
    alignItems: 'flex-end',
  },
  statNum: {
    color: colors.text,
  },
  statCap: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    ...type.caption,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
});
