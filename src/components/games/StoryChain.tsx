'use client';

import { useState, useEffect } from 'react';

interface StoryChainProps {
  onComplete?: () => void;
}

const firstSentences = [
  'Once upon a time, there was a magical cat.',
  'In a faraway land, a brave knight set out on a quest.',
  'The old wizard discovered a mysterious book.',
  'A tiny robot found itself in a human world.',
];

export default function StoryChain({ onComplete }: StoryChainProps) {
  const [firstSentence, setFirstSentence] = useState('');
  const [userSentences, setUserSentences] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [storyComplete, setStoryComplete] = useState(false);

  useEffect(() => {
    if (!firstSentence) {
      const random = firstSentences[Math.floor(Math.random() * firstSentences.length)];
      setFirstSentence(random);
    }
  }, [firstSentence]);

  const handleAddSentence = () => {
    if (currentInput.trim() && userSentences.length < 5) {
      setUserSentences(prev => {
        const newSentences = [...prev, currentInput.trim()];
        if (newSentences.length >= 5) {
          setStoryComplete(true);
          if (onComplete) {
            setTimeout(() => onComplete(), 3000);
          }
        }
        return newSentences;
      });
      setCurrentInput('');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">📖 Story Chain</h2>
        <p className="text-sm text-gray-600">
          Sentences: <span className="font-bold text-blue-600">{userSentences.length}/5</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-gray-800 font-medium">{firstSentence}</p>
          </div>

          {userSentences.map((sentence, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 animate-fade-in">
              <p className="text-gray-800">{sentence}</p>
            </div>
          ))}

          {!storyComplete && (
            <div>
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Add your sentence to continue the story..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 resize-none"
                rows={3}
              />
              <button
                onClick={handleAddSentence}
                disabled={!currentInput.trim()}
                className="mt-3 w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-bold"
              >
                Add Sentence
              </button>
            </div>
          )}

          {storyComplete && (
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 animate-fade-in">
              <p className="text-lg font-semibold text-green-800">🎉 Story Complete!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

