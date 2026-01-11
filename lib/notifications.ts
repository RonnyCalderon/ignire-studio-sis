// Conditional import to handle Expo Go limitations
import { Platform } from 'react-native';
import { dailyPhrases } from './daily-phrases';
import { smartShuffle } from './utils';

// NOTE: expo-notifications is currently causing crashes in Expo Go SDK 53+ on some devices.
// We are temporarily disabling it to ensure the app runs.
// When building a development client or standalone app, this can be re-enabled.

let Notifications: any = null;

/* 
try {
    // Only import if not web to avoid bundler issues there, though the error is Android specific in Expo Go.
    if (Platform.OS !== 'web') {
        Notifications = require('expo-notifications');
    }
} catch (e) {
    console.warn("expo-notifications could not be loaded", e);
}

if (Notifications && Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
}
*/

/**
 * Schedules the daily phrase notification if the user has them enabled.
 */
export async function scheduleDailyPhraseNotification(gender: 'woman' | 'man') {
  if (Platform.OS === 'web' || !Notifications) {
    console.log("Notifications skipped (web or disabled in Expo Go)");
    return; 
  }

  try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      const userDirection = gender === 'woman' ? 'Woman to Man' : 'Man to Woman';
      const relevantPhrases = dailyPhrases.filter(
        (p) => p.direction === userDirection
      );
      const dateKey = `notification_phrase_${
        new Date().toISOString().split('T')[0]
      }`;
      const phrase = await smartShuffle(dateKey, relevantPhrases);

      if (phrase) {
        console.log("Scheduling daily notification for 9:00 AM.");
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Here's your daily whisper...",
            body: phrase.phrase,
          },
          // This is the correct, explicit trigger object required by the new version of the library.
          trigger: {
            type: 'daily',
            hour: 9,
            minute: 0,
          },
        });
      }
  } catch (error) {
      console.log("Error scheduling notification:", error);
  }
}

/**
 * Disables all future daily phrase notifications.
 */
export async function disableNotifications() {
  if (Platform.OS === 'web' || !Notifications) {
    return;
  }
  try {
      console.log('Disabling all scheduled notifications.');
      await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
      console.log("Error disabling notifications:", error);
  }
}
