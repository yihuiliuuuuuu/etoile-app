import { CLASSES_ACCENT, PRACTICE_ACCENT } from '@/constants/tab-colors';
import { letterTight, sfPro, weightSemibold } from '@/constants/typography';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

type TabEmptyVariant = 'classes' | 'practice';

const COPY: Record<TabEmptyVariant, { emoji: string; title: string; body: string; cta: string }> = {
  classes: {
    emoji: '🩰',
    title: 'Your class journal is empty',
    body: 'Log your first class to track goals, monthly trends, and the studios you train at.',
    cta: 'Log first class',
  },
  practice: {
    emoji: '🦾',
    title: 'No practice logged yet',
    body: 'Log your first session to see weekly hours, monthly trends, and goal progress come to life.',
    cta: 'Log practice',
  },
};

type TabEmptyStateProps = {
  variant: TabEmptyVariant;
  onAdd: () => void;
  style?: StyleProp<ViewStyle>;
};

export function TabEmptyState({ variant, onAdd, style }: TabEmptyStateProps) {
  const accent = variant === 'classes' ? CLASSES_ACCENT : PRACTICE_ACCENT;
  const copy = COPY[variant];

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.emoji}>{copy.emoji}</Text>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.body}>{copy.body}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={copy.cta}
        onPress={onAdd}
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
      >
        <Text style={[styles.ctaLabel, { color: accent }]}>{copy.cta}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 34,
    marginHorizontal: 16,
    marginTop: 22,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 32,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 44,
    marginBottom: 16,
  },
  title: {
    fontFamily: sfPro,
    fontSize: 22,
    fontWeight: weightSemibold,
    color: '#000',
    letterSpacing: letterTight,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#9a9a9a',
    letterSpacing: letterTight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  cta: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  ctaPressed: {
    opacity: 0.65,
  },
  ctaLabel: {
    fontFamily: sfPro,
    fontSize: 17,
    fontWeight: weightSemibold,
    letterSpacing: letterTight,
  },
});
