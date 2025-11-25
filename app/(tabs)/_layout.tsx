import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/tab-bar-icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Record',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'mic-circle' : 'mic-circle-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="storage"
        options={{
          title: 'Recordings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'list-circle' : 'list-circle-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
