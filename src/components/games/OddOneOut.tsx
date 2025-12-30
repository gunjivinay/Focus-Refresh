'use client';

import { useState, useEffect } from 'react';

interface OddOneOutProps {
  onComplete?: () => void;
}

interface Question {
  words: string[];
  oddIndex: number;
  category: string;
}

const questions: Question[] = [
  { words: ['cat', 'dog', 'bird', 'car'], oddIndex: 3, category: 'Animals' },
  { words: ['apple', 'banana', 'orange', 'book'], oddIndex: 3, category: 'Fruits' },
  { words: ['red', 'blue', 'green', 'happy'], oddIndex: 3, category: 'Colors' },
  { words: ['chair', 'table', 'sofa', 'cloud'], oddIndex: 3, category: 'Furniture' },
  { words: ['guitar', 'piano', 'violin', 'bicycle'], oddIndex: 3, category: 'Musical Instruments' },
  { words: ['sun', 'moon', 'star', 'computer'], oddIndex: 3, category: 'Celestial Bodies' },
  { words: ['ocean', 'river', 'lake', 'mountain'], oddIndex: 3, category: 'Water Bodies' },
  { words: ['doctor', 'teacher', 'engineer', 'pizza'], oddIndex: 3, category: 'Professions' },
];

export default function OddOneOut({ onComplete }: OddOneOutProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [gameOver, setGameOver] = useState(false);
  const maxRounds = 8;

  const currentQuestion = questions[round];

  useEffect(() => {
    if (round >= maxRounds) {
      setGameOver(true);
      if (onComplete) {
        setTimeout(() => onComplete(), 3000);
      }
    }
  }, [round]);

  const handleSelect = (index: number) => {
    if (selectedIndex !== null) return;
    
    setSelectedIndex(index);
    if (index === currentQuestion.oddIndex) {
      setScore(prev => prev + 1);
      setFeedback('✅ Correct! Well done!');
    } else {
      setFeedback(`❌ Wrong! The odd one out was "${currentQuestion.words[currentQuestion.oddIndex]}"`);
    }

    setTimeout(() => {
      setRound(prev => prev + 1);
      setSelectedIndex(null);
      setFeedback('');
    }, 2000);
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

  if (!currentQuestion) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🔍 Odd One Out</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Round: <span className="font-bold">{round + 1}/{maxRounds}</span>
          </p>
          <p className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-2">Category: {currentQuestion.category}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-2xl w-full">
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-700 font-semibold mb-4">
            Find the word that doesn't belong:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.words.map((word, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={selectedIndex !== null}
                className={`px-6 py-8 rounded-xl border-2 transition-all font-bold text-xl ${
                  selectedIndex === index
                    ? index === currentQuestion.oddIndex
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-red-100 border-red-500 text-red-800'
                    : selectedIndex !== null && index === currentQuestion.oddIndex
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-800'
                } disabled:opacity-50`}
              >
                {word}
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


