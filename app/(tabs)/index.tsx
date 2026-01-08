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
import Card from '@/components/ui/card';
import { UserOnboarding } from '@/components/user-onboarding';
import { useUser } from '@/context/user-provider';
import { useWeeklyChallenge, type ChallengeCategory } from '@/hooks/use-weekly-challenge';
import { quotes } from '@/lib/quotes';
import { smartShuffle } from '@/lib/utils';
import { RefreshCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function DashboardScreen() {
  const { partnerName, userIsKnown } = useUser();
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

  useEffect(() => {
    const loadQuote = async () => {
        try {
          // Guard against empty quotes
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
    return <View style={[styles.container, { backgroundColor }]}><Text style={{marginTop: 50, textAlign:'center', color: textColor}}>Loading...</Text></View>;
  }

  if (!isStarted) {
    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <ChallengeSelection onSelectCategory={handleSelectCategory} quote={dailyQuote} />
        </SafeAreaView>
    );
  }

  const now = Date.now();
  const isRewardActive = isCompleted && rewardExpiry && now < rewardExpiry;

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
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
            {isRewardActive ? (
                <Card>
                  <RewardCard
                    expiry={rewardExpiry}
                    onRewardEnd={resetChallengeState}
                    onNewChallengeClick={resetChallengeState}
                  />
                </Card>
            ) : (
              challenge && (
                  <Card>
                    <ChallengeCard
                        challenge={challenge}
                        expiry={expiry}
                        onStart={beginChallenge}
                        onComplete={handleCompletePress}
                        isCompleted={isCompleted}
                    />
                  </Card>
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
  },
});
