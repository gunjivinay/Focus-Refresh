'use client';

import { useState, useEffect } from 'react';

interface TriviaQuizProps {
  onComplete?: () => void;
}

interface Question {
  question: string;
  options: string[];
  correct: number;
  category: string;
}

const questions: Question[] = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct: 2,
    category: 'General Knowledge',
  },
  {
    question: 'Which programming language is known as the "language of the web"?',
    options: ['Python', 'Java', 'JavaScript', 'C++'],
    correct: 2,
    category: 'Tech',
  },
  {
    question: 'What does CPU stand for?',
    options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Computer Processing Unit'],
    correct: 0,
    category: 'Tech',
  },
  {
    question: 'How many continents are there?',
    options: ['5', '6', '7', '8'],
    correct: 2,
    category: 'General Knowledge',
  },
  {
    question: 'What is the largest planet in our solar system?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correct: 2,
    category: 'General Knowledge',
  },
  {
    question: 'In programming, what does API stand for?',
    options: ['Application Programming Interface', 'Advanced Program Integration', 'Automated Program Interface', 'Application Process Integration'],
    correct: 0,
    category: 'Tech',
  },
  {
    question: 'What is 2 + 2 × 2?',
    options: ['6', '8', '4', '10'],
    correct: 0,
    category: 'Brain Teaser',
  },
  {
    question: 'Which browser engine does Chrome use?',
    options: ['Gecko', 'WebKit', 'Blink', 'Trident'],
    correct: 2,
    category: 'Tech',
  },
];

export default function TriviaQuiz({ onComplete }: TriviaQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const question = questions[currentQuestion];

  useEffect(() => {
    if (currentQuestion >= questions.length) {
      setGameOver(true);
      if (onComplete) {
        setTimeout(() => onComplete(), 3000);
      }
    }
  }, [currentQuestion]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    if (index === question.correct) {
      setScore(prev => prev + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Wrong! The correct answer is: ${question.options[question.correct]}`);
    }

    setTimeout(() => {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setFeedback('');
    }, 2000);
  };

  if (gameOver) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Quiz Complete!</h3>
          <p className="text-xl text-gray-700">
            Final Score: <span className="font-bold text-blue-600">{score}/{questions.length}</span>
          </p>
          <p className="text-lg text-gray-600">
            Accuracy: <span className="font-bold text-purple-600">{Math.round((score / questions.length) * 100)}%</span>
          </p>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🧠 Quick Trivia Quiz</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Question: <span className="font-bold">{currentQuestion + 1}/{questions.length}</span>
          </p>
          <p className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </p>
        </div>
        <p className="text-xs text-gray-500">Category: {question.category}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-6">
          <div>
            <p className="text-xl font-semibold text-gray-800 mb-6">{question.question}</p>
          </div>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full px-6 py-4 rounded-xl border-2 text-left transition-all ${
                  selectedAnswer === index
                    ? index === question.correct
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-red-100 border-red-500 text-red-800'
                    : selectedAnswer !== null && index === question.correct
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-800'
                } disabled:opacity-50`}
              >
                <span className="font-semibold">{String.fromCharCode(65 + index)}. </span>
                {option}
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


