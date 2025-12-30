'use client';

import { useState } from 'react';

interface PredictOutputProps {
  onComplete?: () => void;
}

const snippets = [
  {
    code: 'let x = 5;\nlet y = x++;\nconsole.log(y);',
    options: ['5', '6', 'undefined', 'Error'],
    correct: 0,
  },
  {
    code: 'const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);',
    options: ['3', '4', '5', 'Error'],
    correct: 1,
  },
  {
    code: 'console.log("5" + 3);',
    options: ['8', '53', 'undefined', 'Error'],
    correct: 1,
  },
  {
    code: 'let a = true;\nlet b = false;\nconsole.log(a && b);',
    options: ['true', 'false', 'undefined', 'Error'],
    correct: 1,
  },
  {
    code: 'for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}',
    options: ['0, 1, 2', '3, 3, 3', 'undefined', 'Error'],
    correct: 0,
  },
];

export default function PredictOutput({ onComplete }: PredictOutputProps) {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);

  const snippet = snippets[currentSnippet];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    if (index === snippet.correct) {
      setScore(prev => prev + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Wrong! The correct answer is: ${snippet.options[snippet.correct]}`);
    }

    setTimeout(() => {
      if (currentSnippet < snippets.length - 1) {
        setCurrentSnippet(prev => prev + 1);
        setSelectedAnswer(null);
        setFeedback('');
      } else {
        setCompleted(true);
        if (onComplete) {
          setTimeout(() => onComplete(), 2000);
        }
      }
    }, 2000);
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Quiz Complete!</h3>
          <p className="text-xl text-gray-700">
            Score: <span className="font-bold text-blue-600">{score}/{snippets.length}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🔮 Predict Output</h2>
        <p className="text-sm text-gray-600">
          Question {currentSnippet + 1}/{snippets.length} | Score: {score}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">What will this code output?</p>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
              <pre className="whitespace-pre-wrap">{snippet.code}</pre>
            </div>
          </div>

          <div className="space-y-3">
            {snippet.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full px-6 py-4 rounded-xl border-2 text-left transition-all ${
                  selectedAnswer === index
                    ? index === snippet.correct
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-red-100 border-red-500 text-red-800'
                    : selectedAnswer !== null && index === snippet.correct
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


