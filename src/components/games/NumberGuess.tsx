'use client';

import { useState, useEffect } from 'react';

interface NumberGuessProps {
  onComplete?: () => void;
}

export default function NumberGuess({ onComplete }: NumberGuessProps) {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'won'>('setup');
  const [minRange, setMinRange] = useState<number>(1);
  const [maxRange, setMaxRange] = useState<number>(100);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [hint, setHint] = useState<string>('');
  const [guessHistory, setGuessHistory] = useState<Array<{ guess: number; hint: string }>>([]);
  const [shake, setShake] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [currentRange, setCurrentRange] = useState<{ min: number; max: number } | null>(null);

  const startGame = () => {
    if (minRange >= maxRange) {
      setShake(true);
      setHint('❌ Maximum number must be greater than minimum number!');
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (maxRange - minRange < 2) {
      setShake(true);
      setHint('❌ Range is too small! Please choose a range with at least 3 numbers.');
      setTimeout(() => setShake(false), 500);
      return;
    }
    const target = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    setTargetNumber(target);
    setGameState('playing');
    setAttempts(0);
    setGuessHistory([]);
    setHint(`🎯 I'm thinking of a number between ${minRange} and ${maxRange}. Can you guess it?`);
    setGuess('');
    setCurrentRange({ min: minRange, max: maxRange });
  };

  const handleGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < minRange || guessNum > maxRange) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setHint(`❌ Please enter a number between ${minRange} and ${maxRange}`);
      return;
    }

    setAttempts(prev => prev + 1);
    setPulse(true);
    setTimeout(() => setPulse(false), 300);

    if (guessNum === targetNumber) {
      setGameState('won');
      setHint('🎉 Correct! You guessed it!');
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    } else {
      let newHint = '';
      const difference = Math.abs(guessNum - targetNumber);
      const range = maxRange - minRange;
      const percentage = (difference / range) * 100;

      // Calculate how many numbers away
      const numbersAway = difference;
      
      if (guessNum < targetNumber) {
        if (numbersAway <= 3) {
          newHint = `🔥 Very close! The number is just ${numbersAway} number${numbersAway > 1 ? 's' : ''} higher! Try a bit higher! ⬆️`;
        } else if (numbersAway <= 10) {
          newHint = `📈 Too low! The number is ${numbersAway} numbers higher. Try a higher number! ⬆️`;
        } else if (numbersAway <= 25) {
          newHint = `⬆️ Too low! The number is much higher (about ${numbersAway} numbers away). Go higher! ⬆️`;
        } else {
          const midPoint = Math.floor((minRange + maxRange) / 2);
          if (guessNum < midPoint) {
            newHint = `⬆️ Way too low! Try guessing in the upper half (above ${midPoint}). Think bigger! ⬆️`;
          } else {
            newHint = `⬆️ Too low! The number is higher than ${guessNum}. Keep going up! ⬆️`;
          }
        }
      } else {
        if (numbersAway <= 3) {
          newHint = `🔥 Very close! The number is just ${numbersAway} number${numbersAway > 1 ? 's' : ''} lower! Try a bit lower! ⬇️`;
        } else if (numbersAway <= 10) {
          newHint = `📉 Too high! The number is ${numbersAway} numbers lower. Try a lower number! ⬇️`;
        } else if (numbersAway <= 25) {
          newHint = `⬇️ Too high! The number is much lower (about ${numbersAway} numbers away). Go lower! ⬇️`;
        } else {
          const midPoint = Math.floor((minRange + maxRange) / 2);
          if (guessNum > midPoint) {
            newHint = `⬇️ Way too high! Try guessing in the lower half (below ${midPoint}). Think smaller! ⬇️`;
          } else {
            newHint = `⬇️ Too high! The number is lower than ${guessNum}. Keep going down! ⬇️`;
          }
        }
      }

      setHint(newHint);
      setGuessHistory(prev => [...prev, { guess: guessNum, hint: newHint }]);
      
      // Update the narrowed range based on guess
      if (guessNum < targetNumber && (!currentRange || guessNum > currentRange.min)) {
        setCurrentRange({ min: guessNum + 1, max: currentRange?.max || maxRange });
      } else if (guessNum > targetNumber && (!currentRange || guessNum < currentRange.max)) {
        setCurrentRange({ min: currentRange?.min || minRange, max: guessNum - 1 });
      }
      
      setGuess('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      handleGuess();
    }
  };

  if (gameState === 'setup') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="text-6xl mb-4 animate-bounce-in">🎯</div>
          <h2 className="text-3xl font-bold text-gray-800 animate-fade-in" style={{ animationDelay: '0.6s' }}>Number Guess Game</h2>
          <p className="text-gray-600 animate-fade-in" style={{ animationDelay: '0.8s' }}>Set your number range and start guessing!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 max-w-md w-full border-2 border-blue-200 animate-scale-in" style={{ animationDelay: '1s' }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From (Minimum Number):
              </label>
              <input
                type="number"
                value={minRange}
                onChange={(e) => setMinRange(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg font-semibold text-gray-900 bg-white transition-all"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To (Maximum Number):
              </label>
              <input
                type="number"
                value={maxRange}
                onChange={(e) => setMaxRange(parseInt(e.target.value) || 100)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg font-semibold text-gray-900 bg-white transition-all"
                min={minRange + 1}
              />
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Range:</span> {minRange} to {maxRange}
                <br />
                <span className="text-xs text-gray-600">
                  ({maxRange - minRange + 1} possible numbers)
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={startGame}
            className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-500 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 animate-fade-in ${
              shake ? 'animate-shake' : ''
            }`}
            style={{ animationDelay: '1.2s' }}
          >
            🚀 Start Guessing!
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="w-full h-full flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="text-center space-y-4">
          <div className="text-8xl mb-4 animate-bounce-in" style={{ animationDelay: '0.4s' }}>🎉</div>
          <h3 className="text-3xl font-bold text-green-600 mb-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>Amazing! You Got It!</h3>
          <p className="text-xl text-gray-700 mb-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            The number was <span className="font-bold text-blue-600 text-2xl">{targetNumber}</span>
          </p>
          <p className="text-lg text-gray-600 animate-fade-in" style={{ animationDelay: '1s' }}>
            You guessed it in <span className="font-bold text-purple-600">{attempts}</span> attempt{attempts !== 1 ? 's' : ''}!
          </p>
          <div className="mt-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300 animate-scale-in" style={{ animationDelay: '1.2s' }}>
            <p className="text-lg font-semibold text-green-800">🌟 Great job! You're a number master! 🌟</p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full h-full flex flex-col animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="mb-4 flex justify-between items-center animate-slide-in-down" style={{ animationDelay: '0.3s' }}>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🎯 Number Guess</h2>
            <p className="text-sm text-gray-600">Range: {minRange} to {maxRange}</p>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm text-gray-600">
              Attempts: <span className="font-bold text-blue-600">{attempts}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-sm text-gray-600 mb-2">Guess the number between</p>
            <div className="flex items-center gap-3 justify-center animate-scale-in" style={{ animationDelay: '0.7s' }}>
              <div className={`text-3xl font-bold px-6 py-3 rounded-xl border-2 transition-all duration-500 ${
                currentRange ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-blue-600 bg-blue-50 border-blue-200'
              }`}>
                {currentRange ? currentRange.min : minRange}
              </div>
              <span className="text-2xl text-gray-400">→</span>
              <div className={`text-3xl font-bold px-6 py-3 rounded-xl border-2 transition-all duration-500 ${
                currentRange ? 'text-purple-600 bg-purple-50 border-purple-200' : 'text-purple-600 bg-purple-50 border-purple-200'
              }`}>
                {currentRange ? currentRange.max : maxRange}
              </div>
            </div>
            {currentRange && currentRange.min !== minRange && currentRange.max !== maxRange && (
              <p className="text-xs text-gray-500 mt-2 animate-fade-in">
                💡 Range narrowed! The number is between {currentRange.min} and {currentRange.max}
              </p>
            )}
          </div>

        <div className="w-full max-w-md space-y-4">
          <div className="relative">
            <input
              type="number"
              value={guess}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty string for clearing
                if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= minRange && parseInt(value) <= maxRange)) {
                  setGuess(value);
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder={`Enter a number (${currentRange ? `${currentRange.min}-${currentRange.max}` : `${minRange}-${maxRange}`})`}
              className={`w-full px-6 py-4 border-2 rounded-xl focus:outline-none text-2xl font-bold text-center text-gray-900 transition-all placeholder:text-gray-400 ${
                shake
                  ? 'border-red-500 bg-red-50 text-gray-900 animate-shake'
                  : hint.includes('🔥')
                  ? 'border-green-500 bg-green-50 text-gray-900'
                  : hint.includes('❌')
                  ? 'border-red-300 bg-red-50 text-gray-900'
                  : 'border-blue-300 bg-white focus:border-blue-500 text-gray-900'
              }`}
              min={currentRange ? currentRange.min : minRange}
              max={currentRange ? currentRange.max : maxRange}
              autoFocus
            />
          </div>

          {hint && (
            <div
              className={`bg-gradient-to-r rounded-xl p-4 border-2 text-center transition-all duration-500 animate-slide-in-up ${
                hint.includes('🎉')
                  ? 'from-green-100 to-emerald-100 border-green-300 text-green-800'
                  : hint.includes('🔥')
                  ? 'from-orange-100 to-yellow-100 border-orange-300 text-orange-800 animate-pulse-glow'
                  : hint.includes('📈') || hint.includes('📉')
                  ? 'from-blue-100 to-indigo-100 border-blue-300 text-blue-800'
                  : hint.includes('❌')
                  ? 'from-red-100 to-pink-100 border-red-300 text-red-800'
                  : 'from-gray-100 to-slate-100 border-gray-300 text-gray-800'
              } ${pulse ? 'scale-105' : ''}`}
            >
              <p className="text-base sm:text-lg font-semibold leading-relaxed">{hint}</p>
            </div>
          )}
          
          {/* Progress Indicator */}
          {attempts > 0 && guessHistory.length > 0 && (
            <div className="w-full max-w-md">
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${Math.min(100, (attempts / 10) * 100)}%` 
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {attempts} attempt{attempts !== 1 ? 's' : ''} used
              </p>
            </div>
          )}

          <button
            onClick={handleGuess}
            disabled={!guess}
            className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 animate-fade-in ${
              pulse ? 'animate-pulse-glow' : ''
            }`}
            style={{ animationDelay: '0.9s' }}
          >
            🎯 Make a Guess!
          </button>
        </div>

        {guessHistory.length > 0 && (
          <div className="w-full max-w-md mt-4">
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 max-h-48 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-700 mb-2">📋 Guess History:</p>
              <div className="space-y-2">
                {guessHistory.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-2 border border-gray-200 text-sm animate-slide-in"
                  >
                    <span className="font-bold text-blue-600">{item.guess}</span>
                    <span className="text-gray-600 ml-2">→</span>
                    <span className="text-gray-700 ml-2">{item.hint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

