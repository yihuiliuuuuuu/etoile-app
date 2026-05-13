import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import YearlyGoalCard from '../../components/YearlyGoalCard';
import ActivityCard from '../../components/ActivityCard';
import { practiceData } from '../../constants/MockData';
import { Colors } from '../../constants/Colors';

const HERO = {
  uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
};

export default function PracticeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Practice" heroSource={HERO} />

        <View style={styles.cards}>
          <YearlyGoalCard data={practiceData.yearlyGoal} />
          <ActivityCard
            title="Monthly Hours"
            data={practiceData.monthlyHours}
          />
          <ActivityCard
            title="Weekly Hours"
            data={practiceData.weeklyHours}
          />
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
