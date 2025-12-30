'use client';

import { useState, useEffect } from 'react';

interface CodeBreakerProps {
  onComplete?: () => void;
}

export default function CodeBreaker({ onComplete }: CodeBreakerProps) {
  const [code, setCode] = useState<number[]>([]);
  const [guess, setGuess] = useState<number[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [completed, setCompleted] = useState(false);

  const maxRounds = 5;
  const codeLength = 4;

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    generateCode();
  }, [round]);

  const generateCode = () => {
    const newCode: number[] = [];
    for (let i = 0; i < codeLength; i++) {
      newCode.push(Math.floor(Math.random() * 6) + 1);
    }
    setCode(newCode);
    setGuess([]);
    setHints([]);
    setAttempts(0);
    setSolved(false);
  };

  const handleNumberClick = (num: number) => {
    if (guess.length < codeLength) {
      setGuess([...guess, num]);
    }
  };

  const handleCheck = () => {
    if (guess.length !== codeLength) return;

    const newHints: string[] = [];
    const guessCopy = [...guess];
    const codeCopy = [...code];

    // Check for exact matches
    for (let i = 0; i < codeLength; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        newHints.push('✓');
        guessCopy[i] = -1;
        codeCopy[i] = -2;
      }
    }

    // Check for correct numbers in wrong positions
    for (let i = 0; i < codeLength; i++) {
      if (guessCopy[i] !== -1) {
        const idx = codeCopy.indexOf(guessCopy[i]);
        if (idx !== -1) {
          newHints.push('○');
          codeCopy[idx] = -2;
        }
      }
    }

    setHints(newHints);
    setAttempts(prev => prev + 1);

    if (JSON.stringify(guess) === JSON.stringify(code)) {
      setSolved(true);
      setScore(prev => prev + (6 - attempts) * 10);
      setTimeout(() => {
        setRound(prev => prev + 1);
      }, 2000);
    } else if (attempts >= 5) {
      setTimeout(() => {
        setRound(prev => prev + 1);
      }, 2000);
    } else {
      setGuess([]);
    }
  };

  const handleClear = () => {
    setGuess([]);
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Code Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🔐 Code Breaker</h2>
          <p className="text-sm text-gray-600">Crack the 4-digit code!</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Round: <span className="font-bold">{round + 1}/{maxRounds}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
          <div className="text-sm text-gray-600">Attempts: <span className="font-bold">{attempts}/6</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Your Guess:</p>
          <div className="flex gap-2 justify-center">
            {Array.from({ length: codeLength }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold"
              >
                {guess[i] || '?'}
              </div>
            ))}
          </div>
        </div>

        {hints.length > 0 && (
          <div className="flex gap-2 justify-center">
            {hints.map((hint, i) => (
              <div key={i} className="text-2xl">{hint}</div>
            ))}
          </div>
        )}

        {solved && (
          <div className="p-4 bg-green-100 border-2 border-green-500 rounded-xl text-center">
            <p className="font-bold text-green-800 text-lg">Code Cracked! ✓</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 max-w-xs">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={guess.length >= codeLength}
              className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-bold text-xl"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCheck}
            disabled={guess.length !== codeLength || solved}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 font-semibold"
          >
            Check
          </button>
          <button
            onClick={handleClear}
            disabled={guess.length === 0}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 font-semibold"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}


