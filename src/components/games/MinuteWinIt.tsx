'use client';

import { useState, useEffect } from 'react';

interface MinuteWinItProps {
  onComplete?: () => void;
}

const challenges = [
  { name: 'Stack Cups', description: 'Click cups in order to stack them', target: 10 },
  { name: 'Click Targets', description: 'Click moving targets as fast as you can', target: 20 },
];

export default function MinuteWinIt({ onComplete }: MinuteWinItProps) {
  const [challenge, setChallenge] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (challenge && timeLeft > 0 && !gameOver) {
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

      if (challenge === 'Click Targets') {
        const targetInterval = setInterval(() => {
          setTargets(prev => [
            ...prev,
            {
              id: Date.now(),
              x: Math.random() * 80 + 10,
              y: Math.random() * 80 + 10,
            },
          ]);
        }, 2000);
        return () => {
          clearInterval(timer);
          clearInterval(targetInterval);
        };
      }

      return () => clearInterval(timer);
    }
  }, [challenge, timeLeft, gameOver]);

  const handleTargetClick = (id: number) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    setScore(prev => prev + 1);
  };

  if (!challenge) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">⏱️</div>
          <h2 className="text-3xl font-bold text-gray-800">Minute to Win It</h2>
          <p className="text-gray-600">Choose a challenge</p>
        </div>
        <div className="flex flex-col gap-3">
          {challenges.map((ch) => (
            <button
              key={ch.name}
              onClick={() => setChallenge(ch.name)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg"
            >
              {ch.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Time's Up!</h3>
          <p className="text-xl text-gray-700">
            Final Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">⏱️ {challenge}</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
          <p className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
            Time: {timeLeft}s
          </p>
        </div>
      </div>

      <div className="relative bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 w-96 h-96">
        {challenge === 'Click Targets' && targets.map((target) => (
          <button
            key={target.id}
            onClick={() => handleTargetClick(target.id)}
            className="absolute w-12 h-12 bg-red-500 rounded-full hover:bg-red-600 transition-all animate-bounce"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
            }}
          />
        ))}
        {challenge === 'Stack Cups' && (
          <div className="flex flex-col-reverse items-center justify-end h-full">
            {Array.from({ length: score }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-blue-500 rounded-full border-2 border-blue-700 mb-1"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


