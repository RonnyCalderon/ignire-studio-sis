import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button = ({ children, onPress, variant = 'default', style, textStyle }: ButtonProps) => {
  const primaryColor = useThemeColor({}, 'primary');
  const accentColor = useThemeColor({}, 'accent');
  const textColorLight = useThemeColor({ light: '#fff', dark: '#000' }, 'text');
  const borderColor = useThemeColor({}, 'border');

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'outline':
        return { borderWidth: 1, borderColor };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'default':
      default:
        return { backgroundColor: primaryColor };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return { color: primaryColor };
      case 'default':
      default:
        return { color: textColorLight };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getVariantStyle(), style]}
      onPress={onPress}
    >
      <Text style={[styles.text, getTextStyle(), textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PT-Sans',
  },
});

export default Button;
