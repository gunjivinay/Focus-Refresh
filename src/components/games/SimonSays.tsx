'use client';

import { useState, useEffect } from 'react';

interface SimonSaysProps {
  onComplete?: () => void;
}

type Color = 'red' | 'blue' | 'green' | 'yellow';

const colors: Color[] = ['red', 'blue', 'green', 'yellow'];
const colorClasses: Record<Color, string> = {
  red: 'bg-red-500 hover:bg-red-600',
  blue: 'bg-blue-500 hover:bg-blue-600',
  green: 'bg-green-500 hover:bg-green-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600',
};

export default function SimonSays({ onComplete }: SimonSaysProps) {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userSequence, setUserSequence] = useState<Color[]>([]);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const maxLevel = 5;

  useEffect(() => {
    if (level > maxLevel) {
      setGameOver(true);
      if (onComplete) {
        setTimeout(() => onComplete(), 3000);
      }
      return;
    }
    startNewLevel();
  }, [level]);

  const startNewLevel = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence(prev => [...prev, newColor]);
    setIsShowing(true);
    showSequence([...sequence, newColor]);
  };

  const showSequence = (seq: Color[]) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < seq.length) {
        setActiveColor(seq[index]);
        setTimeout(() => {
          setActiveColor(null);
          index++;
        }, 600);
      } else {
        clearInterval(interval);
        setIsShowing(false);
        setIsPlaying(true);
        setUserSequence([]);
      }
    }, 800);
  };

  const handleColorClick = (color: Color) => {
    if (!isPlaying || isShowing) return;

    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Wrong!
      setGameOver(true);
      if (onComplete) {
        setTimeout(() => onComplete(), 3000);
      }
    } else if (newUserSequence.length === sequence.length) {
      // Level complete!
      setIsPlaying(false);
      setTimeout(() => {
        setLevel(prev => prev + 1);
      }, 1000);
    }
  };

  const resetGame = () => {
    setSequence([]);
    setUserSequence([]);
    setLevel(1);
    setIsPlaying(false);
    setIsShowing(false);
    setActiveColor(null);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-800">Game Over!</h3>
          <p className="text-xl text-gray-700">
            You reached level <span className="font-bold text-blue-600">{level - 1}</span>
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🎨 Simon Says</h2>
        <p className="text-sm text-gray-600">
          Level: <span className="font-bold text-blue-600">{level}/{maxLevel}</span>
        </p>
        {isShowing && (
          <p className="text-sm text-orange-600 font-semibold">Watch the sequence...</p>
        )}
        {isPlaying && !isShowing && (
          <p className="text-sm text-green-600 font-semibold">Your turn! Repeat the sequence</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 w-64 h-64">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            disabled={isShowing || !isPlaying}
            className={`${colorClasses[color]} rounded-xl border-4 transition-all transform ${
              activeColor === color ? 'scale-90 brightness-150' : ''
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        ))}
      </div>
    </div>
  );
}


