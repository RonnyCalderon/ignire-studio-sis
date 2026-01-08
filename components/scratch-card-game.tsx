import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Image, StyleSheet, PanResponder, Animated, Dimensions } from 'react-native';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { sexPositions, type SexPosition } from '@/lib/sex-positions';
import { RefreshCw, Sparkles } from 'lucide-react-native';
import { smartShuffle } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';

const SCRATCH_SIZE = 40; // Size of each scratch block

export function ScratchCardGame() {
  const [position, setPosition] = useState<SexPosition | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Grid of blocks covering the image
  const [blocks, setBlocks] = useState<{ id: number; opacity: Animated.Value }[]>([]);
  const scratchedCount = useRef(0);
  const totalBlocks = useRef(0);

  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const scratchColor = useThemeColor({ light: '#B76E79', dark: '#8A545C' }, 'primary');
  const scratchBorderColor = useThemeColor({ light: '#9f5d66', dark: '#6B4148' }, 'border');
  const positionDescColor = useThemeColor({ light: '#4b5563', dark: '#ccc' }, 'text');

  const getRandomPosition = useCallback(async () => {
    setIsRevealed(false);
    scratchedCount.current = 0;
    const newPos = await smartShuffle('sexPositions', sexPositions);
    setPosition(newPos);
    resetBlocks();
  }, []);

  const resetBlocks = () => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      const cols = Math.ceil(dimensions.width / SCRATCH_SIZE);
      const rows = Math.ceil(dimensions.height / SCRATCH_SIZE);
      const newBlocks = [];
      for (let i = 0; i < cols * rows; i++) {
        newBlocks.push({ id: i, opacity: new Animated.Value(1) });
      }
      setBlocks(newBlocks);
      totalBlocks.current = newBlocks.length;
    }
  };

  useEffect(() => {
    getRandomPosition();
  }, [getRandomPosition]);

  useEffect(() => {
    resetBlocks();
  }, [dimensions]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (isRevealed || totalBlocks.current === 0) return;

        const { locationX, locationY } = evt.nativeEvent;
        const cols = Math.ceil(dimensions.width / SCRATCH_SIZE);
        const col = Math.floor(locationX / SCRATCH_SIZE);
        const row = Math.floor(locationY / SCRATCH_SIZE);
        const index = row * cols + col;

        if (blocks[index] && (blocks[index].opacity as any)._value !== 0) {
           Animated.timing(blocks[index].opacity, {
             toValue: 0,
             duration: 100,
             useNativeDriver: true
           }).start();
           
           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
           scratchedCount.current += 1;
           
           if (scratchedCount.current > totalBlocks.current * 0.6) {
             revealAll();
           }
        }
      },
    })
  ).current;

  const revealAll = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    blocks.forEach(block => {
        Animated.timing(block.opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    });
  };

  if (!position) return null;

  return (
    <Card style={{ width: '100%' }}>
      <View style={{ alignItems: 'center', padding: 20 }}>
        <Text style={[styles.title, { color: textColor }]}>Reveal of Fate</Text>
        <Text style={{ color: subTextColor, textAlign: 'center', fontFamily: 'PT-Sans' }}>
            Scratch the card below to reveal a new position.
        </Text>
      </View>
      <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
        <View 
            style={styles.cardContainer}
            onLayout={(e) => setDimensions({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
        >
            <Image
                source={{ uri: position.image.imageUrl }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.overlayContainer} {...panResponder.panHandlers}>
                {blocks.map((block) => (
                    <Animated.View 
                        key={block.id} 
                        style={[
                            styles.scratchBlock, 
                            { 
                                width: SCRATCH_SIZE, 
                                height: SCRATCH_SIZE, 
                                opacity: block.opacity,
                                backgroundColor: scratchColor,
                                borderColor: scratchBorderColor,
                            }
                        ]} 
                    />
                ))}
            </View>

            {!isRevealed && scratchedCount.current === 0 && (
                 <View style={styles.centerText} pointerEvents="none">
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>SCRATCH ME</Text>
                      </View>
                 </View>
            )}
        </View>

        {isRevealed && (
            <View style={{ marginTop: 20, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Sparkles size={20} color="#F59E0B" />
                    <Text style={[styles.positionName, { color: primaryColor }]}>{position.name}</Text>
                    <Sparkles size={20} color="#F59E0B" />
                </View>
                <Text style={[styles.positionDesc, { color: positionDescColor }]}>{position.description}</Text>
            </View>
        )}

      </View>
      <View style={{ padding: 20, paddingTop: 20 }}>
        <Button onPress={getRandomPosition} variant="outline">
             <RefreshCw size={16} color={primaryColor} style={{ marginRight: 8 }} />
             <Text>Get New Card</Text>
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontFamily: 'Playfair-Display',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardContainer: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#e5e7eb',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        flexWrap: 'wrap',
        zIndex: 10,
    },
    scratchBlock: {
        borderWidth: 1,
    },
    centerText: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    badge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fff',
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
        fontFamily: 'PT-Sans',
    },
    positionName: {
        fontSize: 24,
        fontFamily: 'Playfair-Display',
        fontWeight: 'bold',
    },
    positionDesc: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
        fontFamily: 'PT-Sans',
    }
});
