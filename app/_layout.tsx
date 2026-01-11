import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { UserProvider } from '@/context/user-provider';

// NOTE: Notifications disabled temporarily to fix Expo Go crash
let Notifications: any = null;
/*
try {
  if (Platform.OS !== 'web') {
    Notifications = require('expo-notifications');
  }
} catch (e) {
  console.log("Notifications module unavailable");
}
*/

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [loaded] = useFonts({
    'Playfair-Display': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PT-Sans': require('../assets/fonts/PTSans-Regular.ttf'),
  });

  useEffect(() => {
    // Platform Check: Only ask for notification permissions on mobile devices if module is loaded.
    if (Platform.OS !== 'web' && Notifications) {
      const requestPermissions = async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
              console.log('Notification permissions not granted');
            }
        } catch (e) {
            console.log("Failed to request notification permissions:", e);
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
          <Stack.Screen name="sex-diary" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </UserProvider>
  );
}
