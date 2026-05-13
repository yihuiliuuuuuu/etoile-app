import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, CardSectionHeader } from '../ui/Card';
import { colors, spacing, type } from '../../theme';
import type { NextClass } from '../../types/home';

type NextClassCardProps = {
  data: NextClass;
};

export function NextClassCard({ data }: NextClassCardProps) {
  return (
    <Card style={styles.card}>
      <CardSectionHeader
        icon={
          <MaterialCommunityIcons name="yoga" size={22} color={colors.primary} />
        }
        title="Next Class"
        actionLabel="Calendar"
      />
      <View style={styles.timeRow}>
        <Text style={[type.statLarge, styles.time]}>{data.timeLabel}</Text>
        <Text style={[type.statLarge, styles.date]}>{data.dateLabel}</Text>
      </View>
      <View style={styles.locRow}>
        <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.textTertiary} />
        <Text style={[type.bodyBold, styles.loc]}>{data.locationLabel}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: spacing.sm,
  },
  time: {
    color: colors.text,
  },
  date: {
    color: colors.textSecondary,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loc: {
    color: colors.textSecondary,
  },
});
