import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { Card } from '@/src/components/Card';
import { PracticeRing } from '@/src/components/PracticeRing';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { colors, spacing } from '@/src/theme';

interface TodaysPracticeCardProps {
  /** Minutes practiced so far today. */
  minutes: number;
  /** Daily goal in minutes. */
  goalMinutes: number;
  /** Headline copy below the ring. */
  focus?: string;
  /** Optional sub-line, e.g. "Adagio · Centre work". */
  detail?: string;
  onContinue?: () => void;
}

/**
 * Hero card on the Home screen. The progress ring lives on a soft blush
 * panel inside a clean white card; the CTA sits below.
 */
export function TodaysPracticeCard({
  minutes,
  goalMinutes,
  focus = "Today's focus",
  detail,
  onContinue,
}: TodaysPracticeCardProps) {
  const progress = goalMinutes > 0 ? minutes / goalMinutes : 0;
  const pct = Math.min(100, Math.round(progress * 100));

  return (
    <Card>
      <View style={styles.ringWrapper}>
        <View style={styles.softPanel}>
          <PracticeRing
            progress={progress}
            size={196}
            strokeWidth={14}
            centerLabel="TODAY"
            centerValue={String(minutes)}
            centerUnit={`of ${goalMinutes} min · ${pct}%`}
          />
        </View>
      </View>

      <View style={styles.copy}>
        <AppText variant="cardLabel" color={colors.textTertiary} style={styles.eyebrow}>
          {focus.toUpperCase()}
        </AppText>
        <AppText variant="titleSerif" color={colors.textPrimary} style={styles.headline}>
          {detail ?? 'Pliés, tendus, and a little adagio.'}
        </AppText>
      </View>

      <PrimaryButton label="Continue practice" icon="play" onPress={onContinue} fullWidth />
    </Card>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    alignItems: 'center',
  },
  softPanel: {
    width: '100%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 20,
    alignItems: 'center',
  },
  copy: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  eyebrow: {
    letterSpacing: 1.6,
  },
  headline: {
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
