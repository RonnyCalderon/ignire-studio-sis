import { ChallengeCard } from '@/components/challenge-card';
import { ChallengeSelection } from '@/components/challenge-selection';
import { RewardCard } from '@/components/reward-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import Button from '@/components/ui/button';
import { UserOnboarding } from '@/components/user-onboarding';
import { useUser } from '@/context/user-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useWeeklyChallenge, type ChallengeCategory } from '@/hooks/use-weekly-challenge';
import { quotes } from '@/lib/quotes';
import { smartShuffle } from '@/lib/utils';
import { RefreshCw, BookHeart, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Card from '@/components/ui/card';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

const maleCharacter = require('@/assets/images/stickers/Cute-creatures/man-suit-character.png');
const femaleCharacter = require('@/assets/images/stickers/dominatrix2.png');
const STORAGE_KEY = 'sex-diary-entries';

type DiaryEntry = {
    id: string;
    date: number;
    phrases: string[];
    notes: string;
    images: string[];
    rating: number;
    tags: string[];
};

export default function DashboardScreen() {
  const { partnerName, userIsKnown, gender } = useUser();
  const {
    challenge,
    expiry,
    isCompleted,
    rewardExpiry,
    isLoading,
    isStarted,
    completeChallenge,
    startNewChallenge,
    resetChallenge,
    resetChallengeState,
    beginChallenge,
  } = useWeeklyChallenge();

  const [refreshing, setRefreshing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<{ text: string; author: string } | null>(null);
  const [recentDiaryEntry, setRecentDiaryEntry] = useState<DiaryEntry | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const mutedForeground = useThemeColor({}, 'mutedForeground');

  const character = gender === 'man' ? maleCharacter : femaleCharacter;
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
        try {
          if (quotes && quotes.length > 0) {
            const quote = await smartShuffle('daily_quote', quotes);
            setDailyQuote(quote);
          }
          // Load recent diary entry
          const savedDiary = await AsyncStorage.getItem(STORAGE_KEY);
          if (savedDiary) {
              const entries = JSON.parse(savedDiary);
              if (entries.length > 0) {
                  // Assuming entries are sorted by date desc
                  setRecentDiaryEntry(entries[0]);
              }
          }
        } catch (e) {
          console.log("Error loading data:", e);
        }
    };
    loadData();
    
    // Add listener for focus to reload diary if needed, but for simplicity we rely on refresh or initial mount
  }, [refreshing]); // Reload when refreshing

  const handleSelectCategory = async (category: ChallengeCategory) => {
    await startNewChallenge(category);
  };

  const handleCompletePress = () => {
    setShowConfirmation(true);
  };

  const confirmComplete = async () => {
    setShowConfirmation(false);
    await completeChallenge();
  };

  if (!userIsKnown) {
     return <UserOnboarding />;
  }

  if (isLoading) {
    return <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}><Text style={{marginTop: 50, textAlign:'center', color: textColor}}>Loading...</Text></SafeAreaView>;
  }

  if (!isStarted) {
    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <ChallengeSelection onSelectCategory={handleSelectCategory} quote={dailyQuote} />
                
                {/* Diary Teaser for Onboarding/Start */}
                <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
                     <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Your Intimacy Diary</Text>
                        <TouchableOpacity onPress={() => router.push('/sex-diary')}>
                            <Text style={{ color: mutedForeground, fontFamily: 'PT-Sans' }}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/sex-diary')}>
                        <Card style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }} variant="outline">
                             <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: primaryColor + '20', alignItems: 'center', justifyContent: 'center' }}>
                                 <BookHeart size={24} color={primaryColor} />
                             </View>
                             <View style={{ flex: 1 }}>
                                 <Text style={{ fontFamily: 'Playfair-Display', fontSize: 16, fontWeight: 'bold', color: textColor }}>
                                     {recentDiaryEntry ? "Continue Writing" : "Start Your Diary"}
                                 </Text>
                                 <Text style={{ fontFamily: 'PT-Sans', color: mutedForeground, fontSize: 13 }}>
                                     {recentDiaryEntry 
                                        ? `Last entry: ${format(new Date(recentDiaryEntry.date), 'MMM d')}` 
                                        : "Record your desires and memories."}
                                 </Text>
                             </View>
                             <ChevronRight size={20} color={mutedForeground} />
                        </Card>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
  }

  const now = Date.now();
  const isRewardActive = isCompleted && rewardExpiry && now < rewardExpiry;

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <ScrollView
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }} />}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: primaryColor }]}>
                {isRewardActive ? "Your Reward" : `Invitation for ${partnerName}`}
            </Text>
            {challenge && !isRewardActive && (
                <Button variant="outline" onPress={resetChallenge}>
                    <RefreshCw size={16} color={mutedForeground} />
                </Button>
            )}
          </View>

          <View style={styles.cardContainer}>
             {isStarted && <Image source={character} style={styles.character} />}
            {isRewardActive ? (
                  <RewardCard
                    expiry={rewardExpiry}
                    onRewardEnd={resetChallengeState}
                    onNewChallengeClick={resetChallengeState}
                  />
            ) : (
              challenge && (
                    <ChallengeCard
                        challenge={challenge}
                        expiry={expiry}
                        onStart={beginChallenge}
                        onComplete={handleCompletePress}
                        isCompleted={isCompleted}
                    />
              )
            )}
          </View>

          {/* Diary Section at Bottom */}
           <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                    <Text style={[styles.sectionTitle, { color: primaryColor }]}>Your Intimacy Diary</Text>
                    <TouchableOpacity onPress={() => router.push('/sex-diary')}>
                        <Text style={{ color: mutedForeground, fontFamily: 'PT-Sans' }}>View All</Text>
                    </TouchableOpacity>
                </View>

                {recentDiaryEntry ? (
                    <TouchableOpacity onPress={() => router.push('/sex-diary')}>
                        <Card style={{ padding: 16 }} variant="outline">
                             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontFamily: 'PT-Sans', fontWeight: 'bold', color: primaryColor, fontSize: 12 }}>
                                    {format(new Date(recentDiaryEntry.date), 'MMMM d, yyyy')}
                                </Text>
                                <BookHeart size={16} color={mutedForeground} />
                             </View>
                             <Text style={{ fontFamily: 'Playfair-Display', fontStyle: 'italic', fontSize: 16, color: textColor, marginBottom: 8 }} numberOfLines={2}>
                                 "{recentDiaryEntry.phrases?.[0] || recentDiaryEntry.notes || 'A special moment...'}"
                             </Text>
                             <Text style={{ fontFamily: 'PT-Sans', color: mutedForeground, fontSize: 12 }}>
                                 Tap to read more...
                             </Text>
                        </Card>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => router.push('/sex-diary')}>
                        <Card style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }} variant="outline">
                             <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: primaryColor + '20', alignItems: 'center', justifyContent: 'center' }}>
                                 <BookHeart size={24} color={primaryColor} />
                             </View>
                             <View style={{ flex: 1 }}>
                                 <Text style={{ fontFamily: 'Playfair-Display', fontSize: 16, fontWeight: 'bold', color: textColor }}>
                                     Start Your Diary
                                 </Text>
                                 <Text style={{ fontFamily: 'PT-Sans', color: mutedForeground, fontSize: 13 }}>
                                     Capture your intimate journey.
                                 </Text>
                             </View>
                             <ChevronRight size={20} color={mutedForeground} />
                        </Card>
                    </TouchableOpacity>
                )}
            </View>

        </ScrollView>
      </SafeAreaView>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Challenge Conquered!</AlertDialogTitle>
            <AlertDialogDescription>
              You've proven once again how deeply connected and adventurous you both are.
              Confirming this step unlocks your reward and and continues your journey deeper. Are you ready?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setShowConfirmation(false)}>Not Yet</AlertDialogCancel>
            <AlertDialogAction onPress={confirmComplete}>Claim Reward</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Playfair-Display',
    fontWeight: '800',
    flex: 1,
  },
  sectionTitle: {
      fontSize: 20,
      fontFamily: 'Playfair-Display',
      fontWeight: 'bold',
  },
  cardContainer: {
    paddingHorizontal: 20,
    position: 'relative',
  },
  character: {
    position: 'absolute',
    top: -20,
    left: 0,
    width: 70,
    height: 70,
    zIndex: 10,
    transform: [{ rotate: '-15deg' }]
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarImage: {
      width: '80%',
      height: '80%',
  },
});
