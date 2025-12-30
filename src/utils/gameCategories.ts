import { GameType } from '@/src/types';

export type GameCategory = 
  | 'Puzzle & Logic'
  | 'Memory & Pattern'
  | 'Word & Language'
  | 'Math & Numbers'
  | 'Action & Arcade'
  | 'Creative & Art'
  | 'Trivia & Quiz'
  | 'Physical & Movement'
  | 'Coding & Programming';

export interface CategorizedGame {
  id: GameType;
  name: string;
  description: string;
}

export const gameCategories: Record<GameCategory, CategorizedGame[]> = {
  'Puzzle & Logic': [
    { id: 'number-guess', name: '🎯 Number Guess', description: 'Guess the number with helpful hints! Set your range and start playing' },
    { id: 'light-logic', name: '💡 Light Logic Puzzles', description: 'Solve mini Sudoku, Nonograms, or grid puzzles!' },
    { id: 'sudoku', name: '🔢 Sudoku', description: 'Fill the grid with numbers for perfect focus' },
    { id: 'logic-lock', name: '🔐 Logic Lock', description: 'Solve logic puzzles to unlock your thinking' },
    { id: 'brain-teaser', name: '🧠 Brain Teaser', description: 'Challenge your mind with tricky brain puzzles' },
    { id: 'code-puzzles', name: '💻 Code Puzzles', description: 'Find bugs or predict output! Language-neutral code logic puzzles' },
    { id: 'code-breaker', name: '🔐 Code Breaker', description: 'Crack the 4-digit code' },
    { id: 'block-puzzle', name: '🧩 Block Puzzle', description: 'Combine blocks to reach higher numbers' },
    { id: 'slide-puzzle-2048', name: '🧩 2048 Slide Puzzle', description: 'Merge tiles to reach 2048! Slide tiles to combine numbers' },
    { id: 'spot-difference', name: '👁️ Spot the Difference', description: 'Find 3-5 differences between two images! Click the differences' },
    { id: 'spot-the-diff', name: '👁️ Spot The Difference', description: 'Find differences between two grids' },
    { id: 'mind-maze', name: '🧩 Mind Maze', description: 'Navigate through mazes to sharpen spatial reasoning' },
    { id: 'chess-puzzle', name: '♟️ Chess Puzzle', description: 'Master tactical chess puzzles for strategic thinking' },
    { id: 'chess', name: '♟️ Chess', description: 'Play full chess game - two players on interactive board' },
  ],
  'Memory & Pattern': [
    { id: 'memory-flip', name: '🃏 Memory Flip', description: 'Match pairs of cards! Flip two at a time to find matches' },
    { id: 'simon-says', name: '🎨 Simon Says', description: 'Repeat the pattern! Colored buttons light up in sequence' },
    { id: 'pattern-master', name: '🎨 Pattern Master', description: 'Remember and repeat color patterns' },
    { id: 'memory-matrix', name: '🧠 Memory Matrix', description: 'Memorize highlighted cells in the grid' },
  ],
  'Word & Language': [
    { id: 'typing-burst', name: '⌨️ Typing Burst', description: 'Test your typing speed! Type words as fast as you can' },
    { id: 'word-scramble', name: '🔤 Word Scramble', description: 'Unscramble the word before time runs out! Choose categories' },
    { id: 'quick-word-chain', name: '🔗 Quick Word Chain', description: 'Build a word chain! Type related words before time runs out' },
    { id: 'word-chain', name: '🔗 Word Chain', description: 'Continue word chains - each word starts with last letter' },
    { id: 'word-search', name: '🔍 Word Search', description: 'Find hidden words in the grid' },
    { id: 'anagram-solver', name: '🔤 Anagram Solver', description: 'Unscramble letters to form words' },
    { id: 'odd-one-out', name: '🔍 Odd One Out', description: 'Find the word that doesn\'t belong! 3 share a category, 1 is different' },
    { id: 'story-chain', name: '📖 Story Chain', description: 'Build a silly story together! Add 3-5 sentences to continue' },
  ],
  'Math & Numbers': [
    { id: 'quick-math-duel', name: '⚡ Quick Math Duel', description: 'Race against time to solve arithmetic problems!' },
    { id: 'number-crunch', name: '🔢 Number Crunch', description: 'Select numbers that sum to the target' },
    { id: 'math-rush', name: '⚡ Math Rush', description: 'Solve math problems as fast as you can' },
    { id: 'sequence-solver', name: '🔢 Sequence Solver', description: 'Find patterns in number sequences' },
  ],
  'Action & Arcade': [
    { id: 'tic-tac-toe', name: '⭕ Tic-Tac-Toe', description: 'Classic Tic-Tac-Toe game - play vs AI or two players' },
    { id: 'chess', name: '♟️ Chess', description: 'Play full chess game - two players on interactive board' },
    { id: 'rock-paper-scissors', name: '✂️ Rock Paper Scissors', description: 'Classic RPS against the computer! Best-of-3 or best-of-5 matches' },
    { id: 'snake-avoider', name: '🐍 Snake / Avoider', description: 'Control a snake or avoid obstacles! Navigate for 60-90 seconds' },
    { id: 'tetris-blocks', name: '🧱 Falling Blocks', description: 'Classic falling blocks puzzle! 3 lives or 5 levels max' },
    { id: 'minute-win-it', name: '⏱️ Minute to Win It', description: 'Fast clickable timing challenges! Digital office games' },
    { id: 'speed-match', name: '⚡ Speed Match', description: 'Match patterns quickly to boost reaction time' },
    { id: 'quick-draw', name: '⚡ Quick Draw', description: 'Quickly select the correct shape' },
    { id: 'color-blast', name: '🎨 Color Blast', description: 'Select the target color quickly' },
    { id: 'shape-shift', name: '🔄 Shape Shift', description: 'Quickly select the correct shape' },
  ],
  'Creative & Art': [
    { id: 'doodle-challenge', name: '✏️ Doodle Challenge', description: 'Draw based on a random prompt! Create art for 60-120 seconds' },
    { id: 'little-alchemy', name: '⚗️ Little Alchemy', description: 'Combine elements to discover new items! Start with fire, water, earth, air' },
    { id: 'paper-airplane', name: '✈️ Paper Airplane Sim', description: 'Adjust parameters and throw a plane! Try to beat your distance' },
  ],
  'Trivia & Quiz': [
    { id: 'trivia-quiz', name: '🧠 Quick Trivia Quiz', description: 'Answer 5-10 questions! General knowledge, tech facts, brain teasers' },
  ],
  'Physical & Movement': [
    { id: 'physical-challenge', name: '🏃 Physical Challenge', description: 'Get moving! Jumping jacks, stretches, or walking' },
  ],
  'Coding & Programming': [
    { id: 'fizzbuzz-mini', name: '🔢 FizzBuzz Mini', description: 'Write a function to replace multiples of 3/5 with Fizz/Buzz' },
    { id: 'code-golf-basics', name: '⛳ Code Golf Basics', description: 'Shorten code snippets to fewest characters possible' },
    { id: 'predict-output', name: '🔮 Predict Output', description: 'Guess the console output of JavaScript snippets' },
    { id: 'golf-score', name: '⛳ Golf Score', description: 'Calculate golf scores: Birdie, Bogey, etc. based on par and strokes' },
    { id: 'elevator-saga', name: '🏢 Elevator Saga', description: 'Control elevators to optimize movement in a 3-floor building' },
    { id: 'sql-murder-mystery', name: '🔍 SQL Murder Mystery', description: 'Solve a mystery by selecting the correct people from the database' },
    { id: 'mini-code-combat', name: '⚔️ Mini Code Combat', description: 'Navigate through mazes using interactive arrow buttons' },
    { id: 'leetcode-bites', name: '💻 LeetCode Easy Bites', description: 'Solve 1-2 array/string problems with JS editor and tester' },
    { id: 'checkio-missions', name: '🏝️ CheckiO Missions', description: 'Solve Python/JS challenges like sorting numbers or finding median' },
    { id: 'codingame-clones', name: '🎮 CodinGame Clones', description: 'Play interactive Tic-Tac-Toe against AI or with a friend' },
    { id: 'tic-tac-toe', name: '⭕ Tic-Tac-Toe', description: 'Classic Tic-Tac-Toe game - play vs AI or two players' },
  ],
};

// Helper function to get category for a game
export function getGameCategory(gameId: GameType): GameCategory | null {
  if (!gameId) return null;
  
  for (const [category, games] of Object.entries(gameCategories)) {
    if (games.some(game => game.id === gameId)) {
      return category as GameCategory;
    }
  }
  return null;
}

// Get all categories
export function getAllCategories(): GameCategory[] {
  return Object.keys(gameCategories) as GameCategory[];
}

