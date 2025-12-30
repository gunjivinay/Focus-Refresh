'use client';

import { useState, useEffect, useRef } from 'react';

interface SnakeAvoiderProps {
  onComplete?: () => void;
}

type Direction = 'up' | 'down' | 'left' | 'right';

export default function SnakeAvoider({ onComplete }: SnakeAvoiderProps) {
  const [gameMode, setGameMode] = useState<'snake' | 'avoider' | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState<Direction>('right');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (gameMode && timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            if (onComplete) {
              setTimeout(() => onComplete(), 3000);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameMode, timeLeft, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setDirection('up');
      if (e.key === 'ArrowDown') setDirection('down');
      if (e.key === 'ArrowLeft') setDirection('left');
      if (e.key === 'ArrowRight') setDirection('right');
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!gameMode) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🐍</div>
          <h2 className="text-3xl font-bold text-gray-800">Snake / Avoider</h2>
          <p className="text-gray-600">Choose your game mode</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setGameMode('snake')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg"
          >
            Snake
          </button>
          <button
            onClick={() => setGameMode('avoider')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg shadow-lg"
          >
            Avoider
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Game Over!</h3>
          <p className="text-xl text-gray-700">
            Final Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
          <p className="text-lg text-gray-600">
            Time Survived: <span className="font-bold text-purple-600">{90 - timeLeft}s</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">{gameMode === 'snake' ? '🐍 Snake' : '🏃 Avoider'}</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
          <p className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
            Time: {timeLeft}s
          </p>
        </div>
        <p className="text-xs text-gray-500">Use arrow keys to control</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-gray-700 rounded-lg"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setDirection('up')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ↑
        </button>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setDirection('left')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ←
          </button>
          <button
            onClick={() => setDirection('right')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            →
          </button>
        </div>
        <button
          onClick={() => setDirection('down')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ↓
        </button>
      </div>
    </div>
  );
}


