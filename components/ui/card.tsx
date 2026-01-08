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
        // Use boxShadow for web and newer RN versions if supported, 
        // but react-native strictly still uses shadowColor/Offset/Opacity/Radius for iOS native.
        // The warning comes from web usage or new arch.
        // For now, we will keep the standard RN shadow props as they are correct for native iOS.
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

export default Card;
