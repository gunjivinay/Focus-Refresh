'use client';

import { useState, useEffect } from 'react';

interface ChessPuzzleProps {
  onComplete?: () => void;
}

interface Puzzle {
  id: number;
  fen: string; // Chess position
  solution: string; // Best move
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const puzzles: Puzzle[] = [
  {
    id: 1,
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    solution: 'Bxf7+',
    hint: 'Look for a check that wins material',
    difficulty: 'easy',
  },
  {
    id: 2,
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    solution: 'Nxe5',
    hint: 'Capture the central pawn',
    difficulty: 'easy',
  },
  {
    id: 3,
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2',
    solution: 'Qh4+',
    hint: 'Early queen attack',
    difficulty: 'medium',
  },
];

export default function ChessPuzzle({ onComplete }: ChessPuzzleProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [userMove, setUserMove] = useState('');
  const [score, setScore] = useState(0);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);

  const puzzle = puzzles[currentPuzzle % puzzles.length];

  const handleSubmit = () => {
    const normalizedMove = userMove.trim().toUpperCase().replace(/\s+/g, '');
    const normalizedSolution = puzzle.solution.toUpperCase().replace(/\s+/g, '');

    if (normalizedMove === normalizedSolution || normalizedMove.includes(normalizedSolution)) {
      setScore(prev => prev + (puzzle.difficulty === 'easy' ? 10 : puzzle.difficulty === 'medium' ? 20 : 30));
      setPuzzlesSolved(prev => {
        const newCount = prev + 1;
        if (newCount >= 5) {
          setGameCompleted(true);
          if (onComplete) {
            setTimeout(() => onComplete(), 1000);
          }
        } else {
          setCurrentPuzzle(prev => prev + 1);
          setUserMove('');
          setShowHint(false);
          setFeedback('');
        }
        return newCount;
      });
      setFeedback('Correct! Excellent move! ✓');
    } else {
      setFeedback(`Not quite. Hint: ${puzzle.hint}`);
      setShowHint(true);
    }
  };

  const handleSkip = () => {
    setCurrentPuzzle(prev => prev + 1);
    setUserMove('');
    setShowHint(false);
    setFeedback('');
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">♟️ Chess Puzzle</h2>
          <p className="text-gray-600">Find the best move to sharpen your tactical skills!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span>
          </div>
          <div className="text-sm text-gray-600">
            Solved: <span className="font-bold">{puzzlesSolved}/5</span>
          </div>
          <div className="text-sm text-gray-600">
            Difficulty: <span className="font-bold capitalize">{puzzle.difficulty}</span>
          </div>
        </div>
      </div>

      {gameCompleted ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-green-600 mb-2">Brilliant!</h3>
            <p className="text-xl text-gray-700 mb-4">You solved 5 chess puzzles!</p>
            <p className="text-lg text-gray-600">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
            <p className="text-sm text-gray-500 mt-4">Your tactical skills are sharp! Keep playing or wait for the timer.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center space-y-4 overflow-y-auto">
          {/* Chess Board Visualization */}
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-4 md:p-6 border-2 border-amber-300">
            <div className="text-center mb-4">
              <p className="text-lg font-semibold text-gray-800 mb-2">Chess Position</p>
              <p className="text-sm text-gray-600">Find the best move for White</p>
            </div>
            
            {/* Simple ASCII Chess Board Representation */}
            <div className="bg-white rounded-lg p-4 font-mono text-sm">
              <div className="grid grid-cols-8 gap-0 border-2 border-gray-800">
                {Array.from({ length: 64 }).map((_, i) => {
                  const row = Math.floor(i / 8);
                  const col = i % 8;
                  const isLight = (row + col) % 2 === 0;
                  return (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center ${isLight ? 'bg-amber-100' : 'bg-amber-800'} border border-gray-400`}
                    >
                      <span className="text-xs">{(row + col) % 3 === 0 ? '♟' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 italic">Analyze the position and find the best move</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your move (e.g., Nf3, e4, Bxf7+):
              </label>
              <input
                type="text"
                value={userMove}
                onChange={(e) => setUserMove(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-3 text-lg font-mono border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none uppercase"
                placeholder="Enter move (e.g., Nf3)"
                autoFocus
              />
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-lg text-center ${
                  feedback.includes('Correct')
                    ? 'bg-green-100 border-2 border-green-500 text-green-800'
                    : 'bg-yellow-100 border-2 border-yellow-500 text-yellow-800'
                }`}
              >
                <p className="text-lg font-bold">{feedback}</p>
              </div>
            )}

            {showHint && (
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">💡 Hint:</p>
                <p className="text-lg font-medium text-blue-800">{puzzle.hint}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg"
              >
                Submit Move
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-lg"
              >
                Skip Puzzle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

