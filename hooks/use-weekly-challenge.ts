import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { generateWeeklyChallenge, type Challenge } from '@/ai/flows/generate-weekly-challenge';
import { useUser } from '@/context/user-provider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHALLENGE_DURATION = 7 * 24 * 60 * 60 * 1000;
const REWARD_DURATION = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'weeklyChallengeState';
const HISTORY_KEY = 'challengeHistory';

export type ChallengeCategory = 'love' | 'adventurous' | 'sexy';

export type ChallengeHistoryItem = Challenge & { completedAt: number };

export interface WeeklyChallengeState {
  challenge: Challenge | null;
  expiry: number | null;
  isCompleted: boolean;
  rewardExpiry: number | null;
  isStarted: boolean;
}

export function useWeeklyChallenge() {
  const { partnerName } = useUser();
  const [state, setState] = useState<WeeklyChallengeState & { isLoading: boolean; history: ChallengeHistoryItem[] }>({
    challenge: null,
    expiry: null,
    isCompleted: false,
    rewardExpiry: null,
    isStarted: false,
    isLoading: true,
    history: [],
  });

  const persistState = async (newState: WeeklyChallengeState) => {
      try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (e) { console.error(e); }
  };
  
  const loadHistory = async (): Promise<ChallengeHistoryItem[]> => {
    try {
        const historyJSON = await AsyncStorage.getItem(HISTORY_KEY);
        return historyJSON ? JSON.parse(historyJSON) : [];
    } catch (e) {
        console.error("Failed to load history", e);
        return [];
    }
  };

  const resetChallengeState = useCallback(async () => {
    const resetState: WeeklyChallengeState = { 
        challenge: null, 
        expiry: null, 
        isCompleted: false, 
        rewardExpiry: null, 
        isStarted: false 
    };
    await persistState(resetState);
    setState(s => ({ ...s, ...resetState, isLoading: false }));
  }, []);

  const loadState = useCallback(async () => {
    try {
        const storedStateJSON = await AsyncStorage.getItem(STORAGE_KEY);
        const challengeHistory = await loadHistory();
        const now = Date.now();

        if (storedStateJSON) {
          const storedState: WeeklyChallengeState = JSON.parse(storedStateJSON);
          
          const isChallengeSelected = storedState.isStarted && !storedState.isCompleted;
          const isChallengeRunning = storedState.expiry && now < storedState.expiry;
          const isRewardActive = storedState.isCompleted && storedState.rewardExpiry && now < storedState.rewardExpiry;

          if (isChallengeSelected || isChallengeRunning || isRewardActive) {
              setState({ ...storedState, history: challengeHistory, isLoading: false });
          } else {
              await resetChallengeState();
              setState(s => ({...s, history: challengeHistory }));
          }
        } else {
            setState(s => ({ ...s, isLoading: false, isStarted: false, history: challengeHistory }));
        }
    } catch (e) {
        console.error(e);
        const challengeHistory = await loadHistory();
        setState(s => ({ ...s, isLoading: false, history: challengeHistory }));
    }
  }, [resetChallengeState]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const startNewChallenge = useCallback(async (category: ChallengeCategory) => {
    setState(s => ({ ...s, isLoading: true }));
    try {
      const result = await generateWeeklyChallenge({ category, partnerName: partnerName || undefined });

      const newState: WeeklyChallengeState = {
        challenge: result.challenge,
        expiry: null,
        isCompleted: false,
        rewardExpiry: null,
        isStarted: true,
      };
      await persistState(newState);
      setState(s => ({ ...s, ...newState, isLoading: false }));
    } catch (error) {
      console.error("Failed to generate challenge:", error);
      resetChallengeState();
    }
  }, [resetChallengeState, partnerName]);
  
  const beginChallenge = useCallback(async () => {
    if (!state.challenge || state.expiry) return;

    const newExpiry = Date.now() + CHALLENGE_DURATION;
    const runningState: WeeklyChallengeState = {
      ...state,
      expiry: newExpiry,
    };
    await persistState(runningState);
    setState(s => ({...s, ...runningState, isLoading: false }));
  }, [state]);

  const completeChallenge = useCallback(async () => {
    if (!state.challenge || !state.expiry) return;

    const now = Date.now();
    const newRewardExpiry = now + REWARD_DURATION;
    const completedState: WeeklyChallengeState = {
      ...state,
      isCompleted: true,
      rewardExpiry: newRewardExpiry,
    };
    
    await persistState(completedState);

    const newHistoryItem: ChallengeHistoryItem = { ...state.challenge, completedAt: now };
    const newHistory = [newHistoryItem, ...state.history];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    
    setState(s => ({...s, ...completedState, history: newHistory, isLoading: false }));
  }, [state]);

  const resetChallenge = useCallback(() => {
      Alert.alert(
          "Start Fresh",
          "Are you sure you want to generate a new challenge? Current progress will be lost.",
          [
              { text: "Cancel", style: "cancel" },
              { text: "Reset", style: "destructive", onPress: resetChallengeState }
          ]
      );
  }, [resetChallengeState]);

  return { ...state, completeChallenge, startNewChallenge, resetChallengeState, beginChallenge, resetChallenge };
}
