import React from 'react';

interface TimerProps {
  seconds: number;
  onComplete?: () => void;
}

export default function Timer({ seconds, onComplete }: TimerProps) {
  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Call onComplete when timer reaches 0
  React.useEffect(() => {
    if (seconds === 0 && onComplete) {
      onComplete();
    }
  }, [seconds, onComplete]);

  const isLowTime = seconds < 60; // Less than 1 minute remaining

  return (
    <div className={`text-center ${isLowTime ? 'animate-pulse' : ''}`}>
      <div className={`text-4xl font-bold ${isLowTime ? 'text-red-600' : 'text-blue-600'}`}>
        {formatTime(seconds)}
      </div>
      <p className="text-sm text-gray-500 mt-2">Time remaining</p>
    </div>
  );
}


