import React, { useEffect, useRef } from 'react';
import { View, useWindowDimensions, StyleSheet, Platform } from 'react-native';
import { Heart } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEART_COUNT = 20;
const ANIMATION_DURATION = 3000;

const HeartParticle = ({ onAnimationComplete }) => {
  const { height, width } = useWindowDimensions();
  const primaryColor = useThemeColor({}, 'primary');
  
  const startY = height;
  const startX = useSharedValue(width / 2 + (Math.random() - 0.5) * 50);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const delay = Math.random() * (ANIMATION_DURATION - 500);
    
    translateY.value = withDelay(
      delay,
      withTiming(-startY - 50, {
        duration: ANIMATION_DURATION - delay,
        easing: Easing.out(Easing.quad),
      })
    );

    startX.value = withDelay(
        delay,
        withTiming(startX.value + (Math.random() - 0.5) * 150, {
            duration: ANIMATION_DURATION - delay
        })
    );
    
    opacity.value = withDelay(
      delay + (ANIMATION_DURATION - delay) * 0.7,
      withTiming(0, {
        duration: (ANIMATION_DURATION - delay) * 0.3,
      }, (finished) => {
        if (finished) {
          runOnJS(onAnimationComplete)();
        }
      })
    );
    
    scale.value = withDelay(delay, withTiming(Math.random() * 0.5 + 0.5));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 0,
      left: startX.value,
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Heart size={30} color={primaryColor} fill={primaryColor} />
    </Animated.View>
  );
};

export const HeartAnimation = ({ trigger, onComplete }) => {
  const [particles, setParticles] = React.useState([]);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (trigger) {
      hasTriggered.current = true;
      const newParticles = Array.from({ length: HEART_COUNT }).map((_, i) => ({ id: i }));
      setParticles(newParticles);
    }
  }, [trigger]);

  const handleAnimationComplete = () => {
    setParticles((prev) => prev.slice(1));
  };

  useEffect(() => {
    if (hasTriggered.current && particles.length === 0 && onComplete) {
      onComplete();
      hasTriggered.current = false;
    }
  }, [particles, onComplete]);

  return (
    <View 
      style={styles.container}
      // On web, use style.pointerEvents. On native, the prop is safer for older versions but style is becoming standard.
      // To satisfy the warning "Use style.pointerEvents", we add it to the style object below.
      // We keep the prop as 'none' just in case, but let's prioritize the style fix.
      pointerEvents="none" 
    >
      {particles.map((p) => (
        <HeartParticle key={p.id} onAnimationComplete={handleAnimationComplete} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // @ts-ignore - 'none' is a valid value for pointerEvents in newer RN types but might not be in all definitions
    pointerEvents: 'none', 
  }
});