import { GoalsBottomSheet } from '@/components/goals-bottom-sheet';
import { ProfileAvatar, profileAvatarBaseStyle } from '@/components/profile-avatar';
import { PracticeLogSection } from '@/components/practice-log-section';
import { TabEmptyState } from '@/components/tab-empty-state';
import { SwipeBetweenTabShell } from '@/components/swipe-between-tab-shell';
import { PRACTICE_ACCENT } from '@/constants/tab-colors';
import { letterTight, screenBackground, sfPro, weightSemibold } from '@/constants/typography';
import { cycleLabel, useGoals } from '@/contexts/goals-context';
import { useAuth } from '@/contexts/auth-context';
import { usePracticeLog, type PracticeLogEntry } from '@/contexts/practice-log-context';
import {
  formatGoalHours,
  getPracticeGoalCardStats,
  startOfWeek,
  weekRangeLabel,
} from '@/utils/goal-progress';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useDevReset } from '@/hooks/use-dev-reset';
import { useRouter } from 'expo-router';
import { useTabCloudRefresh } from '@/hooks/use-tab-cloud-refresh';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

const BAR_HEIGHT_MIN = 24;
const BAR_HEIGHT_MAX = 75;

function sumHoursInWeek(entries: PracticeLogEntry[], weekStart: Date): number {
  const start = weekStart.getTime();
  const end = start + 7 * 24 * 60 * 60 * 1000;
  const totalMinutes = entries.reduce((sum, e) => {
    const t = new Date(e.dateISO).getTime();
    if (Number.isNaN(t) || t < start || t >= end) return sum;
    return sum + e.durationMinutes;
  }, 0);
  return totalMinutes / 60;
}

function sumHoursInMonth(entries: PracticeLogEntry[], year: number, month: number): number {
  const totalMinutes = entries.reduce((sum, e) => {
    const d = new Date(e.dateISO);
    if (Number.isNaN(d.getTime()) || d.getFullYear() !== year || d.getMonth() !== month) return sum;
    return sum + e.durationMinutes;
  }, 0);
  return totalMinutes / 60;
}

function withBarHeights<T extends { value: number; isCurrent: boolean }>(
  periods: T[],
): (T & { barHeight: number })[] {
  const maxValue = Math.max(...periods.map((p) => p.value), 0.1);
  return periods.map((p) => ({
    ...p,
    barHeight:
      p.value === 0
        ? BAR_HEIGHT_MIN
        : BAR_HEIGHT_MIN + (p.value / maxValue) * (BAR_HEIGHT_MAX - BAR_HEIGHT_MIN),
  }));
}

function buildLastFourWeekBars(entries: PracticeLogEntry[], now = new Date()) {
  const currentWeekStart = startOfWeek(now);
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const offset = 3 - i;
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(weekStart.getDate() - offset * 7);
    return {
      key: `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`,
      value: sumHoursInWeek(entries, weekStart),
      isCurrent: offset === 0,
      weekStart,
    };
  });
  return withBarHeights(weeks);
}

function buildLastFourMonthBars(entries: PracticeLogEntry[], now = new Date()) {
  const months = Array.from({ length: 4 }, (_, i) => {
    const offset = 3 - i;
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      value: sumHoursInMonth(entries, d.getFullYear(), d.getMonth()),
      isCurrent: offset === 0,
    };
  });
  return withBarHeights(months);
}

export default function PracticeScreen() {
  const router = useRouter();
  const [goalsOpen, setGoalsOpen] = useState(false);
  const { practiceGoals } = useGoals();
  const { onAvatarPress, avatarUri, avatarRevision, isSignedIn } = useAuth();
  const { onLongPressTitle } = useDevReset();
  const cloudRefresh = useTabCloudRefresh();
  const { entries: practiceEntries, loaded, openCreate } = usePracticeLog();
  const isEmpty = loaded && practiceEntries.length === 0;
  const practiceGoalStats = useMemo(
    () =>
      getPracticeGoalCardStats(
        practiceEntries,
        practiceGoals.cycle,
        practiceGoals.targetHours,
      ),
    [practiceEntries, practiceGoals.cycle, practiceGoals.targetHours],
  );

  const weeklyBars = useMemo(() => buildLastFourWeekBars(practiceEntries), [practiceEntries]);
  const monthlyBars = useMemo(() => buildLastFourMonthBars(practiceEntries), [practiceEntries]);
  const currentWeekHours = weeklyBars[weeklyBars.length - 1]?.value ?? 0;
  const currentMonthHours = monthlyBars[monthlyBars.length - 1]?.value ?? 0;
  const currentWeekLabel = useMemo(() => {
    const start = startOfWeek(new Date());
    return weekRangeLabel(start);
  }, []);

  return (
    <SwipeBetweenTabShell active="practice">
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            cloudRefresh.onRefresh ? (
              <RefreshControl
                refreshing={cloudRefresh.refreshing}
                onRefresh={cloudRefresh.onRefresh}
                tintColor={PRACTICE_ACCENT}
              />
            ) : undefined
          }
        >
          <View style={styles.hero}>
            <View style={styles.heroBackdrop} />
            <Image
              source={require('@/assets/hero-practice.png')}
              style={styles.heroImage}
              contentFit="cover"
              contentPosition="top"
            />
            <View style={styles.heroDim} pointerEvents="none" />
            <LinearGradient
              pointerEvents="none"
              style={styles.heroGradient}
              colors={['rgba(0, 0, 0, 0)', 'rgba(241, 242, 245, 0.5)', screenBackground]}
              locations={[0, 0.48, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <View style={styles.heroHeader}>
              <Pressable onLongPress={onLongPressTitle} delayLongPress={800}>
                <Text style={styles.title}>Practice</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isSignedIn ? 'Profile' : 'Profile, sign in'}
                onPress={() => onAvatarPress('practice')}
                style={({ pressed }) => [pressed && styles.avatarPressed]}
              >
                <ProfileAvatar
                  uri={avatarUri}
                  revision={avatarRevision}
                  size={58}
                  style={[profileAvatarBaseStyle.base, styles.avatar]}
                />
              </Pressable>
            </View>
          </View>

          {isEmpty ? (
            <TabEmptyState variant="practice" onAdd={openCreate} style={styles.cardFirst} />
          ) : (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Yearly goal, open goals editor"
                onPress={() => setGoalsOpen(true)}
                style={({ pressed }) => [styles.card, styles.cardFirst, pressed && styles.cardPressed]}
              >
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>✌🏼 {cycleLabel(practiceGoals.cycle)} Goal</Text>
                  <Text style={styles.link}>Edit</Text>
                </View>
                <View style={styles.stats}>
                  <View style={styles.statColumn}>
                    <Text style={[styles.big, styles.statBig]}>{practiceGoalStats.periodDisplay}</Text>
                    <Text style={styles.muted}>{practiceGoalStats.periodLabel}</Text>
                  </View>
                  <View style={styles.statColumn}>
                    <Text style={[styles.big, styles.statBig]}>{practiceGoalStats.yearDisplay}</Text>
                    <Text style={styles.muted}>{practiceGoalStats.yearLabel}</Text>
                  </View>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${practiceGoalStats.progressPct}%` }]} />
                </View>
                <Text style={styles.rightMuted}>
                  {formatGoalHours(practiceGoalStats.progressValue)} / {practiceGoalStats.progressTarget}{' '}
                  hrs • {practiceGoalStats.progressPct}%
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Weekly hours, open details"
                onPress={() => router.push('/practice/weekly')}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>🦾 {currentWeekLabel}</Text>
                  <Text style={styles.link}>View</Text>
                </View>
                <View style={styles.activityRow}>
                  <View style={styles.activityCountLabeled}>
                    <Text style={[styles.big, styles.activityStatNumber]}>
                      {formatGoalHours(currentWeekHours)}
                    </Text>
                    <Text style={styles.activityStatLabel}>Hours</Text>
                  </View>
                  <View style={styles.bars}>
                    {weeklyBars.map((w) => (
                      <View
                        key={w.key}
                        style={[
                          styles.bar,
                          { height: w.barHeight },
                          w.isCurrent ? styles.barCurrent : styles.barPast,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Monthly hours, open details"
                onPress={() => router.push('/practice/monthly')}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>💪🏼 This month</Text>
                  <Text style={styles.link}>View</Text>
                </View>
                <View style={styles.activityRow}>
                  <View style={styles.activityCountLabeled}>
                    <Text style={[styles.big, styles.activityStatNumber]}>
                      {formatGoalHours(currentMonthHours)}
                    </Text>
                    <Text style={styles.activityStatLabel}>Hours</Text>
                  </View>
                  <View style={styles.bars}>
                    {monthlyBars.map((m) => (
                      <View
                        key={m.key}
                        style={[
                          styles.bar,
                          { height: m.barHeight },
                          m.isCurrent ? styles.barCurrent : styles.barPast,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </Pressable>

              <PracticeLogSection />
            </>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
        <GoalsBottomSheet
          visible={goalsOpen}
          variant="practice"
          onClose={() => setGoalsOpen(false)}
        />
      </View>
    </SwipeBetweenTabShell>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: screenBackground },
  hero: {
    height: 278,
    paddingTop: 88,
    paddingHorizontal: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: screenBackground,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  heroDim: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '58%',
    zIndex: 2,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 3,
  },
  title: {
    flexShrink: 1,
    textAlign: 'left',
    fontSize: 46,
    fontFamily: 'AbrilFatface_400Regular',
    color: '#ffffff',
    letterSpacing: letterTight,
    includeFontPadding: false,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    backgroundColor: '#e8e6ed',
  },
  avatarPressed: {
    opacity: 0.88,
  },
  card: { backgroundColor: '#fff', borderRadius: 34, marginHorizontal: 16, marginTop: 22, padding: 24 },
  cardFirst: { marginTop: -52, zIndex: 2 },
  cardPressed: { opacity: 0.92 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: {
    fontFamily: sfPro,
    fontSize: 17,
    fontWeight: weightSemibold,
    color: PRACTICE_ACCENT,
    letterSpacing: letterTight,
  },
  link: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#b8b8b8',
    letterSpacing: letterTight,
  },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 36, marginBottom: 28 },
  statColumn: { alignItems: 'center' },
  statBig: { textAlign: 'center' },
  big: {
    fontFamily: sfPro,
    fontSize: 48,
    fontWeight: weightSemibold,
    color: '#000',
    letterSpacing: letterTight,
  },
  muted: {
    fontFamily: sfPro,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#b7b7b7',
    letterSpacing: letterTight,
  },
  progressBg: { height: 16, borderRadius: 8, backgroundColor: '#f0f0f0', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: PRACTICE_ACCENT, borderRadius: 8 },
  rightMuted: {
    fontFamily: sfPro,
    textAlign: 'right',
    color: '#b7b7b7',
    fontWeight: weightSemibold,
    marginTop: 10,
    letterSpacing: letterTight,
  },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 34 },
  activityCountLabeled: {
    minHeight: BAR_HEIGHT_MAX,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityStatNumber: {
    includeFontPadding: false,
    textAlign: 'center',
  },
  activityStatLabel: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#b7b7b7',
    letterSpacing: letterTight,
    textAlign: 'center',
  },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  bar: { width: 14, borderRadius: 7 },
  barPast: { backgroundColor: '#f0f0f0' },
  barCurrent: { backgroundColor: PRACTICE_ACCENT },
});
