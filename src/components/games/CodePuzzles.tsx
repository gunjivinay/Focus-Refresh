'use client';

import { useState } from 'react';

interface CodePuzzlesProps {
  onComplete?: () => void;
}

interface Puzzle {
  type: 'bug' | 'output';
  question: string;
  code: string;
  options: string[];
  correct: number;
}

const puzzles: Puzzle[] = [
  {
    type: 'bug',
    question: 'Find the bug in this code:',
    code: 'function add(a, b) {\n  return a + b\n}',
    options: ['Missing semicolon', 'Wrong function name', 'Missing return statement', 'No bug'],
    correct: 0,
  },
  {
    type: 'output',
    question: 'What will this code output?',
    code: 'let x = 5;\nlet y = x++;\nconsole.log(y);',
    options: ['5', '6', 'undefined', 'Error'],
    correct: 0,
  },
];

export default function CodePuzzles({ onComplete }: CodePuzzlesProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const puzzle = puzzles[currentPuzzle];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    
    setSelected(index);
    if (index === puzzle.correct) {
      setScore(prev => prev + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Wrong! The correct answer is: ${puzzle.options[puzzle.correct]}`);
    }

    setTimeout(() => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setSelected(null);
        setFeedback('');
      } else {
        setGameOver(true);
        if (onComplete) {
          setTimeout(() => onComplete(), 3000);
        }
      }
    }, 2000);
  };

  if (gameOver) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Puzzle Complete!</h3>
          <p className="text-xl text-gray-700">
            Score: <span className="font-bold text-blue-600">{score}/{puzzles.length}</span>
          </p>
        </div>
      </div>
    );
  }

  if (!puzzle) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">💻 Code Puzzles</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Puzzle: <span className="font-bold">{currentPuzzle + 1}/{puzzles.length}</span>
          </p>
          <p className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-6">
          <div>
            <p className="text-lg font-semibold text-gray-800 mb-4">{puzzle.question}</p>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 mb-4">
              <pre>{puzzle.code}</pre>
            </div>
          </div>

          <div className="space-y-3">
            {puzzle.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selected !== null}
                className={`w-full px-6 py-4 rounded-xl border-2 text-left transition-all ${
                  selected === index
                    ? index === puzzle.correct
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-red-100 border-red-500 text-red-800'
                    : selected !== null && index === puzzle.correct
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-800'
                } disabled:opacity-50`}
              >
                <span className="font-semibold">{String.fromCharCode(65 + index)}. </span>
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`rounded-xl p-4 animate-fade-in ${
              feedback.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-semibold">{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


