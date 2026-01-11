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
import { RefreshCw, BookHeart, ChevronRight, Home, Sparkles, Trophy, Flame, Heart, User, PenLine } from 'lucide-react-native';
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

// Updated icon path
const romanticNovelIcon = require('@/assets/images/stickers/love.png');

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
  const { partnerName, userIsKnown, gender, userName } = useUser();
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
    history
  } = useWeeklyChallenge();

  const [refreshing, setRefreshing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<{ text: string; author: string } | null>(null);
  const [recentDiaryEntry, setRecentDiaryEntry] = useState<DiaryEntry | null>(null);
  const [diaryCount, setDiaryCount] = useState(0);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const mutedForeground = useThemeColor({}, 'mutedForeground');
  
  const pinkBg = '#FFD1DC';
  const deepPink = '#D81B60';
  const softRose = '#FFF0F5';

  const character = gender === 'man' ? maleCharacter : femaleCharacter;
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
        try {
          if (quotes && quotes.length > 0) {
            const quote = await smartShuffle('daily_quote', quotes);
            setDailyQuote(quote);
          }
          const savedDiary = await AsyncStorage.getItem(STORAGE_KEY);
          if (savedDiary) {
              const entries = JSON.parse(savedDiary);
              setDiaryCount(entries.length);
              if (entries.length > 0) {
                  setRecentDiaryEntry(entries[0]);
              }
          }
        } catch (e) {
          console.log("Error loading data:", e);
        }
    };
    loadData();
  }, [refreshing]);

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
    return <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}><Text style={{marginTop: 50, textAlign:'center', color: textColor}}>Loading your sanctuary...</Text></SafeAreaView>;
  }

  const now = Date.now();
  const isRewardActive = isCompleted && rewardExpiry && now < rewardExpiry;
  const stats = { completed: history.length, streak: history.length };

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <ScrollView
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }} />}
        >
          {/* Unified Profile Header - Hidden when challenge started */}
          {!isStarted && (
            <View style={{ padding: 20 }}>
               <TouchableOpacity onPress={() => router.push('/profile')}>
                  <Card style={{ padding: 24, backgroundColor: pinkBg, borderColor: '#FFB6C1', borderRadius: 30, shadowColor: deepPink, shadowOpacity: 0.1, shadowRadius: 15 }} variant="outline">
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                           <View style={[styles.avatarContainer, { backgroundColor: '#FFF' }]}>
                               <Image source={character} style={styles.avatarImage} resizeMode="contain" />
                           </View>
                           <View style={{ flex: 1 }}>
                               <Text style={[styles.welcomeSub, { color: deepPink }]}>Welcome home,</Text>
                               <Text style={[styles.welcomeTitle, { color: deepPink, fontSize: 24 }]}>{userName}</Text>
                               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                   <Heart size={12} color={deepPink} fill={deepPink} />
                                   <Text style={{ fontFamily: 'PT-Sans', fontSize: 13, color: deepPink, opacity: 0.8, fontWeight: '600' }}>Devoted to {partnerName}</Text>
                               </View>
                           </View>
                           <ChevronRight size={24} color={deepPink} />
                      </View>
                      
                      <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.6)', padding: 16, borderRadius: 24 }}>
                           <View style={{ alignItems: 'center', gap: 4 }}>
                               <Trophy size={18} color={deepPink} />
                               <Text style={{ fontFamily: 'PT-Sans', fontWeight: '800', color: deepPink, fontSize: 16 }}>{stats.completed}</Text>
                               <Text style={{ fontFamily: 'PT-Sans', fontSize: 10, color: deepPink, opacity: 0.7, fontWeight: '700', textTransform: 'uppercase' }}>Unlocked</Text>
                           </View>
                           <View style={{ width: 1, backgroundColor: 'rgba(216, 27, 96, 0.2)', height: '70%', alignSelf: 'center' }} />
                           <View style={{ alignItems: 'center', gap: 4 }}>
                               <Flame size={18} color="#FF4500" />
                               <Text style={{ fontFamily: 'PT-Sans', fontWeight: '800', color: deepPink, fontSize: 16 }}>{stats.streak}</Text>
                               <Text style={{ fontFamily: 'PT-Sans', fontSize: 10, color: deepPink, opacity: 0.7, fontWeight: '700', textTransform: 'uppercase' }}>Streak</Text>
                           </View>
                           <View style={{ width: 1, backgroundColor: 'rgba(216, 27, 96, 0.2)', height: '70%', alignSelf: 'center' }} />
                           <View style={{ alignItems: 'center', gap: 4 }}>
                               <BookHeart size={18} color={deepPink} />
                               <Text style={{ fontFamily: 'PT-Sans', fontWeight: '800', color: deepPink, fontSize: 16 }}>{diaryCount}</Text>
                               <Text style={{ fontFamily: 'PT-Sans', fontSize: 10, color: deepPink, opacity: 0.7, fontWeight: '700', textTransform: 'uppercase' }}>Secrets</Text>
                           </View>
                      </View>
                  </Card>
               </TouchableOpacity>
            </View>
          )}

          {!isStarted ? (
             <View style={{ marginTop: 0 }}>
                <ChallengeSelection onSelectCategory={handleSelectCategory} quote={dailyQuote} />
             </View>
          ) : (
            <View style={[styles.cardContainer, { marginTop: 20 }]}>
                 <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: deepPink }]}>
                        {isRewardActive ? "Your Sacred Reward" : "Current Invitation"}
                    </Text>
                    {challenge && !isRewardActive && (
                        <TouchableOpacity onPress={resetChallenge} style={{ padding: 4 }}>
                            <RefreshCw size={18} color={deepPink} />
                        </TouchableOpacity>
                    )}
                </View>

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
          )}

          {/* Diary Section - Visible Always */}
           <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                         <PenLine size={20} color={deepPink} />
                         <Text style={[styles.sectionTitle, { color: deepPink }]}>Intimacy Diary</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/sex-diary')}>
                        <Text style={{ color: deepPink, fontFamily: 'PT-Sans', fontWeight: 'bold' }}>View All</Text>
                    </TouchableOpacity>
                </View>

                {recentDiaryEntry ? (
                    <TouchableOpacity onPress={() => router.push('/sex-diary')}>
                        <Card style={{ padding: 20, backgroundColor: '#FFF5F7', borderColor: pinkBg, borderRadius: 25 }} variant="outline">
                             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                <Text style={{ fontFamily: 'PT-Sans', fontWeight: 'bold', color: deepPink, fontSize: 12, textTransform: 'uppercase' }}>
                                    Last Memory: {format(new Date(recentDiaryEntry.date), 'MMMM d')}
                                </Text>
                                <Sparkles size={16} color={deepPink} />
                             </View>
                             <Text style={{ fontFamily: 'Playfair-Display', fontStyle: 'italic', fontSize: 17, color: '#4A4A4A', marginBottom: 12, lineHeight: 24 }} numberOfLines={3}>
                                 "{recentDiaryEntry.phrases?.[0] || recentDiaryEntry.notes || 'A special moment shared...'}"
                             </Text>
                             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                 <Text style={{ fontFamily: 'PT-Sans', color: deepPink, fontSize: 13, fontWeight: 'bold' }}>Read more</Text>
                                 <ChevronRight size={14} color={deepPink} />
                             </View>
                        </Card>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => router.push('/sex-diary')}>
                        <Card style={{ padding: 24, flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: pinkBg, borderColor: '#FFB6C1', borderRadius: 25 }} variant="outline">
                             <Image source={femaleCharacter} style={{ width: 55, height: 55 }} resizeMode="contain" />
                             <View style={{ flex: 1 }}>
                                 <Text style={{ fontFamily: 'Playfair-Display', fontSize: 19, fontWeight: 'bold', color: deepPink }}>
                                     Spill your secrets?
                                 </Text>
                                 <Text style={{ fontFamily: 'PT-Sans', color: deepPink, fontSize: 14, marginTop: 4, lineHeight: 20, opacity: 0.9 }}>
                                    Your diary is bare, but your nights are full. Capture the magic.
                                 </Text>
                             </View>
                        </Card>
                    </TouchableOpacity>
                )}
            </View>

        </ScrollView>
      </SafeAreaView>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent style={{ borderRadius: 25, padding: 24 }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontFamily: 'Playfair-Display', fontSize: 22, color: deepPink }}>Challenge Conquered!</AlertDialogTitle>
            <AlertDialogDescription style={{ fontFamily: 'PT-Sans', fontSize: 16, lineHeight: 24, marginTop: 10 }}>
              You've proven how deeply connected you are. Unlock your sacred reward and continue this beautiful journey into the unknown.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter style={{ marginTop: 24 }}>
            <AlertDialogCancel onPress={() => setShowConfirmation(false)} style={{ borderRadius: 12 }}>Not Yet</AlertDialogCancel>
            <AlertDialogAction onPress={confirmComplete} style={{ backgroundColor: deepPink, borderRadius: 12 }}>Claim Reward</AlertDialogAction>
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
  welcomeSub: {
      fontFamily: 'PT-Sans',
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontWeight: 'bold',
      opacity: 0.8,
  },
  welcomeTitle: {
      fontFamily: 'Playfair-Display',
      fontSize: 26,
      fontWeight: '800',
      marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
      fontSize: 20,
      fontFamily: 'Playfair-Display',
      fontWeight: 'bold',
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#FFF',
  },
  avatarImage: {
      width: '100%',
      height: '100%',
  },
});
