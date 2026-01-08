/**
 * This file contains the color palette for the app.
 * The app is designed to be dark mode only, matching the web application's aesthetic.
 */

export const BORDER_RADIUS = 12;

// The definitive dark color palette, based on the provided image.
const darkPalette = {
  background: 'hsl(350, 12%, 10%)',
  foreground: 'hsl(350, 15%, 85%)',
  card: 'hsl(350, 10%, 15%)',
  cardForeground: 'hsl(350, 15%, 85%)',
  primary: 'hsl(350, 41%, 72%)',
  primaryForeground: 'hsl(350, 12%, 10%)',
  secondary: 'hsl(350, 10%, 20%)',
  secondaryForeground: 'hsl(350, 15%, 90%)',
  muted: 'hsl(350, 10%, 25%)',
  mutedForeground: 'hsl(350, 10%, 55%)',
  accent: 'hsl(0, 80%, 50%)',
  accentForeground: 'hsl(0, 0%, 100%)',
  destructive: 'hsl(0, 63%, 40%)',
  destructiveForeground: 'hsl(0, 0%, 98%)',
  border: 'hsl(350, 10%, 22%)',
  input: 'hsl(350, 10%, 20%)',
  ring: 'hsl(350, 41%, 72%)',
};

const theme = {
  ...darkPalette,
  text: darkPalette.foreground,
  tint: darkPalette.primary,
  icon: darkPalette.mutedForeground,
  tabIconDefault: darkPalette.mutedForeground,
  tabIconSelected: darkPalette.primary,
}

// To prevent any "flash of incorrect theme", both light and dark exports point to the same dark theme.
export const Colors = {
  light: theme,
  dark: theme,
};

// Explicitly export themed keys for direct component use
export const card = Colors.dark.card;
export const border = Colors.dark.border;
export const primary = Colors.dark.primary;
export const accent = Colors.dark.accent;
