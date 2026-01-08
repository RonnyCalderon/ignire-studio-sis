import React, { useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Dices, RefreshCw, Sparkles } from 'lucide-react-native';
import { actions, bodyParts } from '@/lib/love-dice';
import { smartShuffle } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';

export function PositionDiceGame() {
  const [result, setResult] = useState<{ action: string; bodyPart: string } | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const cardBackgroundColor = useThemeColor({}, 'card');
  const iconContainerBackgroundColor = useThemeColor({ light: '#fff1f2', dark: '#2A2525' }, 'background');
  const dieBackgroundColor = useThemeColor({ light: '#f8fafc', dark: '#1E1E1E' }, 'background');
  const dieBorderColor = useThemeColor({ light: '#e2e8f0', dark: '#333' }, 'border');
  const dieValueColor = useThemeColor({ light: '#1e293b', dark: '#fff' }, 'text');
  const resultContainerBackgroundColor = useThemeColor({ light: '#fffbeb', dark: '#2A2525' }, 'background');
  const resultContainerBorderColor = useThemeColor({ light: '#fcd34d', dark: '#F59E0B' }, 'border');
  const resultTextColor = useThemeColor({ light: '#b45309', dark: '#F59E0B' }, 'text');


  const rollDice = async () => {
    if (isRolling) return;
    setIsRolling(true);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    spinValue.setValue(0);

    Animated.parallel([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.bounce),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleValue, { toValue: 0.9, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleValue, { toValue: 1, duration: 200, useNativeDriver: true }),
      ])
    ]).start();

    const action = await smartShuffle('dice_action', actions);
    const bodyPart = await smartShuffle('dice_bodyPart', bodyParts);

    setTimeout(() => {
      setResult({ action, bodyPart });
      setIsRolling(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 800);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Card>
        <View style={{ alignItems: 'center', padding: 20, paddingTop: 30 }}>
            <View style={[styles.iconContainer, { backgroundColor: iconContainerBackgroundColor }]}>
              <Dices size={32} color={primaryColor} />
            </View>
            <Text style={[styles.title, { color: textColor }]}>Love Dice</Text>
            <Text style={[styles.subtitle, { color: subTextColor }]}>Roll to decide your next move...</Text>
        </View>

        <View style={{ alignItems: 'center', gap: 24, padding: 20 }}>
            <View style={styles.diceContainer}>
                <Animated.View style={[styles.die, { backgroundColor: dieBackgroundColor, borderColor: dieBorderColor, transform: [{ rotate: spin }, { scale: scaleValue }] }]}>
                    <Text style={styles.dieLabel}>ACTION</Text>
                    <Text style={[styles.dieValue, { color: dieValueColor }]}>
                        {isRolling ? "..." : result?.action || "?"}
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.die, { backgroundColor: iconContainerBackgroundColor, borderColor: primaryColor, transform: [{ rotate: spin }, { scale: scaleValue }] }]}>
                    <Text style={[styles.dieLabel, { color: primaryColor }]}>BODY PART</Text>
                    <Text style={[styles.dieValue, { color: primaryColor }]}>
                        {isRolling ? "..." : result?.bodyPart || "?"}
                    </Text>
                </Animated.View>
            </View>

            {result && !isRolling && (
               <View style={[styles.resultContainer, { backgroundColor: resultContainerBackgroundColor, borderColor: resultContainerBorderColor }]}>
                  <Sparkles size={20} color="#F59E0B" />
                  <Text style={[styles.resultText, { color: resultTextColor }]}>
                     {result.action} the {result.bodyPart}
                  </Text>
                  <Sparkles size={20} color="#F59E0B" />
               </View>
            )}

            <Button onPress={rollDice} disabled={isRolling} style={{ width: '100%' }}>
                {isRolling ? (
                    <Text>Rolling...</Text>
                ) : (
                    <>
                      <RefreshCw size={20} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={{fontWeight: 'bold'}}>Roll Dice</Text>
                    </>
                )}
            </Button>
        </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 12,
    borderRadius: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Playfair-Display',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PT-Sans',
  },
  diceContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    width: '100%',
  },
  die: {
    width: 140,
    height: 140,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dieLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 8,
    letterSpacing: 1,
    fontFamily: 'PT-Sans',
  },
  dieValue: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: 'Playfair-Display',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    borderWidth: 1,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'PT-Sans',
  }
});
