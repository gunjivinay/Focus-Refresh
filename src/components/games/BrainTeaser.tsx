'use client';

import { useState, useEffect } from 'react';

interface BrainTeaserProps {
  onComplete?: () => void;
}

interface Teaser {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const teasers: Teaser[] = [
  {
    id: 1,
    question: 'If you have 3 apples and you take away 2, how many do you have?',
    options: ['1 apple', '2 apples', '3 apples', '5 apples'],
    correct: 0,
    explanation: 'You took away 2, so you have 2 apples now!',
    difficulty: 'easy',
  },
  {
    id: 2,
    question: 'A man is looking at a photograph. Someone asks him, "Who is that?" He replies, "Brothers and sisters I have none, but that man\'s father is my father\'s son." Who is in the photograph?',
    options: ['His son', 'His father', 'His brother', 'Himself'],
    correct: 0,
    explanation: 'The man\'s father\'s son is himself, so the person in the photo is his son.',
    difficulty: 'medium',
  },
  {
    id: 3,
    question: 'What comes next in the sequence: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '50'],
    correct: 1,
    explanation: 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, so 6×7=42',
    difficulty: 'medium',
  },
  {
    id: 4,
    question: 'You are in a room with 3 switches. One controls a light in another room. You can only enter that room once. How do you determine which switch controls the light?',
    options: [
      'Turn on switch 1, wait 5 min, turn it off. Turn on switch 2, enter room.',
      'Turn on all switches, enter room.',
      'Turn on switch 1, enter room immediately.',
      'Flip switches randomly.',
    ],
    correct: 0,
    explanation: 'Turn on switch 1, wait (bulb heats up), turn off. Turn on switch 2, enter. If light is on = switch 2. If off but warm = switch 1. If off and cold = switch 3.',
    difficulty: 'hard',
  },
  {
    id: 5,
    question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    options: ['An echo', 'A shadow', 'A thought', 'A dream'],
    correct: 0,
    explanation: 'An echo speaks (repeats) without a mouth and hears (responds to) without ears, and is created by wind/sound waves.',
    difficulty: 'easy',
  },
];

export default function BrainTeaser({ onComplete }: BrainTeaserProps) {
  const [currentTeaser, setCurrentTeaser] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [teasersSolved, setTeasersSolved] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const teaser = teasers[currentTeaser % teasers.length];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === teaser.correct) {
      setScore(prev => prev + (teaser.difficulty === 'easy' ? 10 : teaser.difficulty === 'medium' ? 20 : 30));
      setShowExplanation(true);
      
      setTimeout(() => {
        setTeasersSolved(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            setGameCompleted(true);
            if (onComplete) {
              setTimeout(() => onComplete(), 1000);
            }
          } else {
            setCurrentTeaser(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
          }
          return newCount;
        });
      }, 2000);
    } else {
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    setCurrentTeaser(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🧠 Brain Teaser</h2>
          <p className="text-gray-600">Challenge your logical thinking and problem-solving skills!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </div>
          <div className="text-sm text-gray-600">
            Solved: <span className="font-bold">{teasersSolved}/5</span>
          </div>
          <div className="text-sm text-gray-600">
            Difficulty: <span className="font-bold capitalize">{teaser.difficulty}</span>
          </div>
        </div>
      </div>

      {gameCompleted ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-green-600 mb-2">Brilliant Mind!</h3>
            <p className="text-xl text-gray-700 mb-4">You solved 5 brain teasers!</p>
            <p className="text-lg text-gray-600">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
            <p className="text-sm text-gray-500 mt-4">Your brain is sharp! Keep playing or wait for the timer.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center space-y-4 overflow-y-auto">
          {/* Question Card */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 md:p-6 border-2 border-purple-300">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                teaser.difficulty === 'easy' ? 'bg-green-200 text-green-800' :
                teaser.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-red-200 text-red-800'
              }`}>
                {teaser.difficulty.toUpperCase()}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{teaser.question}</h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {teaser.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`
                  w-full p-4 rounded-xl text-left transition-all
                  ${selectedAnswer === index
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }
                  ${showExplanation && index === teaser.correct
                    ? 'bg-green-500 text-white border-green-600'
                    : ''
                  }
                  ${showExplanation && selectedAnswer === index && index !== teaser.correct
                    ? 'bg-red-500 text-white border-red-600'
                    : ''
                  }
                  disabled:opacity-75 disabled:cursor-not-allowed
                  font-medium text-lg
                `}
              >
                <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-6 rounded-xl ${
              selectedAnswer === teaser.correct
                ? 'bg-green-100 border-2 border-green-500'
                : 'bg-yellow-100 border-2 border-yellow-500'
            }`}>
              <p className="font-bold text-lg mb-2">
                {selectedAnswer === teaser.correct ? '✓ Correct!' : '✗ Not quite right'}
              </p>
              <p className="text-gray-700">{teaser.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || showExplanation}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg"
            >
              Submit Answer
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-lg"
            >
              Skip Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

