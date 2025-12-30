'use client';

import { useState, useEffect } from 'react';

interface PhysicalChallengeProps {
  onComplete?: () => void;
}

const activities = [
  { name: 'Jumping Jacks', count: 20, emoji: '🤸' },
  { name: 'Desk Stretch', duration: 60, emoji: '🧘' },
  { name: 'Walk Steps', count: 100, emoji: '🚶' },
];

export default function PhysicalChallenge({ onComplete }: PhysicalChallengeProps) {
  const [activity, setActivity] = useState<string | null>(null);
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (currentActivity && 'duration' in currentActivity && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCompleted(true);
            if (onComplete) {
              setTimeout(() => onComplete(), 3000);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentActivity, timeLeft]);

  const handleStart = (act: any) => {
    setActivity(act.name);
    setCurrentActivity(act);
    if ('duration' in act) {
      setTimeLeft(act.duration);
    } else {
      setProgress(0);
    }
    setCompleted(false);
  };

  const handleIncrement = () => {
    if (currentActivity && 'count' in currentActivity) {
      const newProgress = progress + 1;
      setProgress(newProgress);
      if (newProgress >= currentActivity.count) {
        setCompleted(true);
        if (onComplete) {
          setTimeout(() => onComplete(), 3000);
        }
      }
    }
  };

  if (!activity) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🏃</div>
          <h2 className="text-3xl font-bold text-gray-800">Physical Challenge</h2>
          <p className="text-gray-600">Choose an activity</p>
        </div>
        <div className="flex flex-col gap-3">
          {activities.map((act) => (
            <button
              key={act.name}
              onClick={() => handleStart(act)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg"
            >
              {act.emoji} {act.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Activity Complete!</h3>
          <p className="text-lg text-gray-600">Great job! You completed the challenge!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentActivity?.emoji} {activity}
        </h2>
        {currentActivity && 'count' in currentActivity && (
          <p className="text-sm text-gray-600">
            Progress: <span className="font-bold text-blue-600">{progress}/{currentActivity.count}</span>
          </p>
        )}
        {currentActivity && 'duration' in currentActivity && (
          <p className="text-sm text-gray-600">
            Time: <span className="font-bold text-blue-600">{timeLeft}s</span>
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-md w-full text-center">
        <div className="space-y-6">
          <div className="text-6xl">{currentActivity?.emoji}</div>
          <p className="text-lg text-gray-700">
            {currentActivity && 'count' in currentActivity
              ? `Do ${currentActivity.count} ${activity.toLowerCase()}!`
              : `Hold this position for ${currentActivity?.duration} seconds!`}
          </p>
          {currentActivity && 'count' in currentActivity && (
            <button
              onClick={handleIncrement}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg"
            >
              +1 Count
            </button>
          )}
          <button
            onClick={() => {
              setActivity(null);
              setCurrentActivity(null);
              setProgress(0);
              setTimeLeft(0);
            }}
            className="w-full py-3 px-6 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold"
          >
            Change Activity
          </button>
        </div>
      </div>
    </div>
  );
}


