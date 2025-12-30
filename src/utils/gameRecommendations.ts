import type { Mood, GameType } from '@/src/types';

const moodToGame: Record<NonNullable<Mood>, GameType[]> = {
  tired: ['number-guess', 'mind-maze', 'speed-match', 'logic-lock', 'pattern-master', 'memory-matrix'],
  bored: ['number-guess', 'chess-puzzle', 'brain-teaser', 'speed-match', 'mind-maze', 'word-chain', 'quick-draw'],
  unfocused: ['number-guess', 'logic-lock', 'mind-maze', 'brain-teaser', 'number-crunch', 'pattern-master'],
  stressed: ['number-guess', 'sudoku', 'logic-lock', 'mind-maze', 'memory-matrix', 'pattern-master'],
};

const allGames: GameType[] = [
  'number-guess',
  'rock-paper-scissors',
  'quick-math-duel',
  'typing-burst',
  'odd-one-out',
  'memory-flip',
  'quick-word-chain',
  'simon-says',
  'slide-puzzle-2048',
  'snake-avoider',
  'little-alchemy',
  'word-scramble',
  'trivia-quiz',
  'doodle-challenge',
  'spot-difference',
  'paper-airplane',
  'light-logic',
  'story-chain',
  'code-puzzles',
  'tetris-blocks',
  'minute-win-it',
  'physical-challenge',
  'mind-maze', 
  'speed-match', 
  'logic-lock', 
  'chess-puzzle', 
  'sudoku', 
  'brain-teaser',
  'number-crunch',
  'word-chain',
  'pattern-master',
  'memory-matrix',
  'quick-draw',
  'color-blast',
  'sequence-solver',
  'word-search',
  'code-breaker',
  'spot-the-diff',
  'block-puzzle',
  'anagram-solver',
  'math-rush',
  'shape-shift',
  'fizzbuzz-mini',
  'code-golf-basics',
  'predict-output',
  'golf-score',
  'elevator-saga',
  'sql-murder-mystery',
  'mini-code-combat',
  'leetcode-bites',
  'checkio-missions',
  'codingame-clones',
  'tic-tac-toe',
  'chess',
];

export function getRecommendedGame(mood: Mood): GameType {
  if (!mood) {
    return 'number-guess'; // Default game
  }
  
  const games = moodToGame[mood];
  return games[0] || 'number-guess';
}

export function getAvailableGames(mood: Mood): GameType[] {
  if (!mood) {
    return allGames;
  }
  
  return moodToGame[mood] || ['number-guess'];
}

export function getAllGames(): GameType[] {
  return allGames;
}

