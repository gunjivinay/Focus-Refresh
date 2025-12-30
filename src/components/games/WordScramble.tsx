'use client';

import { useState, useEffect } from 'react';

interface WordScrambleProps {
  onComplete?: () => void;
}

const wordCategories = {
  tech: ['javascript', 'computer', 'algorithm', 'database', 'network', 'software', 'hardware', 'internet'],
  school: ['teacher', 'student', 'classroom', 'homework', 'library', 'science', 'history', 'mathematics'],
  fruits: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'watermelon', 'pineapple', 'mango'],
};

type Category = keyof typeof wordCategories;

export default function WordScramble({ onComplete }: WordScrambleProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const maxRounds = 8;

  const scrambleWord = (word: string): string => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  useEffect(() => {
    if (category && round < maxRounds && !gameOver) {
      const words = wordCategories[category];
      const word = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(word);
      setScrambledWord(scrambleWord(word));
      setUserAnswer('');
      setTimeLeft(30);
      setFeedback('');

      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setFeedback('⏰ Time\'s up!');
            setTimeout(() => {
              setRound(prev => prev + 1);
            }, 1500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (round >= maxRounds) {
      setGameOver(true);
      if (onComplete) {
        setTimeout(() => onComplete(), 3000);
      }
    }
  }, [category, round, gameOver]);

  const handleSubmit = () => {
    if (userAnswer.toLowerCase() === currentWord.toLowerCase()) {
      setScore(prev => prev + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Wrong! The word was "${currentWord}"`);
    }

    setTimeout(() => {
      setRound(prev => prev + 1);
    }, 1500);
  };

  if (!category) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🔤</div>
          <h2 className="text-3xl font-bold text-gray-800">Word Scramble</h2>
          <p className="text-gray-600">Choose a category</p>
        </div>
        <div className="flex flex-col gap-3">
          {Object.keys(wordCategories).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat as Category)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg capitalize"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

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

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🔤 Word Scramble</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Round: <span className="font-bold">{round + 1}/{maxRounds}</span>
          </p>
          <p className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
          <p className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-gray-600'}`}>
            Time: {timeLeft}s
          </p>
        </div>
        <p className="text-xs text-gray-500">Category: {category}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-md w-full">
        <div className="text-center space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">Unscramble this word:</p>
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-4">
              <p className="text-4xl font-bold text-gray-900 tracking-wider">{scrambledWord}</p>
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-xl font-semibold text-center text-gray-900"
              placeholder="Type your answer..."
              autoFocus
            />
          </div>

          {feedback && (
            <div className={`rounded-xl p-4 animate-fade-in ${
              feedback.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-semibold">{feedback}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!userAnswer}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-bold"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}


