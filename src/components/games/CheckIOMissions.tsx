'use client';

import { useState } from 'react';

interface CheckIOMissionsProps {
  onComplete?: () => void;
}

const missions = [
  {
    title: 'Sort Numbers',
    description: 'Sort an array of numbers in ascending order',
    testCases: [
      { input: [3, 1, 4, 2], expected: [1, 2, 3, 4] },
      { input: [5, 2, 8, 1], expected: [1, 2, 5, 8] },
    ],
  },
  {
    title: 'Find Median',
    description: 'Find the median of an array of numbers',
    testCases: [
      { input: [1, 3, 2], expected: 2 },
      { input: [1, 2, 3, 4], expected: 2.5 },
    ],
  },
];

export default function CheckIOMissions({ onComplete }: CheckIOMissionsProps) {
  const [currentMission, setCurrentMission] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [result, setResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [completed, setCompleted] = useState(false);

  const testCode = () => {
    try {
      const mission = missions[currentMission];
      const func = new Function('arr', userCode + '; return sortNumbers ? sortNumbers(arr) : findMedian ? findMedian(arr) : null;');
      
      let allPassed = true;
      mission.testCases.forEach((testCase) => {
        const output = func(testCase.input);
        const outputStr = JSON.stringify(output);
        const expectedStr = JSON.stringify(testCase.expected);
        if (outputStr !== expectedStr) {
          allPassed = false;
        }
      });

      if (allPassed) {
        setResult({ passed: true, message: '✅ Mission complete!' });
        if (currentMission < missions.length - 1) {
          setTimeout(() => {
            setCurrentMission(prev => prev + 1);
            setUserCode('');
            setResult(null);
          }, 2000);
        } else {
          setCompleted(true);
          if (onComplete) {
            setTimeout(() => onComplete(), 2000);
          }
        }
      } else {
        setResult({ passed: false, message: '❌ Mission failed. Try again!' });
      }
    } catch (err: any) {
      setResult({ passed: false, message: `❌ Error: ${err.message}` });
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🏝️</div>
          <h3 className="text-2xl font-bold text-gray-800">All Missions Complete!</h3>
        </div>
      </div>
    );
  }

  const mission = missions[currentMission];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🏝️ CheckiO Missions</h2>
        <p className="text-sm text-gray-600">Mission {currentMission + 1}/{missions.length}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{mission.title}</h3>
            <p className="text-sm text-gray-600">{mission.description}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Write your solution:</label>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="function sortNumbers(arr) { return arr.sort((a, b) => a - b); }"
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-sm text-gray-900 bg-gray-50"
            />
          </div>

          <button
            onClick={testCode}
            disabled={!userCode.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-bold"
          >
            ✅ Submit Solution
          </button>

          {result && (
            <div className={`rounded-xl p-4 ${
              result.passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <p className="font-semibold">{result.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


