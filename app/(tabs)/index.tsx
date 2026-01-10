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
import { RefreshCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const maleCharacter = require('@/assets/images/stickers/Cute-creatures/man-suit-character.png');
const femaleCharacter = require('@/assets/images/stickers/dominatrix2.png');

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
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const mutedForeground = useThemeColor({}, 'mutedForeground');

  const character = gender === 'man' ? maleCharacter : femaleCharacter;

  useEffect(() => {
    const loadQuote = async () => {
        try {
          if (quotes && quotes.length > 0) {
            const quote = await smartShuffle('daily_quote', quotes);
            setDailyQuote(quote);
          }
        } catch (e) {
          console.log("Error loading quote:", e);
        }
    };
    loadQuote();
  }, []);

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
            contentContainerStyle={{ paddingBottom: 120 }} // Increased padding for tab bar
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
