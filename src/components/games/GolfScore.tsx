'use client';

import { useState } from 'react';

interface GolfScoreProps {
  onComplete?: () => void;
}

const testCases = [
  { par: 4, strokes: 2, expected: 'Eagle' },
  { par: 4, strokes: 3, expected: 'Birdie' },
  { par: 4, strokes: 4, expected: 'Par' },
  { par: 4, strokes: 5, expected: 'Bogey' },
  { par: 4, strokes: 6, expected: 'Double Bogey' },
  { par: 5, strokes: 3, expected: 'Eagle' },
  { par: 3, strokes: 1, expected: 'Hole-in-one!' },
];

export default function GolfScore({ onComplete }: GolfScoreProps) {
  const [userCode, setUserCode] = useState('');
  const [result, setResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [completed, setCompleted] = useState(false);

  const testCode = () => {
    if (!userCode.trim()) return;

    try {
      const func = new Function('par', 'strokes', userCode + '; return golfScore ? golfScore(par, strokes) : null;');
      
      let allPassed = true;
      testCases.forEach((testCase) => {
        const output = func(testCase.par, testCase.strokes);
        if (output !== testCase.expected) {
          allPassed = false;
        }
      });

      if (allPassed) {
        setResult({ passed: true, message: '✅ All test cases passed! Great job!' });
        setCompleted(true);
        if (onComplete) {
          setTimeout(() => onComplete(), 2000);
        }
      } else {
        setResult({ passed: false, message: '❌ Some test cases failed. Check your logic.' });
      }
    } catch (err: any) {
      setResult({ passed: false, message: `❌ Error: ${err.message}` });
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">⛳</div>
          <h3 className="text-2xl font-bold text-gray-800">Perfect Score!</h3>
          <p className="text-lg text-gray-600">Your golf score function works correctly!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">⛳ Golf Score</h2>
        <p className="text-sm text-gray-600">Write a function that calculates golf scores based on par and strokes</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-sm font-semibold text-gray-800 mb-2">Rules:</p>
            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
              <li>strokes === 1: "Hole-in-one!"</li>
              <li>strokes &lt;= par - 2: "Eagle"</li>
              <li>strokes === par - 1: "Birdie"</li>
              <li>strokes === par: "Par"</li>
              <li>strokes === par + 1: "Bogey"</li>
              <li>strokes === par + 2: "Double Bogey"</li>
              <li>strokes &gt;= par + 3: "Go Home!"</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Write your function:
            </label>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder='function golfScore(par, strokes) {\n  // Your code here\n}'
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-sm text-gray-900 bg-gray-50"
            />
          </div>

          <button
            onClick={testCode}
            disabled={!userCode.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-bold"
          >
            🧪 Test Code
          </button>

          {result && (
            <div className={`rounded-xl p-4 border-2 ${
              result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <p className={`font-semibold ${result.passed ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


