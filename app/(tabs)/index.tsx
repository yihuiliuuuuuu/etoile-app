import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import YearlyGoalCard from '../../components/YearlyGoalCard';
import NextClassCard from '../../components/NextClassCard';
import ActivityCard from '../../components/ActivityCard';
import StudiosAttendedCard from '../../components/StudiosAttendedCard';
import { classesData } from '../../constants/MockData';
import { Colors } from '../../constants/Colors';

const HERO = {
  uri: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
};

export default function ClassesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Classes" heroSource={HERO} />

        <View style={styles.cards}>
          <YearlyGoalCard data={classesData.yearlyGoal} />
          <NextClassCard data={classesData.nextClass} />
          <ActivityCard
            title="Monthly Activity"
            data={classesData.monthlyActivity}
          />
          <StudiosAttendedCard data={classesData.studiosAttended} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  cards: {
    marginTop: 16,
  },
});
