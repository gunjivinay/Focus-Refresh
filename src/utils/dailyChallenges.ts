import type { GameType } from '@/src/types';

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  gameId: GameType;
  targetScore?: number;
  targetCompletion?: boolean;
  reward: {
    type: 'badge' | 'bonus';
    badgeId?: string;
    bonusPoints?: number;
  };
  completed: boolean;
}

const STORAGE_KEY = 'focus-refresh-daily-challenges';

function getStorageKey(userId?: string): string {
  if (userId) {
    return `${STORAGE_KEY}_${userId}`;
  }
  return STORAGE_KEY;
}

export function getTodayChallenge(userId?: string): DailyChallenge | null {
  if (typeof window === 'undefined') return null;

  const storageKey = getStorageKey(userId);
  const stored = localStorage.getItem(storageKey);
  const today = new Date().toISOString().split('T')[0];

  if (stored) {
    try {
      const challenges: DailyChallenge[] = JSON.parse(stored);
      const todayChallenge = challenges.find(c => c.date === today);
      if (todayChallenge) {
        return todayChallenge;
      }
    } catch {
      // Invalid data, continue to create new
    }
  }

  // Create new challenge for today
  const allGames: GameType[] = [
    'number-guess', 'rock-paper-scissors', 'quick-math-duel', 'typing-burst',
    'memory-flip', 'simon-says', 'word-scramble', 'trivia-quiz',
  ];

  const randomGame = allGames[Math.floor(Math.random() * allGames.length)];
  const challengeTypes = [
    {
      title: 'Quick Win',
      description: `Complete a game of ${randomGame}`,
      targetCompletion: true,
      reward: { type: 'bonus' as const, bonusPoints: 50 },
    },
    {
      title: 'Score Master',
      description: `Score at least 100 points in ${randomGame}`,
      targetScore: 100,
      reward: { type: 'bonus' as const, bonusPoints: 75 },
    },
    {
      title: 'Daily Player',
      description: `Play any game today`,
      reward: { type: 'bonus' as const, bonusPoints: 25 },
    },
  ];

  const challengeType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];

  const newChallenge: DailyChallenge = {
    id: `challenge_${Date.now()}`,
    date: today,
    title: challengeType.title,
    description: challengeType.description,
    gameId: randomGame,
    targetScore: challengeType.targetScore,
    targetCompletion: challengeType.targetCompletion,
    reward: challengeType.reward as { type: 'badge' | 'bonus'; badgeId?: string; bonusPoints?: number },
    completed: false,
  };

  saveChallenge(newChallenge, userId);
  return newChallenge;
}

function saveChallenge(challenge: DailyChallenge, userId?: string): void {
  if (typeof window === 'undefined') return;

  const storageKey = getStorageKey(userId);
  const stored = localStorage.getItem(storageKey);
  let challenges: DailyChallenge[] = [];

  if (stored) {
    try {
      challenges = JSON.parse(stored);
      // Remove old challenges (older than 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      challenges = challenges.filter(c => new Date(c.date) >= sevenDaysAgo);
    } catch {
      challenges = [];
    }
  }

  // Update or add challenge
  const index = challenges.findIndex(c => c.id === challenge.id);
  if (index > -1) {
    challenges[index] = challenge;
  } else {
    challenges.push(challenge);
  }

  localStorage.setItem(storageKey, JSON.stringify(challenges));
}

export function completeChallenge(challengeId: string, userId?: string): void {
  const challenge = getTodayChallenge(userId);
  if (challenge && challenge.id === challengeId) {
    challenge.completed = true;
    saveChallenge(challenge, userId);
  }
}

export function checkChallengeCompletion(
  gameId: GameType,
  score: number,
  completed: boolean,
  userId?: string
): { completed: boolean; reward?: { type: 'bonus'; bonusPoints: number } } {
  const challenge = getTodayChallenge(userId);
  if (!challenge || challenge.completed || challenge.gameId !== gameId) {
    return { completed: false };
  }

  let isCompleted = false;

  if (challenge.targetCompletion !== undefined) {
    isCompleted = completed === challenge.targetCompletion;
  } else if (challenge.targetScore !== undefined) {
    isCompleted = score >= challenge.targetScore;
  } else {
    // Just playing the game completes it
    isCompleted = true;
  }

  if (isCompleted) {
    completeChallenge(challenge.id, userId);
    return {
      completed: true,
      reward: challenge.reward.type === 'bonus' 
        ? { type: 'bonus' as const, bonusPoints: challenge.reward.bonusPoints || 0 }
        : undefined,
    };
  }

  return { completed: false };
}

