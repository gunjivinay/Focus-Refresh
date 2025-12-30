'use client';

import { useState, useEffect } from 'react';

interface SpeedMatchProps {
  onComplete?: () => void;
}

type Shape = 'circle' | 'square' | 'triangle' | 'star';
type Color = 'red' | 'blue' | 'green' | 'yellow';

interface Pattern {
  shape: Shape;
  color: Color;
}

export default function SpeedMatch({ onComplete }: SpeedMatchProps) {
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [options, setOptions] = useState<Pattern[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [completed, setCompleted] = useState(false);

  const maxRounds = 10;

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    
    generatePattern();
    setTimeLeft(5);
  }, [round]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !completed) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      setTimeout(() => {
        setRound(prev => prev + 1);
        setGameOver(false);
      }, 1500);
    }
  }, [timeLeft, gameOver, completed]);

  const generatePattern = () => {
    const shapes: Shape[] = ['circle', 'square', 'triangle', 'star'];
    const colors: Color[] = ['red', 'blue', 'green', 'yellow'];
    
    const correct: Pattern = {
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    
    const wrongOptions: Pattern[] = [];
    while (wrongOptions.length < 3) {
      const wrong: Pattern = {
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      if (JSON.stringify(wrong) !== JSON.stringify(correct)) {
        wrongOptions.push(wrong);
      }
    }
    
    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    setPattern(correct);
    setOptions(allOptions);
  };

  const handleSelect = (selected: Pattern) => {
    if (JSON.stringify(selected) === JSON.stringify(pattern)) {
      setScore(prev => prev + 10);
      setRound(prev => prev + 1);
    } else {
      setGameOver(true);
      setTimeout(() => {
        setRound(prev => prev + 1);
        setGameOver(false);
      }, 1500);
    }
  };

  const getShapeEmoji = (shape: Shape) => {
    switch (shape) {
      case 'circle': return '⭕';
      case 'square': return '⬜';
      case 'triangle': return '🔺';
      case 'star': return '⭐';
    }
  };

  const getColorClass = (color: Color) => {
    switch (color) {
      case 'red': return 'text-red-500';
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'yellow': return 'text-yellow-500';
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Lightning Fast!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">⚡ Speed Match</h2>
          <p className="text-sm text-gray-600">Match the pattern quickly!</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Round: <span className="font-bold">{round + 1}/{maxRounds}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
          <div className={`text-sm font-bold ${timeLeft <= 2 ? 'text-red-600 animate-pulse' : 'text-gray-600'}`}>
            Time: {timeLeft}s
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {pattern && (
          <>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Find this pattern:</p>
              <div className={`text-8xl ${getColorClass(pattern.color)}`}>
                {getShapeEmoji(pattern.shape)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  disabled={gameOver}
                  className={`
                    p-6 rounded-xl border-2 transition-all
                    ${gameOver ? 'opacity-50' : 'hover:scale-105 hover:shadow-lg'}
                    ${JSON.stringify(option) === JSON.stringify(pattern) 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white hover:border-blue-300'
                    }
                  `}
                >
                  <div className={`text-5xl ${getColorClass(option.color)}`}>
                    {getShapeEmoji(option.shape)}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


