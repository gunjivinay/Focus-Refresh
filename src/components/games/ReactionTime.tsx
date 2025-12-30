'use client';

import { useState, useEffect, useRef } from 'react';

interface ReactionTimeProps {
  onComplete?: () => void;
}

export default function ReactionTime({ onComplete }: ReactionTimeProps) {
  const [state, setState] = useState<'waiting' | 'ready' | 'click' | 'result'>('waiting');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [averageTime, setAverageTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const maxRounds = 5;

  const startRound = () => {
    setState('waiting');
    setCurrentTime(null);
    
    // Random delay between 1-4 seconds
    const delay = Math.random() * 3000 + 1000;
    
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      // Clicked too early
      setState('result');
      setCurrentTime(null);
      setTimeout(() => {
        startRound();
      }, 2000);
      return;
    }

    if (state === 'ready' && startTimeRef.current) {
      const reactionTime = Date.now() - startTimeRef.current;
      setCurrentTime(reactionTime);
      setReactionTimes(prev => {
        const newTimes = [...prev, reactionTime];
        const avg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
        setAverageTime(avg);
        setBestTime(prevBest => prevBest === null ? reactionTime : Math.min(prevBest, reactionTime));
        
        if (newTimes.length >= maxRounds) {
          setGameCompleted(true);
          if (onComplete) {
            setTimeout(() => onComplete(), 2000);
          }
        }
        return newTimes;
      });
      setState('result');
      setRound(prev => prev + 1);
      
      if (reactionTimes.length + 1 < maxRounds) {
        setTimeout(() => {
          startRound();
        }, 2000);
      }
    }
  };

  useEffect(() => {
    startRound();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getColorClass = () => {
    if (state === 'waiting') return 'bg-red-500 hover:bg-red-600';
    if (state === 'ready') return 'bg-green-500 hover:bg-green-600 animate-pulse';
    if (state === 'result') return 'bg-blue-500 hover:bg-blue-600';
    return 'bg-gray-500';
  };

  const getInstruction = () => {
    if (state === 'waiting') return 'Wait for green...';
    if (state === 'ready') return 'CLICK NOW!';
    if (state === 'result') return currentTime ? `Reaction: ${currentTime}ms` : 'Too early!';
    return '';
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">⚡ Reaction Time</h2>
          <p className="text-gray-600">Test your reflexes and reaction speed!</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-600">
            Round: <span className="font-bold">{round}/{maxRounds}</span>
          </div>
          {averageTime && (
            <div className="text-sm text-gray-600">
              Average: <span className="font-bold">{Math.round(averageTime)}ms</span>
            </div>
          )}
          {bestTime && (
            <div className="text-sm text-gray-600">
              Best: <span className="font-bold text-green-600">{bestTime}ms</span>
            </div>
          )}
        </div>
      </div>

      {gameCompleted ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-green-600 mb-2">Lightning Fast!</h3>
          <p className="text-xl text-gray-700 mb-4">You completed 5 reaction tests!</p>
          <div className="space-y-2 mb-4">
            {averageTime && (
              <p className="text-lg text-gray-600">
                Average: <span className="font-bold text-blue-600">{Math.round(averageTime)}ms</span>
              </p>
            )}
            {bestTime && (
              <p className="text-lg text-gray-600">
                Best Time: <span className="font-bold text-green-600">{bestTime}ms</span>
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4">Great reflexes! Keep playing or wait for the timer.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Reaction Button */}
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <button
              onClick={handleClick}
              className={`
                w-64 h-64 rounded-full
                ${getColorClass()}
                text-white font-bold text-2xl
                shadow-2xl transform transition-all duration-200
                hover:scale-105 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-blue-300
              `}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {state === 'waiting' ? '⏸️' : state === 'ready' ? '⚡' : '✓'}
                </div>
                <div className="text-xl">{getInstruction()}</div>
              </div>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="font-bold text-gray-800 mb-2">How to Play:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Wait for the button to turn <span className="font-bold text-green-600">GREEN</span></li>
              <li>• Click as fast as you can when it turns green</li>
              <li>• Don't click when it's red (waiting) - that's too early!</li>
              <li>• Complete 5 rounds to finish</li>
            </ul>
          </div>

          {/* Recent Times */}
          {reactionTimes.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Recent Times:</h4>
              <div className="flex gap-2 flex-wrap">
                {reactionTimes.map((time, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    {time}ms
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


