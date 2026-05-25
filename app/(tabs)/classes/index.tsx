import { ClassLogSection } from '@/components/class-log-section';
import { CloudBackupBanner } from '@/components/cloud-backup-banner';
import { ProfileAvatar, profileAvatarBaseStyle } from '@/components/profile-avatar';
import { GoalsBottomSheet } from '@/components/goals-bottom-sheet';
import { TabEmptyState } from '@/components/tab-empty-state';
import { SwipeBetweenTabShell } from '@/components/swipe-between-tab-shell';
import { CLASSES_ACCENT } from '@/constants/tab-colors';
import { letterTight, screenBackground, sfPro, weightSemibold } from '@/constants/typography';
import { cycleLabel, useGoals } from '@/contexts/goals-context';
import { useAuth } from '@/contexts/auth-context';
import { useClassLog } from '@/contexts/class-log-context';
import { buildLastFourMonthBars } from '@/utils/class-month-activity';
import { getClassGoalCardStats } from '@/utils/goal-progress';
import { buildStudioAttendance } from '@/utils/studio-attendance';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useDevReset } from '@/hooks/use-dev-reset';
import { useRouter } from 'expo-router';
import { useTabCloudRefresh } from '@/hooks/use-tab-cloud-refresh';
import { Fragment, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ClassesScreen() {
  const router = useRouter();
  const [goalsOpen, setGoalsOpen] = useState(false);
  const { classGoals } = useGoals();
  const { onAvatarPress, avatarUri, avatarRevision, isSignedIn } = useAuth();
  const { onLongPressTitle } = useDevReset();
  const cloudRefresh = useTabCloudRefresh();
  const { entries: classEntries, loaded, openCreate } = useClassLog();
  const isEmpty = loaded && classEntries.length === 0;
  const classGoalStats = useMemo(
    () =>
      getClassGoalCardStats(
        classEntries,
        classGoals.cycle,
        classGoals.targetClasses,
      ),
    [classEntries, classGoals.cycle, classGoals.targetClasses],
  );

  const monthlyBars = useMemo(() => buildLastFourMonthBars(classEntries), [classEntries]);
  const currentMonthClassCount = monthlyBars[monthlyBars.length - 1]?.count ?? 0;
  const studioYear = new Date().getFullYear();
  const studioSegments = useMemo(
    () => buildStudioAttendance(classEntries, studioYear),
    [classEntries, studioYear],
  );

  return (
    <SwipeBetweenTabShell active="classes">
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          cloudRefresh.onRefresh ? (
            <RefreshControl
              refreshing={cloudRefresh.refreshing}
              onRefresh={cloudRefresh.onRefresh}
              tintColor={CLASSES_ACCENT}
            />
          ) : undefined
        }
      >
        <View style={styles.hero}>
          <View style={styles.heroBackdrop} />
          <Image
            source={require('@/assets/hero-studio.png')}
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
              <Text style={styles.title}>Classes</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isSignedIn ? 'Profile' : 'Profile, sign in'}
              onPress={() => onAvatarPress('classes')}
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

        <CloudBackupBanner />

        {isEmpty ? (
          <TabEmptyState variant="classes" onAdd={openCreate} style={styles.cardFirst} />
        ) : (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Goal, open goals editor"
              onPress={() => setGoalsOpen(true)}
              style={({ pressed }) => [styles.card, styles.cardFirst, pressed && styles.cardPressed]}
            >
              <View style={styles.row}>
                <Text style={styles.cardTitle}>☝🏽 {cycleLabel(classGoals.cycle)} Goal</Text>
                <Text style={styles.link}>Edit</Text>
              </View>
              <View style={styles.stats}>
                <View style={styles.statColumn}>
                  <Text style={[styles.big, styles.statBig]}>{classGoalStats.periodDisplay}</Text>
                  <Text style={styles.muted}>{classGoalStats.periodLabel}</Text>
                </View>
                <View style={styles.statColumn}>
                  <Text style={[styles.big, styles.statBig]}>{classGoalStats.yearDisplay}</Text>
                  <Text style={styles.muted}>{classGoalStats.yearLabel}</Text>
                </View>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${classGoalStats.progressPct}%` }]} />
              </View>
              <Text style={styles.rightMuted}>
                {classGoalStats.progressValue} / {classGoalStats.progressTarget} classes •{' '}
                {classGoalStats.progressPct}%
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Monthly classes, open details"
              onPress={() => router.push('/classes/monthly')}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <View style={styles.row}>
                <Text style={styles.cardTitle}>🗓️ This month</Text>
                <Text style={styles.link}>View</Text>
              </View>
              <View style={styles.activityRow}>
                <View style={styles.activityCount}>
                  <Text style={[styles.big, styles.activityStatNumber]}>{currentMonthClassCount}</Text>
                  <Text style={styles.activityStatLabel}>Classes</Text>
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

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🩰 Next Class</Text>
              <Text style={styles.time}>10:00 <Text style={styles.light}>Fri Jun 12</Text></Text>
              <Text style={styles.subtle}>📍 DOCK 11</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Studios attended, open details"
              onPress={() => router.push('/classes/studios')}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <View style={styles.row}>
                <Text style={styles.cardTitle}>🤎 Studios Attended</Text>
                <Text style={styles.link}>View</Text>
              </View>
              {studioSegments.length > 0 ? (
                <>
                  <View style={styles.studioBar}>
                    {studioSegments.map((s) => (
                      <View
                        key={s.name}
                        style={[styles.segment, { flex: s.flex, backgroundColor: s.color }]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.legendLine, styles.legendLineFirst]}>
                    {studioSegments.slice(0, 3).map((s, i) => (
                      <Fragment key={s.name}>
                        {i > 0 ? <Text>    </Text> : null}
                        <Text style={[styles.legendDot, { color: s.color }]}>●</Text>
                        <Text> {s.displayName}</Text>
                      </Fragment>
                    ))}
                  </Text>
                  {studioSegments.length > 3 ? (
                    <Text style={[styles.legendLine, styles.legendLineSecond]}>
                      {studioSegments.slice(3).map((s, i) => (
                        <Fragment key={s.name}>
                          {i > 0 ? <Text>    </Text> : null}
                          <Text style={[styles.legendDot, { color: s.color }]}>●</Text>
                          <Text> {s.displayName}</Text>
                        </Fragment>
                      ))}
                    </Text>
                  ) : null}
                </>
              ) : (
                <Text style={styles.studioEmpty}>Log a class to see studios here.</Text>
              )}
            </Pressable>

            <ClassLogSection />
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
      <GoalsBottomSheet
        visible={goalsOpen}
        variant="classes"
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
    color: CLASSES_ACCENT,
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
  progressFill: { height: '100%', backgroundColor: CLASSES_ACCENT, borderRadius: 8 },
  rightMuted: {
    fontFamily: sfPro,
    textAlign: 'right',
    color: '#b7b7b7',
    fontWeight: weightSemibold,
    marginTop: 10,
    letterSpacing: letterTight,
  },
  time: {
    fontFamily: sfPro,
    fontSize: 32,
    fontWeight: weightSemibold,
    marginTop: 28,
    letterSpacing: letterTight,
  },
  light: { fontFamily: sfPro, color: '#b7b7b7', fontWeight: weightSemibold, letterSpacing: letterTight },
  subtle: {
    fontFamily: sfPro,
    color: '#b7b7b7',
    fontSize: 16,
    fontWeight: weightSemibold,
    marginTop: 12,
    letterSpacing: letterTight,
  },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 34 },
  activityCount: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  activityStatNumber: {
    includeFontPadding: false,
    textAlign: 'center',
    lineHeight: 48,
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
  barCurrent: { backgroundColor: CLASSES_ACCENT },
  studioBar: { height: 24, borderRadius: 6, backgroundColor: '#eee', flexDirection: 'row', overflow: 'hidden', marginTop: 24, marginBottom: 14 },
  segment: { height: '100%' },
  legendLine: {
    fontFamily: sfPro,
    fontSize: 12,
    color: '#222',
    fontWeight: weightSemibold,
    letterSpacing: -0.35,
  },
  legendLineFirst: {
    marginTop: 6,
  },
  legendLineSecond: {
    marginTop: 6,
  },
  legendDot: {
    fontSize: 12,
    fontWeight: weightSemibold,
  },
  studioEmpty: {
    fontFamily: sfPro,
    fontSize: 14,
    fontWeight: weightSemibold,
    color: '#b7b7b7',
    letterSpacing: letterTight,
    marginTop: 24,
  },
});