import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClassesScreen } from '../screens/ClassesScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { TabBar } from './TabBar';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Classes" component={ClassesScreen} />
      <Tab.Screen name="Practice" component={PracticeScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);
