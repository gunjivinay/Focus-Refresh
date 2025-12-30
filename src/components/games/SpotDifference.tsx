'use client';

import { useState } from 'react';

interface SpotDifferenceProps {
  onComplete?: () => void;
}

export default function SpotDifference({ onComplete }: SpotDifferenceProps) {
  const [found, setFound] = useState(0);
  const [differences, setDifferences] = useState<number[]>([]);
  const totalDifferences = 5;

  const handleClick = (index: number) => {
    if (differences.includes(index)) return;
    
    setDifferences(prev => [...prev, index]);
    setFound(prev => {
      const newFound = prev + 1;
      if (newFound >= totalDifferences) {
        if (onComplete) {
          setTimeout(() => onComplete(), 2000);
        }
      }
      return newFound;
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">👁️ Spot the Difference</h2>
        <p className="text-sm text-gray-600">
          Found: <span className="font-bold text-blue-600">{found}/{totalDifferences}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-blue-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border-2 border-gray-300 relative">
              {/* Simulated differences - in real game these would be images */}
              {[1, 2, 3, 4, 5].map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleClick(diff)}
                  className={`absolute w-8 h-8 rounded-full border-2 ${
                    differences.includes(diff)
                      ? 'bg-green-500 border-green-700'
                      : 'bg-red-500 border-red-700 opacity-50 hover:opacity-100'
                  }`}
                  style={{
                    top: `${20 + diff * 15}%`,
                    left: `${15 + diff * 12}%`,
                  }}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">Image 1</p>
          </div>
          <div className="relative">
            <div className="w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg border-2 border-gray-300 relative">
              {/* Same differences in slightly different positions */}
              {[1, 2, 3, 4, 5].map((diff) => (
                <div
                  key={diff}
                  className={`absolute w-8 h-8 rounded-full border-2 ${
                    differences.includes(diff)
                      ? 'bg-green-500 border-green-700'
                      : 'bg-transparent border-transparent'
                  }`}
                  style={{
                    top: `${22 + diff * 14}%`,
                    left: `${17 + diff * 10}%`,
                  }}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">Image 2</p>
          </div>
        </div>
      </div>

      {found >= totalDifferences && (
        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 animate-fade-in">
          <p className="text-lg font-semibold text-green-800">🎉 All differences found!</p>
        </div>
      )}
    </div>
  );
}


