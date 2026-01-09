
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { UserProvider } from '@/context/user-provider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [loaded] = useFonts({
    'Playfair-Display': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PT-Sans': require('../assets/fonts/PTSans-Regular.ttf'),
  });

  useEffect(() => {
    // Platform Check: Only ask for notification permissions on mobile devices.
    if (Platform.OS !== 'web') {
      const requestPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('You need to enable notifications in your settings to receive daily phrases.');
        }
      };
      requestPermissions();
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      {/* The app now defaults to the dark theme defined in constants/theme.ts */}
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </UserProvider>
  );
}
