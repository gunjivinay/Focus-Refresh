import type { GameType } from '@/src/types';

export type Difficulty = 'easy' | 'medium' | 'hard';

const GAME_DIFFICULTY: Record<NonNullable<GameType>, Difficulty> = {
  'number-guess': 'easy',
  'rock-paper-scissors': 'easy',
  'quick-math-duel': 'medium',
  'typing-burst': 'medium',
  'odd-one-out': 'easy',
  'memory-flip': 'medium',
  'quick-word-chain': 'medium',
  'simon-says': 'medium',
  'slide-puzzle-2048': 'hard',
  'snake-avoider': 'medium',
  'little-alchemy': 'hard',
  'word-scramble': 'medium',
  'trivia-quiz': 'medium',
  'doodle-challenge': 'easy',
  'spot-difference': 'medium',
  'paper-airplane': 'easy',
  'light-logic': 'hard',
  'story-chain': 'easy',
  'code-puzzles': 'hard',
  'tetris-blocks': 'hard',
  'minute-win-it': 'medium',
  'physical-challenge': 'easy',
  'mind-maze': 'medium',
  'speed-match': 'medium',
  'logic-lock': 'hard',
  'chess-puzzle': 'hard',
  'sudoku': 'hard',
  'brain-teaser': 'hard',
  'number-crunch': 'medium',
  'word-chain': 'medium',
  'pattern-master': 'hard',
  'memory-matrix': 'hard',
  'quick-draw': 'easy',
  'color-blast': 'easy',
  'sequence-solver': 'medium',
  'word-search': 'medium',
  'code-breaker': 'hard',
  'spot-the-diff': 'medium',
  'block-puzzle': 'hard',
  'anagram-solver': 'medium',
  'math-rush': 'medium',
  'shape-shift': 'easy',
  'fizzbuzz-mini': 'medium',
  'code-golf-basics': 'hard',
  'predict-output': 'hard',
  'golf-score': 'easy',
  'elevator-saga': 'hard',
  'sql-murder-mystery': 'hard',
  'mini-code-combat': 'medium',
  'leetcode-bites': 'hard',
  'checkio-missions': 'hard',
  'codingame-clones': 'medium',
  'tic-tac-toe': 'easy',
  'chess': 'hard',
};

export function getGameDifficulty(gameId: GameType): Difficulty {
  return GAME_DIFFICULTY[gameId] || 'medium';
}

export function getDifficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
    default:
      return 'Unknown';
  }
}

