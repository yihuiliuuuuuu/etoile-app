import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { Card } from '@/src/components/Card';
import { CardHeader } from '@/src/components/CardHeader';
import { colors, spacing } from '@/src/theme';
import { UpcomingClass } from '@/src/types';

interface NextClassCardProps {
  upcoming: UpcomingClass;
  onCalendarPress?: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDay(date: Date): string {
  return `${DAYS[date.getDay()]} ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function NextClassCard({ upcoming, onCalendarPress }: NextClassCardProps) {
  return (
    <Card>
      <CardHeader
        icon="body-outline"
        title="Next Class"
        action="Calendar"
        onActionPress={onCalendarPress}
      />

      <View style={styles.row}>
        <AppText variant="metricMedium">{formatTime(upcoming.startsAt)}</AppText>
        <AppText
          variant="metricMedium"
          color={colors.textTertiary}
          style={styles.dateLabel}
        >
          {formatDay(upcoming.startsAt)}
        </AppText>
      </View>

      <View style={styles.studioRow}>
        <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
        <AppText
          variant="bodyMuted"
          color={colors.textSecondary}
          style={styles.studioLabel}
        >
          {upcoming.studio}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  dateLabel: {
    marginLeft: spacing.sm,
  },
  studioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  studioLabel: {
    marginLeft: spacing.xs,
  },
});
