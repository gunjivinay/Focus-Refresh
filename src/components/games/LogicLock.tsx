'use client';

import { useState, useEffect } from 'react';

interface LogicLockProps {
  onComplete?: () => void;
}

interface Puzzle {
  question: string;
  answer: string;
  options: string[];
}

const puzzles: Puzzle[] = [
  {
    question: 'If all roses are flowers, and some flowers are red, then:',
    answer: 'Some roses may be red',
    options: ['All roses are red', 'Some roses may be red', 'No roses are red', 'Roses are not flowers'],
  },
  {
    question: 'A clock shows 3:15. What is the angle between the hands?',
    answer: '7.5 degrees',
    options: ['0 degrees', '7.5 degrees', '15 degrees', '30 degrees'],
  },
  {
    question: 'If you have 5 apples and eat 2, then buy 3 more, how many do you have?',
    answer: '6 apples',
    options: ['3 apples', '5 apples', '6 apples', '10 apples'],
  },
  {
    question: 'What comes next: 2, 4, 8, 16, ?',
    answer: '32',
    options: ['20', '24', '32', '64'],
  },
  {
    question: 'If today is Monday, what day will it be in 7 days?',
    answer: 'Monday',
    options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
  },
];

export default function LogicLock({ onComplete }: LogicLockProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  const puzzle = puzzles[currentPuzzle % puzzles.length];

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    setShowResult(true);
    
    if (selectedAnswer === puzzle.answer) {
      setScore(prev => prev + 20);
    }
    
    setTimeout(() => {
      if (currentPuzzle >= puzzles.length - 1) {
        setCompleted(true);
        if (onComplete) setTimeout(() => onComplete(), 1000);
      } else {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2000);
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Logic Master!</h3>
          <p className="text-gray-700">Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🔐 Logic Lock</h2>
          <p className="text-sm text-gray-600">Unlock puzzles with logic</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Puzzle: <span className="font-bold">{currentPuzzle + 1}/{puzzles.length}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-300">
          <p className="text-lg font-semibold text-gray-800">{puzzle.question}</p>
        </div>

        <div className="space-y-3">
          {puzzle.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(option)}
              disabled={showResult}
              className={`
                w-full p-4 rounded-xl text-left transition-all
                ${selectedAnswer === option
                  ? showResult && option === puzzle.answer
                    ? 'bg-green-500 text-white border-2 border-green-600'
                    : showResult && option !== puzzle.answer
                    ? 'bg-red-500 text-white border-2 border-red-600'
                    : 'bg-blue-500 text-white border-2 border-blue-600'
                  : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }
                ${showResult ? 'opacity-75' : ''}
                font-medium
              `}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`p-4 rounded-xl text-center ${
            selectedAnswer === puzzle.answer ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'
          }`}>
            <p className="font-bold text-lg">
              {selectedAnswer === puzzle.answer ? '✓ Correct!' : '✗ Try again next time'}
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || showResult}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}


