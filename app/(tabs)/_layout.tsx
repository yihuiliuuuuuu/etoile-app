import { Tabs } from 'expo-router';

import { EtoileTabBar } from '@/src/components/EtoileTabBar';
import { colors } from '@/src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
      tabBar={(props) => <EtoileTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Classes' }} />
      <Tabs.Screen name="practice" options={{ title: 'Practice' }} />
    </Tabs>
  );
}
