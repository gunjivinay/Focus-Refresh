'use client';

import { useState, useEffect } from 'react';

interface TetrisBlocksProps {
  onComplete?: () => void;
}

export default function TetrisBlocks({ onComplete }: TetrisBlocksProps) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [grid, setGrid] = useState<number[][]>(
    Array(10).fill(null).map(() => Array(10).fill(0))
  );

  useEffect(() => {
    if (level > 5 || lives <= 0) {
      setGameOver(true);
      if (onComplete) {
        setTimeout(() => onComplete(), 3000);
      }
    }
  }, [level, lives]);

  const clearLine = () => {
    setScore(prev => prev + 100);
    if (score % 500 === 0) {
      setLevel(prev => prev + 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🧱 Falling Blocks</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
          <p className="text-sm text-gray-600">
            Level: <span className="font-bold text-purple-600">{level}/5</span>
          </p>
          <p className="text-sm text-gray-600">
            Lives: <span className="font-bold text-red-600">{lives}</span>
          </p>
        </div>
        <p className="text-xs text-gray-500">Use arrow keys to move and rotate</p>
      </div>

      {gameOver ? (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Game Over!</h3>
          <p className="text-xl text-gray-700">
            Final Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="grid grid-cols-10 gap-1">
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`w-6 h-6 rounded ${
                    cell === 0 ? 'bg-gray-700' : 'bg-blue-500'
                  }`}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


