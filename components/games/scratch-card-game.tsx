import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';
import { Gift, Hand, Lock, RefreshCw } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue
} from 'react-native-reanimated';

// 1. High-Res Scratching: Smaller blocks for smoother edges
const SCRATCH_SIZE = 15; 
const BRUSH_SIZE = 35;   
const REVEAL_THRESHOLD = 2500; // Total distance dragged to trigger auto-reveal

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Components ---

interface ScratchBlockProps {
  x: number;
  y: number;
  width: number;
  height: number;
  touchPos: SharedValue<{ x: number; y: number }>;
  isRevealed: boolean;
  color: string;
}

const ScratchBlock = React.memo(({ x, y, width, height, touchPos, isRevealed, color }: ScratchBlockProps) => {
  const opacity = useSharedValue(1);
  
  // 5. Foil Texture: Slight random opacity to simulate real scratch card texture
  const randomTexture = useMemo(() => 0.9 + Math.random() * 0.1, []); 
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  useDerivedValue(() => {
    if (isRevealed) {
      if (opacity.value > 0) {
        // Randomize reveal delay slightly for a "particle" effect
        opacity.value = withTiming(0, { duration: 300 + Math.random() * 200 });
      }
      return;
    }

    const tp = touchPos.value;
    const dx = tp.x - centerX;
    const dy = tp.y - centerY;
    const distSq = dx * dx + dy * dy;
    
    // Check if within brush radius
    if (distSq < BRUSH_SIZE * BRUSH_SIZE) {
       if (opacity.value > 0) {
          opacity.value = withTiming(0, { duration: 50 });
       }
    }
  });

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value * randomTexture,
  }));

  return (
    <Animated.View 
      style={[
        styles.block, 
        { left: x, top: y, width, height, backgroundColor: color }, 
        style
      ]} 
    />
  );
});

export function ScratchCardGame() {
  const [challenge, setChallenge] = useState<{ text: string, type: string } | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameId, setGameId] = useState(0); 
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });

  const touchPos = useSharedValue({ x: -100, y: -100 });
  const totalScratchDistance = useSharedValue(0);
  const confettiRef = useRef<ConfettiCannon>(null);

  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const scratchColor = useThemeColor({ light: '#E5C07B', dark: '#CCA458' }, 'primary'); // Gold
  const cardBg = useThemeColor({ light: '#f3f4f6', dark: '#1f2937' }, 'card');

  const challenges = [
    { text: "Sensual Massage Exchange (20 mins)", type: "Foreplay" },
    { text: "Kissing session with no hands allowed", type: "Foreplay" },
    { text: "Whisper your deepest fantasy", type: "Intimacy" },
    { text: "Blindfolded touch guessing game", type: "Fun" },
    { text: "Undress each other slowly", type: "Intimacy" },
    { text: "5 minutes of oral pleasure (giver's choice)", type: "Spicy" },
    { text: "Roleplay: Strangers at a bar", type: "Fun" },
    { text: "Shower together", type: "Intimacy" },
    { text: "Body worship: Worship one body part for 5 mins", type: "Spicy" },
    { text: "Use an ice cube on your partner", type: "Sensation" }
  ];

  const resetGame = () => {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setChallenge(randomChallenge);
    setIsRevealed(false);
    setHasStarted(false);
    touchPos.value = { x: -100, y: -100 };
    totalScratchDistance.value = 0;
    setGameId(prev => prev + 1);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handleStartScratch = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  const handleAutoReveal = () => {
    if (!isRevealed) {
      handleReveal();
    }
  };

  const pan = Gesture.Pan()
    .onStart((g) => {
      touchPos.value = { x: g.x, y: g.y };
      runOnJS(handleStartScratch)();
    })
    .onUpdate((g) => {
      // 2. Auto-Complete: Track distance to estimate scratch progress
      const dx = g.x - touchPos.value.x;
      const dy = g.y - touchPos.value.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      totalScratchDistance.value += dist;

      touchPos.value = { x: g.x, y: g.y };

      if (totalScratchDistance.value > REVEAL_THRESHOLD) {
         runOnJS(handleAutoReveal)();
      }
    })
    .onEnd(() => {
      if (Platform.OS !== 'web') {
        // 4. Haptic Feedback: Heavy impact on end
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
    });

  const handleReveal = () => {
    if (isRevealed) return;
    
    setIsRevealed(true);
    setHasStarted(true);
    if (Platform.OS !== 'web') {
       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // 1. Confetti Explosion: Trigger fun reward
    if (confettiRef.current) {
        confettiRef.current.start();
    }
  };

  const blocks = useMemo(() => {
    if (dimensions.width === 0) return [];
    
    const cols = Math.ceil(dimensions.width / SCRATCH_SIZE);
    const rows = Math.ceil(dimensions.height / SCRATCH_SIZE);
    const blocksList = [];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        blocksList.push({
          id: `${r}-${c}`,
          x: c * SCRATCH_SIZE,
          y: r * SCRATCH_SIZE,
          width: SCRATCH_SIZE,
          height: SCRATCH_SIZE
        });
      }
    }
    return blocksList;
  }, [dimensions.width, dimensions.height]);

  if (!challenge) return null;

  return (
    <Card style={{ width: '100%' }}>
      <View style={{ alignItems: 'center', padding: 20 }}>
        <Text style={[styles.title, { color: textColor }]}>Secret Challenges</Text>
        <Text style={{ color: subTextColor, textAlign: 'center', fontFamily: 'PT-Sans', marginBottom: 16 }}>
          {isRevealed ? "Challenge Revealed!" : "Scratch the card below to reveal your fate..."}
        </Text>
        
        <View 
          style={[styles.scratchContainer, { backgroundColor: cardBg }]}
          onLayout={(e) => setDimensions({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
        >
          {/* Background Layer (The Secret Content) */}
          <View style={styles.hiddenContent}>
             <Gift size={40} color={primaryColor} style={{ marginBottom: 16 }} />
             <Text style={[styles.challengeType, { color: primaryColor }]}>{challenge.type}</Text>
             <Text style={[styles.challengeText, { color: textColor }]}>{challenge.text}</Text>
          </View>

          {/* Foreground Layer (Scratch Blocks) */}
          {blocks.length > 0 && (
             <GestureHandlerRootView style={StyleSheet.absoluteFill}>
               <GestureDetector gesture={pan}>
                 <View style={{ flex: 1 }}>
                    {blocks.map(b => (
                      <ScratchBlock 
                        key={`${b.id}-${gameId}`} 
                        x={b.x} 
                        y={b.y} 
                        width={b.width} 
                        height={b.height} 
                        touchPos={touchPos}
                        isRevealed={isRevealed}
                        color={scratchColor}
                      />
                    ))}
                   
                   {/* Overlay displayed BEFORE scratching starts */}
                   {!hasStarted && !isRevealed && (
                     <View style={styles.scratchMeOverlay} pointerEvents="none">
                        <View style={styles.deckInfo}>
                            <Lock size={24} color="#fff" style={{ opacity: 0.8, marginBottom: 8 }} />
                            <Text style={styles.deckTitle}>{challenge.type}</Text>
                            <Text style={styles.deckSubtitle}>CARD DECK</Text>
                        </View>

                        <View style={styles.badge}>
                            <Hand size={18} color="#fff" style={{ marginBottom: 4 }} />
                            <Text style={styles.badgeText}>SCRATCH HERE</Text>
                        </View>
                     </View>
                   )}
                 </View>
               </GestureDetector>
             </GestureHandlerRootView>
          )}

           <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{x: -10, y: 0}}
            autoStart={false}
            fadeOut={true}
          />
        </View>

        <View style={styles.buttonContainer}>
           {!isRevealed ? (
             <Button onPress={handleReveal} variant="ghost" style={{ width: '100%' }}>
                <Text>Or Reveal Instantly</Text>
             </Button>
           ) : (
             <Button onPress={resetGame} variant="default" style={{ width: '100%' }}>
                <RefreshCw size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text>Next Challenge</Text>
             </Button>
           )}
        </View>

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
  scratchContainer: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  hiddenContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 0,
  },
  challengeType: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: 'PT-Sans',
  },
  challengeText: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Playfair-Display',
    fontWeight: '600',
    lineHeight: 32,
  },
  block: {
    position: 'absolute',
    borderWidth: 0, 
  },
  scratchMeOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  deckInfo: {
      alignItems: 'center',
  },
  deckTitle: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Playfair-Display',
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  deckSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    letterSpacing: 3,
    marginTop: 4,
    fontFamily: 'PT-Sans',
    fontWeight: '700',
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1.5,
    fontFamily: 'PT-Sans',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  }
});
