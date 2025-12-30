'use client';

import { useState } from 'react';

interface LeetCodeBitesProps {
  onComplete?: () => void;
}

const problems = [
  {
    title: 'Two Sum',
    description: 'Given an array of numbers and a target, find two numbers that add up to the target.',
    example: 'Input: [2, 7, 11, 15], target = 9\nOutput: [0, 1]',
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
    ],
  },
];

export default function LeetCodeBites({ onComplete }: LeetCodeBitesProps) {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [result, setResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [completed, setCompleted] = useState(false);

  const testCode = () => {
    try {
      const problem = problems[currentProblem];
      const func = new Function('nums', 'target', userCode + '; return twoSum ? twoSum(nums, target) : null;');
      
      let allPassed = true;
      problem.testCases.forEach((testCase) => {
        const output = func(testCase.input.nums, testCase.input.target);
        const outputStr = JSON.stringify(output?.sort());
        const expectedStr = JSON.stringify(testCase.expected.sort());
        if (outputStr !== expectedStr) {
          allPassed = false;
        }
      });

      if (allPassed) {
        setResult({ passed: true, message: '✅ All test cases passed!' });
        setCompleted(true);
        if (onComplete) {
          setTimeout(() => onComplete(), 2000);
        }
      } else {
        setResult({ passed: false, message: '❌ Some test cases failed' });
      }
    } catch (err: any) {
      setResult({ passed: false, message: `❌ Error: ${err.message}` });
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">💻</div>
          <h3 className="text-2xl font-bold text-gray-800">Problem Solved!</h3>
        </div>
      </div>
    );
  }

  const problem = problems[currentProblem];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">💻 LeetCode Easy Bites</h2>
        <p className="text-sm text-gray-600">Problem {currentProblem + 1}/{problems.length}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{problem.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{problem.description}</p>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700">
              <pre className="whitespace-pre-wrap">{problem.example}</pre>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Write your solution:</label>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="function twoSum(nums, target) {\n  // Your code here\n}"
              className="w-full h-40 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-sm text-gray-900 bg-gray-50"
            />
          </div>

          <button
            onClick={testCode}
            disabled={!userCode.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-bold"
          >
            🧪 Run Tests
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


