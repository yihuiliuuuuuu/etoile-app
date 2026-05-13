import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { Greeting } from '@/src/components/Greeting';
import { QuickActions, QuickAction } from '@/src/components/QuickActions';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { SectionTitle } from '@/src/components/SectionTitle';
import { TodaysPracticeCard } from '@/src/components/TodaysPracticeCard';
import { WeeklyProgress, DayProgress } from '@/src/components/WeeklyProgress';
import { greetingForHour, homeSnapshot } from '@/src/data/mock';
import { spacing } from '@/src/theme';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function HomeScreen() {
  const router = useRouter();
  const snapshot = homeSnapshot;
  const salutation = useMemo(() => greetingForHour(new Date().getHours()), []);

  const weekDays: DayProgress[] = snapshot.week.days.map((day, idx) => ({
    label: DAY_LABELS[idx] ?? '',
    minutes: day.minutes,
    isToday: idx === snapshot.week.days.length - 1,
  }));

  const totalMinutes = snapshot.week.days.reduce((sum, d) => sum + d.minutes, 0);

  const actions: QuickAction[] = [
    {
      id: 'log',
      label: 'Log practice',
      icon: 'create-outline',
      onPress: () => router.push('/log'),
    },
    {
      id: 'note',
      label: 'Add note',
      icon: 'bookmark-outline',
      onPress: () => router.push('/log'),
    },
    {
      id: 'progress',
      label: 'View progress',
      icon: 'stats-chart-outline',
      onPress: () => router.push('/progress'),
    },
  ];

  return (
    <ScreenContainer bottomInset={96}>
      <Greeting
        salutation={salutation}
        name={snapshot.user.firstName}
        avatarUri={snapshot.user.avatarUri}
        initials={snapshot.user.initials}
      />

      <TodaysPracticeCard
        minutes={snapshot.today.minutes}
        goalMinutes={snapshot.today.goalMinutes}
        focus={snapshot.today.focusLabel}
        detail={snapshot.today.detail}
        onContinue={() => router.push('/log')}
      />

      <View style={{ gap: spacing.md }}>
        <SectionTitle
          title="Weekly progress"
          subtitle="Five days in a row — keep the line."
          action="See all"
          onActionPress={() => router.push('/progress')}
        />
        <WeeklyProgress
          days={weekDays}
          goalMinutes={snapshot.goalMinutesPerDay}
          totalMinutes={totalMinutes}
          streak={snapshot.week.streak}
        />
      </View>

      <View style={{ gap: spacing.md }}>
        <SectionTitle title="Quick actions" />
        <QuickActions actions={actions} />
      </View>
    </ScreenContainer>
  );
}
