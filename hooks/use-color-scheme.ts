import { useColorScheme as useNativeColorScheme } from 'react-native';

// The use-color-scheme hook is used by Themed components to determine which
// color scheme to use. By default, it returns the user's system preference.
// However, we can override this to force a specific color scheme.
//
// In this case, we are forcing the dark theme to match the web app's design.
export function useColorScheme() {
  return 'dark';
}
