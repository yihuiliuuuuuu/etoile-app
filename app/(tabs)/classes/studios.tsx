import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { letterTight, screenBackground, sfPro, weightSemibold } from '@/constants/typography';
import { useClassLog } from '@/contexts/class-log-context';
import { buildStudioAttendance } from '@/utils/studio-attendance';

const TRACK_HEIGHT = 10;

export default function StudiosAttendedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { entries } = useClassLog();
  const year = new Date().getFullYear();

  const studios = useMemo(() => buildStudioAttendance(entries, year), [entries, year]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Text style={styles.backGlyph}>‹</Text>
        </Pressable>
        <Text style={styles.screenTitle}>Studios</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        <Text style={styles.sectionTitle}>Studios Attended {year}</Text>

        {studios.length === 0 ? (
          <Text style={styles.emptyText}>No studios logged for {year} yet.</Text>
        ) : (
          <View style={styles.list}>
            {studios.map((studio) => (
              <View key={studio.name} style={styles.row}>
                <View style={styles.rowHeader}>
                  <Text style={styles.studioName}>{studio.displayName}</Text>
                  <Text style={styles.studioCount}>{studio.count}</Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${studio.widthPct}%`,
                        backgroundColor: studio.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: screenBackground,
  },
  scroll: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8e8ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: {
    fontFamily: sfPro,
    fontSize: 28,
    color: '#333',
    fontWeight: weightSemibold,
    marginTop: -2,
    includeFontPadding: false,
  },
  topBarSpacer: {
    width: 44,
  },
  screenTitle: {
    fontFamily: sfPro,
    fontSize: 18,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontFamily: sfPro,
    fontSize: 22,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    marginBottom: 28,
  },
  emptyText: {
    fontFamily: sfPro,
    fontSize: 15,
    fontWeight: weightSemibold,
    color: '#b7b7b7',
    letterSpacing: letterTight,
  },
  list: {
    gap: 22,
  },
  row: {
    gap: 10,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studioName: {
    flex: 1,
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    marginRight: 12,
  },
  studioCount: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: TRACK_HEIGHT / 2,
    minWidth: 4,
  },
  pressed: {
    opacity: 0.88,
  },
});
