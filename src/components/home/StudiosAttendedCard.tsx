import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, CardSectionHeader } from '../ui/Card';
import { colors, spacing, type } from '../../theme';
import type { StudiosAttended } from '../../types/home';

type StudiosAttendedCardProps = {
  data: StudiosAttended;
};

export function StudiosAttendedCard({ data }: StudiosAttendedCardProps) {
  const total = data.slices.reduce((a, s) => a + s.percent, 0);
  const remainder = Math.max(0, 100 - total);

  return (
    <Card style={styles.card}>
      <CardSectionHeader
        icon={
          <MaterialCommunityIcons
            name="emoticon-happy-outline"
            size={22}
            color={colors.primary}
          />
        }
        title="Studios Attended"
        actionLabel="View"
      />
      <View style={styles.bar}>
        {data.slices.map((s) => (
          <View
            key={s.id}
            style={[styles.segment, { flex: s.percent, backgroundColor: s.color }]}
          />
        ))}
        {remainder > 0 ? (
          <View
            style={[styles.segment, { flex: remainder, backgroundColor: colors.barInactive }]}
          />
        ) : null}
      </View>
      <View style={styles.legend}>
        {data.slices.map((s) => (
          <View key={s.id} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.legendText} numberOfLines={1}>
              {s.name}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xxl,
  },
  bar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  segment: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    rowGap: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...type.micro,
    color: colors.textSecondary,
    flex: 1,
  },
});
