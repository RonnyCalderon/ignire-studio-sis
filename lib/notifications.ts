import * as Notifications from 'expo-notifications';
import { dailyPhrases } from './daily-phrases';
import { smartShuffle } from './utils';
import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
}

/**
 * Schedules the daily phrase notification if the user has them enabled.
 */
export async function scheduleDailyPhraseNotification(gender: 'woman' | 'man') {
  if (Platform.OS === 'web') {
    return; // Notifications are not available on web
  }

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
}

/**
 * Disables all future daily phrase notifications.
 */
export async function disableNotifications() {
  if (Platform.OS === 'web') {
    return;
  }
  console.log('Disabling all scheduled notifications.');
  await Notifications.cancelAllScheduledNotificationsAsync();
}
