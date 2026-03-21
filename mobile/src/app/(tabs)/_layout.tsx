import React from 'react';
import { Tabs } from 'expo-router';
import { BookOpen, PenLine, Settings } from 'lucide-react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E8C547',
        tabBarInactiveTintColor: '#8888A0',
        tabBarStyle: {
          backgroundColor: '#0A0A0F',
          borderTopColor: '#1C1C2E',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }: { color: string }) => (
            <BookOpen size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }: { color: string }) => (
            <PenLine size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => (
            <Settings size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
