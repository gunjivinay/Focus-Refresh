'use client';

import { useState, useEffect } from 'react';

interface WordPuzzleProps {
  onComplete?: () => void;
}

// Word lists for different difficulty levels
const wordLists = {
  easy: ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'BOOK', 'BIRD'],
  medium: ['OCEAN', 'RIVER', 'MOUNTAIN', 'FOREST', 'DESERT', 'ISLAND', 'VALLEY', 'BEACH'],
  hard: ['ADVENTURE', 'JOURNEY', 'DISCOVER', 'EXPLORE', 'MYSTERY', 'PUZZLE', 'CHALLENGE', 'VICTORY'],
};

export default function WordPuzzle({ onComplete }: WordPuzzleProps) {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [scrambledWord, setScrambledWord] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [score, setScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [hint, setHint] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Initialize game
  useEffect(() => {
    startNewWord();
  }, [level]);

  const startNewWord = () => {
    const words = wordLists[level];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setScrambledWord(scrambleWord(randomWord));
    setUserInput('');
    setShowHint(false);
    setHint(generateHint(randomWord));
  };

  const scrambleWord = (word: string): string => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  const generateHint = (word: string): string => {
    const hints: Record<string, string> = {
      'CAT': 'A furry pet that meows',
      'DOG': 'A loyal companion',
      'SUN': 'Bright star in the sky',
      'MOON': 'Shines at night',
      'STAR': 'Twinkles in the sky',
      'TREE': 'Has leaves and branches',
      'BOOK': 'You read this',
      'BIRD': 'Flies in the sky',
      'OCEAN': 'Large body of water',
      'RIVER': 'Flowing water',
      'MOUNTAIN': 'Very tall landform',
      'FOREST': 'Many trees together',
      'DESERT': 'Hot and dry place',
      'ISLAND': 'Land surrounded by water',
      'VALLEY': 'Low area between mountains',
      'BEACH': 'Sandy place by water',
      'ADVENTURE': 'Exciting experience',
      'JOURNEY': 'A long trip',
      'DISCOVER': 'Find something new',
      'EXPLORE': 'Investigate or travel',
      'MYSTERY': 'Something unknown',
      'PUZZLE': 'A problem to solve',
      'CHALLENGE': 'A difficult task',
      'VICTORY': 'Winning or success',
    };
    return hints[word] || 'Unscramble the word!';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setUserInput(value);

    // Check if word is correct
    if (value === currentWord) {
      setScore(prev => prev + (level === 'easy' ? 10 : level === 'medium' ? 20 : 30));
      setWordsCompleted(prev => {
        const newCount = prev + 1;
        
        // Level up after 5 words
        if (newCount % 5 === 0 && level !== 'hard') {
          setTimeout(() => {
            setLevel(prevLevel => {
              if (prevLevel === 'easy') return 'medium';
              if (prevLevel === 'medium') return 'hard';
              return 'hard';
            });
          }, 500);
        }

        // Complete game after 15 words
        if (newCount >= 15) {
          setGameCompleted(true);
          if (onComplete) {
            setTimeout(() => onComplete(), 1000);
          }
        } else {
          // Start next word after short delay
          setTimeout(() => startNewWord(), 500);
        }
        
        return newCount;
      });
    }
  };

  const handleSkip = () => {
    startNewWord();
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Word Puzzle</h2>
          <p className="text-gray-600">Unscramble the word!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </div>
          <div className="text-sm text-gray-600">
            Words: <span className="font-bold">{wordsCompleted}/15</span>
          </div>
          <div className="text-sm text-gray-600">
            Level: <span className="font-bold capitalize">{level}</span>
          </div>
        </div>
      </div>

      {gameCompleted ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-green-600 mb-2">Congratulations!</h3>
          <p className="text-xl text-gray-700 mb-4">You completed all 15 words!</p>
          <p className="text-lg text-gray-600">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
          <p className="text-sm text-gray-500 mt-4">You can keep playing or wait for the timer.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-8 text-center">
            <p className="text-sm text-gray-600 mb-2">Scrambled Word</p>
            <div className="text-5xl font-bold text-gray-800 tracking-wider mb-4">
              {scrambledWord.split('').map((letter, index) => (
                <span
                  key={index}
                  className="inline-block mx-1 px-3 py-2 bg-white rounded-lg shadow-md"
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the correct word:
              </label>
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none uppercase tracking-wider"
                placeholder="Type here..."
                autoFocus
              />
            </div>

            {userInput === currentWord && (
              <div className="p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
                <p className="text-xl font-bold text-green-800">✓ Correct!</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-medium"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Skip Word
              </button>
            </div>

            {showHint && (
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Hint:</p>
                <p className="text-lg font-medium text-blue-800">{hint}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


