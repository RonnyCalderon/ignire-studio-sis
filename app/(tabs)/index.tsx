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
import { Button } from '@/components/ui/button';
import { UserOnboarding } from '@/components/user-onboarding';
import { useUser } from '@/context/user-provider';
import { useWeeklyChallenge, type ChallengeCategory } from '@/hooks/use-weekly-challenge';
import { quotes } from '@/lib/quotes';
import { smartShuffle } from '@/lib/utils';
import { RefreshCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

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

  useEffect(() => {
    const loadQuote = async () => {
        const quote = await smartShuffle('daily_quote', quotes);
        setDailyQuote(quote);
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
    return <View style={styles.container}><Text style={{marginTop: 50, textAlign:'center'}}>Loading...</Text></View>;
  }

  // PASSING QUOTE HERE
  if (!isStarted) {
    return (
        <View style={styles.container}>
            <ChallengeSelection onSelectCategory={handleSelectCategory} quote={dailyQuote} />
        </View>
    );
  }

  const now = Date.now();
  const isRewardActive = isCompleted && rewardExpiry && now < rewardExpiry;

  return (
    <>
      <ScrollView 
          style={styles.container} 
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
              {isRewardActive ? "Your Reward" : `Invitation for ${partnerName}`}
          </Text>
          {challenge && !isRewardActive && (
              <Button variant="outline" size="icon" onPress={resetChallenge}>
                  <RefreshCw size={16} color="#000" />
              </Button>
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
      </ScrollView>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Challenge Conquered!</AlertDialogTitle>
            <AlertDialogDescription>
              You've proven once again how deeply connected and adventurous you both are. 
              Confirming this step unlocks your reward and continues your journey deeper. Are you ready?
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
    backgroundColor: '#fff',
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
    fontWeight: '800',
    color: '#FF5A5F', 
    flex: 1,
  },
});