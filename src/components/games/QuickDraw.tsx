'use client';

import { useState, useEffect } from 'react';

interface QuickDrawProps {
  onComplete?: () => void;
}

export default function QuickDraw({ onComplete }: QuickDrawProps) {
  const [target, setTarget] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [completed, setCompleted] = useState(false);

  const maxRounds = 15;
  const shapes = ['Circle', 'Square', 'Triangle', 'Star', 'Heart', 'Diamond'];

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    setTarget(shapes[Math.floor(Math.random() * shapes.length)]);
    setTimeLeft(5);
  }, [round]);

  useEffect(() => {
    if (timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !completed) {
      setRound(prev => prev + 1);
    }
  }, [timeLeft, completed]);

  const handleSelect = (shape: string) => {
    if (shape === target) {
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
          <h3 className="text-2xl font-bold text-green-600 mb-2">Quick Draw Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">⚡ Quick Draw</h2>
          <p className="text-sm text-gray-600">Select the shape quickly!</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Round: <span className="font-bold">{round + 1}/{maxRounds}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
          <div className={`text-sm font-bold ${timeLeft <= 2 ? 'text-red-600 animate-pulse' : 'text-gray-600'}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Find this shape:</p>
          <div className="text-6xl font-bold text-blue-600">{target}</div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md">
          {shapes.map((shape) => (
            <button
              key={shape}
              onClick={() => handleSelect(shape)}
              className={`
                p-6 rounded-xl border-2 transition-all font-bold
                ${shape === target
                  ? 'border-green-500 bg-green-50 scale-110'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:scale-105'
                }
              `}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


