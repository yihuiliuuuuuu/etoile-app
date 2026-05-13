import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, CardSectionHeader } from '../ui/Card';
import { MiniBars } from '../ui/MiniBars';
import { colors, spacing, type } from '../../theme';
import type { MonthlyActivity } from '../../types/home';

type MonthlyActivityCardProps = {
  data: MonthlyActivity;
};

export function MonthlyActivityCard({ data }: MonthlyActivityCardProps) {
  return (
    <Card style={styles.card}>
      <CardSectionHeader
        icon={
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={22}
            color={colors.primary}
          />
        }
        title="Monthly Activity"
        actionLabel="View"
      />
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={[type.statLarge, styles.count]}>{data.monthCount}</Text>
          <Text style={[type.statLabel, styles.month]}> {data.monthLabel}</Text>
        </View>
        <MiniBars values={data.barHeights} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  count: {
    color: colors.text,
  },
  month: {
    color: colors.textSecondary,
  },
});
