import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, useWindowDimensions, Animated, Platform } from 'react-native';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Clock, Star, Sparkles } from 'lucide-react-native';
import { rewards } from '@/lib/data';
import { placeholderImages } from '@/lib/placeholder-images';
import { smartShuffle } from '@/lib/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';

const Countdown = ({ expiry, onEnd }: { expiry: number, onEnd: () => void }) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

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
                <Text style={styles.timeValue}>{String(timeLeft.hours).padStart(2, '0')}</Text>
                <Text style={styles.timeLabel}>Hours</Text>
            </View>
            <View style={styles.timeDivider}>:</View>
            <View style={styles.timeBlock}>
                <Text style={styles.timeValue}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
                <Text style={styles.timeLabel}>Minutes</Text>
            </View>
            <View style={styles.timeDivider}>:</View>
            <View style={styles.timeBlock}>
                <Text style={styles.timeValue}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
                <Text style={styles.timeLabel}>Seconds</Text>
            </View>
        </View>
    );
};

const StarRating = ({ reward }: { reward: string }) => {
    const [rating, setRating] = useState(0);

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
                        color={rating > i ? "#Facc15" : "#e5e7eb"}
                        fill={rating > i ? "#Facc15" : "transparent"}
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
    const [rewardImage, setRewardImage] = useState<string | null>(null);
    const confettiRef = useRef<ConfettiCannon>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Animation Values for "animate-in fade-in-50 zoom-in-90"
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        const loadReward = async () => {
            try {
                const selectedReward = await smartShuffle('rewards', rewards);
                setReward(selectedReward || "A Special Surprise");
                
                const img = placeholderImages.find(p => p.imageHint.includes('gift')) || placeholderImages[0];
                setRewardImage(img ? img.imageUrl : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48');

                // Start Entry Animation
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
            } finally {
                setIsLoading(false);
            }
        };
        loadReward();
    }, []);

    if (isLoading) {
        return (
            <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF5A5F" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }} pointerEvents="none">
                 <ConfettiCannon 
                    count={200} 
                    origin={{x: width / 2, y: -20}} 
                    autoStart={false} 
                    ref={confettiRef} 
                    fadeOut={true}
                    fallSpeed={3000}
                />
            </View>

            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], width: '100%', alignItems: 'center' }}>
                <Card style={styles.card}>
                    <View style={styles.headerContainer}>
                        <Image
                            source={{ uri: rewardImage! }}
                            style={styles.headerImage}
                            resizeMode="cover"
                        />
                        <View style={styles.imageOverlay} />
                        
                        <View style={styles.headerContentOverlay}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                                <Gift size={28} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.headerSubtitle}>CONGRATULATIONS!</Text>
                            </View>
                            <Text style={styles.headerTitle}>Reward Unlocked</Text>
                        </View>
                    </View>

                    <CardContent style={styles.content}>
                        <Text style={styles.rewardText}>"{reward}"</Text>
                        
                        <View style={styles.timerSection}>
                            <View style={styles.timerHeader}>
                                <Clock size={16} color="#ef4444" style={{ marginRight: 6 }} />
                                <Text style={styles.timerLabel}>Claim it before it expires!</Text>
                            </View>
                            <Countdown expiry={expiry} onEnd={onRewardEnd} />
                        </View>
                    </CardContent>

                    <CardFooter style={styles.footer}>
                        <Text style={styles.footerLabel}>How much did you enjoy this reward?</Text>
                        <StarRating reward={reward || ''} />
                        <Button onPress={onNewChallengeClick} style={styles.button} size="lg" variant="secondary">
                            <Text style={styles.buttonText}>Start New Challenge</Text>
                        </Button>
                    </CardFooter>
                </Card>
            </Animated.View>
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
        maxWidth: 768, // Matching max-w-3xl
        overflow: 'hidden',
        borderWidth: 0,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: "#FF5A5F",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    headerContainer: {
        height: 256, // Matching h-64
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
        // Gradient simulation can be done with LinearGradient if installed, using simple overlay for now
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
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    content: {
        alignItems: 'center',
        padding: 24,
        paddingBottom: 24,
    },
    rewardText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FF5A5F',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 36,
        fontStyle: 'italic',
    },
    timerSection: {
        alignItems: 'center',
        backgroundColor: '#fff1f2',
        padding: 16,
        borderRadius: 12,
        width: '100%',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    timerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    timerLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#ef4444',
        textTransform: 'uppercase',
        letterSpacing: 1,
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
        color: '#1a1a1a',
        fontVariant: ['tabular-nums'],
    },
    timeLabel: {
        fontSize: 10,
        color: '#6b7280',
        textTransform: 'uppercase',
        marginTop: 4,
        fontWeight: '600',
    },
    timeDivider: {
        fontSize: 28,
        fontWeight: '800',
        color: '#d1d5db',
        marginTop: -15,
    },
    footer: {
        backgroundColor: '#f9fafb',
        padding: 24,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    footerLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
        marginBottom: 12,
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
    button: {
        width: '100%',
        backgroundColor: '#f3f4f6', // secondary variant style
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937', // secondary text color
    }
});
