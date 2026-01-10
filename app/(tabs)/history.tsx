import { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';
import { useUser } from '@/context/user-provider';
import { useWeeklyChallenge } from '@/hooks/use-weekly-challenge';
import { levels, type Level } from '@/lib/levels';
import Card from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Flame, Lock, Trophy, Award, X } from 'lucide-react-native';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { smartShuffle } from '@/lib/utils';
import { manCallsWomanNames, womanCallsManNames } from '@/lib/data';
import ConfettiCannon from 'react-native-confetti-cannon';
import { quotes } from '@/lib/quotes'; // Imported quotes for the popup

// --- Gamification Logic ---
const getCurrentLevel = (completedCount: number): [Level | null, Level | null] => {
    const sortedLevels = [...levels].sort((a, b) => a.threshold - b.threshold);
    let currentLevel: Level | null = null;
    let nextLevel: Level | null = null;

    for (let i = 0; i < sortedLevels.length; i++) {
        if (completedCount >= sortedLevels[i].threshold) {
            currentLevel = sortedLevels[i];
        } else {
            nextLevel = sortedLevels[i];
            break;
        }
    }
    return [currentLevel, nextLevel];
};

const getChallengesForLevel = (level: Level, history: any[]) => {
    const levelIndex = levels.findIndex(l => l.level === level.level);
    const prevLevelThreshold = levelIndex > 0 ? levels[levelIndex - 1].threshold : 0;
    return history.slice(prevLevelThreshold, level.threshold).filter(challenge => challenge.text && challenge.text.trim() !== '');
};

// --- Helper Components ---
const LevelIcon = ({ level, isLocked }: { level: Level | null | undefined, isLocked?: boolean }) => {
    const primary = useThemeColor({}, 'primary');
    const border = useThemeColor({}, 'border');
    
    // Default fallback
    let IconComponent = Award; 

    if (isLocked) {
        IconComponent = Lock;
    } else if (level && level.icon) {
        IconComponent = level.icon;
    }

    // Handle primary color safely
    const safePrimary = primary || '#000000';
    // Only append alpha if it's a hex code
    const backgroundColor = isLocked ? 'transparent' : safePrimary; 
    const borderColor = isLocked ? border : safePrimary;
    const iconColor = isLocked ? border : '#FFFFFF'; 

    return (
        <View style={[styles.levelIcon, { backgroundColor, borderColor }]}>
            <IconComponent size={18} color={iconColor} />
        </View>
    )
}

const RankCard = ({ level, progress, progressText }: { level: Level, progress: number, progressText: string }) => {
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'mutedForeground');
    const primary = useThemeColor({}, 'primary');
    
    return (
        <Card style={styles.rankCard} variant="outline">
            <Text style={[styles.rankLabel, { color: primary }]}>Current Rank</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <LevelIcon level={level} />
                <Text style={[styles.levelTitle, { color: primary }]}>{level.title}</Text>
            </View>
            <Text style={[styles.levelDescription, { color: muted }]}>{level.description}</Text>
            <View style={{ marginTop: 16 }}>
                <Progress value={progress} style={{ height: 6, marginBottom: 6 }} />
                <Text style={[styles.progressText, { color: text }]}>{progressText}</Text>
            </View>
        </Card>
    )
}

export default function HistoryScreen() {
    const { userName, partnerName, gender } = useUser();
    const { history } = useWeeklyChallenge();
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [showLevelUpModal, setShowLevelUpModal] = useState<Level | null>(null);
    const [selectedStickerLevel, setSelectedStickerLevel] = useState<Level | null>(null); // For sticker popup
    const [partnerNickname, setPartnerNickname] = useState<string | null>(null);
    const [stickerQuote, setStickerQuote] = useState<{ text: string, author: string } | null>(null); // Store quote for sticker popup

    const textColor = useThemeColor({}, 'text');
    const mutedColor = useThemeColor({}, 'mutedForeground');
    const destructiveColor = useThemeColor({}, 'destructive');
    const primaryColor = useThemeColor({}, 'primary');
    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');

    const { completedCount, currentLevel, nextLevel, unlockedLevels, lockedLevels, sortedHistory } = useMemo(() => {
        const completedCount = history.filter(item => item.text && item.text.trim() !== '').length;
        const sorted = [...history].sort((a, b) => a.completedAt - b.completedAt);
        const [current, next] = getCurrentLevel(completedCount);
        const unlocked = current ? levels.filter(l => l.threshold <= current.threshold) : [];
        const locked = next ? levels.filter(l => l.threshold > (current?.threshold ?? 0)) : [];
        return { completedCount, currentLevel: current, nextLevel: next, unlockedLevels: unlocked, lockedLevels: locked, sortedHistory: sorted };
    }, [history]);

    // Function to get correct nickname
    const getPartnerNickname = async () => {
        let name = "";
        if (gender === 'woman') {
            const shuffledName = await smartShuffle('manCallsWomanNames', manCallsWomanNames);
            name = shuffledName || "Love";
        } else if (gender === 'man') {
            const shuffledName = await smartShuffle('womanCallsManNames', womanCallsManNames);
            name = shuffledName || "Love";
        } else {
            name = "Love";
        }
        setPartnerNickname(name);
    };

    useEffect(() => {
        const checkLevelUp = async () => {
            if (currentLevel) {
                const lastSeenLevel = await AsyncStorage.getItem('lastSeenLevel');
                const currentLevelNum = currentLevel.level.toString();

                if (lastSeenLevel !== currentLevelNum) {
                    await getPartnerNickname();
                    setShowLevelUpModal(currentLevel);
                    await AsyncStorage.setItem('lastSeenLevel', currentLevelNum);
                }
            }
        };
        checkLevelUp();
    }, [currentLevel, gender]);

    if (!currentLevel) {
        return (
            <SafeAreaView style={[styles.page, { backgroundColor }]} edges={['top']}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={[styles.header, { alignItems: 'center'}]}>
                        <Text style={[styles.headerTitle, { color: textColor }]}>Your Journey Begins</Text>
                        <Text style={[styles.headerSubtitle, { color: mutedColor }]}>Complete your first challenge to unlock your rank.</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    const progressPercent = nextLevel 
        ? ((completedCount - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
        : 100;

    const progressText = nextLevel 
        ? `Progress to ${nextLevel.title}: ${completedCount} / ${nextLevel.threshold}`
        : "You've reached the highest level!";

    const handleStickerPress = async (level: Level) => {
        if (!unlockedLevels.includes(level)) return; // Don't open if locked
        
        await getPartnerNickname();
        // Pick a random quote based on the level ID to keep it somewhat consistent or random
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setStickerQuote(randomQuote);
        setSelectedStickerLevel(level);
    };

    return (
        <SafeAreaView style={[styles.page, { backgroundColor }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: textColor }]}>{userName} & {partnerName}'s Journey</Text>
                    <Text style={[styles.headerSubtitle, { color: mutedColor }]}>A record of our shared adventures and growth.</Text>
                </View>

                <RankCard level={currentLevel} progress={progressPercent} progressText={progressText} />

                {/* --- Sticker Unlock Section --- */}
                <View style={{ marginBottom: 24 }}>
                     <Text style={[styles.sectionTitle, { color: textColor }]}>Collection</Text>
                     <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                         {/* Show all levels, unlocked ones fully visible, locked ones darkened/locked icon */}
                         {levels.map((level) => {
                             const isUnlocked = unlockedLevels.some(l => l.level === level.level);
                             return (
                                 <TouchableOpacity 
                                    key={level.level} 
                                    style={{ alignItems: 'center', width: 80, opacity: isUnlocked ? 1 : 0.5 }}
                                    onPress={() => handleStickerPress(level)}
                                    disabled={!isUnlocked}
                                 >
                                     <View style={[
                                         styles.stickerContainer, 
                                         { 
                                             borderColor: isUnlocked ? primaryColor : mutedColor,
                                             backgroundColor: isUnlocked ? '#fff' : '#f0f0f0' 
                                         }
                                     ]}>
                                         {level.rewardSticker ? (
                                             <Image 
                                                source={level.rewardSticker} 
                                                style={[styles.stickerImage, !isUnlocked && { tintColor: 'gray' }]} 
                                                resizeMode="contain" 
                                             />
                                         ) : (
                                             <Lock size={20} color={mutedColor} />
                                         )}
                                         {!isUnlocked && (
                                             <View style={styles.lockedOverlay}>
                                                 <Lock size={16} color="#fff" />
                                             </View>
                                         )}
                                     </View>
                                     <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 4, color: mutedColor, fontFamily: 'PT-Sans' }}>
                                         {level.title}
                                     </Text>
                                 </TouchableOpacity>
                             )
                         })}
                     </View>
                </View>

                <Accordion type="single" value={openAccordion} onValueChange={setOpenAccordion} style={styles.accordion}>
                    {unlockedLevels.length > 0 && <Text style={[styles.sectionTitle, { color: textColor }]}>Unlocked Ranks</Text>}
                    {unlockedLevels.slice().reverse().map(level => {
                        const challengesForLevel = getChallengesForLevel(level, sortedHistory);
                        return (
                            <AccordionItem key={`unlocked-${level.level}`} value={`unlocked-${level.level}`} style={styles.accordionItem}>
                                <AccordionTrigger>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                        <LevelIcon level={level} />
                                        <View>
                                            <Text style={[styles.accordionTriggerText, {color: textColor}]}>{level.title}</Text>
                                            <Text style={[styles.accordionThresholdText, { color: mutedColor }]}>Unlocked at {level.threshold} challenges</Text>
                                        </View>
                                    </View>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Text style={[styles.accordionContentDescription, { color: mutedColor }]}>{level.description}</Text>
                                    {challengesForLevel.length > 0 && (
                                        <View>
                                            <Text style={styles.completedStepsTitle}>Completed Steps on this Path:</Text>
                                            {challengesForLevel.map((challenge, i) => (
                                                <Card key={i} style={styles.miniChallengeCard} variant="outline">
                                                     <Text style={{color: textColor, fontFamily: 'PT-Sans', lineHeight: 20}}>{challenge.text}</Text>
                                                </Card>
                                            ))}
                                        </View>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}

                    {lockedLevels.length > 0 && <Text style={[styles.sectionTitle, { color: textColor, marginTop: 24 }]}>The Path Ahead</Text>}
                    {lockedLevels.map(level => (
                        <AccordionItem key={`locked-${level.level}`} value={`locked-${level.level}`} style={[styles.accordionItem, { opacity: 0.6 }]}>
                             <AccordionTrigger>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                    <LevelIcon level={level} isLocked />
                                    <View>
                                        <Text style={[styles.accordionTriggerText, {color: textColor}]}>{level.title}</Text>
                                        <Text style={[styles.accordionThresholdText, { color: mutedColor }]}>Unlocks at {level.threshold} challenges</Text>
                                    </View>
                                </View>
                            </AccordionTrigger>
                            <AccordionContent>
                                 <Text style={[styles.accordionContentDescription, { color: mutedColor }]}>{level.description}</Text>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <View style={styles.fullLogContainer}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Completed Challenges Log ({completedCount})</Text>
                    {history.slice().reverse().map((item, index) => {
                        if (!item.text || item.text.trim() === '') return null;
                        return (
                            <Card key={index} style={styles.logItem} variant="outline">
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.logDate, { color: mutedColor }]}>
                                        {format(new Date(item.completedAt), "MMMM d, yy")}
                                    </Text>
                                    <Text style={[styles.logText, { color: textColor }]}>{item.text}</Text>
                                </View>
                                <View style={{alignItems: 'flex-end', gap: 8}}>
                                     <View style={styles.flameContainer}>
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <Flame key={i} size={16} color={i < item.spicyLevel ? destructiveColor : mutedColor} fill={i < item.spicyLevel ? destructiveColor : 'transparent'} />
                                        ))}
                                    </View>
                                    <Trophy size={20} color={primaryColor} />
                                </View>
                            </Card>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Level Up Modal */}
            <Modal
                transparent={true}
                visible={!!showLevelUpModal}
                animationType="fade"
                onRequestClose={() => setShowLevelUpModal(null)}
            >
                <View style={styles.modalOverlay}>
                    <ConfettiCannon 
                        count={200} 
                        origin={{x: -10, y: 0}} 
                        autoStart={true} 
                        fadeOut={true}
                    />
                    <Card style={[styles.modalCard, { backgroundColor: cardColor }]}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowLevelUpModal(null)}>
                            <X size={24} color={mutedColor} />
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', padding: 20 }}>
                            <Text style={[styles.congratsTitle, { color: primaryColor }]}>Congratulations!</Text>
                            <Text style={[styles.nicknameText, { color: textColor }]}>{partnerNickname}</Text>
                            
                            <View style={[styles.levelBadge, { borderColor: primaryColor }]}>
                                <LevelIcon level={showLevelUpModal} />
                            </View>
                            
                            <Text style={[styles.levelUpTitle, { color: textColor }]}>You've reached Rank {showLevelUpModal?.level}</Text>
                            <Text style={[styles.levelUpSubtitle, { color: primaryColor }]}>{showLevelUpModal?.title}</Text>
                            
                            <Text style={[styles.levelUpDescription, { color: mutedColor }]}>
                                {showLevelUpModal?.description}
                            </Text>

                            {showLevelUpModal?.rewardSticker && (
                                <View style={{ marginTop: 20, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: textColor, marginBottom: 8 }}>NEW STICKER UNLOCKED</Text>
                                    <View style={[styles.stickerContainer, { width: 100, height: 100, borderRadius: 50, borderColor: primaryColor }]}>
                                        <Image source={showLevelUpModal.rewardSticker} style={{ width: 70, height: 70 }} resizeMode="contain" />
                                    </View>
                                </View>
                            )}
                        </View>
                    </Card>
                </View>
            </Modal>

            {/* Sticker Detail Modal */}
            <Modal
                transparent={true}
                visible={!!selectedStickerLevel}
                animationType="fade"
                onRequestClose={() => setSelectedStickerLevel(null)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={[styles.modalCard, { backgroundColor: cardColor }]}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedStickerLevel(null)}>
                            <X size={24} color={mutedColor} />
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', padding: 20 }}>
                            <Text style={[styles.congratsTitle, { color: primaryColor, fontSize: 20 }]}>Secret Unlocked</Text>
                            
                            {selectedStickerLevel?.rewardSticker && (
                                <View style={[styles.stickerContainer, { width: 120, height: 120, borderRadius: 60, borderColor: primaryColor, marginVertical: 20 }]}>
                                    <Image source={selectedStickerLevel.rewardSticker} style={{ width: 90, height: 90 }} resizeMode="contain" />
                                </View>
                            )}
                            
                            <Text style={[styles.levelUpSubtitle, { color: textColor, fontSize: 18, marginBottom: 16 }]}>{selectedStickerLevel?.title} Reward</Text>
                            
                            {stickerQuote && (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontStyle: 'italic', fontSize: 16, color: textColor, textAlign: 'center', lineHeight: 24, fontFamily: 'Playfair-Display' }}>
                                        "{stickerQuote.text}"
                                    </Text>
                                    <Text style={{ textAlign: 'center', marginTop: 10, color: mutedColor, fontSize: 12, fontFamily: 'PT-Sans' }}>
                                        — {stickerQuote.author}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Card>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1 },
    container: { padding: 16, paddingBottom: 120 }, // Increased padding bottom for tab bar
    header: { width: '100%', alignItems: 'flex-start', marginBottom: 24, marginTop: 10 },
    headerTitle: { fontFamily: 'Playfair-Display', fontSize: 28, fontWeight: 'bold' },
    headerSubtitle: { fontFamily: 'PT-Sans', fontSize: 16, marginTop: 4 },
    rankCard: { width: '100%', marginBottom: 32, padding: 20 },
    rankLabel: { fontFamily: 'PT-Sans', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12 },
    levelIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    levelTitle: { fontFamily: 'Playfair-Display', fontSize: 24, fontWeight: 'bold' },
    levelDescription: { fontFamily: 'PT-Sans', fontSize: 14, lineHeight: 21, marginTop: 4 },
    progressText: { fontFamily: 'PT-Sans', fontSize: 12, fontWeight: '600' },
    sectionTitle: { fontFamily: 'Playfair-Display', fontSize: 22, fontWeight: 'bold', marginBottom: 16, width: '100%' },
    accordion: { width: '100%', gap: 8 },
    accordionItem: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16 },
    accordionTriggerText: { fontFamily: 'PT-Sans', fontSize: 16, fontWeight: 'bold' },
    accordionThresholdText: { fontFamily: 'PT-Sans', fontSize: 12, marginTop: 2 },
    accordionContentDescription: { fontFamily: 'PT-Sans', fontStyle: 'italic', fontSize: 14, lineHeight: 20, marginBottom: 16 },
    completedStepsTitle: { fontFamily: 'PT-Sans', fontWeight: 'bold', marginBottom: 8 },
    miniChallengeCard: { padding: 12, marginBottom: 8 },
    fullLogContainer: { width: '100%', marginTop: 32 },
    logItem: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 16, marginBottom: 12 },
    logText: { fontFamily: 'Playfair-Display', fontSize: 18, flexShrink: 1, marginTop: 4, fontStyle: 'italic', lineHeight: 24 },
    logDate: { fontFamily: 'PT-Sans', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    flameContainer: { flexDirection: 'row', gap: 2 },
    stickerContainer: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', overflow: 'hidden' },
    stickerImage: { width: 40, height: 40 },
    lockedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalCard: { width: '100%', maxWidth: 400, borderRadius: 20, overflow: 'hidden' },
    closeButton: { position: 'absolute', top: 16, right: 16, zIndex: 10 },
    congratsTitle: { fontFamily: 'Playfair-Display', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    nicknameText: { fontFamily: 'Playfair-Display', fontSize: 28, fontWeight: '800', fontStyle: 'italic', marginBottom: 24 },
    levelBadge: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    levelUpTitle: { fontFamily: 'PT-Sans', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    levelUpSubtitle: { fontFamily: 'Playfair-Display', fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    levelUpDescription: { textAlign: 'center', fontFamily: 'PT-Sans', fontSize: 14, lineHeight: 20 },
});
