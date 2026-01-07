import { Redirect, useRootNavigationState } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const rootNavigationState = useRootNavigationState();

  // Wait for navigation to be ready to avoid redirect loops
  if (!rootNavigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href="/(tabs)" />;
}
