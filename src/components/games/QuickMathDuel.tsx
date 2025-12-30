'use client';

import { useState, useEffect } from 'react';

interface QuickMathDuelProps {
  onComplete?: () => void;
}

type ProblemType = 'addition' | 'subtraction' | 'multiplication' | 'comparison';

interface Problem {
  type: ProblemType;
  a: number;
  b: number;
  answer?: number;
  correctAnswer: number | boolean;
}

export default function QuickMathDuel({ onComplete }: QuickMathDuelProps) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [gameOver, setGameOver] = useState(false);
  const maxRounds = 10;

  const generateProblem = (): Problem => {
    const types: ProblemType[] = ['addition', 'subtraction', 'multiplication', 'comparison'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'comparison') {
      const a = Math.floor(Math.random() * 50) + 1;
      const b = Math.floor(Math.random() * 50) + 1;
      return {
        type,
        a,
        b,
        correctAnswer: a > b,
      };
    } else {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = type === 'multiplication' 
        ? Math.floor(Math.random() * 10) + 1 
        : Math.floor(Math.random() * 20) + 1;
      
      let answer = 0;
      if (type === 'addition') answer = a + b;
      else if (type === 'subtraction') answer = Math.max(a, b) - Math.min(a, b);
      else answer = a * b;

      return {
        type,
        a: type === 'subtraction' ? Math.max(a, b) : a,
        b: type === 'subtraction' ? Math.min(a, b) : b,
        answer,
        correctAnswer: answer,
      };
    }
  };

  useEffect(() => {
    if (round >= maxRounds) {
      setGameOver(true);
      if (onComplete) {
        setTimeout(() => onComplete(), 3000);
      }
      return;
    }

    const newProblem = generateProblem();
    setProblem(newProblem);
    setTimeLeft(3);
    setUserAnswer('');
    setFeedback('');

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFeedback('⏰ Time\'s up!');
          setTimeout(() => {
            setRound(prev => prev + 1);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [round]);

  const handleSubmit = () => {
    if (!problem || !userAnswer) return;

    let isCorrect = false;
    if (problem.type === 'comparison') {
      const userChoice = userAnswer.toLowerCase() === 'a' || userAnswer.toLowerCase() === 'bigger';
      isCorrect = userChoice === problem.correctAnswer;
    } else {
      isCorrect = parseInt(userAnswer) === problem.correctAnswer;
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Wrong! The answer was ${problem.type === 'comparison' ? (problem.correctAnswer ? 'A is bigger' : 'B is bigger') : problem.correctAnswer}`);
    }

    setTimeout(() => {
      setRound(prev => prev + 1);
    }, 1500);
  };

  if (gameOver) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Game Over!</h3>
          <p className="text-xl text-gray-700">
            Final Score: <span className="font-bold text-blue-600">{score}/{maxRounds}</span>
          </p>
          <p className="text-lg text-gray-600">
            Accuracy: <span className="font-bold text-purple-600">{Math.round((score / maxRounds) * 100)}%</span>
          </p>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">⚡ Quick Math Duel</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Round: <span className="font-bold">{round + 1}/{maxRounds}</span>
          </p>
          <p className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
          <p className={`text-sm font-bold ${timeLeft <= 1 ? 'text-red-600' : 'text-gray-600'}`}>
            Time: {timeLeft}s
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-md w-full">
        <div className="text-center space-y-6">
          {problem.type === 'comparison' ? (
            <div>
              <p className="text-lg text-gray-600 mb-4">Which is bigger?</p>
              <div className="flex items-center justify-center gap-4">
                <div className="px-6 py-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <p className="text-3xl font-bold text-blue-600">A: {problem.a}</p>
                </div>
                <span className="text-2xl text-gray-400">VS</span>
                <div className="px-6 py-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <p className="text-3xl font-bold text-purple-600">B: {problem.b}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-6 justify-center">
                <button
                  onClick={() => setUserAnswer('A')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
                >
                  A is Bigger
                </button>
                <button
                  onClick={() => setUserAnswer('B')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold"
                >
                  B is Bigger
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-4xl font-bold text-gray-800 mb-4">
                {problem.a} {problem.type === 'addition' ? '+' : problem.type === 'subtraction' ? '-' : '×'} {problem.b} = ?
              </p>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-2xl font-bold text-center text-gray-900"
                autoFocus
              />
            </div>
          )}

          {feedback && (
            <div className={`rounded-xl p-4 animate-fade-in ${
              feedback.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-semibold">{feedback}</p>
            </div>
          )}

          {problem.type !== 'comparison' && userAnswer && !feedback && (
            <button
              onClick={handleSubmit}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold"
            >
              Submit Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


