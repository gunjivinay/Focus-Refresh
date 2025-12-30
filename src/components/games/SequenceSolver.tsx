'use client';

import { useState, useEffect } from 'react';

interface SequenceSolverProps {
  onComplete?: () => void;
}

export default function SequenceSolver({ onComplete }: SequenceSolverProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);

  const maxRounds = 10;

  useEffect(() => {
    if (round >= maxRounds) {
      setCompleted(true);
      if (onComplete) setTimeout(() => onComplete(), 1000);
      return;
    }
    generateSequence();
  }, [round]);

  const generateSequence = () => {
    const patterns = [
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        const diff = Math.floor(Math.random() * 5) + 1;
        return [start, start + diff, start + diff * 2, start + diff * 3, start + diff * 4];
      },
      () => {
        const start = Math.floor(Math.random() * 5) + 1;
        const mult = Math.floor(Math.random() * 3) + 2;
        return [start, start * mult, start * mult * mult, start * mult * mult * mult];
      },
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        return [start, start + 1, start + 3, start + 6, start + 10];
      },
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const seq = pattern();
    setSequence(seq.slice(0, 4));
    setUserAnswer('');
    setFeedback('');
  };

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    const correct = sequence[3] + (sequence[3] - sequence[2]);
    
    if (answer === correct) {
      setScore(prev => prev + 15);
      setFeedback('Correct! ✓');
      setTimeout(() => {
        setRound(prev => prev + 1);
        setFeedback('');
      }, 1000);
    } else {
      setFeedback(`Wrong! The answer is ${correct}`);
      setTimeout(() => {
        setRound(prev => prev + 1);
        setFeedback('');
      }, 2000);
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Sequence Master!</h3>
          <p className="text-gray-700">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🔢 Sequence Solver</h2>
          <p className="text-sm text-gray-600">Find the pattern and complete the sequence</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">Round: <span className="font-bold">{round + 1}/{maxRounds}</span></div>
          <div className="text-sm text-gray-600">Score: <span className="font-bold text-blue-600">{score}</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-300">
          <p className="text-sm text-gray-600 mb-4 text-center">What number comes next?</p>
          <div className="flex justify-center gap-3">
            {sequence.map((num, idx) => (
              <div key={idx} className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center text-2xl font-bold text-gray-800">
                {num}
              </div>
            ))}
            <div className="w-16 h-16 bg-yellow-200 border-2 border-dashed border-yellow-400 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-600">
              ?
            </div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="?"
            autoFocus
          />

          {feedback && (
            <div className={`p-4 rounded-xl text-center ${
              feedback.includes('Correct')
                ? 'bg-green-100 border-2 border-green-500 text-green-800'
                : 'bg-red-100 border-2 border-red-500 text-red-800'
            }`}>
              <p className="font-bold text-lg">{feedback}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold text-lg"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}


