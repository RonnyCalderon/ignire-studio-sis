import { View, ViewStyle } from 'react-native';

interface ProgressProps {
  value: number;
  style?: ViewStyle;
}

export function Progress({ value, style }: ProgressProps) {
  return (
    <View style={[{ height: 10, backgroundColor: '#e5e7eb', borderRadius: 5, overflow: 'hidden' }, style]}>
      <View style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, height: '100%', backgroundColor: '#FF5A5F' }} />
    </View>
  );
}
