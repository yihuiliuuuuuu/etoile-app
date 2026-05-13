import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';

import { colors, fonts } from '@/src/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  focused: boolean;
  outline: IconName;
  solid: IconName;
}

function TabIcon({ focused, outline, solid }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? solid : outline}
      size={22}
      color={focused ? colors.primary : colors.textTertiary}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 11,
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.divider,
          borderTopWidth: 1,
          height: 84,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} outline="home-outline" solid="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Log',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} outline="add-circle-outline" solid="add-circle" />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} outline="stats-chart-outline" solid="stats-chart" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} outline="person-outline" solid="person" />
          ),
        }}
      />
    </Tabs>
  );
}
