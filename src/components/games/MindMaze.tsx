'use client';

import { useState, useEffect } from 'react';

interface MindMazeProps {
  onComplete?: () => void;
}

type Cell = 'wall' | 'path' | 'start' | 'end' | 'visited';

const generateMaze = (size: number): Cell[][] => {
  const maze: Cell[][] = Array(size).fill(null).map(() => Array(size).fill('wall'));
  
  // Simple maze generation - create a path from start to end
  for (let i = 0; i < size; i++) {
    maze[0][i] = 'path';
    maze[size - 1][i] = 'path';
    maze[i][0] = 'path';
    maze[i][size - 1] = 'path';
  }
  
  maze[0][0] = 'start';
  maze[size - 1][size - 1] = 'end';
  
  // Add some internal paths
  for (let i = 1; i < size - 1; i += 2) {
    for (let j = 1; j < size - 1; j += 2) {
      maze[i][j] = 'path';
      if (Math.random() > 0.3) maze[i + 1][j] = 'path';
      if (Math.random() > 0.3) maze[i][j + 1] = 'path';
    }
  }
  
  return maze;
};

export default function MindMaze({ onComplete }: MindMazeProps) {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [currentPos, setCurrentPos] = useState({ row: 0, col: 0 });
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [level, setLevel] = useState(1);
  const size = 8;

  useEffect(() => {
    const newMaze = generateMaze(size);
    newMaze[0][0] = 'start';
    newMaze[size - 1][size - 1] = 'end';
    setMaze(newMaze);
    setCurrentPos({ row: 0, col: 0 });
    setMoves(0);
    setCompleted(false);
  }, [level]);

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (completed) return;
    
    const { row, col } = currentPos;
    let newRow = row;
    let newCol = col;
    
    switch (direction) {
      case 'up': newRow = Math.max(0, row - 1); break;
      case 'down': newRow = Math.min(size - 1, row + 1); break;
      case 'left': newCol = Math.max(0, col - 1); break;
      case 'right': newCol = Math.min(size - 1, col + 1); break;
    }
    
    if (maze[newRow][newCol] !== 'wall') {
      setCurrentPos({ row: newRow, col: newCol });
      setMoves(prev => prev + 1);
      
      if (newRow === size - 1 && newCol === size - 1) {
        setCompleted(true);
        if (level >= 3) {
          if (onComplete) setTimeout(() => onComplete(), 1000);
        } else {
          setTimeout(() => {
            setLevel(prev => prev + 1);
          }, 1500);
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') handleMove('up');
      if (e.key === 'ArrowDown') handleMove('down');
      if (e.key === 'ArrowLeft') handleMove('left');
      if (e.key === 'ArrowRight') handleMove('right');
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPos, completed]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🧩 Mind Maze</h2>
          <p className="text-sm text-gray-600">Navigate from start to end</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Level: <span className="font-bold">{level}/3</span></div>
          <div className="text-sm text-gray-600">Moves: <span className="font-bold">{moves}</span></div>
        </div>
      </div>

      {completed && level >= 3 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Maze Master!</h3>
            <p className="text-gray-700">You completed all levels!</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="grid gap-1 p-2 bg-gray-800 rounded-lg" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
            {maze.map((row, i) =>
              row.map((cell, j) => {
                const isCurrent = i === currentPos.row && j === currentPos.col;
                const isEnd = i === size - 1 && j === size - 1;
                
                return (
                  <div
                    key={`${i}-${j}`}
                    className={`
                      w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
                      ${cell === 'wall' ? 'bg-gray-700' : 'bg-white'}
                      ${isCurrent ? 'bg-blue-500' : ''}
                      ${isEnd ? 'bg-green-500' : ''}
                      ${completed && isEnd ? 'animate-pulse' : ''}
                      border border-gray-600
                    `}
                  >
                    {isCurrent && '👤'}
                    {isEnd && !isCurrent && '🏁'}
                  </div>
                );
              })
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2 max-w-xs">
            <div></div>
            <button onClick={() => handleMove('up')} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">↑</button>
            <div></div>
            <button onClick={() => handleMove('left')} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">←</button>
            <button onClick={() => handleMove('down')} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">↓</button>
            <button onClick={() => handleMove('right')} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">→</button>
          </div>
          
          {completed && (
            <div className="p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
              <p className="font-bold text-green-800">Level {level} Complete! 🎉</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


