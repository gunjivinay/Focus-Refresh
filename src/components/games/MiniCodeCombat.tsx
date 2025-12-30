'use client';

import { useState } from 'react';

interface MiniCodeCombatProps {
  onComplete?: () => void;
}

type Direction = 'up' | 'down' | 'left' | 'right';
type CellType = 'path' | 'wall' | 'start' | 'end';

const mazes = [
  {
    grid: [
      ['start', 'path', 'path', 'wall'],
      ['wall', 'wall', 'path', 'wall'],
      ['path', 'path', 'path', 'end'],
    ],
  },
  {
    grid: [
      ['start', 'path', 'wall', 'path'],
      ['path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'end'],
    ],
  },
];

export default function MiniCodeCombat({ onComplete }: MiniCodeCombatProps) {
  const [currentMaze, setCurrentMaze] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  const maze = mazes[currentMaze];
  const grid = maze.grid;

  const moveCharacter = (direction: Direction) => {
    const newPos = { ...position };
    
    switch (direction) {
      case 'up':
        if (newPos.y > 0) newPos.y--;
        break;
      case 'down':
        if (newPos.y < grid.length - 1) newPos.y++;
        break;
      case 'left':
        if (newPos.x > 0) newPos.x--;
        break;
      case 'right':
        if (newPos.x < grid[0].length - 1) newPos.x++;
        break;
    }

    const cell = grid[newPos.y]?.[newPos.x];
    if (cell === 'wall') return; // Can't move into wall

    setPosition(newPos);
    setMoves(prev => prev + 1);

    // Check if reached end
    if (cell === 'end') {
      if (currentMaze < mazes.length - 1) {
        setTimeout(() => {
          setCurrentMaze(prev => prev + 1);
          setPosition({ x: 0, y: 0 });
          setMoves(0);
        }, 1500);
      } else {
        setCompleted(true);
        if (onComplete) {
          setTimeout(() => onComplete(), 2000);
        }
      }
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">⚔️</div>
          <h3 className="text-2xl font-bold text-gray-800">All Mazes Completed!</h3>
          <p className="text-lg text-gray-600">Total Moves: <span className="font-bold text-blue-600">{moves}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">⚔️ Mini Code Combat</h2>
        <p className="text-sm text-gray-600">Maze {currentMaze + 1}/{mazes.length} | Moves: {moves}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
              {grid.map((row, i) =>
                row.map((cell, j) => {
                  const isPlayerHere = position.x === j && position.y === i;
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`aspect-square flex items-center justify-center text-2xl ${
                        cell === 'wall'
                          ? 'bg-gray-700'
                          : cell === 'start'
                          ? 'bg-green-600'
                          : cell === 'end'
                          ? 'bg-red-600'
                          : 'bg-gray-800'
                      }`}
                    >
                      {isPlayerHere ? '🚶' : cell === 'start' ? '🏁' : cell === 'end' ? '🎯' : cell === 'wall' ? '🧱' : ''}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => moveCharacter('up')}
              className="w-16 h-16 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-xl"
            >
              ↑
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => moveCharacter('left')}
                className="w-16 h-16 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-xl"
              >
                ←
              </button>
              <button
                onClick={() => moveCharacter('down')}
                className="w-16 h-16 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-xl"
              >
                ↓
              </button>
              <button
                onClick={() => moveCharacter('right')}
                className="w-16 h-16 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-xl"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
