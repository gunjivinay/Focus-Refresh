'use client';

import { useState, useEffect } from 'react';

interface MathRushProps {
  onComplete?: () => void;
}

export default function MathRush({ onComplete }: MathRushProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [completed, setCompleted] = useState(false);

  const maxRounds = 20;

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    generateQuestion();
    setTimeLeft(10);
  }, [round]);

  useEffect(() => {
    if (timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !completed) {
      setRound(prev => prev + 1);
    }
  }, [timeLeft, completed]);

  const generateQuestion = () => {
    const ops: ('+' | '-' | '*')[] = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    setOperation(op);

    if (op === '+') {
      setNum1(Math.floor(Math.random() * 50) + 1);
      setNum2(Math.floor(Math.random() * 50) + 1);
    } else if (op === '-') {
      const n1 = Math.floor(Math.random() * 50) + 20;
      setNum1(n1);
      setNum2(Math.floor(Math.random() * n1));
    } else {
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
    }
    setUserAnswer('');
  };

  const calculateAnswer = (): number => {
    switch (operation) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      default: return 0;
    }
  };

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    if (answer === calculateAnswer()) {
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
          <h3 className="text-2xl font-bold text-green-600 mb-2">Math Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  const getOpSymbol = () => {
    switch (operation) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      default: return '+';
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">⚡ Math Rush</h2>
          <p className="text-sm text-gray-600">Solve math problems as fast as you can!</p>
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
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-8 border-2 border-green-300">
          <div className="flex justify-center items-center gap-4 text-4xl font-bold text-gray-800">
            <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center">
              {num1}
            </div>
            <div>{getOpSymbol()}</div>
            <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center">
              {num2}
            </div>
            <div>=</div>
            <div className="w-20 h-20 bg-yellow-200 border-2 border-dashed border-yellow-400 rounded-lg flex items-center justify-center">
              ?
            </div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="?"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold text-lg"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}


