'use client';

import { useState, useEffect } from 'react';

interface SpotTheDiffProps {
  onComplete?: () => void;
}

export default function SpotTheDiff({ onComplete }: SpotTheDiffProps) {
  const [grid1, setGrid1] = useState<boolean[][]>([]);
  const [grid2, setGrid2] = useState<boolean[][]>([]);
  const [differences, setDifferences] = useState<number>(0);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [completed, setCompleted] = useState(false);

  const gridSize = 5;
  const maxRounds = 6;

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    generateGrids();
  }, [round]);

  const generateGrids = () => {
    const g1: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    const g2: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    
    // Create identical grids
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const val = Math.random() > 0.5;
        g1[i][j] = val;
        g2[i][j] = val;
      }
    }
    
    // Add 3 differences
    let diffCount = 0;
    while (diffCount < 3) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (g1[row][col] === g2[row][col]) {
        g2[row][col] = !g2[row][col];
        diffCount++;
      }
    }
    
    setGrid1(g1);
    setGrid2(g2);
    setDifferences(3);
    setFound(new Set());
  };

  const handleCellClick = (row: number, col: number, grid: number) => {
    const key = `${row}-${col}`;
    if (found.has(key)) return;
    
    const isDiff = grid1[row][col] !== grid2[row][col];
    if (isDiff) {
      setFound(new Set([...found, key]));
      setScore(prev => prev + 20);
      
      if (found.size + 1 >= differences) {
        setTimeout(() => setRound(prev => prev + 1), 1500);
      }
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Spot Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👁️ Spot The Difference</h2>
          <p className="text-sm text-gray-600">Find {differences} differences between the grids</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Round: <span className="font-bold">{round + 1}/{maxRounds}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
          <div className="text-sm text-gray-600">Found: <span className="font-bold">{found.size}/{differences}</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-4 overflow-y-auto">
        <div className="flex gap-4">
          <div>
            <p className="text-center text-sm text-gray-600 mb-2">Grid 1</p>
            <div className="grid gap-1 bg-gray-800 p-2 rounded-lg" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
              {grid1.flat().map((cell, idx) => {
                const row = Math.floor(idx / gridSize);
                const col = idx % gridSize;
                const key = `${row}-${col}`;
                return (
                  <button
                    key={idx}
                    onClick={() => handleCellClick(row, col, 1)}
                    className={`
                      w-10 h-10 rounded
                      ${cell ? 'bg-yellow-400' : 'bg-white'}
                      ${found.has(key) ? 'ring-4 ring-green-500' : ''}
                    `}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-center text-sm text-gray-600 mb-2">Grid 2</p>
            <div className="grid gap-1 bg-gray-800 p-2 rounded-lg" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
              {grid2.flat().map((cell, idx) => {
                const row = Math.floor(idx / gridSize);
                const col = idx % gridSize;
                const key = `${row}-${col}`;
                return (
                  <button
                    key={idx}
                    onClick={() => handleCellClick(row, col, 2)}
                    className={`
                      w-10 h-10 rounded
                      ${cell ? 'bg-yellow-400' : 'bg-white'}
                      ${found.has(key) ? 'ring-4 ring-green-500' : ''}
                    `}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

