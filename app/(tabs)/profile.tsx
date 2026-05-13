import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { Avatar } from '@/src/components/Avatar';
import { Card } from '@/src/components/Card';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { homeSnapshot } from '@/src/data/mock';
import { colors, radii, spacing } from '@/src/theme';

interface Row {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
}

const SETTINGS: Row[] = [
  { icon: 'time-outline', label: 'Daily goal', value: '60 min' },
  { icon: 'notifications-outline', label: 'Reminders', value: 'Mornings' },
  { icon: 'sparkles-outline', label: 'Theme', value: 'Soft rose' },
  { icon: 'help-circle-outline', label: 'Support' },
  { icon: 'log-out-outline', label: 'Sign out' },
];

export default function ProfileScreen() {
  const { user } = homeSnapshot;

  return (
    <ScreenContainer bottomInset={96}>
      <View style={styles.heroRow}>
        <Avatar uri={user.avatarUri} initials={user.initials} size={72} />
        <View style={styles.heroCopy}>
          <AppText variant="titleSerif" color={colors.textPrimary}>
            {user.firstName}
          </AppText>
          <AppText variant="bodyMuted" color={colors.textTertiary}>
            Pre-professional · Year 4
          </AppText>
        </View>
      </View>

      <Card variant="soft">
        <AppText variant="subtitleSerifItalic" color={colors.textPrimary}>
          “Tenez votre dos.” — Mme. Laurent
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={styles.quoteCaption}>
          Saved from your last class on May 9
        </AppText>
      </Card>

      <View style={styles.settings}>
        {SETTINGS.map((row, idx) => (
          <View
            key={row.label}
            style={[
              styles.settingsRow,
              idx === SETTINGS.length - 1 && styles.settingsRowLast,
            ]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={row.icon} size={18} color={colors.primary} />
            </View>
            <AppText variant="body" color={colors.textPrimary} style={styles.rowLabel}>
              {row.label}
            </AppText>
            {row.value ? (
              <AppText variant="bodyMuted" color={colors.textTertiary} style={styles.rowValue}>
                {row.value}
              </AppText>
            ) : null}
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  heroCopy: {
    flex: 1,
  },
  quoteCaption: {
    marginTop: spacing.md,
  },
  settings: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingsRowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowLabel: {
    flex: 1,
  },
  rowValue: {
    marginRight: spacing.sm,
  },
});
