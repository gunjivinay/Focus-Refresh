'use client';

import { useState, useEffect } from 'react';

interface MemoryMatrixProps {
  onComplete?: () => void;
}

export default function MemoryMatrix({ onComplete }: MemoryMatrixProps) {
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [revealed, setRevealed] = useState<boolean[][]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [completed, setCompleted] = useState(false);

  const gridSize = 4;

  useEffect(() => {
    if (level > 8) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    generateGrid();
  }, [level]);

  const generateGrid = () => {
    const newGrid: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    const newRevealed: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    
    const cellsToFill = level + 2;
    let filled = 0;
    while (filled < cellsToFill) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (!newGrid[row][col]) {
        newGrid[row][col] = true;
        filled++;
      }
    }
    
    setGrid(newGrid);
    setRevealed(newRevealed);
    setShowGrid(true);
    setTimeout(() => setShowGrid(false), 2000 + level * 200);
  };

  const handleCellClick = (row: number, col: number) => {
    if (showGrid) return;
    
    const newRevealed = revealed.map(r => [...r]);
    newRevealed[row][col] = true;
    setRevealed(newRevealed);

    if (grid[row][col]) {
      setScore(prev => prev + 10);
      const allCorrect = grid.every((r, i) => 
        r.every((cell, j) => !cell || newRevealed[i][j])
      );
      if (allCorrect) {
        setTimeout(() => setLevel(prev => prev + 1), 1000);
      }
    } else {
      setTimeout(() => generateGrid(), 1000);
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Memory Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🧠 Memory Matrix</h2>
          <p className="text-sm text-gray-600">Remember the highlighted cells</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Level: <span className="font-bold">{level}/8</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid gap-1 bg-gray-800 p-2 rounded-lg" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const isHighlighted = grid[row]?.[col];
            const isRevealed = revealed[row]?.[col];

            return (
              <button
                key={i}
                onClick={() => handleCellClick(row, col)}
                disabled={showGrid}
                className={`
                  w-16 h-16 md:w-20 md:h-20 rounded transition-all
                  ${showGrid && isHighlighted
                    ? 'bg-yellow-400 animate-pulse'
                    : isRevealed && isHighlighted
                    ? 'bg-green-500'
                    : isRevealed && !isHighlighted
                    ? 'bg-red-500'
                    : 'bg-white hover:bg-gray-100'
                  }
                  ${showGrid ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              />
            );
          })}
        </div>
      </div>

      {showGrid && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Memorize the yellow cells...</p>
        </div>
      )}
    </div>
  );
}


