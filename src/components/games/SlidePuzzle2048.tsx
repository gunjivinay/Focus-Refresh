'use client';

import { useState, useEffect } from 'react';

interface SlidePuzzle2048Props {
  onComplete?: () => void;
}

type Direction = 'up' | 'down' | 'left' | 'right';

export default function SlidePuzzle2048({ onComplete }: SlidePuzzle2048Props) {
  const [grid, setGrid] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    addRandomTile();
    addRandomTile();
  }, []);

  const addRandomTile = () => {
    const emptyCells: [number, number][] = [];
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) emptyCells.push([i, j]);
      });
    });

    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newGrid = [...grid];
      newGrid[i][j] = Math.random() < 0.9 ? 2 : 4;
      setGrid(newGrid);
    }
  };

  const move = (direction: Direction) => {
    const newGrid = grid.map(row => [...row]);
    let moved = false;

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const row = newGrid[i].filter(cell => cell !== 0);
        for (let j = 0; j < row.length - 1; j++) {
          if (row[j] === row[j + 1]) {
            row[j] *= 2;
            setScore(prev => prev + row[j]);
            row[j + 1] = 0;
            moved = true;
          }
        }
        const merged = row.filter(cell => cell !== 0);
        while (merged.length < 4) merged.push(0);
        newGrid[i] = merged;
      }
    }

    if (moved) {
      setGrid(newGrid);
      setTimeout(() => addRandomTile(), 100);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') move('left');
    if (e.key === 'ArrowRight') move('right');
    if (e.key === 'ArrowUp') move('up');
    if (e.key === 'ArrowDown') move('down');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [grid]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🧩 2048 Slide Puzzle</h2>
        <p className="text-sm text-gray-600">
          Score: <span className="font-bold text-blue-600">{score}</span>
        </p>
        <p className="text-xs text-gray-500">Use arrow keys to move tiles</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-4">
        <div className="grid grid-cols-4 gap-2">
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg ${
                  cell === 0
                    ? 'bg-gray-700'
                    : cell === 2
                    ? 'bg-gray-200 text-gray-800'
                    : cell === 4
                    ? 'bg-gray-300 text-gray-800'
                    : 'bg-yellow-400 text-gray-800'
                }`}
              >
                {cell !== 0 && cell}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => move('left')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ← Left
        </button>
        <button
          onClick={() => move('right')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Right →
        </button>
      </div>
    </div>
  );
}


