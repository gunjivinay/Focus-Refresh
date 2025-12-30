// User statistics and badge tracking

import type { BadgeId } from '@/src/types/badges';
import { ALL_BADGES } from '@/src/types/badges';
import type { GameType } from '@/src/types';

export interface UserStats {
  userId: string;
  userName: string;
  totalGamesPlayed: number;
  totalScore: number;
  gamesCompleted: number;
  badges: BadgeId[];
  gameHistory: {
    gameId: GameType;
    score: number;
    completed: boolean;
    timestamp: number;
    duration: number;
  }[];
  lastPlayedDate: string;
  playStreak: number;
  gamesByType: Record<NonNullable<GameType>, number>;
  achievements: {
    perfectGames: number;
    fastCompletions: number;
    highScores: Record<NonNullable<GameType>, number>;
  };
}

const STORAGE_KEY = 'focus-refresh-user-stats';

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getStorageKey(userId?: string): string {
  if (userId) {
    return `${STORAGE_KEY}_${userId}`;
  }
  return STORAGE_KEY;
}

export function getUserStats(userId?: string): UserStats | null {
  if (typeof window === 'undefined') return null;
  
  const storageKey = getStorageKey(userId);
  let stored: string | null = null;
  
  try {
    stored = localStorage.getItem(storageKey);
  } catch (e) {
    console.error('localStorage get failed:', e);
    return null;
  }
  
  if (!stored) {
    // Create new user
    const newUser: UserStats = {
      userId: userId || generateUserId(),
      userName: 'Player',
      totalGamesPlayed: 0,
      totalScore: 0,
      gamesCompleted: 0,
      badges: [],
      gameHistory: [],
      lastPlayedDate: new Date().toISOString().split('T')[0],
      playStreak: 0,
      gamesByType: {} as Record<NonNullable<GameType>, number>,
      achievements: {
        perfectGames: 0,
        fastCompletions: 0,
        highScores: {} as Record<NonNullable<GameType>, number>,
      },
    };
    saveUserStats(newUser, userId);
    return newUser;
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveUserStats(stats: UserStats, userId?: string): void {
  if (typeof window === 'undefined') return;
  const storageKey = getStorageKey(userId || stats.userId);
  
  try {
    // Dynamic import to avoid circular dependencies
    import('./storageHelpers').then(({ safeSetItem }) => {
      const result = safeSetItem(storageKey, JSON.stringify(stats));
      if (!result.success && result.error) {
        console.error('Failed to save stats:', result.error.message);
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('storage-error', { detail: result.error }));
        }
      }
    }).catch(() => {
      // Fallback to direct localStorage
      try {
        localStorage.setItem(storageKey, JSON.stringify(stats));
      } catch (e: any) {
        console.error('localStorage save failed:', e);
        if (e.name === 'QuotaExceededError' && typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('storage-error', { 
            detail: { type: 'quota_exceeded', message: 'Storage is full. Please export your data or clear browser storage.' }
          }));
        }
      }
    });
  } catch (error) {
    // Fallback to direct localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(stats));
    } catch (e: any) {
      console.error('localStorage save failed:', e);
      if (e.name === 'QuotaExceededError' && typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('storage-error', { 
          detail: { type: 'quota_exceeded', message: 'Storage is full. Please export your data or clear browser storage.' }
        }));
      }
    }
  }
}

export function updateUserStats(updates: Partial<UserStats>, userId?: string): UserStats {
  const current = getUserStats(userId);
  if (!current) {
    const newUser: UserStats = {
      userId: userId || generateUserId(),
      userName: 'Player',
      totalGamesPlayed: 0,
      totalScore: 0,
      gamesCompleted: 0,
      badges: [],
      gameHistory: [],
      lastPlayedDate: new Date().toISOString().split('T')[0],
      playStreak: 0,
      gamesByType: {} as Record<NonNullable<GameType>, number>,
      achievements: {
        perfectGames: 0,
        fastCompletions: 0,
        highScores: {} as Record<NonNullable<GameType>, number>,
      },
    };
    Object.assign(newUser, updates);
    saveUserStats(newUser, userId);
    return newUser;
  }
  
  const updated = { ...current, ...updates };
  saveUserStats(updated, userId);
  return updated;
}

export function recordGamePlay(
  gameId: GameType,
  score: number,
  completed: boolean,
  duration: number,
  userId?: string
): { stats: UserStats; newBadges: BadgeId[] } {
  if (!gameId) {
    const stats = getUserStats(userId) || updateUserStats({}, userId);
    return { stats, newBadges: [] };
  }
  
  const stats = getUserStats(userId);
  if (!stats) {
    const newStats = updateUserStats({
      totalGamesPlayed: 1,
      totalScore: score,
      gamesCompleted: completed ? 1 : 0,
      gameHistory: [{
        gameId,
        score,
        completed,
        timestamp: Date.now(),
        duration,
      }],
      gamesByType: { [gameId]: 1 } as Record<NonNullable<GameType>, number>,
    }, userId);
    return { stats: newStats, newBadges: checkForNewBadges(newStats, gameId, score, completed, duration) };
  }

  // Update stats
  const today = new Date().toISOString().split('T')[0];
  const lastDate = stats.lastPlayedDate;
  const playStreak = today === lastDate ? stats.playStreak : 
                     new Date(today).getTime() - new Date(lastDate).getTime() === 86400000 ? stats.playStreak + 1 : 1;

  const updatedStats = updateUserStats({
    totalGamesPlayed: stats.totalGamesPlayed + 1,
    totalScore: stats.totalScore + score,
    gamesCompleted: stats.gamesCompleted + (completed ? 1 : 0),
    gameHistory: [
      ...stats.gameHistory,
      {
        gameId,
        score,
        completed,
        timestamp: Date.now(),
        duration,
      },
    ],
    lastPlayedDate: today,
    playStreak,
    gamesByType: {
      ...stats.gamesByType,
      [gameId]: (stats.gamesByType[gameId] || 0) + 1,
    },
    achievements: {
      ...stats.achievements,
      perfectGames: completed && score > 0 ? stats.achievements.perfectGames + 1 : stats.achievements.perfectGames,
      fastCompletions: duration < 120 ? stats.achievements.fastCompletions + 1 : stats.achievements.fastCompletions,
      highScores: {
        ...stats.achievements.highScores,
        [gameId]: Math.max(stats.achievements.highScores[gameId] || 0, score),
      },
    },
  }, userId);

  const newBadges = checkForNewBadges(updatedStats, gameId, score, completed, duration);
  
  if (newBadges.length > 0) {
    updatedStats.badges = [...new Set([...updatedStats.badges, ...newBadges])];
    saveUserStats(updatedStats, userId);
  }

  return { stats: updatedStats, newBadges };
}

function checkForNewBadges(
  stats: UserStats,
  gameId: GameType,
  score: number,
  completed: boolean,
  duration: number
): BadgeId[] {
  const newBadges: BadgeId[] = [];
  const currentBadges = new Set(stats.badges);

  // First game badge
  if (stats.totalGamesPlayed === 1 && !currentBadges.has('first-game')) {
    newBadges.push('first-game');
  }

  // Speed demon - complete game in under 2 minutes
  if (completed && duration < 120 && !currentBadges.has('speed-demon')) {
    newBadges.push('speed-demon');
  }

  // Puzzle master - complete 10 puzzle games
  const puzzleGames: NonNullable<GameType>[] = [
    'sudoku', 'brain-teaser', 'logic-lock', 'chess-puzzle', 
    'light-logic', 'code-puzzles', 'block-puzzle', 'code-breaker',
    'spot-difference', 'spot-the-diff', 'mind-maze', 'number-guess'
  ];
  const puzzleCount = puzzleGames.reduce((sum, game) => sum + (stats.gamesByType[game] || 0), 0);
  if (puzzleCount >= 10 && !currentBadges.has('puzzle-master')) {
    newBadges.push('puzzle-master');
  }

  // Word wizard - complete 5 word games
  const wordGames: NonNullable<GameType>[] = [
    'word-chain', 'word-search', 'anagram-solver', 'word-scramble',
    'quick-word-chain', 'odd-one-out', 'story-chain', 'typing-burst'
  ];
  const wordCount = wordGames.reduce((sum, game) => sum + (stats.gamesByType[game] || 0), 0);
  if (wordCount >= 5 && !currentBadges.has('word-wizard')) {
    newBadges.push('word-wizard');
  }

  // Math genius - score 200+ in math games
  const mathGames: NonNullable<GameType>[] = [
    'math-rush', 'number-crunch', 'sequence-solver', 'quick-math-duel'
  ];
  const mathTotal = stats.gameHistory
    .filter(g => g.gameId && mathGames.includes(g.gameId))
    .reduce((sum, g) => sum + g.score, 0);
  if (mathTotal >= 200 && !currentBadges.has('math-genius')) {
    newBadges.push('math-genius');
  }

  // Memory king - complete all memory games
  const memoryGames: NonNullable<GameType>[] = [
    'memory-matrix', 'pattern-master', 'mind-maze', 'memory-flip', 'simon-says'
  ];
  const memoryCompleted = memoryGames.every(game => (stats.gamesByType[game] || 0) > 0);
  if (memoryCompleted && !currentBadges.has('memory-king')) {
    newBadges.push('memory-king');
  }

  // Perfectionist - complete with zero errors (simplified: high score)
  if (completed && score >= 100 && !currentBadges.has('perfectionist')) {
    newBadges.push('perfectionist');
  }

  // Dedicated - play 20 games
  if (stats.totalGamesPlayed >= 20 && !currentBadges.has('dedicated')) {
    newBadges.push('dedicated');
  }

  // Explorer - try 10 different games
  const uniqueGames = Object.keys(stats.gamesByType).length;
  if (uniqueGames >= 10 && !currentBadges.has('explorer')) {
    newBadges.push('explorer');
  }

  // Champion - complete 50 games
  if (stats.gamesCompleted >= 50 && !currentBadges.has('champion')) {
    newBadges.push('champion');
  }

  // Streak master - play 5 days in a row
  if (stats.playStreak >= 5 && !currentBadges.has('streak-master')) {
    newBadges.push('streak-master');
  }

  // Night owl - play after 10 PM
  const hour = new Date().getHours();
  if (hour >= 22 && !currentBadges.has('night-owl')) {
    newBadges.push('night-owl');
  }

  // Early bird - play before 8 AM
  if (hour < 8 && !currentBadges.has('early-bird')) {
    newBadges.push('early-bird');
  }

  // Weekend warrior - play on weekends
  const day = new Date().getDay();
  if ((day === 0 || day === 6) && !currentBadges.has('weekend-warrior')) {
    newBadges.push('weekend-warrior');
  }

  // Quick thinker - complete 3 games in one session
  const todayGames = stats.gameHistory.filter(g => {
    const gameDate = new Date(g.timestamp).toISOString().split('T')[0];
    return gameDate === stats.lastPlayedDate;
  });
  if (todayGames.length >= 3 && !currentBadges.has('quick-thinker')) {
    newBadges.push('quick-thinker');
  }

  // Game-specific badges based on performance
  if (completed) {
    // Number Guess Master - complete in 3 attempts or less (score represents attempts)
    if (gameId === 'number-guess' && score <= 3 && !currentBadges.has('number-guess-master')) {
      newBadges.push('number-guess-master');
    }

    // RPS Champion - win 5 matches
    if (gameId === 'rock-paper-scissors' && (stats.gamesByType[gameId] || 0) >= 5 && !currentBadges.has('rps-champion')) {
      newBadges.push('rps-champion');
    }

    // Math Duel Expert - score 80%+ (score represents percentage)
    if (gameId === 'quick-math-duel' && score >= 80 && !currentBadges.has('math-duel-expert')) {
      newBadges.push('math-duel-expert');
    }

    // Typing Speedster - score 60+ (score represents WPM)
    if (gameId === 'typing-burst' && score >= 60 && !currentBadges.has('typing-speedster')) {
      newBadges.push('typing-speedster');
    }

    // Odd One Out Pro - score 100% (score represents percentage)
    if (gameId === 'odd-one-out' && score >= 100 && !currentBadges.has('odd-one-out-pro')) {
      newBadges.push('odd-one-out-pro');
    }

    // Memory Flip Ace - complete in under 20 moves (score represents moves)
    if (gameId === 'memory-flip' && score <= 20 && !currentBadges.has('memory-flip-ace')) {
      newBadges.push('memory-flip-ace');
    }

    // Word Chain Builder - score 10+ (score represents chain length)
    if (gameId === 'quick-word-chain' && score >= 10 && !currentBadges.has('word-chain-builder')) {
      newBadges.push('word-chain-builder');
    }

    // Simon Says Master - complete all 5 levels
    if (gameId === 'simon-says' && (stats.gamesByType[gameId] || 0) >= 5 && !currentBadges.has('simon-says-master')) {
      newBadges.push('simon-says-master');
    }

    // 2048 Champion - score 512+ (score represents highest tile)
    if (gameId === 'slide-puzzle-2048' && score >= 512 && !currentBadges.has('2048-champion')) {
      newBadges.push('2048-champion');
    }

    // Snake Master - survive 90 seconds (duration check)
    if (gameId === 'snake-avoider' && duration >= 90 && !currentBadges.has('snake-master')) {
      newBadges.push('snake-master');
    }

    // Alchemy Wizard - discover 5+ items (score represents discoveries)
    if (gameId === 'little-alchemy' && score >= 5 && !currentBadges.has('alchemy-wizard')) {
      newBadges.push('alchemy-wizard');
    }

    // Scramble King - unscramble 6+ words (score represents correct words)
    if (gameId === 'word-scramble' && score >= 6 && !currentBadges.has('scramble-king')) {
      newBadges.push('scramble-king');
    }

    // Trivia Expert - score 80%+ (score represents percentage)
    if (gameId === 'trivia-quiz' && score >= 80 && !currentBadges.has('trivia-expert')) {
      newBadges.push('trivia-expert');
    }

    // Doodle Artist - complete a doodle challenge
    if (gameId === 'doodle-challenge' && !currentBadges.has('doodle-artist')) {
      newBadges.push('doodle-artist');
    }

    // Spot the Difference Pro - find all differences quickly (duration check)
    if (gameId === 'spot-difference' && duration < 60 && !currentBadges.has('spot-difference-pro')) {
      newBadges.push('spot-difference-pro');
    }

    // Airplane Pilot - throw 200+ meters (score represents distance)
    if (gameId === 'paper-airplane' && score >= 200 && !currentBadges.has('airplane-pilot')) {
      newBadges.push('airplane-pilot');
    }

    // Logic Solver - complete light logic puzzles
    if (gameId === 'light-logic' && !currentBadges.has('logic-solver')) {
      newBadges.push('logic-solver');
    }

    // Story Teller - complete a story chain
    if (gameId === 'story-chain' && !currentBadges.has('story-teller')) {
      newBadges.push('story-teller');
    }

    // Code Debugger - solve all puzzles correctly (score represents correct answers)
    if (gameId === 'code-puzzles' && score >= 100 && !currentBadges.has('code-debugger')) {
      newBadges.push('code-debugger');
    }

    // Tetris Master - reach level 5 (score represents level)
    if (gameId === 'tetris-blocks' && score >= 5 && !currentBadges.has('tetris-master')) {
      newBadges.push('tetris-master');
    }

    // Minute Winner - complete minute to win it challenge
    if (gameId === 'minute-win-it' && !currentBadges.has('minute-winner')) {
      newBadges.push('minute-winner');
    }

    // Physical Champion - complete physical challenge
    if (gameId === 'physical-challenge' && !currentBadges.has('physical-champion')) {
      newBadges.push('physical-champion');
    }

    // Coding game badges
    if (gameId === 'fizzbuzz-mini' && completed && !currentBadges.has('fizzbuzz-master')) {
      newBadges.push('fizzbuzz-master');
    }

    if (gameId === 'code-golf-basics' && score >= 1000 && !currentBadges.has('code-golfer')) {
      newBadges.push('code-golfer');
    }

    if (gameId === 'predict-output' && score >= 100 && !currentBadges.has('output-predictor')) {
      newBadges.push('output-predictor');
    }

    if (gameId === 'golf-score' && completed && !currentBadges.has('golf-calculator')) {
      newBadges.push('golf-calculator');
    }

    if (gameId === 'elevator-saga' && score >= 100 && !currentBadges.has('elevator-optimizer')) {
      newBadges.push('elevator-optimizer');
    }

    if (gameId === 'sql-murder-mystery' && completed && !currentBadges.has('sql-detective')) {
      newBadges.push('sql-detective');
    }

    if (gameId === 'mini-code-combat' && completed && !currentBadges.has('code-warrior')) {
      newBadges.push('code-warrior');
    }

    if (gameId === 'leetcode-bites' && completed && !currentBadges.has('leetcode-solver')) {
      newBadges.push('leetcode-solver');
    }

    if (gameId === 'checkio-missions' && completed && !currentBadges.has('checkio-explorer')) {
      newBadges.push('checkio-explorer');
    }

    if (gameId === 'codingame-clones' && completed && !currentBadges.has('bot-builder')) {
      newBadges.push('bot-builder');
    }
  }

  return newBadges;
}

export function getUserName(userId?: string): string {
  const stats = getUserStats(userId);
  return stats?.userName || 'Player';
}

export function setUserName(name: string, userId?: string): void {
  updateUserStats({ userName: name }, userId);
}

export function getTotalBadges(userId?: string): number {
  const stats = getUserStats(userId);
  return stats?.badges.length || 0;
}

export function getBadgeProgress(userId?: string): { earned: number; total: number } {
  const stats = getUserStats(userId);
  const earned = stats?.badges.length || 0;
  const total = Object.keys(ALL_BADGES).length;
  return { earned, total };
}

export interface GameStatistics {
  gameId: GameType;
  playCount: number;
  completionCount: number;
  completionRate: number;
  averageScore: number;
  highScore: number;
  lastPlayed?: number;
}

export function getGameStatistics(gameId: GameType, userId?: string): GameStatistics {
  const stats = getUserStats(userId);
  if (!stats) {
    return {
      gameId,
      playCount: 0,
      completionCount: 0,
      completionRate: 0,
      averageScore: 0,
      highScore: 0,
    };
  }

  const gameHistory = stats.gameHistory.filter(g => g.gameId === gameId);
  const playCount = gameHistory.length;
  const completionCount = gameHistory.filter(g => g.completed).length;
  const completionRate = playCount > 0 ? (completionCount / playCount) * 100 : 0;
  const totalScore = gameHistory.reduce((sum, g) => sum + g.score, 0);
  const averageScore = playCount > 0 ? totalScore / playCount : 0;
  const highScore = playCount > 0 ? Math.max(...gameHistory.map(g => g.score)) : 0;
  const lastPlayed = playCount > 0 ? Math.max(...gameHistory.map(g => g.timestamp)) : undefined;

  return {
    gameId,
    playCount,
    completionCount,
    completionRate,
    averageScore,
    highScore,
    lastPlayed,
  };
}

export function getAllGameStatistics(userId?: string): Record<NonNullable<GameType>, GameStatistics> {
  const stats = getUserStats(userId);
  if (!stats) {
    return {} as Record<NonNullable<GameType>, GameStatistics>;
  }

  const allGameIds = new Set<GameType>();
  stats.gameHistory.forEach(g => {
    if (g.gameId) {
      allGameIds.add(g.gameId);
    }
  });

  const result: Record<string, GameStatistics> = {};
  allGameIds.forEach(gameId => {
    if (gameId) {
      result[gameId] = getGameStatistics(gameId, userId);
    }
  });

  return result as Record<NonNullable<GameType>, GameStatistics>;
}

