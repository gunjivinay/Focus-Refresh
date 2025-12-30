'use client';

import { useState, useEffect } from 'react';

interface NumberCrunchProps {
  onComplete?: () => void;
}

export default function NumberCrunch({ onComplete }: NumberCrunchProps) {
  const [target, setTarget] = useState(0);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [completed, setCompleted] = useState(false);

  const maxRounds = 10;

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    generatePuzzle();
    setTimeLeft(30);
  }, [round]);

  useEffect(() => {
    if (timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !completed) {
      setRound(prev => prev + 1);
    }
  }, [timeLeft, completed]);

  const generatePuzzle = () => {
    const targetNum = Math.floor(Math.random() * 50) + 20;
    setTarget(targetNum);
    const nums: number[] = [];
    for (let i = 0; i < 6; i++) {
      nums.push(Math.floor(Math.random() * 20) + 1);
    }
    setNumbers(nums);
    setSelected([]);
  };

  const toggleNumber = (num: number, index: number) => {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const checkAnswer = () => {
    const sum = selected.reduce((acc, idx) => acc + numbers[idx], 0);
    if (sum === target) {
      setScore(prev => prev + 10);
      setRound(prev => prev + 1);
    } else {
      setSelected([]);
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Number Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  const selectedSum = selected.reduce((acc, idx) => acc + numbers[idx], 0);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🔢 Number Crunch</h2>
          <p className="text-sm text-gray-600">Select numbers that sum to the target</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Round: <span className="font-bold">{round + 1}/{maxRounds}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
          <div className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-gray-600'}`}>{timeLeft}s</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Target Sum:</p>
          <div className="text-5xl font-bold text-blue-600">{target}</div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-xs">
          {numbers.map((num, index) => (
            <button
              key={index}
              onClick={() => toggleNumber(num, index)}
              className={`
                p-4 rounded-xl font-bold text-xl transition-all
                ${selected.includes(index)
                  ? 'bg-blue-500 text-white scale-110'
                  : 'bg-white border-2 border-gray-300 hover:border-blue-400'
                }
              `}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Selected Sum:</p>
          <div className={`text-3xl font-bold ${selectedSum === target ? 'text-green-600' : 'text-gray-700'}`}>
            {selectedSum}
          </div>
        </div>

        <button
          onClick={checkAnswer}
          disabled={selected.length === 0}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-semibold text-lg"
        >
          Check Answer
        </button>
      </div>
    </div>
  );
}


