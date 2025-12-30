// Motivational quotes for different contexts

export const motivationalQuotes = [
  "You've got this! 💪",
  "Every break is a step toward success! 🚀",
  "You're doing great! Keep going! ✨",
  "Take a moment, refresh your mind! 🌟",
  "You deserve this break! Enjoy it! 🎯",
  "Small breaks lead to big achievements! 🏆",
  "You're recharging for greatness! ⚡",
  "Focus will come back stronger! 🎪",
  "This break will make you unstoppable! 🔥",
  "You're investing in your productivity! 💎",
];

export const completionQuotes = [
  "Great work! You've earned this break. Time to get back to it! 🚀",
  "You've refreshed your mind. Ready to tackle the next challenge? 💪",
  "Break complete! You're recharged and ready to focus! ✨",
  "Well done! You're refreshed and ready to continue! 🎯",
  "Time to get back to work! You've got this! 🌟",
  "Amazing! You're ready to conquer your tasks! 🏆",
  "Perfect! Your mind is refreshed and ready! ⚡",
  "Excellent! Time to channel that energy into work! 🔥",
  "Fantastic! You're recharged and focused! 💎",
  "Wonderful! Ready to achieve great things! 🎪",
];

export const gameEncouragementQuotes = [
  "You're doing amazing! Keep it up! 🌟",
  "Great progress! You've got this! 💪",
  "You're on fire! Keep going! 🔥",
  "Excellent work! Stay focused! ✨",
  "You're crushing it! Keep pushing! 🚀",
  "Amazing skills! Keep it up! 🎯",
  "You're unstoppable! Keep going! ⚡",
  "Fantastic! You're doing great! 🏆",
  "Incredible! Keep that momentum! 💎",
  "Outstanding! You're a champion! 🎪",
];

export const focusQuotes = [
  "Focus is not about saying yes to everything. It's about saying no to distractions.",
  "The way to get started is to quit talking and begin doing.",
  "Concentrate all your thoughts upon the work at hand.",
  "Focus on being productive instead of busy.",
  "Where focus goes, energy flows.",
  "The successful warrior is an average person with laser-like focus.",
  "Focus on progress, not perfection.",
  "Your focus determines your reality.",
  "The ability to focus is a competitive advantage.",
  "Focus on what matters and let go of what doesn't.",
];

export function getRandomQuote(quotes: string[]): string {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getQuoteByIndex(quotes: string[], index: number): string {
  return quotes[index % quotes.length];
}


