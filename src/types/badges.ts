// Badge types and definitions

export type BadgeId = 
  | 'first-game'
  | 'speed-demon'
  | 'puzzle-master'
  | 'word-wizard'
  | 'math-genius'
  | 'memory-king'
  | 'perfectionist'
  | 'dedicated'
  | 'explorer'
  | 'champion'
  | 'streak-master'
  | 'night-owl'
  | 'early-bird'
  | 'weekend-warrior'
  | 'quick-thinker'
  // Game-specific badges
  | 'number-guess-master'
  | 'rps-champion'
  | 'math-duel-expert'
  | 'typing-speedster'
  | 'odd-one-out-pro'
  | 'memory-flip-ace'
  | 'word-chain-builder'
  | 'simon-says-master'
  | '2048-champion'
  | 'snake-master'
  | 'alchemy-wizard'
  | 'scramble-king'
  | 'trivia-expert'
  | 'doodle-artist'
  | 'spot-difference-pro'
  | 'airplane-pilot'
  | 'logic-solver'
  | 'story-teller'
  | 'code-debugger'
  | 'tetris-master'
  | 'minute-winner'
  | 'physical-champion'
  | 'fizzbuzz-master'
  | 'code-golfer'
  | 'output-predictor'
  | 'golf-calculator'
  | 'elevator-optimizer'
  | 'sql-detective'
  | 'code-warrior'
  | 'leetcode-solver'
  | 'checkio-explorer'
  | 'bot-builder';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  emoji: string;
  category: 'achievement' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const ALL_BADGES: Record<BadgeId, Badge> = {
  'first-game': {
    id: 'first-game',
    name: 'First Steps',
    description: 'Played your first game',
    emoji: '🎯',
    category: 'milestone',
    rarity: 'common',
  },
  'speed-demon': {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a game in under 2 minutes',
    emoji: '⚡',
    category: 'achievement',
    rarity: 'rare',
  },
  'puzzle-master': {
    id: 'puzzle-master',
    name: 'Puzzle Master',
    description: 'Complete 10 puzzle games',
    emoji: '🧩',
    category: 'achievement',
    rarity: 'epic',
  },
  'word-wizard': {
    id: 'word-wizard',
    name: 'Word Wizard',
    description: 'Complete 5 word games',
    emoji: '📝',
    category: 'achievement',
    rarity: 'rare',
  },
  'math-genius': {
    id: 'math-genius',
    name: 'Math Genius',
    description: 'Score 200+ in math games',
    emoji: '🔢',
    category: 'achievement',
    rarity: 'epic',
  },
  'memory-king': {
    id: 'memory-king',
    name: 'Memory King',
    description: 'Complete all memory games',
    emoji: '🧠',
    category: 'achievement',
    rarity: 'epic',
  },
  'perfectionist': {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete a game with zero errors',
    emoji: '✨',
    category: 'achievement',
    rarity: 'legendary',
  },
  'dedicated': {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Play 20 games total',
    emoji: '💪',
    category: 'milestone',
    rarity: 'rare',
  },
  'explorer': {
    id: 'explorer',
    name: 'Explorer',
    description: 'Try 10 different games',
    emoji: '🗺️',
    category: 'achievement',
    rarity: 'rare',
  },
  'champion': {
    id: 'champion',
    name: 'Champion',
    description: 'Complete 50 games total',
    emoji: '🏆',
    category: 'milestone',
    rarity: 'legendary',
  },
  'streak-master': {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Play 5 days in a row',
    emoji: '🔥',
    category: 'special',
    rarity: 'epic',
  },
  'night-owl': {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Play after 10 PM',
    emoji: '🦉',
    category: 'special',
    rarity: 'rare',
  },
  'early-bird': {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Play before 8 AM',
    emoji: '🐦',
    category: 'special',
    rarity: 'rare',
  },
  'weekend-warrior': {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Play on weekends',
    emoji: '🎮',
    category: 'special',
    rarity: 'common',
  },
  'quick-thinker': {
    id: 'quick-thinker',
    name: 'Quick Thinker',
    description: 'Complete 3 games in one session',
    emoji: '💨',
    category: 'achievement',
    rarity: 'rare',
  },
  // Game-specific badges
  'number-guess-master': {
    id: 'number-guess-master',
    name: 'Number Guess Master',
    description: 'Guess correctly in 3 attempts or less',
    emoji: '🎯',
    category: 'achievement',
    rarity: 'rare',
  },
  'rps-champion': {
    id: 'rps-champion',
    name: 'RPS Champion',
    description: 'Win 5 Rock Paper Scissors matches',
    emoji: '✂️',
    category: 'achievement',
    rarity: 'rare',
  },
  'math-duel-expert': {
    id: 'math-duel-expert',
    name: 'Math Duel Expert',
    description: 'Score 80%+ in Quick Math Duel',
    emoji: '⚡',
    category: 'achievement',
    rarity: 'epic',
  },
  'typing-speedster': {
    id: 'typing-speedster',
    name: 'Typing Speedster',
    description: 'Achieve 60+ WPM in Typing Burst',
    emoji: '⌨️',
    category: 'achievement',
    rarity: 'epic',
  },
  'odd-one-out-pro': {
    id: 'odd-one-out-pro',
    name: 'Odd One Out Pro',
    description: 'Complete all rounds with 100% accuracy',
    emoji: '🔍',
    category: 'achievement',
    rarity: 'rare',
  },
  'memory-flip-ace': {
    id: 'memory-flip-ace',
    name: 'Memory Flip Ace',
    description: 'Complete Memory Flip in under 20 moves',
    emoji: '🃏',
    category: 'achievement',
    rarity: 'epic',
  },
  'word-chain-builder': {
    id: 'word-chain-builder',
    name: 'Word Chain Builder',
    description: 'Build a chain of 10+ words',
    emoji: '🔗',
    category: 'achievement',
    rarity: 'rare',
  },
  'simon-says-master': {
    id: 'simon-says-master',
    name: 'Simon Says Master',
    description: 'Complete all 5 levels of Simon Says',
    emoji: '🎨',
    category: 'achievement',
    rarity: 'epic',
  },
  '2048-champion': {
    id: '2048-champion',
    name: '2048 Champion',
    description: 'Reach 512 or higher in 2048',
    emoji: '🧩',
    category: 'achievement',
    rarity: 'legendary',
  },
  'snake-master': {
    id: 'snake-master',
    name: 'Snake Master',
    description: 'Survive 90 seconds in Snake/Avoider',
    emoji: '🐍',
    category: 'achievement',
    rarity: 'rare',
  },
  'alchemy-wizard': {
    id: 'alchemy-wizard',
    name: 'Alchemy Wizard',
    description: 'Discover 5+ items in Little Alchemy',
    emoji: '⚗️',
    category: 'achievement',
    rarity: 'rare',
  },
  'scramble-king': {
    id: 'scramble-king',
    name: 'Scramble King',
    description: 'Unscramble 6+ words correctly',
    emoji: '🔤',
    category: 'achievement',
    rarity: 'rare',
  },
  'trivia-expert': {
    id: 'trivia-expert',
    name: 'Trivia Expert',
    description: 'Score 80%+ in Trivia Quiz',
    emoji: '🧠',
    category: 'achievement',
    rarity: 'epic',
  },
  'doodle-artist': {
    id: 'doodle-artist',
    name: 'Doodle Artist',
    description: 'Complete a Doodle Challenge',
    emoji: '✏️',
    category: 'achievement',
    rarity: 'common',
  },
  'spot-difference-pro': {
    id: 'spot-difference-pro',
    name: 'Spot the Difference Pro',
    description: 'Find all differences quickly',
    emoji: '👁️',
    category: 'achievement',
    rarity: 'rare',
  },
  'airplane-pilot': {
    id: 'airplane-pilot',
    name: 'Airplane Pilot',
    description: 'Throw plane 200+ meters',
    emoji: '✈️',
    category: 'achievement',
    rarity: 'epic',
  },
  'logic-solver': {
    id: 'logic-solver',
    name: 'Logic Solver',
    description: 'Complete Light Logic Puzzles',
    emoji: '💡',
    category: 'achievement',
    rarity: 'rare',
  },
  'story-teller': {
    id: 'story-teller',
    name: 'Story Teller',
    description: 'Complete a Story Chain',
    emoji: '📖',
    category: 'achievement',
    rarity: 'common',
  },
  'code-debugger': {
    id: 'code-debugger',
    name: 'Code Debugger',
    description: 'Solve all Code Puzzles correctly',
    emoji: '💻',
    category: 'achievement',
    rarity: 'epic',
  },
  'tetris-master': {
    id: 'tetris-master',
    name: 'Tetris Master',
    description: 'Reach level 5 in Tetris Blocks',
    emoji: '🧱',
    category: 'achievement',
    rarity: 'legendary',
  },
  'minute-winner': {
    id: 'minute-winner',
    name: 'Minute Winner',
    description: 'Complete Minute to Win It challenge',
    emoji: '⏱️',
    category: 'achievement',
    rarity: 'rare',
  },
  'physical-champion': {
    id: 'physical-champion',
    name: 'Physical Champion',
    description: 'Complete a Physical Challenge',
    emoji: '🏃',
    category: 'achievement',
    rarity: 'common',
  },
  // Coding game badges
  'fizzbuzz-master': {
    id: 'fizzbuzz-master',
    name: 'FizzBuzz Master',
    description: 'Complete FizzBuzz Mini correctly',
    emoji: '🔢',
    category: 'achievement',
    rarity: 'rare',
  },
  'code-golfer': {
    id: 'code-golfer',
    name: 'Code Golfer',
    description: 'Score 1000+ in Code Golf Basics',
    emoji: '⛳',
    category: 'achievement',
    rarity: 'epic',
  },
  'output-predictor': {
    id: 'output-predictor',
    name: 'Output Predictor',
    description: 'Score 100% in Predict Output',
    emoji: '🔮',
    category: 'achievement',
    rarity: 'rare',
  },
  'golf-calculator': {
    id: 'golf-calculator',
    name: 'Golf Calculator',
    description: 'Complete Golf Score challenge',
    emoji: '⛳',
    category: 'achievement',
    rarity: 'common',
  },
  'elevator-optimizer': {
    id: 'elevator-optimizer',
    name: 'Elevator Optimizer',
    description: 'Score 100+ in Elevator Saga',
    emoji: '🏢',
    category: 'achievement',
    rarity: 'rare',
  },
  'sql-detective': {
    id: 'sql-detective',
    name: 'SQL Detective',
    description: 'Solve SQL Murder Mystery',
    emoji: '🔍',
    category: 'achievement',
    rarity: 'epic',
  },
  'code-warrior': {
    id: 'code-warrior',
    name: 'Code Warrior',
    description: 'Complete all Mini Code Combat mazes',
    emoji: '⚔️',
    category: 'achievement',
    rarity: 'rare',
  },
  'leetcode-solver': {
    id: 'leetcode-solver',
    name: 'LeetCode Solver',
    description: 'Solve LeetCode Easy Bites problems',
    emoji: '💻',
    category: 'achievement',
    rarity: 'epic',
  },
  'checkio-explorer': {
    id: 'checkio-explorer',
    name: 'CheckiO Explorer',
    description: 'Complete all CheckiO Missions',
    emoji: '🏝️',
    category: 'achievement',
    rarity: 'epic',
  },
  'bot-builder': {
    id: 'bot-builder',
    name: 'Bot Builder',
    description: 'Create a winning bot in CodinGame Clones',
    emoji: '🤖',
    category: 'achievement',
    rarity: 'legendary',
  },
};

export function getBadgeById(id: BadgeId): Badge {
  return ALL_BADGES[id];
}

export function getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
  return Object.values(ALL_BADGES).filter(badge => badge.rarity === rarity);
}

