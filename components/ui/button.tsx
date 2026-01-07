import { TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'icon' | 'lg';
  className?: string; 
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function Button({ onPress, children, variant = 'default', size = 'default', style, textStyle, disabled }: ButtonProps) {
  const baseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: size === 'lg' ? 14 : 10,
    paddingHorizontal: size === 'icon' ? 10 : 16,
    opacity: disabled ? 0.5 : 1,
  };

  const variantStyles: Record<string, ViewStyle> = {
    default: { backgroundColor: '#FF5A5F' },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e5e7eb' },
    ghost: { backgroundColor: 'transparent' },
  };

  const textColor = variant === 'default' ? 'white' : '#1f2937';

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={[baseStyle, variantStyles[variant], style]}
    >
      {typeof children === 'string' ? (
        <Text style={[{ color: textColor, fontWeight: '600', fontSize: 16 }, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
