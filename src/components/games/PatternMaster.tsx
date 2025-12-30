'use client';

import { useState, useEffect } from 'react';

interface PatternMasterProps {
  onComplete?: () => void;
}

export default function PatternMaster({ onComplete }: PatternMasterProps) {
  const [pattern, setPattern] = useState<string[]>([]);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [colors] = useState(['🔴', '🟢', '🔵', '🟡', '🟣', '🟠']);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showPattern, setShowPattern] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (level > 10) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    generatePattern();
  }, [level]);

  const generatePattern = () => {
    const newPattern: string[] = [];
    for (let i = 0; i < level + 2; i++) {
      newPattern.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setPattern(newPattern);
    setUserPattern([]);
    setShowPattern(true);
    setTimeout(() => setShowPattern(false), (level + 2) * 600);
  };

  const handleColorClick = (color: string) => {
    if (showPattern) return;
    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);

    if (newUserPattern.length === pattern.length) {
      if (JSON.stringify(newUserPattern) === JSON.stringify(pattern)) {
        setScore(prev => prev + level * 5);
        setTimeout(() => setLevel(prev => prev + 1), 1000);
      } else {
        generatePattern();
      }
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Pattern Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🎨 Pattern Master</h2>
          <p className="text-sm text-gray-600">Remember and repeat the color pattern</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Level: <span className="font-bold">{level}/10</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            {showPattern ? 'Watch the pattern...' : 'Repeat the pattern!'}
          </p>
          <div className="flex gap-3 justify-center">
            {pattern.map((color, idx) => (
              <div
                key={idx}
                className={`text-5xl transition-all ${
                  showPattern ? 'opacity-100 scale-110' : 'opacity-30 scale-100'
                }`}
              >
                {color}
              </div>
            ))}
          </div>
        </div>

        {!showPattern && (
          <>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Your pattern:</p>
              <div className="flex gap-2 justify-center">
                {userPattern.map((color, idx) => (
                  <div key={idx} className="text-4xl">{color}</div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-xs">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorClick(color)}
                  className="p-4 text-4xl rounded-xl bg-white border-2 border-gray-300 hover:border-blue-400 hover:scale-110 transition-all"
                >
                  {color}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


