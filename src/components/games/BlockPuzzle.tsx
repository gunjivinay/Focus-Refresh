'use client';

import { useState, useEffect } from 'react';

interface BlockPuzzleProps {
  onComplete?: () => void;
}

export default function BlockPuzzle({ onComplete }: BlockPuzzleProps) {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  const gridSize = 4;

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    // Add two random tiles
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setMoves(0);
  };

  const addRandomTile = (grid: number[][]) => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[row][col] = Math.random() > 0.9 ? 4 : 2;
    }
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    const newGrid = grid.map(row => [...row]);
    let moved = false;

    // Simplified move logic (left only for demo)
    if (direction === 'left') {
      for (let i = 0; i < gridSize; i++) {
        const row = newGrid[i].filter(cell => cell !== 0);
        for (let j = 0; j < row.length - 1; j++) {
          if (row[j] === row[j + 1]) {
            row[j] *= 2;
            row[j + 1] = 0;
            setScore(prev => prev + row[j]);
            moved = true;
          }
        }
        const merged = row.filter(cell => cell !== 0);
        while (merged.length < gridSize) merged.push(0);
        newGrid[i] = merged;
      }
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setMoves(prev => prev + 1);
      
      // Check win condition (simplified)
      if (score >= 500) {
        setCompleted(true);
        if (onComplete) setTimeout(() => onComplete(), 1000);
      }
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Puzzle Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🧩 Block Puzzle</h2>
          <p className="text-sm text-gray-600">Combine blocks to reach higher numbers</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
          <div className="text-sm text-gray-600">Moves: <span className="font-bold">{moves}</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="grid gap-2 bg-gray-800 p-3 rounded-lg" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
          {grid.flat().map((cell, idx) => (
            <div
              key={idx}
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center
                font-bold text-lg md:text-xl
                ${cell === 0 ? 'bg-gray-300' : 
                  cell === 2 ? 'bg-yellow-200 text-yellow-900' :
                  cell === 4 ? 'bg-yellow-300 text-yellow-900' :
                  'bg-orange-400 text-white'
                }
              `}
            >
              {cell || ''}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-xs">
          <div></div>
          <button onClick={() => move('up')} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">↑</button>
          <div></div>
          <button onClick={() => move('left')} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">←</button>
          <button onClick={() => move('down')} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">↓</button>
          <button onClick={() => move('right')} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">→</button>
        </div>
      </div>
    </div>
  );
}


