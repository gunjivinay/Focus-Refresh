'use client';

import { useState, useEffect } from 'react';

interface ColorBlastProps {
  onComplete?: () => void;
}

export default function ColorBlast({ onComplete }: ColorBlastProps) {
  const [targetColor, setTargetColor] = useState('');
  const [colors] = useState(['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange']);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [completed, setCompleted] = useState(false);

  const maxRounds = 12;

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
    setTimeLeft(8);
  }, [round]);

  useEffect(() => {
    if (timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !completed) {
      setRound(prev => prev + 1);
    }
  }, [timeLeft, completed]);

  const handleSelect = (color: string) => {
    if (color === targetColor) {
      setScore(prev => prev + 10);
      setRound(prev => prev + 1);
    } else {
      setRound(prev => prev + 1);
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Color Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  const colorClasses: Record<string, string> = {
    'Red': 'bg-red-500',
    'Blue': 'bg-blue-500',
    'Green': 'bg-green-500',
    'Yellow': 'bg-yellow-400',
    'Purple': 'bg-purple-500',
    'Orange': 'bg-orange-500',
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🎨 Color Blast</h2>
          <p className="text-sm text-gray-600">Select the target color quickly!</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Round: <span className="font-bold">{round + 1}/{maxRounds}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
          <div className={`text-sm font-bold ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-gray-600'}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Find this color:</p>
          <div className={`w-32 h-32 rounded-full ${colorClasses[targetColor]} mx-auto shadow-2xl`} />
          <p className="text-2xl font-bold text-gray-800 mt-4">{targetColor}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleSelect(color)}
              className={`
                p-6 rounded-xl transition-all font-bold text-white
                ${colorClasses[color]}
                ${color === targetColor
                  ? 'ring-4 ring-yellow-400 scale-110'
                  : 'hover:scale-105 hover:shadow-lg'
                }
              `}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


