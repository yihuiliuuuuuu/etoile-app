import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius } from '../../src/constants/theme';

function TabBarIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    classes: '◆',
    practice: '●',
  };
  return (
    <Text style={[styles.icon, { color: focused ? Colors.primary : Colors.textMuted }]}>
      {icons[name] || '●'}
    </Text>
  );
}

function FAB() {
  return (
    <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Classes',
            tabBarIcon: ({ focused }) => <TabBarIcon name="classes" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: 'Practice',
            tabBarIcon: ({ focused }) => <TabBarIcon name="practice" focused={focused} />,
          }}
        />
      </Tabs>
      <FAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 100,
    height: 60,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.card,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 0,
    paddingBottom: 0,
  },
  tabItem: {
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  icon: {
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: '300',
    marginTop: -2,
  },
});
