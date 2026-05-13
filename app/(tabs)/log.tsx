import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { Card } from '@/src/components/Card';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { SectionTitle } from '@/src/components/SectionTitle';
import { colors, radii, spacing } from '@/src/theme';

interface LogOption {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
}

const OPTIONS: LogOption[] = [
  {
    icon: 'time-outline',
    title: 'Log practice',
    description: 'Record minutes, focus area and how it felt.',
  },
  {
    icon: 'bookmark-outline',
    title: 'Add note',
    description: 'Capture a correction, image cue or breakthrough.',
  },
  {
    icon: 'musical-notes-outline',
    title: 'Save a variation',
    description: 'Attach music and tag the choreography.',
  },
];

export default function LogScreen() {
  return (
    <ScreenContainer bottomInset={96}>
      <View>
        <AppText variant="eyebrow" color={colors.textTertiary}>
          NEW ENTRY
        </AppText>
        <AppText variant="displaySerif" color={colors.textPrimary} style={styles.title}>
          Log practice
        </AppText>
        <AppText variant="subtitleSerifItalic" color={colors.textSecondary} style={styles.subtitle}>
          Small notes, kept consistently, become a body of work.
        </AppText>
      </View>

      <View style={{ gap: spacing.md }}>
        <SectionTitle title="What would you like to capture?" />
        {OPTIONS.map((option) => (
          <Card key={option.title}>
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Ionicons name={option.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.copy}>
                <AppText variant="sectionTitle" color={colors.textPrimary}>
                  {option.title}
                </AppText>
                <AppText variant="bodyMuted" color={colors.textSecondary} style={styles.description}>
                  {option.description}
                </AppText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </View>
          </Card>
        ))}
      </View>

      <PrimaryButton label="Start a 5-minute warm-up" icon="play" fullWidth />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  copy: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  description: {
    marginTop: 2,
  },
});
