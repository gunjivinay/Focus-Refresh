'use client';

import { useState, useEffect } from 'react';

interface QuickWordChainProps {
  onComplete?: () => void;
}

const startingWords = ['happy', 'sun', 'book', 'water', 'light', 'time', 'love', 'music'];

export default function QuickWordChain({ onComplete }: QuickWordChainProps) {
  const [currentWord, setCurrentWord] = useState('');
  const [chain, setChain] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!currentWord) {
      const word = startingWords[Math.floor(Math.random() * startingWords.length)];
      setCurrentWord(word);
      setChain([word]);
    }
  }, []);

  useEffect(() => {
    if (currentWord && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            if (onComplete) {
              setTimeout(() => onComplete(), 3000);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, currentWord, gameOver]);

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    const input = userInput.trim().toLowerCase();
    
    // Check if word is related (simple check - starts with different letter and is not empty)
    if (input.length > 0 && input !== currentWord) {
      setChain(prev => [...prev, input]);
      setCurrentWord(input);
      setScore(prev => prev + 1);
      setUserInput('');
      setTimeLeft(5);
      setFeedback('✅ Good! Chain continues...');
      setTimeout(() => setFeedback(''), 1000);
    } else {
      setFeedback('❌ Please enter a different word!');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  if (gameOver) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Chain Ended!</h3>
          <p className="text-xl text-gray-700">
            Chain Length: <span className="font-bold text-blue-600">{chain.length}</span> words
          </p>
          <p className="text-lg text-gray-600">
            Score: <span className="font-bold text-purple-600">{score}</span>
          </p>
          <div className="bg-gray-50 rounded-xl p-4 max-w-md">
            <p className="text-sm text-gray-600 mb-2">Your chain:</p>
            <p className="text-sm font-semibold text-gray-800">{chain.join(' → ')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🔗 Quick Word Chain</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Chain: <span className="font-bold text-blue-600">{chain.length}</span>
          </p>
          <p className="text-sm text-gray-600">
            Score: <span className="font-bold text-purple-600">{score}</span>
          </p>
          <p className={`text-sm font-bold ${timeLeft <= 2 ? 'text-red-600' : 'text-gray-600'}`}>
            Time: {timeLeft}s
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-md w-full">
        <div className="text-center space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">Current word:</p>
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-4">
              <p className="text-3xl font-bold text-blue-600">{currentWord}</p>
            </div>
            <p className="text-xs text-gray-500 mb-4">Type a related word to continue the chain</p>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg font-semibold text-center text-gray-900"
              placeholder="Type a related word..."
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
            disabled={!userInput.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-bold"
          >
            Continue Chain
          </button>

          {chain.length > 1 && (
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Current chain:</p>
              <p className="text-sm font-semibold text-gray-800">{chain.join(' → ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


