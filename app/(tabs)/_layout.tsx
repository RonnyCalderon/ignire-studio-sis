import { HapticTab } from '@/components/haptic-tab';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Tabs } from 'expo-router';
import { Gamepad2, Home, Trophy, User, MessageSquare } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';
import { useUser } from '@/context/user-provider';
import { UserOnboarding } from '@/components/user-onboarding';

export default function TabLayout() {
  const activeColor = useThemeColor({}, 'primary');
  const inactiveColor = useThemeColor({}, 'mutedForeground');
  const tabBackgroundColor = useThemeColor({}, 'card');
  const tabBorderColor = useThemeColor({}, 'border');
  const { userIsKnown } = useUser();

  if (!userIsKnown) {
    return <UserOnboarding />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: tabBackgroundColor,
          borderTopColor: tabBorderColor,
          // The absolute positioning is required for the blur effect on iOS.
          ...(Platform.OS === 'ios' && { position: 'absolute' }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <Gamepad2 size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="daily-phrase"
        options={{
          title: 'Daily Phrase',
          tabBarIcon: ({ color }) => <MessageSquare size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Trophy size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
