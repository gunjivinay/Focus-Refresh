'use client';

import { useState } from 'react';

interface LightLogicProps {
  onComplete?: () => void;
}

export default function LightLogic({ onComplete }: LightLogicProps) {
  const [puzzleType, setPuzzleType] = useState<'sudoku' | 'nonogram' | null>(null);
  const [grid, setGrid] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  if (!puzzleType) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">💡</div>
          <h2 className="text-3xl font-bold text-gray-800">Light Logic Puzzles</h2>
          <p className="text-gray-600">Choose a puzzle type</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setPuzzleType('sudoku')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg"
          >
            Mini Sudoku (4×4)
          </button>
          <button
            onClick={() => setPuzzleType('nonogram')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg shadow-lg"
          >
            Nonogram
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          💡 {puzzleType === 'sudoku' ? 'Mini Sudoku' : 'Nonogram'}
        </h2>
        <p className="text-sm text-gray-600">Fill the grid following the rules</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-blue-200">
        <div className="grid grid-cols-4 gap-1">
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <input
                key={`${i}-${j}`}
                type="number"
                min="1"
                max="4"
                value={cell || ''}
                onChange={(e) => {
                  const newGrid = [...grid];
                  newGrid[i][j] = parseInt(e.target.value) || 0;
                  setGrid(newGrid);
                }}
                className="w-12 h-12 text-center border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none font-bold text-gray-900"
              />
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => {
          setPuzzleType(null);
          setGrid([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
          ]);
        }}
        className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold"
      >
        Change Puzzle Type
      </button>
    </div>
  );
}


