import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Easing, Dimensions, Image } from 'react-native';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Dices, RefreshCw, Sparkles, MapPin, Heart, Activity } from 'lucide-react-native';
import { actions, bodyParts, places } from '@/lib/love-dice';
import { smartShuffle } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getRandomFact, GameFact } from '@/lib/game-facts';

const SCREEN_WIDTH = Dimensions.get('window').width;

export function PositionDiceGame() {
  const [result, setResult] = useState<{ action: string; bodyPart: string; place: string } | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [currentFact, setCurrentFact] = useState<GameFact | null>(null);

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
  const cardBg = useThemeColor({}, 'card');
  const mutedForeground = useThemeColor({}, 'mutedForeground');

  const fetchFact = async () => {
    const fact = await getRandomFact();
    setCurrentFact(fact);
  }

  useEffect(() => {
    fetchFact();
  }, []);


  const rollDice = async () => {
    if (isRolling) return;
    setIsRolling(true);

    if (Math.random() > 0.3) fetchFact();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    spinValue.setValue(0);

    Animated.parallel([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
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
    const place = await smartShuffle('dice_place', places);

    setTimeout(() => {
      setResult({ action, bodyPart, place });
      setIsRolling(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const Die = ({ label, value, icon: Icon, delay }: { label: string, value: string | undefined, icon: any, delay: number }) => (
    <Animated.View style={[
      styles.die, 
      { 
        backgroundColor: dieBackgroundColor, 
        borderColor: dieBorderColor,
        transform: [
          { rotate: spin },
          { scale: scaleValue }
        ] 
      }
    ]}>
      <View style={styles.dieHeader}>
        <Icon size={14} color={primaryColor} />
        <Text style={[styles.dieLabel, { color: subTextColor }]}>{label}</Text>
      </View>
      <Text 
        style={[styles.dieValue, { color: dieValueColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {isRolling ? "..." : value || "?"}
      </Text>
    </Animated.View>
  );

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
                <Die 
                  label="ACTION" 
                  value={result?.action} 
                  icon={Activity} 
                  delay={0}
                />
                <Die 
                  label="BODY PART" 
                  value={result?.bodyPart} 
                  icon={Heart} 
                  delay={100}
                />
                <Die 
                  label="PLACE" 
                  value={result?.place} 
                  icon={MapPin} 
                  delay={200}
                />
            </View>

            {result && !isRolling && (
               <View style={[styles.resultContainer, { backgroundColor: resultContainerBackgroundColor, borderColor: resultContainerBorderColor }]}>
                  <Text style={[styles.resultText, { color: resultTextColor }]}>
                     {result.action} {result.bodyPart === 'Lips' ? 'on the' : 'the'} {result.bodyPart} in the {result.place}
                  </Text>
               </View>
            )}

           {currentFact && (
              <View style={styles.factContainer}>
                <Image source={currentFact.sticker} style={styles.sticker} resizeMode="contain" />
                <View style={[styles.speechBubble, { backgroundColor: cardBg }]}>
                    <Text style={[styles.factText, { color: mutedForeground }]}>{currentFact.text}</Text>
                </View>
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  die: {
    width: (SCREEN_WIDTH - 80) / 3, // Responsive width
    minWidth: 90,
    height: 90,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  dieLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'PT-Sans',
    textTransform: 'uppercase',
  },
  dieValue: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: 'Playfair-Display',
  },
  resultContainer: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'PT-Sans',
    textAlign: 'center',
    lineHeight: 24,
  },
    factContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 0,
        paddingBottom: 0,
        marginTop: -10,
        marginBottom: -10
    },
    sticker: {
        width: 60,
        height: 60,
        marginRight: -10,
        zIndex: 10,
        marginBottom: -5
    },
    speechBubble: {
        padding: 12,
        paddingLeft: 20,
        borderRadius: 16,
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    factText: {
        fontSize: 13,
        fontFamily: 'PT-Sans',
        lineHeight: 18,
        fontStyle: 'italic'
    },
});
