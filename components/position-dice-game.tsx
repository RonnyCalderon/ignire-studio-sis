import React, { useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dices, RefreshCw, Sparkles } from 'lucide-react-native';
import { actions, bodyParts } from '@/lib/love-dice';
import { smartShuffle } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

export function PositionDiceGame() {
  const [result, setResult] = useState<{ action: string; bodyPart: string } | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const rollDice = async () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Haptic feedback start
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
      // Success haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 800);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Card>
      <CardHeader style={{ alignItems: 'center', paddingBottom: 10 }}>
        <View style={styles.iconContainer}>
          <Dices size={32} color="#FF5A5F" />
        </View>
        <CardTitle>Love Dice</CardTitle>
        <Text style={styles.subtitle}>Roll to decide your next move...</Text>
      </CardHeader>
      
      <CardContent style={{ alignItems: 'center', gap: 24 }}>
        <View style={styles.diceContainer}>
            <Animated.View style={[styles.die, { transform: [{ rotate: spin }, { scale: scaleValue }] }]}>
                <Text style={styles.dieLabel}>ACTION</Text>
                <Text style={styles.dieValue}>
                    {isRolling ? "..." : result?.action || "?"}
                </Text>
            </Animated.View>

            <Animated.View style={[styles.die, { transform: [{ rotate: spin }, { scale: scaleValue }], backgroundColor: '#fef2f2', borderColor: '#FF5A5F' }]}>
                <Text style={[styles.dieLabel, { color: '#FF5A5F' }]}>BODY PART</Text>
                <Text style={[styles.dieValue, { color: '#FF5A5F' }]}>
                    {isRolling ? "..." : result?.bodyPart || "?"}
                </Text>
            </Animated.View>
        </View>

        {result && !isRolling && (
           <View style={styles.resultContainer}>
              <Sparkles size={20} color="#F59E0B" />
              <Text style={styles.resultText}>
                 {result.action} the {result.bodyPart}
              </Text>
              <Sparkles size={20} color="#F59E0B" />
           </View>
        )}

        <Button onPress={rollDice} disabled={isRolling} size="lg" style={{ width: '100%' }}>
            {isRolling ? (
                <Text style={{color: 'white'}}>Rolling...</Text>
            ) : (
                <>
                  <RefreshCw size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Roll Dice</Text>
                </>
            )}
        </Button>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#fff1f2',
    padding: 12,
    borderRadius: 50,
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
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
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
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
  },
  dieValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fffbeb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b45309',
  }
});
