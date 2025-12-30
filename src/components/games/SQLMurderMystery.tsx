'use client';

import { useState } from 'react';

interface SQLMurderMysteryProps {
  onComplete?: () => void;
}

const database = {
  people: [
    { id: 1, name: 'Alice', age: 30, location: 'Library' },
    { id: 2, name: 'Bob', age: 25, location: 'Park' },
    { id: 3, name: 'Charlie', age: 35, location: 'Library' },
    { id: 4, name: 'Diana', age: 28, location: 'Cafe' },
    { id: 5, name: 'Eve', age: 32, location: 'Library' },
  ],
  events: [
    { id: 1, person_id: 1, event: 'Seen at Library', time: '10:00' },
    { id: 2, person_id: 3, event: 'Left Library', time: '11:00' },
    { id: 3, person_id: 5, event: 'At Library', time: '11:30' },
  ],
};

const questions = [
  {
    question: 'Who was at the Library?',
    correctAnswers: ['Alice', 'Charlie', 'Eve'],
    hint: 'Look for location = "Library"',
  },
  {
    question: 'Find people older than 30',
    correctAnswers: ['Charlie', 'Eve'],
    hint: 'Check the age column',
  },
];

export default function SQLMurderMystery({ onComplete }: SQLMurderMysteryProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];

  const togglePerson = (name: string) => {
    setSelectedPeople(prev => 
      prev.includes(name) 
        ? prev.filter(p => p !== name)
        : [...prev, name]
    );
  };

  const checkAnswer = () => {
    const selectedSet = new Set(selectedPeople.sort());
    const correctSet = new Set(question.correctAnswers.sort());
    
    const isCorrect = selectedSet.size === correctSet.size && 
      [...selectedSet].every(name => correctSet.has(name));

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('✅ Correct!');
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedPeople([]);
          setFeedback('');
        } else {
          setCompleted(true);
          if (onComplete) {
            setTimeout(() => onComplete(), 2000);
          }
        }
      }, 2000);
    } else {
      setFeedback('❌ Not quite right. Try again!');
    }
  };

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800">Mystery Solved!</h3>
          <p className="text-lg text-gray-600">Score: {score}/{questions.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🔍 SQL Murder Mystery</h2>
        <p className="text-sm text-gray-600">Question {currentQuestion + 1}/{questions.length}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-6">
          <div>
            <p className="font-semibold text-gray-800 mb-4 text-lg">{question.question}</p>
            <p className="text-sm text-gray-500 italic mb-4">💡 {question.hint}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Database:</p>
              <div className="space-y-2 text-xs">
                {database.people.map((person) => (
                  <div key={person.id} className="flex gap-4">
                    <span className="font-mono">{person.name}</span>
                    <span className="text-gray-600">Age: {person.age}</span>
                    <span className="text-gray-600">Location: {person.location}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Select the correct people:</p>
            <div className="grid grid-cols-2 gap-3">
              {database.people.map((person) => {
                const isSelected = selectedPeople.includes(person.name);
                return (
                  <button
                    key={person.id}
                    onClick={() => togglePerson(person.name)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-800'
                    }`}
                  >
                    <div className="font-semibold">{person.name}</div>
                    <div className="text-xs text-gray-600">Age: {person.age}, Location: {person.location}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={checkAnswer}
            disabled={selectedPeople.length === 0}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-bold"
          >
            🔍 Check Answer
          </button>

          {feedback && (
            <div className={`rounded-xl p-4 ${
              feedback.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <p className="font-semibold">{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
