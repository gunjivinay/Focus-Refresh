'use client';

import { useState, useEffect } from 'react';

interface SudokuProps {
  onComplete?: () => void;
}

type Cell = number | null;

// Generate a simple 9x9 Sudoku grid (simplified for demo)
const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard'): { grid: Cell[][]; solution: number[][] } => {
  // For demo, we'll use a pre-made easy puzzle
  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  const grid: Cell[][] = solution.map(row => [...row]);
  
  // Remove numbers based on difficulty
  const cellsToRemove = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 40 : 50;
  for (let i = 0; i < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    grid[row][col] = null;
  }

  return { grid, solution };
};

export default function Sudoku({ onComplete }: SudokuProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [errors, setErrors] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const { grid: newGrid, solution: newSolution } = generateSudoku(difficulty);
    setGrid(newGrid);
    setSolution(newSolution);
    setErrors(0);
    setTimeSpent(0);
    setIsComplete(false);
    setSelectedCell(null);
  }, [difficulty]);

  useEffect(() => {
    if (!isComplete) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isComplete]);

  useEffect(() => {
    // Check if puzzle is complete
    let allFilled = true;
    let allCorrect = true;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          allFilled = false;
        } else if (grid[row][col] !== solution[row][col]) {
          allCorrect = false;
        }
      }
    }

    if (allFilled && allCorrect) {
      setIsComplete(true);
      if (onComplete) {
        setTimeout(() => onComplete(), 1000);
      }
    }
  }, [grid, solution, onComplete]);

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col] === null) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell) {
      const newGrid = grid.map(row => [...row]);
      newGrid[selectedCell.row][selectedCell.col] = num;
      setGrid(newGrid);

      // Check if correct
      if (num !== solution[selectedCell.row][selectedCell.col]) {
        setErrors(prev => prev + 1);
      }

      setSelectedCell(null);
    }
  };

  const handleClear = () => {
    if (selectedCell) {
      const newGrid = grid.map(row => [...row]);
      newGrid[selectedCell.row][selectedCell.col] = null;
      setGrid(newGrid);
      setSelectedCell(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🔢 Sudoku</h2>
          <p className="text-gray-600">Fill the grid with numbers 1-9. No repeats in rows, columns, or 3x3 boxes!</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">
            Time: <span className="font-bold">{formatTime(timeSpent)}</span>
          </div>
          <div className="text-sm text-gray-600">
            Errors: <span className={`font-bold ${errors > 5 ? 'text-red-600' : 'text-gray-600'}`}>{errors}</span>
          </div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {isComplete ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-green-600 mb-2">Perfect!</h3>
            <p className="text-xl text-gray-700 mb-4">You solved the Sudoku puzzle!</p>
            <p className="text-lg text-gray-600">
              Time: <span className="font-bold">{formatTime(timeSpent)}</span> | 
              Errors: <span className="font-bold">{errors}</span>
            </p>
            <p className="text-sm text-gray-500 mt-4">Excellent logical thinking! Keep playing or wait for the timer.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 overflow-y-auto">
          {/* Sudoku Grid */}
          <div className="flex justify-center">
            <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 bg-gray-800">
              {Array.from({ length: 81 }).map((_, i) => {
                const row = Math.floor(i / 9);
                const col = i % 9;
                const value = grid[row]?.[col];
                const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                const isIncorrect = value !== null && value !== solution[row][col];
                const boxRow = Math.floor(row / 3);
                const boxCol = Math.floor(col / 3);
                const isBoxBorder = row % 3 === 0 || col % 3 === 0;

                return (
                  <div
                    key={i}
                    onClick={() => handleCellClick(row, col)}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center
                      bg-white border border-gray-300
                      ${isBoxBorder ? 'border-gray-600' : ''}
                      ${isSelected ? 'bg-blue-200 ring-2 ring-blue-400' : ''}
                      ${isIncorrect ? 'bg-red-100' : ''}
                      ${value === null ? 'cursor-pointer hover:bg-gray-100' : 'cursor-pointer'}
                      font-bold text-sm sm:text-base md:text-lg
                    `}
                  >
                    {value || ''}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Number Input */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                {selectedCell ? 'Click a number to fill the selected cell' : 'Click a cell to select it'}
              </p>
              <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumberInput(num)}
                    disabled={!selectedCell}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-lg transition-all"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handleClear}
                  disabled={!selectedCell}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all col-span-5"
                >
                  Clear Cell
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

