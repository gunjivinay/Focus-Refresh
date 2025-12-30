'use client';

import { useState, useEffect } from 'react';

interface NumberSequenceProps {
  onComplete?: () => void;
}

export default function NumberSequence({ onComplete }: NumberSequenceProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    generateSequence();
  }, [level]);

  const generateSequence = () => {
    const length = 4 + level;
    const newSequence: number[] = [];
    
    // Generate sequence with pattern (arithmetic, geometric, or fibonacci-like)
    const pattern = Math.floor(Math.random() * 3);
    
    let start = Math.floor(Math.random() * 10) + 1;
    let diff = Math.floor(Math.random() * 5) + 1;
    
    if (pattern === 0) {
      // Arithmetic sequence
      for (let i = 0; i < length; i++) {
        newSequence.push(start + i * diff);
      }
      setCorrectAnswer(start + length * diff);
    } else if (pattern === 1) {
      // Geometric-like (simplified)
      for (let i = 0; i < length; i++) {
        newSequence.push(start + i * (i + 1));
      }
      setCorrectAnswer(start + length * (length + 1));
    } else {
      // Simple addition pattern
      for (let i = 0; i < length; i++) {
        newSequence.push(start + i * diff);
      }
      setCorrectAnswer(start + length * diff);
    }
    
    setSequence(newSequence);
    setUserAnswer('');
    setFeedback('');
  };

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    
    if (answer === correctAnswer) {
      setScore(prev => prev + level * 5);
      setFeedback('Correct! ✓');
      
      if (level >= 10) {
        setGameCompleted(true);
        if (onComplete) {
          setTimeout(() => onComplete(), 1000);
        }
      } else {
        setTimeout(() => {
          setLevel(prev => prev + 1);
          generateSequence();
        }, 1000);
      }
    } else {
      setFeedback(`Wrong! The answer is ${correctAnswer}`);
      setTimeout(() => {
        generateSequence();
      }, 2000);
    }
  };

  const handleSkip = () => {
    generateSequence();
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Number Sequence</h2>
          <p className="text-gray-600">Find the pattern and complete the sequence!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </div>
          <div className="text-sm text-gray-600">
            Level: <span className="font-bold">{level}/10</span>
          </div>
        </div>
      </div>

      {gameCompleted ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-green-600 mb-2">Excellent!</h3>
          <p className="text-xl text-gray-700 mb-4">You completed all 10 levels!</p>
          <p className="text-lg text-gray-600">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
          <p className="text-sm text-gray-500 mt-4">You can keep playing or wait for the timer.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-8 text-center">
            <p className="text-sm text-gray-600 mb-4">What number comes next?</p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              {sequence.map((num, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center text-2xl font-bold text-gray-800"
                >
                  {num}
                </div>
              ))}
              <div className="w-16 h-16 bg-yellow-200 border-2 border-dashed border-yellow-400 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-600">
                ?
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the next number:
              </label>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="?"
                autoFocus
              />
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-lg text-center ${
                  feedback.includes('Correct')
                    ? 'bg-green-100 border-2 border-green-500 text-green-800'
                    : 'bg-red-100 border-2 border-red-500 text-red-800'
                }`}
              >
                <p className="text-lg font-bold">{feedback}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Submit
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-lg"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


