'use client';

import { useState } from 'react';

interface FizzBuzzMiniProps {
  onComplete?: () => void;
}

export default function FizzBuzzMini({ onComplete }: FizzBuzzMiniProps) {
  const [userCode, setUserCode] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  const expectedOutput = Array.from({ length: 50 }, (_, i) => {
    const num = i + 1;
    if (num % 15 === 0) return 'FizzBuzz';
    if (num % 3 === 0) return 'Fizz';
    if (num % 5 === 0) return 'Buzz';
    return num.toString();
  });

  const testCode = () => {
    setError('');
    setResult([]);

    try {
      // Create a safe execution context
      const func = new Function('n', `
        ${userCode}
        return fizzBuzz ? fizzBuzz(n) : null;
      `);

      // Test with numbers 1-50
      const output: string[] = [];
      for (let i = 1; i <= 50; i++) {
        const result = func(i);
        if (result === null) {
          setError('Function not found. Please define a function called fizzBuzz(n)');
          return;
        }
        output.push(String(result));
      }

      setResult(output);

      // Check if correct
      const isCorrect = output.every((val, idx) => val === expectedOutput[idx]);
      
      if (isCorrect) {
        setCompleted(true);
        if (onComplete) {
          setTimeout(() => onComplete(), 2000);
        }
      } else {
        setError('Output doesn\'t match! Check your logic.');
      }
    } catch (err: any) {
      setError(err.message || 'Error executing code');
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Perfect!</h3>
          <p className="text-lg text-gray-600">Your FizzBuzz function works correctly!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🔢 FizzBuzz Mini</h2>
        <p className="text-sm text-gray-600">Write a function that replaces multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz"</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Write your function (1-2 lines):
            </label>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder='function fizzBuzz(n) {\n  // Your code here\n}'
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-sm text-gray-900 bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Example: if (n % 15 === 0) return "FizzBuzz";</p>
          </div>

          <button
            onClick={testCode}
            disabled={!userCode.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-bold"
          >
            🧪 Test Code
          </button>

          {error && (
            <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
              <p className="text-red-800 font-semibold">❌ {error}</p>
            </div>
          )}

          {result.length > 0 && !error && (
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Output (first 10):</p>
              <div className="font-mono text-xs text-gray-600">
                {result.slice(0, 10).join(', ')}...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


