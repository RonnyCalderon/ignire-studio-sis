import Card from '@/components/ui/card';
import { useUser } from '@/context/user-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useWeeklyChallenge } from '@/hooks/use-weekly-challenge';
import { levels } from '@/lib/levels';
import { quotes } from '@/lib/quotes';
import { AllIdeas, getRandomIdeas } from '@/lib/sex-diary-ideas';
import { smartShuffle } from '@/lib/utils';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Flame, Sticker } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = 'sex-diary-entries';
const dominatrixIcon = require('@/assets/images/stickers/dominatrix.png');

type DiaryEntry = {
    id: string;
    date: number; // Timestamp
    phrases: string[];
    notes: string;
    images: string[];
    rating: number;
    tags: string[];
    quote?: { text: string, author: string };
    stickers?: number[]; // Array of level IDs corresponding to stickers
};

export default function SexDiaryScreen() {
    const { gender } = useUser();
    const params = useLocalSearchParams();
    const router = useRouter();
    const { history } = useWeeklyChallenge();
    
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEntry, setCurrentEntry] = useState<Partial<DiaryEntry>>({});
    const [showIdeasModal, setShowIdeasModal] = useState(false);
    const [showStickerModal, setShowStickerModal] = useState(false);
    
    // For the "Duolingo-style" picker
    const [randomIdeas, setRandomIdeas] = useState<typeof AllIdeas>([]);

    // Theme colors
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const primaryColor = useThemeColor({}, 'primary');
    const mutedColor = useThemeColor({}, 'mutedForeground');
    const destructiveColor = useThemeColor({}, 'destructive');
    const borderColor = useThemeColor({}, 'border');

    // Calculate unlocked stickers
    const unlockedLevels = useMemo(() => {
        const completedCount = history.filter(item => item.text && item.text.trim() !== '').length;
        const sortedLevels = [...levels].sort((a, b) => a.threshold - b.threshold);
        let currentLevelThreshold = 0;
        for (let i = 0; i < sortedLevels.length; i++) {
            if (completedCount >= sortedLevels[i].threshold) {
                currentLevelThreshold = sortedLevels[i].threshold;
            } else {
                break;
            }
        }
        return levels.filter(l => l.threshold <= currentLevelThreshold && l.rewardSticker);
    }, [history]);

    useEffect(() => {
        loadEntries();
        if (params.initialPhrase) {
            setIsEditing(true);
        }
    }, [params]);

    const loadEntries = async () => {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) {
                setEntries(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load diary entries', error);
        }
    };

    const handleOpenInspiration = () => {
        setRandomIdeas(getRandomIdeas(gender, 6));
        setShowIdeasModal(true);
    };

    const handleSelectIdea = (idea: typeof AllIdeas[0]) => {
        const textToAdd = idea.phrase;
        setCurrentEntry(prev => ({
            ...prev,
            notes: prev.notes ? `${prev.notes} ${textToAdd}` : textToAdd
        }));
        setShowIdeasModal(false);
    };

    const handleAddQuote = async () => {
        const newQuote = await smartShuffle('diary_quotes', quotes);
        setCurrentEntry(prev => ({ ...prev, quote: newQuote }));
    };

    const handleAddSticker = (levelId: number) => {
        setCurrentEntry(prev => ({
            ...prev,
            stickers: [...(prev.stickers || []), levelId]
        }));
        setShowStickerModal(false);
    };

    const removeSticker = (indexToRemove: number) => {
        setCurrentEntry(prev => ({
            ...prev,
            stickers: prev.stickers?.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const saveEntry = async () => {
        if (!currentEntry.date) currentEntry.date = Date.now();
        if (!currentEntry.id) currentEntry.id = Math.random().toString(36).substr(2, 9);
        
        const newEntry: DiaryEntry = {
            id: currentEntry.id!,
            date: currentEntry.date!,
            phrases: currentEntry.phrases || [],
            notes: currentEntry.notes || '',
            images: currentEntry.images || [],
            rating: currentEntry.rating || 0,
            tags: currentEntry.tags || [],
            quote: currentEntry.quote,
            stickers: currentEntry.stickers || []
        };

        const updatedEntries = [newEntry, ...entries.filter(e => e.id !== newEntry.id)];
        updatedEntries.sort((a, b) => b.date - a.date);
        
        setEntries(updatedEntries);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
        setIsEditing(false);
        setCurrentEntry({});
    };

    const deleteEntry = async (id: string) => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this memory?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        const updated = entries.filter(e => e.id !== id);
                        setEntries(updated);
                        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                    }
                }
            ]
        );
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const assetUri = result.assets[0].uri;
            setCurrentEntry(prev => ({
                ...prev,
                images: [...(prev.images || []), assetUri]
            }));
        }
    };

    const renderEntryCard = ({ item }: { item: DiaryEntry }) => (
        <Card style={styles.entryCard} variant="outline">
            <View style={styles.entryHeader}>
                <Text style={[styles.entryDate, { color: primaryColor }]}>
                    {format(new Date(item.date), 'MMMM d, yyyy')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                     <TouchableOpacity onPress={() => { setCurrentEntry(item); setIsEditing(true); }}>
                        <Ionicons name="pencil" size={20} color={mutedColor} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteEntry(item.id)}>
                        <Ionicons name="trash-outline" size={20} color={destructiveColor} />
                    </TouchableOpacity>
                </View>
            </View>

            {item.quote && (
                <View style={[styles.quoteContainer, { borderColor: mutedColor }]}>
                    <Text style={[styles.quoteText, { color: textColor }]}>"{item.quote.text}"</Text>
                    <Text style={[styles.quoteAuthor, { color: mutedColor }]}>— {item.quote.author}</Text>
                </View>
            )}

            {item.notes ? (
                <Text style={[styles.notesText, { color: textColor }]}>{item.notes}</Text>
            ) : null}

            {item.stickers && item.stickers.length > 0 && (
                <View style={styles.stickerRow}>
                    {item.stickers.map((stickerId, index) => {
                        const level = levels.find(l => l.level === stickerId);
                        if (!level?.rewardSticker) return null;
                        return (
                            <Image 
                                key={index} 
                                source={level.rewardSticker} 
                                style={styles.stickerImageSmall} 
                                resizeMode="contain" 
                            />
                        );
                    })}
                </View>
            )}

            {item.images.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                    {item.images.map((img, idx) => (
                        <Image key={idx} source={{ uri: img }} style={styles.entryImage} />
                    ))}
                </ScrollView>
            )}

            <View style={styles.footer}>
                 <View style={styles.ratingContainer}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Flame 
                            key={i} 
                            size={16} 
                            color={i < item.rating ? destructiveColor : '#e0e0e0'} 
                            fill={i < item.rating ? destructiveColor : 'transparent'} 
                        />
                    ))}
                </View>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
             <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8, padding: 8 }}>
                    <Ionicons name="chevron-back" size={28} color={textColor} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: textColor }]}>Intimacy Diary</Text>
                <TouchableOpacity onPress={() => { setCurrentEntry({}); setIsEditing(true); }} style={[styles.addButton, { backgroundColor: primaryColor }]}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {entries.length === 0 ? (
                <View style={styles.emptyState}>
                     <Image source={dominatrixIcon} style={{ width: 120, height: 120, marginBottom: 20 }} />
                    <Text style={[styles.emptyStateTitle, { color: primaryColor }]}>The Page is Bare...</Text>
                    <Text style={[styles.emptyText, { color: mutedColor }]}>
                        ...but the night is full of possibilities. Don't let these moments fade away.
                        Tell me everything. Your secrets are safe with me.
                    </Text>
                    <TouchableOpacity onPress={() => { setCurrentEntry({}); setIsEditing(true); }} style={[styles.emptyStateButton, { backgroundColor: primaryColor }]}>
                        <Text style={styles.emptyStateButtonText}>Create Your First Entry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={entries}
                    keyExtractor={item => item.id}
                    renderItem={renderEntryCard}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* Edit Modal */}
            <Modal visible={isEditing} animationType="slide" presentationStyle="pageSheet">
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.modalContainer, { backgroundColor: '#FFD1DC' }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setIsEditing(false)} style={{padding: 8}}>
                            <Text style={[styles.modalCancel, { color: '#D81B60' }]}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={[styles.modalTitle, { color: '#D81B60' }]}>New Memory</Text>
                        <TouchableOpacity onPress={saveEntry} style={{padding: 8}}>
                            <Text style={[styles.modalSave, { color: '#D81B60' }]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView contentContainerStyle={styles.modalContent}>
                         <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <Image source={dominatrixIcon} style={{ width: 80, height: 80 }} resizeMode="contain" />
                            <Text style={{ fontFamily: 'Playfair-Display', fontSize: 20, fontWeight: 'bold', color: '#D81B60', marginTop: 10 }}>Ready to spill the tea?</Text>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={[styles.label, { color: '#D81B60' }]}>Intensity</Text>
                            <View style={styles.ratingSelector}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <TouchableOpacity key={i} onPress={() => setCurrentEntry(prev => ({ ...prev, rating: i + 1 }))}>
                                        <Flame 
                                            size={32} 
                                            color={i < (currentEntry.rating || 0) ? '#D81B60' : '#FFB6C1'} 
                                            fill={i < (currentEntry.rating || 0) ? '#D81B60' : 'transparent'} 
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <Text style={[styles.label, { color: '#D81B60' }]}>Spill the details...</Text>
                        
                        {/* Inspiration Buttons Area */}
                        <View style={{ marginBottom: 12, flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity 
                                style={[styles.actionButton, { borderColor: '#D81B60', flex: 1, backgroundColor: '#FFF0F5' }]} 
                                onPress={handleOpenInspiration}
                            >
                                <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#D81B60" />
                                <Text style={[styles.actionButtonText, { color: '#D81B60' }]}>Find words...</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionButton, { borderColor: '#D81B60', flex: 1, backgroundColor: '#FFF0F5' }]} 
                                onPress={handleAddQuote}
                            >
                                <MaterialCommunityIcons name="format-quote-close" size={20} color="#D81B60" />
                                <Text style={[styles.actionButtonText, { color: '#D81B60' }]}>Shuffle Quote</Text>
                            </TouchableOpacity>
                        </View>

                        {currentEntry.quote && (
                            <View style={[styles.quoteContainer, { borderColor: '#D81B60', marginBottom: 12, borderLeftWidth: 4, paddingLeft: 12 }]}>
                                <Text style={[styles.quoteText, { color: '#D81B60' }]}>"{currentEntry.quote.text}"</Text>
                                <Text style={[styles.quoteAuthor, { color: '#D81B60', opacity: 0.7 }]}>— {currentEntry.quote.author}</Text>
                            </View>
                        )}

                        <TextInput
                            style={[styles.input, { color: '#D81B60', borderColor: '#FFB6C1', backgroundColor: '#FFF0F5' }]}
                            multiline
                            placeholder="Describe your intimate moments..."
                            placeholderTextColor="#FFB6C1"
                            value={currentEntry.notes}
                            onChangeText={text => setCurrentEntry(prev => ({ ...prev, notes: text }))}
                        />

                        {/* Stickers Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.label, { color: '#D81B60', marginBottom: 0 }]}>Stickers</Text>
                                <TouchableOpacity onPress={() => setShowStickerModal(true)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name="sticker-emoji" size={20} color="#D81B60" style={{marginRight: 4}}/>
                                    <Text style={{color: '#D81B60', fontFamily: 'PT-Sans', fontWeight: 'bold'}}>Add Sticker</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <ScrollView horizontal style={styles.stickerScroll} showsHorizontalScrollIndicator={false}>
                                {currentEntry.stickers?.map((stickerId, i) => {
                                    const level = levels.find(l => l.level === stickerId);
                                    if (!level?.rewardSticker) return null;
                                    return (
                                        <View key={i} style={styles.previewStickerContainer}>
                                            <Image source={level.rewardSticker} style={styles.previewSticker} resizeMode="contain" />
                                            <TouchableOpacity 
                                                style={styles.removeSticker} 
                                                onPress={() => removeSticker(i)}
                                            >
                                                <Ionicons name="close-circle" size={20} color="#D81B60" />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                                {(!currentEntry.stickers || currentEntry.stickers.length === 0) && (
                                     <Text style={{color: '#D81B60', fontFamily: 'PT-Sans', fontStyle: 'italic', paddingVertical: 10, opacity: 0.6}}>No stickers added.</Text>
                                )}
                            </ScrollView>
                        </View>

                        {/* Photos Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.label, { color: '#D81B60', marginBottom: 0 }]}>Memories</Text>
                                <TouchableOpacity onPress={pickImage} style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="camera" size={20} color="#D81B60" style={{marginRight: 4}}/>
                                    <Text style={{color: '#D81B60', fontFamily: 'PT-Sans', fontWeight: 'bold'}}>Add Photo</Text>
                                </TouchableOpacity>
                            </View>

                            <ScrollView horizontal style={styles.imagePreviewScroll} showsHorizontalScrollIndicator={false}>
                                {currentEntry.images?.map((img, i) => (
                                    <View key={i} style={styles.previewImageContainer}>
                                        <Image source={{ uri: img }} style={styles.previewImage} />
                                        <TouchableOpacity 
                                            style={styles.removeImage} 
                                            onPress={() => setCurrentEntry(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#D81B60" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {(!currentEntry.images || currentEntry.images.length === 0) && (
                                     <Text style={{color: '#D81B60', fontFamily: 'PT-Sans', fontStyle: 'italic', paddingVertical: 10, opacity: 0.6}}>No photos added yet.</Text>
                                )}
                            </ScrollView>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>

                 {/* Ideas "Game" Modal */}
                 {showIdeasModal && (
                    <Modal visible={showIdeasModal} animationType="slide" transparent>
                        <View style={styles.phraseModalOverlay}>
                            <View style={[styles.phraseModalContent, { backgroundColor: '#FFD1DC', height: '65%' }]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Text style={[styles.modalTitle, { color: '#D81B60' }]}>Tap to Describe</Text>
                                    <TouchableOpacity onPress={() => setShowIdeasModal(false)}>
                                        <Ionicons name="close" size={24} color="#D81B60" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontFamily: 'PT-Sans', color: '#D81B60', marginBottom: 16 }}>
                                    Choose a phrase that resonates with your encounter:
                                </Text>
                                <ScrollView contentContainerStyle={styles.ideasGrid}>
                                    {randomIdeas.map((idea, index) => (
                                        <TouchableOpacity 
                                            key={index}
                                            style={[styles.ideaChip, { backgroundColor: '#FFF0F5', borderColor: '#D81B60' }]}
                                            onPress={() => handleSelectIdea(idea)}
                                        >
                                            <Text style={[styles.ideaChipText, { color: '#D81B60' }]}>
                                                {idea.phrase}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <TouchableOpacity 
                                    style={{ alignSelf: 'center', marginTop: 16 }}
                                    onPress={() => setRandomIdeas(getRandomIdeas(gender, 6))}
                                >
                                    <View style={[styles.shuffleButton, { backgroundColor: '#D81B60' }]}>
                                        <Ionicons name="refresh" size={18} color="#fff" style={{marginRight: 8}} />
                                        <Text style={{ color: '#fff', fontFamily: 'PT-Sans', fontWeight: 'bold', fontSize: 16 }}>Shuffle Ideas</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}

                {/* Sticker Selection Modal */}
                {showStickerModal && (
                    <Modal visible={showStickerModal} animationType="slide" transparent>
                        <View style={styles.phraseModalOverlay}>
                            <View style={[styles.phraseModalContent, { backgroundColor: '#FFD1DC', height: '50%' }]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Text style={[styles.modalTitle, { color: '#D81B60' }]}>Select Sticker</Text>
                                    <TouchableOpacity onPress={() => setShowStickerModal(false)}>
                                        <Ionicons name="close" size={24} color="#D81B60" />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                                    {unlockedLevels.length > 0 ? unlockedLevels.map((level) => (
                                        <TouchableOpacity 
                                            key={level.level} 
                                            onPress={() => handleAddSticker(level.level)}
                                            style={{ alignItems: 'center' }}
                                        >
                                            <View style={[styles.stickerContainer, { borderColor: '#D81B60', backgroundColor: '#FFF0F5' }]}>
                                                <Image source={level.rewardSticker} style={styles.stickerImage} resizeMode="contain" />
                                            </View>
                                            <Text style={{ fontSize: 10, marginTop: 4, color: '#D81B60', fontFamily: 'PT-Sans' }}>{level.title}</Text>
                                        </TouchableOpacity>
                                    )) : (
                                        <Text style={{ fontFamily: 'PT-Sans', color: '#D81B60', textAlign: 'center', marginTop: 20 }}>
                                            No stickers unlocked yet. Keep playing to earn rewards!
                                        </Text>
                                    )}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                )}
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    title: { fontFamily: 'Playfair-Display', fontSize: 28, fontWeight: 'bold', flex: 1 },
    addButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyStateTitle: { fontFamily: 'Playfair-Display', fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    emptyText: { fontFamily: 'PT-Sans', fontSize: 16, textAlign: 'center', marginTop: 16, lineHeight: 24 },
    emptyStateButton: { marginTop: 30, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
    emptyStateButtonText: { color: '#fff', fontFamily: 'PT-Sans', fontWeight: 'bold', fontSize: 16 },
    listContent: { padding: 16, paddingBottom: 100 },
    entryCard: { padding: 16, marginBottom: 16 },
    entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    entryDate: { fontFamily: 'PT-Sans', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
    phrasesContainer: { marginBottom: 12, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: '#ccc' },
    phraseText: { fontFamily: 'Playfair-Display', fontStyle: 'italic', fontSize: 16, marginBottom: 4 },
    notesText: { fontFamily: 'PT-Sans', fontSize: 16, lineHeight: 24, marginBottom: 12 },
    imageScroll: { flexDirection: 'row', marginBottom: 12 },
    entryImage: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
    footer: { flexDirection: 'row', justifyContent: 'flex-end' },
    ratingContainer: { flexDirection: 'row', gap: 4 },
    
    // Quote Styles
    quoteContainer: { marginBottom: 12, borderLeftWidth: 2, paddingLeft: 10 },
    quoteText: { fontFamily: 'Playfair-Display', fontStyle: 'italic', fontSize: 16, lineHeight: 22, marginBottom: 4 },
    quoteAuthor: { fontFamily: 'PT-Sans', fontSize: 12 },

    // Stickers
    stickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    stickerImageSmall: { width: 40, height: 40 },
    stickerScroll: { flexDirection: 'row', marginTop: 8 },
    previewStickerContainer: { position: 'relative', marginRight: 12 },
    previewSticker: { width: 60, height: 60 },
    stickerContainer: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    stickerImage: { width: 60, height: 60 },
    removeSticker: { position: 'absolute', top: -5, right: -5 },

    // Edit Modal
    modalContainer: { flex: 1, paddingTop: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#FFB6C1' },
    modalTitle: { fontFamily: 'Playfair-Display', fontSize: 18, fontWeight: 'bold' },
    modalCancel: { fontFamily: 'PT-Sans', fontSize: 16 },
    modalSave: { fontFamily: 'PT-Sans', fontSize: 16, fontWeight: 'bold' },
    modalContent: { padding: 16 },
    sectionContainer: { marginBottom: 24 },
    label: { fontFamily: 'PT-Sans', fontWeight: 'bold', fontSize: 14, marginBottom: 8, marginTop: 16 },
    input: { borderWidth: 1, borderRadius: 8, padding: 12, height: 150, textAlignVertical: 'top', fontFamily: 'PT-Sans', marginTop: 8, fontSize: 16, lineHeight: 22 },
    ratingSelector: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginVertical: 10 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 8 },
    imagePreviewScroll: { flexDirection: 'row', marginTop: 8 },
    previewImageContainer: { position: 'relative', marginRight: 12 },
    previewImage: { width: 100, height: 100, borderRadius: 8 },
    removeImage: { position: 'absolute', top: -8, right: -8, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 12 },
    
    // Action Buttons
    actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed' },
    actionButtonText: { fontWeight: 'bold', fontFamily: 'PT-Sans', marginLeft: 6 },

    // Ideas Grid
    ideasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
    ideaChip: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 6, width: '45%', alignItems: 'center', justifyContent: 'center' },
    ideaChipText: { fontFamily: 'Playfair-Display', fontSize: 14, textAlign: 'center', lineHeight: 20 },
    
    // Shuffle Button
    shuffleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    // Phrase Modal
    phraseModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    phraseModalContent: { height: '60%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
});
