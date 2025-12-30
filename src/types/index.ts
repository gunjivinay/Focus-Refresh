// User mood types
export type Mood = 'tired' | 'bored' | 'unfocused' | 'stressed' | null;

// Timer duration in seconds
export type TimerDuration = 300 | 600 | 900 | null; // 5, 10, or 15 minutes

// Game types
export type GameType = 
  | 'number-guess'
  | 'rock-paper-scissors'
  | 'quick-math-duel'
  | 'typing-burst'
  | 'odd-one-out'
  | 'memory-flip'
  | 'quick-word-chain'
  | 'simon-says'
  | 'slide-puzzle-2048'
  | 'snake-avoider'
  | 'little-alchemy'
  | 'word-scramble'
  | 'trivia-quiz'
  | 'doodle-challenge'
  | 'spot-difference'
  | 'paper-airplane'
  | 'light-logic'
  | 'story-chain'
  | 'code-puzzles'
  | 'tetris-blocks'
  | 'minute-win-it'
  | 'physical-challenge'
  | 'mind-maze' 
  | 'speed-match' 
  | 'logic-lock' 
  | 'chess-puzzle' 
  | 'sudoku' 
  | 'brain-teaser'
  | 'number-crunch'
  | 'word-chain'
  | 'pattern-master'
  | 'memory-matrix'
  | 'quick-draw'
  | 'color-blast'
  | 'sequence-solver'
  | 'word-search'
  | 'code-breaker'
  | 'spot-the-diff'
  | 'block-puzzle'
  | 'anagram-solver'
  | 'math-rush'
  | 'shape-shift'
  | 'fizzbuzz-mini'
  | 'code-golf-basics'
  | 'predict-output'
  | 'golf-score'
  | 'elevator-saga'
  | 'sql-murder-mystery'
  | 'mini-code-combat'
  | 'leetcode-bites'
  | 'checkio-missions'
  | 'codingame-clones'
  | 'tic-tac-toe'
  | 'chess'
  | null;

// Game state
export interface GameState {
  isActive: boolean;
  isCompleted: boolean;
  score?: number;
}

// Timer state
export interface TimerState {
  remainingSeconds: number;
  isActive: boolean;
  isCompleted: boolean;
}

// Main game context state
export interface GameContextState {
  mood: Mood;
  timerDuration: TimerDuration;
  selectedGame: GameType;
  gameState: GameState;
  timerState: TimerState;
}

// Game context actions
export interface GameContextActions {
  setMood: (mood: Mood) => void;
  setTimerDuration: (duration: TimerDuration) => void;
  setSelectedGame: (game: GameType) => void;
  startGame: () => void;
  endGame: () => void;
  resetContext: () => void;
}

// Combined context type
export interface GameContextType extends GameContextState, GameContextActions {}

