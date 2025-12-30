'use client';

import { useState, useEffect } from 'react';

interface ColorMatchProps {
  onComplete?: () => void;
}

type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

const colors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const colorNames: Record<Color, string> = {
  red: 'Red',
  blue: 'Blue',
  green: 'Green',
  yellow: 'Yellow',
  purple: 'Purple',
  orange: 'Orange',
};

const colorClasses: Record<Color, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
};

export default function ColorMatch({ onComplete }: ColorMatchProps) {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userSequence, setUserSequence] = useState<Color[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isShowing, setIsShowing] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startNewLevel();
  }, []);

  const startNewLevel = () => {
    const newSequence: Color[] = [];
    for (let i = 0; i < level + 2; i++) {
      newSequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setSequence(newSequence);
    setUserSequence([]);
    setIsShowing(true);
    setGameOver(false);

    // Show sequence
    setTimeout(() => {
      setIsShowing(false);
    }, (level + 2) * 800);
  };

  const handleColorClick = (color: Color) => {
    if (isShowing || gameOver || gameCompleted) return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    // Check if sequence matches so far
    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong color - game over
      setGameOver(true);
      setTimeout(() => {
        startNewLevel();
        setLevel(1);
        setScore(0);
      }, 2000);
      return;
    }

    // Check if level is complete
    if (newUserSequence.length === sequence.length) {
      setScore(prev => prev + level * 10);
      if (level >= 10) {
        setGameCompleted(true);
        if (onComplete) {
          setTimeout(() => onComplete(), 1000);
        }
      } else {
        setTimeout(() => {
          setLevel(prev => prev + 1);
          startNewLevel();
        }, 500);
      }
    }
  };

  const getSequenceDisplay = () => {
    return sequence.map((color, index) => (
      <div
        key={index}
        className={`w-16 h-16 rounded-full ${colorClasses[color]} shadow-lg transition-all duration-300 ${
          isShowing ? 'opacity-100 scale-110' : 'opacity-30 scale-100'
        }`}
        style={{
          animationDelay: `${index * 200}ms`,
        }}
      />
    ));
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Color Match</h2>
          <p className="text-gray-600">Remember and repeat the color sequence!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </div>
          <div className="text-sm text-gray-600">
            Level: <span className="font-bold">{level}/10</span>
          </div>
        </div>
      </div>

      {gameCompleted ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-green-600 mb-2">Amazing!</h3>
          <p className="text-xl text-gray-700 mb-4">You completed all 10 levels!</p>
          <p className="text-lg text-gray-600">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
          <p className="text-sm text-gray-500 mt-4">You can keep playing or wait for the timer.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Sequence Display */}
          <div className="bg-gray-100 rounded-xl p-8">
            <p className="text-center text-sm text-gray-600 mb-4">
              {isShowing ? 'Watch the sequence...' : 'Repeat the sequence!'}
            </p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              {getSequenceDisplay()}
            </div>
            {!isShowing && userSequence.length > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Your sequence:</p>
                <div className="flex justify-center gap-2">
                  {userSequence.map((color, index) => (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded-full ${colorClasses[color]} shadow-md`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {gameOver && (
            <div className="p-4 bg-red-100 border-2 border-red-500 rounded-lg text-center">
              <p className="text-xl font-bold text-red-800">Wrong sequence! Starting over...</p>
            </div>
          )}

          {/* Color Buttons */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorClick(color)}
                disabled={isShowing || gameOver || gameCompleted}
                className={`
                  ${colorClasses[color]} 
                  w-24 h-24 rounded-full 
                  shadow-lg hover:shadow-xl 
                  transition-all duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  active:scale-95
                  hover:scale-105
                `}
              >
                <span className="text-white font-bold text-sm">{colorNames[color]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


