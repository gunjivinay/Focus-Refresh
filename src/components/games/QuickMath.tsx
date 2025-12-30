'use client';

import { useState, useEffect } from 'react';

interface QuickMathProps {
  onComplete?: () => void;
}

type Operation = '+' | '-' | '*' | '/';

export default function QuickMath({ onComplete }: QuickMathProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState<Operation>('+');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      setGameCompleted(true);
      if (onComplete) {
        setTimeout(() => onComplete(), 1000);
      }
    }
  }, [timeLeft, gameCompleted, onComplete]);

  const generateQuestion = () => {
    const ops: Operation[] = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    setOperation(op);

    if (op === '+') {
      setNum1(Math.floor(Math.random() * 50) + 1);
      setNum2(Math.floor(Math.random() * 50) + 1);
    } else if (op === '-') {
      const n1 = Math.floor(Math.random() * 50) + 20;
      const n2 = Math.floor(Math.random() * n1);
      setNum1(n1);
      setNum2(n2);
    } else {
      // Multiplication (easier numbers)
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
    }

    setUserAnswer('');
    setFeedback('');
  };

  const calculateAnswer = (): number => {
    switch (operation) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      default:
        return 0;
    }
  };

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    const correct = calculateAnswer();

    if (answer === correct) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
      setFeedback('Correct! ✓');
      setTimeout(() => {
        generateQuestion();
      }, 500);
    } else {
      setFeedback(`Wrong! The answer is ${correct}`);
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    }
  };

  const getOperationSymbol = (op: Operation): string => {
    switch (op) {
      case '+':
        return '+';
      case '-':
        return '−';
      case '*':
        return '×';
      case '/':
        return '÷';
      default:
        return '+';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Math</h2>
          <p className="text-gray-600">Solve as many problems as you can in 30 seconds!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </div>
          <div className="text-sm text-gray-600">
            Correct: <span className="font-bold text-green-600">{correctCount}</span>
          </div>
          <div className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-600'}`}>
            Time: {timeLeft}s
          </div>
        </div>
      </div>

      {gameCompleted ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏱️</div>
          <h3 className="text-3xl font-bold text-blue-600 mb-2">Time's Up!</h3>
          <p className="text-xl text-gray-700 mb-2">Great job solving math problems!</p>
          <p className="text-lg text-gray-600 mb-4">
            You got <span className="font-bold text-green-600">{correctCount}</span> correct!
          </p>
          <p className="text-lg text-gray-600">
            Final Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
          <p className="text-sm text-gray-500 mt-4">You can keep playing or wait for the timer.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-8 text-center">
            <div className="flex justify-center items-center gap-4 text-4xl font-bold text-gray-800">
              <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center">
                {num1}
              </div>
              <div className="text-5xl">{getOperationSymbol(operation)}</div>
              <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center">
                {num2}
              </div>
              <div className="text-5xl">=</div>
              <div className="w-20 h-20 bg-yellow-200 border-2 border-dashed border-yellow-400 rounded-lg flex items-center justify-center">
                ?
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your answer:
              </label>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="?"
                autoFocus
              />
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-lg text-center ${
                  feedback.includes('Correct')
                    ? 'bg-green-100 border-2 border-green-500 text-green-800'
                    : 'bg-red-100 border-2 border-red-500 text-red-800'
                }`}
              >
                <p className="text-lg font-bold">{feedback}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


