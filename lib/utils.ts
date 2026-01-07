import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function smartShuffle<T>(key: string, items: T[]): Promise<T> {
  if (!items || items.length === 0) {
    return items[Math.floor(Math.random() * items.length)];
  }

  try {
    const storedStateJSON = await AsyncStorage.getItem(key);
    let shuffledIndices: number[] = [];

    if (storedStateJSON) {
      shuffledIndices = JSON.parse(storedStateJSON);
    }

    if (!shuffledIndices || shuffledIndices.length === 0) {
      // Fisher-Yates shuffle algorithm
      const indices = Array.from({ length: items.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      shuffledIndices = indices;
    }

    const nextIndex = shuffledIndices.pop(); 
    
    await AsyncStorage.setItem(key, JSON.stringify(shuffledIndices));

    if (nextIndex === undefined) {
       return items[Math.floor(Math.random() * items.length)];
    }

    return items[nextIndex];

  } catch (error) {
    console.error("Smart shuffle failed, falling back to random:", error);
    return items[Math.floor(Math.random() * items.length)];
  }
}
