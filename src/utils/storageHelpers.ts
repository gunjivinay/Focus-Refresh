/**
 * Safe localStorage helpers with error handling and quota management
 */

export interface StorageError {
  type: 'quota_exceeded' | 'blocked' | 'unknown';
  message: string;
}

/**
 * Safely get item from localStorage with error handling
 */
export function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('localStorage.getItem failed:', error);
    return null;
  }
}

/**
 * Safely set item in localStorage with error handling and quota management
 */
export function safeSetItem(key: string, value: string): { success: boolean; error?: StorageError } {
  if (typeof window === 'undefined') {
    return { success: false, error: { type: 'unknown', message: 'localStorage not available' } };
  }

  try {
    localStorage.setItem(key, value);
    return { success: true };
  } catch (error: any) {
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      console.warn('localStorage quota exceeded, attempting cleanup...');
      
      // Try to free up space by cleaning old data
      const cleaned = cleanupOldData();
      if (cleaned) {
        try {
          localStorage.setItem(key, value);
          return { success: true };
        } catch (retryError) {
          return {
            success: false,
            error: {
              type: 'quota_exceeded',
              message: 'Storage is full. Please clear some browser data or export your data.',
            },
          };
        }
      }
      
      return {
        success: false,
        error: {
          type: 'quota_exceeded',
          message: 'Storage is full. Please clear some browser data or export your data.',
        },
      };
    }
    
    // Handle blocked localStorage (private mode, etc.)
    if (error.name === 'SecurityError' || error.code === 18) {
      return {
        success: false,
        error: {
          type: 'blocked',
          message: 'localStorage is blocked. Please allow cookies/storage in your browser settings.',
        },
      };
    }
    
    return {
      success: false,
      error: {
        type: 'unknown',
        message: 'Failed to save data. Please try again.',
      },
    };
  }
}

/**
 * Clean up old data to free storage space
 */
function cleanupOldData(): boolean {
  try {
    // Clean up old game history (keep last 50 games)
    const statsKey = 'focus-refresh-user-stats';
    const statsData = localStorage.getItem(statsKey);
    if (statsData) {
      try {
        const stats = JSON.parse(statsData);
        if (stats.gameHistory && stats.gameHistory.length > 50) {
          stats.gameHistory = stats.gameHistory.slice(-50); // Keep last 50
          localStorage.setItem(statsKey, JSON.stringify(stats));
          return true;
        }
      } catch (e) {
        // Invalid data, remove it
        localStorage.removeItem(statsKey);
        return true;
      }
    }
    
    // Clean up old feedback (keep last 20)
    const feedbackKey = 'focus-refresh-feedback';
    const feedbackData = localStorage.getItem(feedbackKey);
    if (feedbackData) {
      try {
        const feedback = JSON.parse(feedbackData);
        if (feedback.length > 20) {
          const cleaned = feedback.slice(0, 20);
          localStorage.setItem(feedbackKey, JSON.stringify(cleaned));
          return true;
        }
      } catch (e) {
        localStorage.removeItem(feedbackKey);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Cleanup failed:', error);
    return false;
  }
}

/**
 * Check if localStorage is available and working
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get approximate storage usage
 */
export function getStorageUsage(): { used: number; available: number; percentage: number } {
  if (typeof window === 'undefined' || !('storage' in navigator && 'estimate' in navigator.storage)) {
    return { used: 0, available: 0, percentage: 0 };
  }
  
  try {
    navigator.storage.estimate().then((estimate) => {
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? (used / quota) * 100 : 0;
      
      // Store in sessionStorage for quick access
      sessionStorage.setItem('storage_usage', JSON.stringify({ used, available: quota - used, percentage }));
    });
  } catch (error) {
    console.warn('Storage estimate failed:', error);
  }
  
  // Return cached value if available
  const cached = sessionStorage.getItem('storage_usage');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
  
  return { used: 0, available: 0, percentage: 0 };
}

/**
 * Export all user data as JSON
 */
export function exportUserData(userId?: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data: Record<string, any> = {};
    
    // Export stats
    const statsKey = userId ? `focus-refresh-user-stats_${userId}` : 'focus-refresh-user-stats';
    const stats = localStorage.getItem(statsKey);
    if (stats) data.stats = JSON.parse(stats);
    
    // Export preferences
    const prefsKey = userId ? `focus-refresh-user-preferences_${userId}` : 'focus-refresh-user-preferences';
    const prefs = localStorage.getItem(prefsKey);
    if (prefs) data.preferences = JSON.parse(prefs);
    
    // Export daily challenges
    const challengesKey = userId ? `focus-refresh-daily-challenges_${userId}` : 'focus-refresh-daily-challenges';
    const challenges = localStorage.getItem(challengesKey);
    if (challenges) data.challenges = JSON.parse(challenges);
    
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Export failed:', error);
    return null;
  }
}

/**
 * Import user data from JSON
 */
export function importUserData(jsonData: string, userId?: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'localStorage not available' };
  }
  
  try {
    const data = JSON.parse(jsonData);
    
    // Import stats
    if (data.stats) {
      const statsKey = userId ? `focus-refresh-user-stats_${userId}` : 'focus-refresh-user-stats';
      const result = safeSetItem(statsKey, JSON.stringify(data.stats));
      if (!result.success) {
        return { success: false, error: result.error?.message || 'Failed to import stats' };
      }
    }
    
    // Import preferences
    if (data.preferences) {
      const prefsKey = userId ? `focus-refresh-user-preferences_${userId}` : 'focus-refresh-user-preferences';
      const result = safeSetItem(prefsKey, JSON.stringify(data.preferences));
      if (!result.success) {
        return { success: false, error: result.error?.message || 'Failed to import preferences' };
      }
    }
    
    // Import challenges
    if (data.challenges) {
      const challengesKey = userId ? `focus-refresh-daily-challenges_${userId}` : 'focus-refresh-daily-challenges';
      const result = safeSetItem(challengesKey, JSON.stringify(data.challenges));
      if (!result.success) {
        return { success: false, error: result.error?.message || 'Failed to import challenges' };
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Invalid data format' };
  }
}

