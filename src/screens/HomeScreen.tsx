import { ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../components/home/ScreenHeader';
import { YearlyGoalCard } from '../components/home/YearlyGoalCard';
import { NextClassCard } from '../components/home/NextClassCard';
import { MonthlyActivityCard } from '../components/home/MonthlyActivityCard';
import { StudiosAttendedCard } from '../components/home/StudiosAttendedCard';
import { BottomNav } from '../components/home/BottomNav';
import { homeMock } from '../data/mockHome';
import { colors, spacing } from '../theme';

export function HomeScreen() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title="Classes" />
        <YearlyGoalCard data={homeMock.yearlyGoal} />
        <NextClassCard data={homeMock.nextClass} />
        <MonthlyActivityCard data={homeMock.monthlyActivity} />
        <StudiosAttendedCard data={homeMock.studiosAttended} />
      </ScrollView>
      <BottomNav active="classes" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
});
