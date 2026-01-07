import { View, ViewStyle } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function Skeleton({ style, className }: { style?: ViewStyle, className?: string }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[{ backgroundColor: '#e5e7eb', borderRadius: 4, opacity }, style]} />
  );
}
