'use client';

import { useState, useEffect } from 'react';

interface WordChainProps {
  onComplete?: () => void;
}

export default function WordChain({ onComplete }: WordChainProps) {
  const [currentWord, setCurrentWord] = useState('');
  const [userWord, setUserWord] = useState('');
  const [chain, setChain] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [completed, setCompleted] = useState(false);

  const maxRounds = 15;
  const startWords = ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'BOOK', 'BIRD'];

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    const startWord = startWords[Math.floor(Math.random() * startWords.length)];
    setCurrentWord(startWord);
    setChain([startWord]);
    setUserWord('');
  }, [round]);

  const handleSubmit = () => {
    const word = userWord.trim().toUpperCase();
    if (word.length < 3) return;

    const lastLetter = currentWord[currentWord.length - 1];
    if (word[0] === lastLetter && !chain.includes(word)) {
      setChain([...chain, word]);
      setCurrentWord(word);
      setUserWord('');
      setScore(prev => prev + 10);
      setRound(prev => prev + 1);
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Word Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🔗 Word Chain</h2>
          <p className="text-sm text-gray-600">Continue the word chain - next word starts with last letter</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Round: <span className="font-bold">{round + 1}/{maxRounds}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Current Word:</p>
          <div className="text-4xl font-bold text-blue-600">{currentWord}</div>
          <p className="text-xs text-gray-500 mt-2">Next word must start with: <span className="font-bold text-lg">{currentWord[currentWord.length - 1]}</span></p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 max-w-md w-full">
          <p className="text-sm text-gray-600 mb-2">Word Chain:</p>
          <div className="flex flex-wrap gap-2">
            {chain.map((word, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
          <input
            type="text"
            value={userWord}
            onChange={(e) => setUserWord(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full px-4 py-3 text-xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none uppercase"
            placeholder="Enter word..."
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold text-lg"
          >
            Submit Word
          </button>
        </div>
      </div>
    </div>
  );
}


