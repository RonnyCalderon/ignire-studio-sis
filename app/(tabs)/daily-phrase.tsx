import { HeartAnimation } from '@/components/heart-animation';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { UserOnboarding } from '@/components/user-onboarding';
import { useUser } from '@/context/user-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DailyPhrase, STRATEGIC_PHRASES } from '@/lib/daily-phrases';
import { manCallsWomanNames, womanCallsManNames } from '@/lib/data';
import { smartShuffle } from '@/lib/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircle, Clock, Gift, Heart, Sparkles, X } from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Use local date string to ensure the "day" resets at midnight local time
const getLocalDateString = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getPhraseKey = () => `daily_phrase_data_${getLocalDateString()}`;
const getCompletionKey = () => `daily_phrase_completed_${getLocalDateString()}`;
const getRevealKey = () => `daily_phrase_revealed_${getLocalDateString()}`;

const dominatrixIcon = require('@/assets/images/stickers/dominatrix.png');
const maleIcon = require('@/assets/images/stickers/Cute-creatures/man-suit-character.png');

const getPhaseForDay = (dayNumber: number): keyof typeof STRATEGIC_PHRASES => {
  if (dayNumber <= 14) return 'The Soil';
  if (dayNumber <= 24) return 'The Fence';
  if (dayNumber <= 29) return 'The Seed';
  if (dayNumber <= 43) return 'The Garden';
  return 'The Anchor';
};
const TOTAL_CYCLE_DAYS = 43;

export default function DailyPhrasePage() {
    const { gender, partnerName, currentHorizonIndex, horizonStartDate, advanceToNextHorizon, userIsKnown } = useUser();
    const { width } = useWindowDimensions();
    const [phrase, setPhrase] = useState<DailyPhrase | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showHearts, setShowHearts] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [congratulatoryName, setCongratulatoryName] = useState<string | null>(null);
    
    const revealAnim = useRef(new Animated.Value(0)).current;

    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const mutedForeground = useThemeColor({}, 'mutedForeground');
    const backgroundColor = useThemeColor({}, 'background');
    
    // Soft, Romantic Palette
    const softPink = '#FFF0F5'; // LavenderBlush
    const romanticRose = '#FFB6C1'; // LightPink
    const deepMagenta = '#D81B60';

    const partnerPossessive = gender === 'woman' ? 'his' : 'her';
    const character = gender === 'woman' ? dominatrixIcon : maleIcon;

    useEffect(() => {
        const setupPhrase = async () => {
            if (!gender || !horizonStartDate) return;
            setIsLoading(true);
            try {
                let name = "Love";
                if (gender === 'woman') {
                    const shuffledName = await smartShuffle('manCallsWomanNames', manCallsWomanNames);
                    name = shuffledName || "Mistress"; 
                } else {
                    const shuffledName = await smartShuffle('womanCallsManNames', womanCallsManNames);
                    name = shuffledName || "Slave";
                }
                setCongratulatoryName(name);

                // Calculate calendar days instead of raw 24h chunks
                const start = new Date(horizonStartDate);
                start.setHours(0, 0, 0, 0);
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const daysIntoCycle = Math.floor((now.getTime() - start.getTime()) / (1000 * 3600 * 24));

                if (daysIntoCycle > TOTAL_CYCLE_DAYS) {
                    await advanceToNextHorizon();
                    return; 
                }

                const storedPhrase = await AsyncStorage.getItem(getPhraseKey());
                if (storedPhrase) {
                    setPhrase(JSON.parse(storedPhrase));
                    const completedStatus = await AsyncStorage.getItem(getCompletionKey());
                    const revealedStatus = await AsyncStorage.getItem(getRevealKey());

                    if (completedStatus === 'true') {
                        setIsCompleted(true);
                        setIsRevealed(true);
                        revealAnim.setValue(1);
                    } else if (revealedStatus === 'true') {
                        setIsRevealed(true);
                        revealAnim.setValue(1);
                    }
                } else {
                    // Start of a new day - reset states
                    setIsRevealed(false);
                    setIsCompleted(true);
                    revealAnim.setValue(0);

                    const phase = getPhaseForDay(daysIntoCycle);
                    const userDirection = gender === 'woman' ? 'Man to Woman' : 'Woman to Man';
                    const relevantPhrases = STRATEGIC_PHRASES[phase]?.filter(p => p.direction === userDirection) || [];

                    if (relevantPhrases.length > 0) {
                        const shuffleKey = `daily_phrase_pool_${phase}_${userDirection}`;
                        const newPhrase = await smartShuffle(shuffleKey, relevantPhrases);
                        
                        if (newPhrase) {
                            await AsyncStorage.setItem(getPhraseKey(), JSON.stringify(newPhrase));
                            setPhrase(newPhrase);
                        }
                    } else {
                        setError("Searching for the perfect whisper...");
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Something went wrong.");
            } finally {
                setIsLoading(false);
            }
        };
        setupPhrase();
    }, [gender, horizonStartDate, currentHorizonIndex]);

    if (!userIsKnown) return <UserOnboarding />;

    const handleReveal = async () => {
        setIsRevealed(true);
        await AsyncStorage.setItem(getRevealKey(), 'true');
        Animated.spring(revealAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 15,
            friction: 8
        }).start();
    };

    const handleComplete = async () => {
        setIsCompleted(true);
        setShowHearts(true);
        await AsyncStorage.setItem(getCompletionKey(), 'true');
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={deepMagenta} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                
                {/* Header CTA with Soft Colors */}
                <View style={[styles.headerCTA, { backgroundColor: softPink }]}>
                    <Image source={character} style={styles.headerIcon} resizeMode="contain" />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Playfair-Display', fontSize: 18, fontWeight: 'bold', color: deepMagenta }}>
                            {isCompleted ? "Beautifully Spoken" : "A Secret for You"}
                        </Text>
                        <Text style={{ fontFamily: 'PT-Sans', color: deepMagenta, fontSize: 13, marginTop: 2, opacity: 0.8 }}>
                            {isCompleted 
                                ? `You've planted a seed of desire in ${partnerName}'s heart.` 
                                : "Whisper these words and watch the fire grow."}
                        </Text>
                    </View>
                </View>

                <View style={styles.mainContent}>
                    {!isRevealed ? (
                        <TouchableOpacity onPress={handleReveal} activeOpacity={0.9} style={styles.revealWrapper}>
                            <Card style={[styles.giftCard, { backgroundColor: cardColor, borderColor: romanticRose }]}>
                                <Sparkles size={60} color={romanticRose} style={{ marginBottom: 20 }} />
                                <Text style={[styles.revealTitle, { color: deepMagenta }]}>Tap to Unlock</Text>
                                <Text style={[styles.revealSubtitle, { color: mutedForeground }]}>A tactical whisper crafted for {partnerName}'s heart.</Text>
                            </Card>
                        </TouchableOpacity>
                    ) : (
                        <Animated.View style={[styles.revealedWrapper, { opacity: revealAnim, transform: [{ scale: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }]}>
                             <Card style={[styles.phraseCard, { backgroundColor: '#FFF5F7' }]}>
                                <Heart size={36} color={romanticRose} fill={romanticRose} style={{ marginBottom: 20 }} />
                                <Text style={[styles.phraseText, { color: '#4A4A4A' }]}>
                                    "{phrase?.phrase}"
                                </Text>
                                
                                <View style={{ width: '100%', marginTop: 10 }}>
                                    <Text style={{ fontFamily: 'PT-Sans', fontSize: 12, color: deepMagenta, opacity: 0.6, marginBottom: 6, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}>
                                        When to say it...
                                    </Text>
                                    <View style={[styles.whenBox, { backgroundColor: '#FFEDF2' }]}>
                                        <Clock size={16} color={deepMagenta} style={{ opacity: 0.7 }} />
                                        <Text style={[styles.whenText, { color: '#6D6D6D' }]}>
                                            {phrase?.when}
                                        </Text>
                                    </View>
                                </View>
                             </Card>

                             <View style={styles.actionContainer}>
                                {isCompleted ? (
                                    <View style={[styles.completedBox, { backgroundColor: '#F0FFF0' }]}>
                                        <CheckCircle size={24} color="#2E7D32" />
                                        <Text style={[styles.completedText, { color: '#2E7D32' }]}>
                                            The mystery is delivered. {partnerName} now holds your heart a little tighter. 
                                            You are {partnerPossessive} <Text style={{ fontWeight: 'bold' }}>{congratulatoryName}</Text>.
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={handleComplete} style={[styles.completeButton, { backgroundColor: deepMagenta }]}>
                                        <Text style={styles.completeButtonText}>I Whispered It</Text>
                                    </TouchableOpacity>
                                )}
                             </View>
                        </Animated.View>
                    )}
                </View>

            </ScrollView>
            <HeartAnimation trigger={showHearts} onComplete={() => setShowHearts(false)} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { paddingBottom: 100 },
    headerCTA: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        margin: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    headerIcon: { width: 60, height: 60, marginRight: 15 },
    mainContent: { paddingHorizontal: 20, alignItems: 'center' },
    revealWrapper: { width: '100%', marginTop: 10 },
    giftCard: {
        width: '100%',
        padding: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 1.5,
    },
    revealTitle: { fontFamily: 'Playfair-Display', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    revealSubtitle: { fontFamily: 'PT-Sans', fontSize: 15, textAlign: 'center', opacity: 0.7 },
    revealedWrapper: { width: '100%', alignItems: 'center' },
    phraseCard: {
        width: '100%',
        padding: 30,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#FFE4E1',
    },
    phraseText: {
        fontFamily: 'PT-Sans',
        fontSize: 19,
        lineHeight: 28,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 25,
    },
    whenBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 15,
        width: '100%',
        justifyContent: 'center',
    },
    whenText: { marginLeft: 10, fontFamily: 'PT-Sans', fontSize: 13, flex: 1, textAlign: 'center' },
    actionContainer: { width: '100%', marginTop: 25 },
    completeButton: {
        width: '100%',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: "#D81B60",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    completeButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold', fontFamily: 'PT-Sans' },
    completedBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        width: '100%',
        justifyContent: 'center',
    },
    completedText: { marginLeft: 10, fontFamily: 'PT-Sans', fontSize: 15, textAlign: 'center' },
});
