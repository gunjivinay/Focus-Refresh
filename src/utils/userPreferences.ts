import type { GameType } from '@/src/types';

export interface UserPreferences {
  favoriteGames: GameType[];
  recentGames: GameType[];
  soundEnabled: boolean;
}

const STORAGE_KEY = 'focus-refresh-user-preferences';

function getStorageKey(userId?: string): string {
  if (userId) {
    return `${STORAGE_KEY}_${userId}`;
  }
  return STORAGE_KEY;
}

export function getPreferences(userId?: string): UserPreferences {
  if (typeof window === 'undefined') {
    return {
      favoriteGames: [],
      recentGames: [],
      soundEnabled: true,
    };
  }

  const storageKey = getStorageKey(userId);
  let stored: string | null = null;
  
  try {
    stored = localStorage.getItem(storageKey);
  } catch (e) {
    console.error('localStorage get failed:', e);
    stored = null;
  }
  
  if (!stored) {
    const defaultPrefs: UserPreferences = {
      favoriteGames: [],
      recentGames: [],
      soundEnabled: true,
    };
    savePreferences(defaultPrefs, userId);
    return defaultPrefs;
  }

  try {
    return JSON.parse(stored);
  } catch {
    const defaultPrefs: UserPreferences = {
      favoriteGames: [],
      recentGames: [],
      soundEnabled: true,
    };
    savePreferences(defaultPrefs, userId);
    return defaultPrefs;
  }
}

export function savePreferences(prefs: UserPreferences, userId?: string): void {
  if (typeof window === 'undefined') return;
  const storageKey = getStorageKey(userId);
  
  try {
    localStorage.setItem(storageKey, JSON.stringify(prefs));
  } catch (e: any) {
    console.error('localStorage save failed:', e);
    if (e.name === 'QuotaExceededError' && typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('storage-error', { 
        detail: { type: 'quota_exceeded', message: 'Storage is full. Please export your data.' }
      }));
    }
  }
}

export function toggleFavoriteGame(gameId: GameType, userId?: string): boolean {
  const prefs = getPreferences(userId);
  const index = prefs.favoriteGames.indexOf(gameId);
  
  if (index > -1) {
    prefs.favoriteGames.splice(index, 1);
    savePreferences(prefs, userId);
    return false; // Removed from favorites
  } else {
    prefs.favoriteGames.push(gameId);
    savePreferences(prefs, userId);
    return true; // Added to favorites
  }
}

export function addRecentGame(gameId: GameType, userId?: string): void {
  const prefs = getPreferences(userId);
  // Remove if already exists
  const index = prefs.recentGames.indexOf(gameId);
  if (index > -1) {
    prefs.recentGames.splice(index, 1);
  }
  // Add to beginning
  prefs.recentGames.unshift(gameId);
  // Keep only last 10
  prefs.recentGames = prefs.recentGames.slice(0, 10);
  savePreferences(prefs, userId);
}

export function toggleSound(userId?: string): boolean {
  const prefs = getPreferences(userId);
  prefs.soundEnabled = !prefs.soundEnabled;
  savePreferences(prefs, userId);
  return prefs.soundEnabled;
}

