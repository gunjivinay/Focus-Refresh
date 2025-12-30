'use client';

import { useState } from 'react';

interface CodeGolfBasicsProps {
  onComplete?: () => void;
}

const challenges = [
  {
    id: 1,
    task: 'Reverse a string',
    example: 'reverseString("hello") → "olleh"',
    testCases: [
      { input: 'hello', expected: 'olleh' },
      { input: 'world', expected: 'dlrow' },
      { input: 'code', expected: 'edoc' },
    ],
  },
  {
    id: 2,
    task: 'Check if palindrome',
    example: 'isPalindrome("racecar") → true',
    testCases: [
      { input: 'racecar', expected: true },
      { input: 'hello', expected: false },
      { input: 'level', expected: true },
    ],
  },
];

export default function CodeGolfBasics({ onComplete }: CodeGolfBasicsProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [result, setResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenge = challenges[currentChallenge];

  const testCode = () => {
    if (!userCode.trim()) return;

    const codeLength = userCode.replace(/\s/g, '').length;
    setCharCount(codeLength);

    try {
      let allPassed = true;
      const func = new Function('str', userCode + '; return reverseString ? reverseString(str) : isPalindrome ? isPalindrome(str) : null;');

      challenge.testCases.forEach((testCase) => {
        const output = func(testCase.input);
        if (output !== testCase.expected) {
          allPassed = false;
        }
      });

      if (allPassed) {
        setResult({ passed: true, message: `✅ All tests passed! Code length: ${codeLength} chars` });
        setScore(prev => prev + (1000 - codeLength));
        
        if (currentChallenge < challenges.length - 1) {
          setTimeout(() => {
            setCurrentChallenge(prev => prev + 1);
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
        setResult({ passed: false, message: '❌ Tests failed. Check your logic.' });
      }
    } catch (err: any) {
      setResult({ passed: false, message: `❌ Error: ${err.message}` });
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-gray-800">Code Golf Complete!</h3>
          <p className="text-lg text-gray-600">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">⛳ Code Golf Basics</h2>
        <p className="text-sm text-gray-600">Challenge {currentChallenge + 1}/{challenges.length}</p>
        <p className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{challenge.task}</h3>
            <p className="text-sm text-gray-600 mb-4">{challenge.example}</p>
            <p className="text-xs text-gray-500">Goal: Write the shortest code possible!</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your code (minimize characters):
            </label>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder='function reverseString(str) { return str.split("").reverse().join(""); }'
              className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-sm text-gray-900 bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Character count: {userCode.replace(/\s/g, '').length}</p>
          </div>

          <button
            onClick={testCode}
            disabled={!userCode.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-bold"
          >
            🧪 Test & Submit
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


