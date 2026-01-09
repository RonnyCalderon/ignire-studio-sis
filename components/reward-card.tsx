import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, useWindowDimensions, Animated } from 'react-native';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Gift, Clock, Star } from 'lucide-react-native';
import { rewards, manCallsWomanNames, womanCallsManNames } from '@/lib/data';
import { placeholderImages } from '@/lib/placeholder-images';
import { smartShuffle } from '@/lib/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useUser } from '@/context/user-provider';

// Hardcoded image for the reward card as requested
const REWARD_CARD_IMAGE = require('@/assets/images/challenges/photo-1642655995292-191ec6b2a099.webp');

const Countdown = ({ expiry, onEnd }: { expiry: number, onEnd: () => void }) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const textColor = useThemeColor({}, 'text');
    const mutedForeground = useThemeColor({}, 'mutedForeground');
    const borderColor = useThemeColor({}, 'border');

    useEffect(() => {
        if (!expiry) return;
        const timer = setInterval(() => {
            const now = Date.now();
            const distance = expiry - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                onEnd();
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, [expiry, onEnd]);

    return (
        <View style={styles.countdownContainer}>
            <View style={styles.timeBlock}>
                <Text style={[styles.timeValue, { color: textColor }]}>{String(timeLeft.hours).padStart(2, '0')}</Text>
                <Text style={[styles.timeLabel, { color: mutedForeground }]}>Hours</Text>
            </View>
            <Text style={[styles.timeDivider, { color: borderColor }]}>:</Text>
            <View style={styles.timeBlock}>
                <Text style={[styles.timeValue, { color: textColor }]}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
                <Text style={[styles.timeLabel, { color: mutedForeground }]}>Minutes</Text>
            </View>
            <Text style={[styles.timeDivider, { color: borderColor }]}>:</Text>
            <View style={styles.timeBlock}>
                <Text style={[styles.timeValue, { color: textColor }]}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
                <Text style={[styles.timeLabel, { color: mutedForeground }]}>Seconds</Text>
            </View>
        </View>
    );
};

const StarRating = ({ reward }: { reward: string }) => {
    const [rating, setRating] = useState(0);
    const accentColor = useThemeColor({}, 'accent');
    const borderColor = useThemeColor({}, 'border');

    useEffect(() => {
        const loadRating = async () => {
            try {
                const storedRatings = await AsyncStorage.getItem('rewardRatings');
                const ratings = storedRatings ? JSON.parse(storedRatings) : {};
                if (ratings[reward]) setRating(ratings[reward]);
            } catch (e) { console.error(e); }
        };
        loadRating();
    }, [reward]);

    const handleRate = async (newRating: number) => {
        setRating(newRating);
        try {
            const storedRatings = await AsyncStorage.getItem('rewardRatings');
            const ratings = storedRatings ? JSON.parse(storedRatings) : {};
            ratings[reward] = newRating;
            await AsyncStorage.setItem('rewardRatings', JSON.stringify(ratings));
        } catch (e) { console.error(e); }
    };

    return (
        <View style={styles.starContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
                <TouchableOpacity key={i} onPress={() => handleRate(i + 1)} activeOpacity={0.7}>
                    <Star
                        size={32}
                        color={rating > i ? accentColor : borderColor}
                        fill={rating > i ? accentColor : "transparent"}
                        style={styles.star}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export function RewardCard({ expiry, onRewardEnd, onNewChallengeClick }: any) {
    const { width } = useWindowDimensions();
    const [reward, setReward] = useState<string | null>(null);
    const [congratulatoryName, setCongratulatoryName] = useState<string | null>(null);
    const confettiRef = useRef<ConfettiCannon>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { gender } = useUser();
    
    const primaryColor = useThemeColor({}, 'primary');
    const primaryForeground = useThemeColor({}, 'primaryForeground');
    const mutedColor = useThemeColor({}, 'muted');
    const borderColor = useThemeColor({}, 'border');
    const mutedForeground = useThemeColor({}, 'mutedForeground');
    const secondaryForeground = useThemeColor({}, 'secondaryForeground');
    const cardColor = useThemeColor({}, 'card');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        const loadReward = async () => {
            try {
                const selectedReward = await smartShuffle('rewards', rewards);
                setReward(selectedReward || "A Special Surprise");
                
                // Determine congratulatory name
                let name = "";
                if (gender === 'woman') {
                    // Woman calls Man
                    const shuffledName = await smartShuffle('womanCallsManNames', womanCallsManNames);
                     name = shuffledName || "My Love";

                } else if (gender === 'man') {
                     // Man calls Woman
                    const shuffledName = await smartShuffle('manCallsWomanNames', manCallsWomanNames);
                    name = shuffledName || "My Love";
                } else {
                    name = "My Love";
                }
                setCongratulatoryName(name);

                Animated.parallel([
                    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                    Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true })
                ]).start();

                setTimeout(() => {
                    confettiRef.current?.start();
                }, 500);
            } catch (e) {
                console.error("Error loading reward:", e);
                setReward("A romantic surprise");
                setCongratulatoryName("My Love");
            } finally {
                setIsLoading(false);
            }
        };
        loadReward();
    }, [gender]);

    if (isLoading) {
        return (
            <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={primaryColor} />
            </View>
        );
    }

    return (
        <View style={styles.container} collapsable={false}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], width: '100%', alignItems: 'center', zIndex: 1 }}>
                <Card style={[styles.card, { shadowColor: primaryColor }]}>
                    <View style={styles.headerContainer}>
                        <Image
                            source={REWARD_CARD_IMAGE}
                            style={styles.headerImage}
                            resizeMode="cover"
                        />
                        <View style={styles.imageOverlay} />
                        
                        <View style={styles.headerContentOverlay}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                                <Gift size={24} color="#FFD700" style={{ marginRight: 8 }} />
                                <Text style={styles.headerSubtitle}>REWARD UNLOCKED</Text>
                            </View>
                            <Text style={[styles.headerTitle, { color: '#fff' }]}>
                                Congratulations,{'\n'}
                                <Text style={{ fontStyle: 'italic', fontSize: 36 }}>{congratulatoryName}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.content}>
                        <Text style={[styles.rewardText, { color: primaryColor }]}>"{reward}"</Text>
                        
                        <View style={[styles.timerSection, { backgroundColor: mutedColor, borderColor: borderColor }]}>
                            <View style={styles.timerHeader}>
                                <Clock size={16} color={primaryColor} style={{ marginRight: 6 }} />
                                <Text style={[styles.timerLabel, { color: primaryColor }]}>Claim it before it expires!</Text>
                            </View>
                            <Countdown expiry={expiry} onEnd={onRewardEnd} />
                        </View>
                    </View>

                    <View style={[styles.footer, { backgroundColor: cardColor, borderTopColor: borderColor }]}>
                        <Text style={[styles.footerLabel, { color: mutedForeground }]}>How much did you enjoy this reward?</Text>
                        <StarRating reward={reward || ''} />
                        <Button onPress={onNewChallengeClick} variant="secondary">
                            <Text style={{ color: secondaryForeground }}>Start New Challenge</Text>
                        </Button>
                    </View>
                </Card>
            </Animated.View>

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }} pointerEvents="none">
                <ConfettiCannon 
                    count={200} 
                    origin={{x: width / 2, y: -20}} 
                    autoStart={false} 
                    ref={confettiRef} 
                    fadeOut={true}
                    fallSpeed={3000}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    card: {
        width: '100%',
        maxWidth: 768,
        overflow: 'hidden',
        borderWidth: 0,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    headerContainer: {
        height: 256,
        width: '100%',
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerContentOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFD700',
        letterSpacing: 1,
        fontFamily: 'PT-Sans',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        fontFamily: 'Playfair-Display',
    },
    content: {
        alignItems: 'center',
        padding: 24,
        paddingBottom: 24,
    },
    rewardText: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 36,
        fontStyle: 'italic',
        fontFamily: 'Playfair-Display',
    },
    timerSection: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        width: '100%',
        borderWidth: 1,
    },
    timerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    timerLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'PT-Sans',
    },
    countdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeBlock: {
        alignItems: 'center',
        minWidth: 60,
    },
    timeValue: {
        fontSize: 28,
        fontWeight: '800',
        fontVariant: ['tabular-nums'],
        fontFamily: 'Playfair-Display',
    },
    timeLabel: {
        fontSize: 10,
        textTransform: 'uppercase',
        marginTop: 4,
        fontWeight: '600',
        fontFamily: 'PT-Sans',
    },
    timeDivider: {
        fontSize: 28,
        fontWeight: '800',
        marginTop: -15,
    },
    footer: {
        padding: 24,
        alignItems: 'center',
        borderTopWidth: 1,
    },
    footerLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 12,
        fontFamily: 'PT-Sans',
    },
    starContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    star: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
});
