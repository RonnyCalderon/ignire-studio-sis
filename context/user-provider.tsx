import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { scheduleDailyPhraseNotification } from '@/lib/notifications';

interface UserContextType {
  userName: string | null;
  partnerName: string | null;
  gender: string | null;
  userIsKnown: boolean;
  saveUser: (userName: string, partnerName: string, gender: 'woman' | 'man') => void;
  logout: () => void;
  // State for the automated, invisible strategic cycle
  currentHorizonIndex: number;
  horizonStartDate: string | null;
  advanceToNextHorizon: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New state for the strategic cycle
  const [currentHorizonIndex, setCurrentHorizonIndex] = useState(0);
  const [horizonStartDate, setHorizonStartDate] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        const storedPartnerName = await AsyncStorage.getItem('partnerName');
        const storedGender = await AsyncStorage.getItem('gender');
        let storedIndex = await AsyncStorage.getItem('currentHorizonIndex');
        let storedStartDate = await AsyncStorage.getItem('horizonStartDate');
        
        if (storedUserName && storedPartnerName && storedGender) {
          // --- FIX: Migrate existing users ---
          // If a user exists but has no start date, they are from the old system.
          // We create a start date for them to seamlessly migrate them to the new cycle.
          if (!storedStartDate) {
            const newStartDate = new Date().toISOString();
            await AsyncStorage.setItem('horizonStartDate', newStartDate);
            storedStartDate = newStartDate;

            // Also ensure their index is set to 0.
            await AsyncStorage.setItem('currentHorizonIndex', '0');
            storedIndex = '0';
          }
          // --- END FIX ---
          
          setUserName(storedUserName);
          setPartnerName(storedPartnerName);
          setGender(storedGender);
          
          setCurrentHorizonIndex(storedIndex ? parseInt(storedIndex, 10) : 0);
          setHorizonStartDate(storedStartDate);

          scheduleDailyPhraseNotification(storedGender as 'woman' | 'man');
        }
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const saveUser = async (newUserName: string, newPartnerName: string, newGender: 'woman' | 'man') => {
    try {
        await AsyncStorage.setItem('userName', newUserName);
        await AsyncStorage.setItem('partnerName', newPartnerName);
        await AsyncStorage.setItem('gender', newGender);
        // Start the journey on first login
        const startDate = new Date().toISOString();
        await AsyncStorage.setItem('currentHorizonIndex', '0');
        await AsyncStorage.setItem('horizonStartDate', startDate);
        
        setUserName(newUserName);
        setPartnerName(newPartnerName);
        setGender(newGender);
        setCurrentHorizonIndex(0);
        setHorizonStartDate(startDate);

        scheduleDailyPhraseNotification(newGender);
    } catch (error) {
        console.error("Failed to save user", error);
    }
  };

  const advanceToNextHorizon = async () => {
    const newIndex = currentHorizonIndex + 1;
    const newStartDate = new Date().toISOString();
    
    setCurrentHorizonIndex(newIndex);
    setHorizonStartDate(newStartDate);

    await AsyncStorage.setItem('currentHorizonIndex', newIndex.toString());
    await AsyncStorage.setItem('horizonStartDate', newStartDate);
  };

  const logout = async () => {
      await AsyncStorage.multiRemove([
        'userName', 'partnerName', 'gender', 'weeklyChallengeState', 
        'currentHorizonIndex', 'horizonStartDate'
      ]);
      setUserName(null);
      setPartnerName(null);
      setGender(null);
      setCurrentHorizonIndex(0);
      setHorizonStartDate(null);
  };

  const userIsKnown = !isLoading && !!userName && !!partnerName && !!gender;

  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FF5A5F" />
        </View>
    );
  }

  return (
    <UserContext.Provider value={{ 
      userName, partnerName, gender, userIsKnown, saveUser, logout,
      currentHorizonIndex, horizonStartDate, advanceToNextHorizon 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}