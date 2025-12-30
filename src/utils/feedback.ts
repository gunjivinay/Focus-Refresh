// Feedback storage and retrieval

export interface Feedback {
  id: string;
  text: string;
  rating: number;
  mood: 'overwhelmed' | 'bored' | 'sleepy' | 'other';
  date: string;
  timestamp: number;
  userName?: string;
}

const FEEDBACK_STORAGE_KEY = 'focus-refresh-feedback';

const moodEmojis: Record<Feedback['mood'], string> = {
  overwhelmed: '😰',
  bored: '😑',
  sleepy: '😴',
  other: '✨',
};

export function getMoodEmoji(mood: Feedback['mood']): string {
  return moodEmojis[mood] || '✨';
}

export function getAllFeedback(): Feedback[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!stored) return [];
    
    const feedbacks: Feedback[] = JSON.parse(stored);
    // Sort by timestamp descending (newest first)
    return feedbacks.sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

export function saveFeedback(feedback: Omit<Feedback, 'id' | 'timestamp' | 'date'>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getAllFeedback();
    const newFeedback: Feedback = {
      ...feedback,
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
    };
    
    // Add to beginning (newest first)
    const updated = [newFeedback, ...existing];
    
    // Keep only last 50 feedbacks to prevent storage bloat
    const limited = updated.slice(0, 50);
    
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving feedback:', error);
  }
}


