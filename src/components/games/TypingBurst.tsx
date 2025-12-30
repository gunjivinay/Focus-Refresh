'use client';

import { useState, useEffect, useRef } from 'react';

interface TypingBurstProps {
  onComplete?: () => void;
}

const words = [
  'code', 'function', 'variable', 'array', 'object', 'string', 'number', 'boolean',
  'react', 'javascript', 'typescript', 'python', 'java', 'html', 'css', 'node',
  'algorithm', 'database', 'server', 'client', 'api', 'json', 'async', 'await',
  'component', 'state', 'props', 'hook', 'render', 'event', 'handler', 'callback'
];

const codeIdentifiers = [
  'userName', 'getData', 'setState', 'handleClick', 'onSubmit', 'isLoading',
  'fetchUser', 'parseJson', 'validateInput', 'formatDate', 'calculateTotal',
  'updateScore', 'resetGame', 'toggleMenu', 'saveFile', 'deleteItem'
];

export default function TypingBurst({ onComplete }: TypingBurstProps) {
  const [mode, setMode] = useState<'words' | 'code' | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [input, setInput] = useState('');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (mode && !gameOver) {
      generateNewWord();
      startTimeRef.current = Date.now();
      const interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          if (newTime >= 120) { // 2 minutes
            setGameOver(true);
            clearInterval(interval);
            if (onComplete) {
              setTimeout(() => onComplete(), 3000);
            }
            return newTime;
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, gameOver]);

  useEffect(() => {
    if (input && input === currentWord) {
      setCorrectCount(prev => prev + 1);
      setTotalCount(prev => prev + 1);
      setInput('');
      generateNewWord();
      calculateWPM();
    } else if (input.length > currentWord.length) {
      setTotalCount(prev => prev + 1);
      setInput('');
      generateNewWord();
      calculateWPM();
    }
  }, [input]);

  useEffect(() => {
    if (totalCount > 0) {
      setAccuracy(Math.round((correctCount / totalCount) * 100));
    }
  }, [correctCount, totalCount]);

  const generateNewWord = () => {
    const wordList = mode === 'words' ? words : codeIdentifiers;
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(randomWord);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const calculateWPM = () => {
    if (startTimeRef.current && timeElapsed > 0) {
      const minutes = timeElapsed / 60;
      const wpmValue = Math.round(correctCount / minutes);
      setWpm(wpmValue || 0);
    }
  };

  if (!mode) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">⌨️</div>
          <h2 className="text-3xl font-bold text-gray-800">Typing Burst</h2>
          <p className="text-gray-600">Choose your mode</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setMode('words')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg"
          >
            Words
          </button>
          <button
            onClick={() => setMode('code')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg shadow-lg"
          >
            Code Identifiers
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">Time's Up!</h3>
          <div className="bg-white rounded-xl p-6 shadow-lg space-y-3">
            <p className="text-xl">
              WPM: <span className="font-bold text-blue-600">{wpm}</span>
            </p>
            <p className="text-xl">
              Accuracy: <span className="font-bold text-purple-600">{accuracy}%</span>
            </p>
            <p className="text-lg text-gray-600">
              Correct: {correctCount} / {totalCount}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">⌨️ Typing Burst</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            WPM: <span className="font-bold text-blue-600">{wpm}</span>
          </p>
          <p className="text-sm text-gray-600">
            Accuracy: <span className="font-bold text-purple-600">{accuracy}%</span>
          </p>
          <p className="text-sm text-gray-600">
            Time: <span className="font-bold">{120 - timeElapsed}s</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-md w-full">
        <div className="text-center space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">Type this {mode === 'words' ? 'word' : 'identifier'}:</p>
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-4">
              <p className="text-3xl font-bold text-gray-900 font-mono">{currentWord}</p>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-xl font-mono text-center text-gray-900"
              autoFocus
              placeholder="Start typing..."
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className={`h-2 flex-1 rounded-full ${input === currentWord.slice(0, input.length) ? 'bg-green-500' : 'bg-gray-200'}`} />
            <span className="text-xs text-gray-500">{input.length}/{currentWord.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


