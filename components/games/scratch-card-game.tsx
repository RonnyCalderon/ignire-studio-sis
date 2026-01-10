import Button from '@/components/ui/button';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';
import { Gift, Hand, Lock, RefreshCw } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Mask, Path, Rect, Stop } from 'react-native-svg';
import { getRandomFact, GameFact } from '@/lib/game-facts';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Lower threshold to ensure it triggers more easily
const REVEAL_THRESHOLD = 1000; 

export function ScratchCardGame() {
  const [challenge, setChallenge] = useState<{ text: string, type: string } | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });
  const [currentFact, setCurrentFact] = useState<GameFact | null>(null);

  // Store the path data as a string in a shared value
  const pathData = useSharedValue(''); 
  const totalScratchDistance = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);
  const scratchLayerOpacity = useSharedValue(1);

  const confettiRef = useRef<ConfettiCannon>(null);

  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({ light: '#f3f4f6', dark: '#1f2937' }, 'card');
  const mutedForeground = useThemeColor({}, 'mutedForeground');
  
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

  const fetchFact = async () => {
    const fact = await getRandomFact();
    setCurrentFact(fact);
  }

  const resetGame = () => {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setChallenge(randomChallenge);
    setIsRevealed(false);
    setHasStarted(false);
    pathData.value = '';
    totalScratchDistance.value = 0;
    overlayOpacity.value = 1;
    scratchLayerOpacity.value = 1;
    fetchFact();
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handleStartScratch = () => {
    if (!hasStarted) {
      setHasStarted(true);
      overlayOpacity.value = withTiming(0, { duration: 300 });
    }
  };

  const handleAutoReveal = () => {
    if (!isRevealed) {
      handleReveal();
    }
  };

  const pan = Gesture.Pan()
    .onStart((g) => {
      runOnJS(handleStartScratch)();
      const newStart = `M ${g.x} ${g.y}`;
      pathData.value = pathData.value ? `${pathData.value} ${newStart}` : newStart;
    })
    .onUpdate((g) => {
      pathData.value = `${pathData.value} L ${g.x} ${g.y}`;

      const dist = Math.sqrt(g.changeX * g.changeX + g.changeY * g.changeY);
      totalScratchDistance.value += dist;

      if (totalScratchDistance.value > REVEAL_THRESHOLD) {
         runOnJS(handleAutoReveal)();
      }
    })
    .onEnd(() => {
      if (Platform.OS !== 'web') {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
    });

  const animatedProps = useAnimatedProps(() => ({
    d: pathData.value,
  }));

  const scratchLayerStyle = useAnimatedStyle(() => ({
    opacity: scratchLayerOpacity.value,
  }));

  const handleReveal = () => {
    if (isRevealed) return;
    
    setIsRevealed(true);
    // Reveal the whole image by fading out the scratch layer
    scratchLayerOpacity.value = withTiming(0, { duration: 500 });
    
    if (Platform.OS !== 'web') {
       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    if (confettiRef.current) {
        confettiRef.current.start();
    }
  };

  if (!challenge) return null;

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <View 
          style={[styles.scratchContainer, { backgroundColor: cardBg }]}
          onLayout={(e) => setDimensions({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
        >
          {/* Background Layer (The Secret Content) */}
          <View style={styles.hiddenContent}>
             <Gift size={48} color={primaryColor} style={{ marginBottom: 16, opacity: 0.9 }} />
             <Text style={[styles.challengeType, { color: primaryColor }]}>{challenge.type}</Text>
             <Text style={[styles.challengeText, { color: textColor }]}>{challenge.text}</Text>
          </View>

          {/* Foreground Layer (SVG with Mask) */}
          {dimensions.width > 0 && (
            <GestureHandlerRootView style={StyleSheet.absoluteFill} pointerEvents={isRevealed ? 'none' : 'auto'}>
               <GestureDetector gesture={pan}>
                 <Animated.View style={[{ flex: 1 }, scratchLayerStyle]}>
                   <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                      <Defs>
                        <LinearGradient id="coverGradient" x1="0" y1="0" x2="1" y2="1">
                          <Stop offset="0" stopColor="#333" stopOpacity="1" />
                          <Stop offset="1" stopColor="#111" stopOpacity="1" />
                        </LinearGradient>
                        <Mask id="scratchMask">
                          {/* White background means visible */}
                          <Rect x="0" y="0" width="100%" height="100%" fill="white" />
                          {/* Black path means hidden (erased) */}
                          <AnimatedPath
                            animatedProps={animatedProps}
                            stroke="black"
                            strokeWidth={60}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </Mask>
                      </Defs>
                      
                      {/* The Dark Overlay, masked */}
                      <Rect 
                        x="0" 
                        y="0" 
                        width="100%" 
                        height="100%" 
                        fill="url(#coverGradient)" 
                        mask="url(#scratchMask)" 
                      />
                   </Svg>

                   {/* Overlay displayed BEFORE scratching starts */}
                   {!hasStarted && (
                      <Animated.View style={[styles.scratchMeOverlay, { opacity: overlayOpacity }]} pointerEvents="none">
                          <View style={styles.deckInfo}>
                              <Lock size={32} color="rgba(255,255,255,0.4)" style={{ marginBottom: 12 }} />
                              <Text style={styles.deckTitle}>Scratch to</Text>
                              <Text style={styles.deckTitleEmphasis}>Ignite</Text>
                              
                              <View style={styles.badge}>
                                <Hand size={14} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={styles.badgeText}>Reveal Fate</Text>
                              </View>
                          </View>
                      </Animated.View>
                   )}
                 </Animated.View>
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

        {currentFact && (
              <View style={styles.factContainer}>
                <Image source={currentFact.sticker} style={styles.sticker} resizeMode="contain" />
                <View style={[styles.speechBubble, { backgroundColor: cardBg }]}>
                    <Text style={[styles.factText, { color: mutedForeground }]}>{currentFact.text}</Text>
                </View>
              </View>
        )}

        <View style={styles.buttonContainer}>
             <Button onPress={isRevealed ? resetGame : handleReveal} variant="default" style={{ width: '100%', backgroundColor: primaryColor, height: 56 }}>
                {isRevealed ? (
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RefreshCw size={20} color="#fff" style={{ marginRight: 10 }} />
                      <Text style={styles.buttonText}>Next Challenge</Text>
                   </View>
                ) : (
                   <Text style={styles.buttonText}>I've Tried it</Text>
                )}
             </Button>
        </View>

      </View>
  );
}

const styles = StyleSheet.create({
  scratchContainer: {
    width: '100%',
    height: 350,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  hiddenContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    zIndex: 0,
  },
  challengeType: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
    opacity: 0.8,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
  },
  challengeText: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'Playfair-Display',
    fontWeight: '700',
    lineHeight: 36,
  },
  scratchMeOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // Darker tint for better contrast on dark overlay
  },
  deckInfo: {
      alignItems: 'center',
      justifyContent: 'center',
  },
  deckTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 24,
    fontFamily: 'Playfair-Display',
    fontWeight: '600',
    marginBottom: -4,
  },
  deckTitleEmphasis: {
    color: '#fff',
    fontSize: 42,
    fontFamily: 'Playfair-Display',
    fontWeight: '900',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
    factContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 0,
        paddingTop: 20,
        marginTop: 0,
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
