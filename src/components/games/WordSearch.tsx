'use client';

import { useState, useEffect } from 'react';

interface WordSearchProps {
  onComplete?: () => void;
}

export default function WordSearch({ onComplete }: WordSearchProps) {
  const [targetWord, setTargetWord] = useState('');
  const [found, setFound] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [completed, setCompleted] = useState(false);

  const maxRounds = 8;
  const words = ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'BOOK', 'BIRD', 'FISH', 'LION'];

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    const word = words[Math.floor(Math.random() * words.length)];
    setTargetWord(word);
    setFound(false);
  }, [round]);

  const handleFind = () => {
    setFound(true);
    setScore(prev => prev + 15);
    setTimeout(() => {
      setRound(prev => prev + 1);
      setFound(false);
    }, 1500);
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

  // Generate a simple grid with the word hidden
  const gridSize = 8;
  const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  
  // Place word horizontally
  const startRow = Math.floor(Math.random() * gridSize);
  const startCol = Math.floor(Math.random() * (gridSize - targetWord.length));
  for (let i = 0; i < targetWord.length; i++) {
    grid[startRow][startCol + i] = targetWord[i];
  }
  
  // Fill rest with random letters
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (!grid[i][j]) {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🔍 Word Search</h2>
          <p className="text-sm text-gray-600">Find the hidden word in the grid</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Round: <span className="font-bold">{round + 1}/{maxRounds}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600 mb-4">Find: {targetWord}</p>
        </div>

        <div className="grid gap-1 bg-gray-800 p-2 rounded-lg" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
          {grid.flat().map((letter, idx) => {
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            const isInWord = row === startRow && col >= startCol && col < startCol + targetWord.length;
            
            return (
              <div
                key={idx}
                className={`
                  w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
                  bg-white rounded font-bold text-sm md:text-base
                  ${found && isInWord ? 'bg-green-400 text-white' : ''}
                `}
              >
                {letter}
              </div>
            );
          })}
        </div>

        {!found && (
          <button
            onClick={handleFind}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold text-lg"
          >
            I Found It!
          </button>
        )}

        {found && (
          <div className="p-4 bg-green-100 border-2 border-green-500 rounded-xl text-center">
            <p className="font-bold text-green-800 text-lg">Great job! ✓</p>
          </div>
        )}
      </div>
    </div>
  );
}


