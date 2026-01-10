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
import { AlertTriangle, CheckCircle, Clock, Gift, Heart } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getPhraseKey = () => `daily_phrase_data_${new Date().toISOString().split('T')[0]}`;
const getCompletionKey = () => `daily_phrase_completed_${new Date().toISOString().split('T')[0]}`;

const maleCharacter = require('@/assets/images/stickers/Cute-creatures/man-suit-character.png');
const femaleCharacter = require('@/assets/images/stickers/dominatrix2.png');


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

    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const mutedForeground = useThemeColor({}, 'mutedForeground');
    const destructiveColor = useThemeColor({}, 'destructive');
    const backgroundColor = useThemeColor({}, 'background');
    
    const partnerPossessive = gender === 'woman' ? 'his' : 'her';
    const character = gender === 'man' ? maleCharacter : femaleCharacter;

    useEffect(() => {
        const setupPhrase = async () => {
            if (!gender || !horizonStartDate) return;
    
            setIsLoading(true);
            setError(null);
    
            try {
                // --- NAME LOGIC ---
                // This is the name the PARTNER calls the USER.
                let name = "Love";
                if (gender === 'woman') {
                    // User is woman. Partner is man. Man calls user 'manCallsWomanNames'
                    const shuffledName = await smartShuffle('manCallsWomanNames', manCallsWomanNames);
                    name = shuffledName || "Mistress"; 
                } else {
                    // User is man. Partner is woman. Woman calls user 'womanCallsManNames'
                    const shuffledName = await smartShuffle('womanCallsManNames', womanCallsManNames);
                    name = shuffledName || "Slave";
                }
                setCongratulatoryName(name);
    
                // --- DATE LOGIC ---
                const daysIntoCycle = Math.floor((new Date().getTime() - new Date(horizonStartDate).getTime()) / (1000 * 3600 * 24));
                
                if (daysIntoCycle > TOTAL_CYCLE_DAYS) {
                    await advanceToNextHorizon();
                    return; 
                }
    
                // --- PHRASE SELECTION LOGIC ---
                const storedPhrase = await AsyncStorage.getItem(getPhraseKey());
                if (storedPhrase) {
                    setPhrase(JSON.parse(storedPhrase));
                    const completedStatus = await AsyncStorage.getItem(getCompletionKey());
                    if (completedStatus === 'true') {
                        setIsCompleted(true);
                        setIsRevealed(true);
                    }
                } else {
                    const phase = getPhaseForDay(daysIntoCycle);
                    
                    /** * FIX: FLIP THE DIRECTION 
                     * If gender is 'woman' (Dominant), she needs the phrases where the 
                     * speaker is addressing a woman leader (currently labeled 'Man to Woman').
                     */
                    const userDirection = gender === 'woman' ? 'Man to Woman' : 'Woman to Man';
                    
                    const relevantPhrases = STRATEGIC_PHRASES[phase]?.filter(p => p.direction === userDirection) || [];
    
                    if (relevantPhrases.length === 0) {
                        setError("Could not find a suitable whisper for today.");
                    } else {
                        const newPhrase = await smartShuffle(getPhraseKey(), relevantPhrases);
                        if (newPhrase) {
                            await AsyncStorage.setItem(getPhraseKey(), JSON.stringify(newPhrase));
                            setPhrase(newPhrase);
                        }
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

    if (!userIsKnown) {
         return <UserOnboarding />;
    }

    const handleReveal = () => setIsRevealed(true);

    const handleComplete = async () => {
        setIsCompleted(true);
        setShowHearts(true);
        await AsyncStorage.setItem(getCompletionKey(), 'true');
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={primaryColor} />
                <Text style={{ color: textColor, marginTop: 16 }}>Crafting your daily whisper...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor, justifyContent: 'center' }]}>
                <AlertTriangle size={48} color={destructiveColor} />
                <Text style={{ color: destructiveColor, marginTop: 16, textAlign: 'center', paddingHorizontal: 20 }}>{error}</Text>
            </SafeAreaView>
        );
    }

    if (!phrase) {
         return (
            <SafeAreaView style={[styles.container, { backgroundColor, justifyContent: 'center' }]}>
                <Text style={{ color: textColor, textAlign: 'center' }}>No whisper available.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={[styles.headerTitle, { color: textColor }]}>A Whisper for <Text style={{ color: primaryColor }}>{partnerName}</Text></Text>
                
                <View style={{position: 'relative', width: '100%', alignItems: 'center'}}>
                    <Image source={character} style={styles.character} />
                    <Card style={[styles.card, { backgroundColor: cardColor }]}>
                        {!isRevealed ? (
                            <TouchableOpacity onPress={handleReveal} style={styles.revealContainer} activeOpacity={0.8}>
                                <Gift size={width * 0.2} color={primaryColor} />
                                <Text style={[styles.revealText, { color: primaryColor }]}>Tap to Reveal</Text>
                                <Text style={[styles.revealSubtext, { color: mutedForeground }]}>Your secret phrase for the day is waiting.</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.revealedContent}>
                                <Heart size={width * 0.15} color={primaryColor} fill={primaryColor} style={styles.icon} />
                                <Text style={[styles.phraseText, { color: textColor }]}>"{phrase.phrase}"</Text>
                                <View style={styles.whenContainer}>
                                    <Clock size={20} color={mutedForeground} />
                                    <Text style={[styles.whenText, { color: mutedForeground }]}>{phrase.when}</Text>
                                </View>
                            </View>
                        )}
                    </Card>
                </View>

                {isRevealed && (
                    <View style={styles.buttonContainer}>
                        {isCompleted ? (
                            <View style={styles.completedContainer}>
                                <CheckCircle size={24} color="#2ecc71" />
                                <Text style={styles.completedText}>
                                    Your whisper is {partnerPossessive} now.{'\n'}
                                    You are {partnerPossessive} <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{congratulatoryName}</Text>.
                                </Text>
                            </View>
                        ) : (
                            <Button onPress={handleComplete} style={{ width: '100%' }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>I whispered it!</Text>
                            </Button>
                        )}
                    </View>
                )}
            </ScrollView>
            <HeartAnimation trigger={showHearts} onComplete={() => setShowHearts(false)} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: {
        padding: 24,
        paddingBottom: 100, // Extra padding for bottom tabs/scroll
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: 'Playfair-Display',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 32,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        minHeight: 300, // Ensure minimum height
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        marginBottom: 24,
    },
    character: {
        position: 'absolute',
        top: -25,
        left: -15,
        width: 80,
        height: 80,
        zIndex: 10,
        transform: [{ rotate: '-20deg' }]
    },
    revealContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    revealText: {
        fontSize: 24,
        fontFamily: 'Playfair-Display',
        fontWeight: 'bold',
        marginTop: 20,
    },
    revealSubtext: {
        fontSize: 16,
        fontFamily: 'PT-Sans',
        marginTop: 12,
        textAlign: 'center',
        opacity: 0.8,
    },
    revealedContent: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    icon: {
        marginBottom: 24,
    },
    phraseText: {
        fontSize: 22,
        fontFamily: 'PT-Sans',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 34,
        marginBottom: 24,
    },
    whenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        width: '100%',
    },
    whenText: {
        marginLeft: 10,
        fontFamily: 'PT-Sans',
        fontSize: 15,
        flex: 1, 
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 8,
        width: '100%',
        maxWidth: 400,
    },
    completedContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        borderRadius: 12,
        width: '100%',
    },
    completedText: {
        color: '#2ecc71',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
        textAlign: 'center',
    },
});
