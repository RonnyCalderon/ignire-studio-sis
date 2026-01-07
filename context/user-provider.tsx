import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native'; // Replacement for Skeleton

interface UserContextType {
  userName: string | null;
  partnerName: string | null;
  userIsKnown: boolean;
  saveUser: (userName: string, partnerName: string) => void;
  logout: () => void; // Added helper
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        const storedPartnerName = await AsyncStorage.getItem('partnerName');
        
        if (storedUserName && storedPartnerName) {
          setUserName(storedUserName);
          setPartnerName(storedPartnerName);
        }
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const saveUser = async (newUserName: string, newPartnerName: string) => {
    try {
        // Save locally
        await AsyncStorage.setItem('userName', newUserName);
        await AsyncStorage.setItem('partnerName', newPartnerName);
        
        // Update State
        setUserName(newUserName);
        setPartnerName(newPartnerName);

        // TODO: Here is where you would also sync to Firebase Firestore
        // await setDoc(doc(db, "users", userId), { userName, partnerName });
    } catch (error) {
        console.error("Failed to save user", error);
    }
  };

  const logout = async () => {
      await AsyncStorage.multiRemove(['userName', 'partnerName', 'weeklyChallengeState']);
      setUserName(null);
      setPartnerName(null);
  };

  const userIsKnown = !isLoading && !!userName && !!partnerName;

  if (isLoading) {
    // Native loading state replacing the HTML Skeleton
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FF5A5F" />
        </View>
    );
  }

  return (
    <UserContext.Provider value={{ userName, partnerName, userIsKnown, saveUser, logout }}>
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