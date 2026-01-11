import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function smartShuffle<T>(key: string, items: T[]): Promise<T> {
  if (!items || items.length === 0) {
    // Fallback for an empty array to prevent crashing.
    return items[0]; 
  }

  // Use a unique storage key to prevent collisions with other data.
  const storageKey = `smart_shuffle_state_${key}`;

  try {
    const storedStateJSON = await AsyncStorage.getItem(storageKey);
    let shuffledIndices: number[] = [];

    if (storedStateJSON) {
      shuffledIndices = JSON.parse(storedStateJSON);
    }

    // Check if we need a new shuffle:
    // 1. No stored indices
    // 2. Indices list is empty
    // 3. Stored indices are out of bounds for the current items list (e.g. if the items list changed)
    const needsNewShuffle = 
      !shuffledIndices || 
      shuffledIndices.length === 0 || 
      shuffledIndices.some(idx => idx >= items.length);

    if (needsNewShuffle) {
      // Fisher-Yates shuffle algorithm
      const indices = Array.from({ length: items.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      shuffledIndices = indices;
    }

    const nextIndex = shuffledIndices.pop();
    
    await AsyncStorage.setItem(storageKey, JSON.stringify(shuffledIndices));

    if (nextIndex === undefined || items[nextIndex] === undefined) {
      // This is a fallback in case something went wrong
      return items[Math.floor(Math.random() * items.length)];
    }

    return items[nextIndex];
  } catch (error) {
    console.error("Smart shuffle failed, falling back to random:", error);
    // Fallback to a simple random choice if anything goes wrong.
    return items[Math.floor(Math.random() * items.length)];
  }
}
