import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BORDER_RADIUS } from '@/constants/theme';

type CardProps = {
  children: React.ReactNode;
  style?: any;
  variant?: 'default' | 'outline';
};

const Card = ({ children, style, variant = 'default' }: CardProps) => {
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const variantStyles = variant === 'outline' ? {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      // Clear web shadow
      boxShadow: 'none',
  } : {
      backgroundColor: cardColor,
  };

  return (
    <View style={[styles.card, { borderColor }, variantStyles, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Updated to standard CSS syntax, though boxShadow in StyleSheet for RN Web usually expects specific format or use of 'style' prop directly for web-specifics if strict typing is enforced. However, RN Web supports string values for boxShadow.
        // To fix the "shadow*" style props deprecation warning in newer RN versions (if applicable) or strict environments, we should rely on `elevation` for Android and standard shadow props for iOS.
        // The warning "shadow* style props are deprecated. Use boxShadow" suggests we are running on a platform (likely Web) where the old RN shadow props are mapped to boxShadow but now preferred to be explicit.
      },
    }),
  },
});

export default Card;
