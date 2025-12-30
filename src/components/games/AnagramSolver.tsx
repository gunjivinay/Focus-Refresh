'use client';

import { useState, useEffect } from 'react';

interface AnagramSolverProps {
  onComplete?: () => void;
}

export default function AnagramSolver({ onComplete }: AnagramSolverProps) {
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [completed, setCompleted] = useState(false);

  const maxRounds = 12;
  const words = ['EARTH', 'OCEAN', 'FOREST', 'MOUNTAIN', 'RIVER', 'DESERT', 'ISLAND', 'VALLEY', 'BEACH', 'CLOUD'];

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    const newWord = words[Math.floor(Math.random() * words.length)];
    setWord(newWord);
    setScrambled(newWord.split('').sort(() => Math.random() - 0.5).join(''));
    setUserAnswer('');
  }, [round]);

  const handleSubmit = () => {
    if (userAnswer.toUpperCase() === word) {
      setScore(prev => prev + 10);
      setRound(prev => prev + 1);
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Anagram Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🔤 Anagram Solver</h2>
          <p className="text-sm text-gray-600">Unscramble the letters to form a word</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Round: <span className="font-bold">{round + 1}/{maxRounds}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 border-2 border-blue-300">
          <p className="text-sm text-gray-600 mb-4 text-center">Scrambled Letters:</p>
          <div className="flex gap-2 justify-center">
            {scrambled.split('').map((letter, idx) => (
              <div key={idx} className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center text-2xl font-bold text-gray-800">
                {letter}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full px-4 py-3 text-xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none uppercase"
            placeholder="Enter word..."
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold text-lg"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}


