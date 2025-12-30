'use client';

import { useState } from 'react';

interface RockPaperScissorsProps {
  onComplete?: () => void;
}

type Choice = 'rock' | 'paper' | 'scissors';
type GameMode = 'best-of-3' | 'best-of-5';

const choices: Choice[] = ['rock', 'paper', 'scissors'];
const choiceEmojis: Record<Choice, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️',
};

export default function RockPaperScissors({ onComplete }: RockPaperScissorsProps) {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [round, setRound] = useState(0);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string>('');

  const targetWins = gameMode === 'best-of-3' ? 2 : 3;

  const getComputerChoice = (): Choice => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player: Choice, computer: Choice): 'player' | 'computer' | 'tie' => {
    if (player === computer) return 'tie';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'player';
    }
    return 'computer';
  };

  const handleChoice = (choice: Choice) => {
    if (gameOver || !gameMode) return;

    const computer = getComputerChoice();
    setPlayerChoice(choice);
    setComputerChoice(computer);

    const winner = determineWinner(choice, computer);
    const newRound = round + 1;

    if (winner === 'player') {
      setPlayerScore(prev => prev + 1);
      setResult('🎉 You win this round!');
    } else if (winner === 'computer') {
      setComputerScore(prev => prev + 1);
      setResult('😔 Computer wins this round!');
    } else {
      setResult('🤝 It\'s a tie!');
    }

    setRound(newRound);

    // Check if game is over
    setTimeout(() => {
      if (playerScore + (winner === 'player' ? 1 : 0) >= targetWins) {
        setGameOver(true);
        setWinner('player');
        if (onComplete) {
          setTimeout(() => onComplete(), 3000);
        }
      } else if (computerScore + (winner === 'computer' ? 1 : 0) >= targetWins) {
        setGameOver(true);
        setWinner('computer');
        if (onComplete) {
          setTimeout(() => onComplete(), 3000);
        }
      } else {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult('');
      }
    }, 2000);
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setRound(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
    setGameOver(false);
    setWinner('');
  };

  if (!gameMode) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">✂️</div>
          <h2 className="text-3xl font-bold text-gray-800">Rock Paper Scissors</h2>
          <p className="text-gray-600">Choose your game mode</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setGameMode('best-of-3')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg"
          >
            Best of 3
          </button>
          <button
            onClick={() => setGameMode('best-of-5')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg shadow-lg"
          >
            Best of 5
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-8xl mb-4">{winner === 'player' ? '🎉' : '😔'}</div>
          <h3 className="text-3xl font-bold text-gray-800">
            {winner === 'player' ? 'You Won!' : 'Computer Won!'}
          </h3>
          <p className="text-xl text-gray-600">
            Final Score: You {playerScore} - {computerScore} Computer
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Rock Paper Scissors</h2>
        <p className="text-gray-600">Round {round + 1} - {gameMode === 'best-of-3' ? 'Best of 3' : 'Best of 5'}</p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">You</p>
            <p className="text-2xl font-bold text-blue-600">{playerScore}</p>
          </div>
          <span className="text-gray-400">-</span>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Computer</p>
            <p className="text-2xl font-bold text-purple-600">{computerScore}</p>
          </div>
        </div>
      </div>

      {playerChoice && computerChoice && (
        <div className="flex items-center justify-center gap-8 animate-fade-in">
          <div className="text-center">
            <div className="text-6xl mb-2">{choiceEmojis[playerChoice]}</div>
            <p className="text-sm text-gray-600">You</p>
          </div>
          <span className="text-3xl text-gray-400">VS</span>
          <div className="text-center">
            <div className="text-6xl mb-2">{choiceEmojis[computerChoice]}</div>
            <p className="text-sm text-gray-600">Computer</p>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 animate-fade-in">
          <p className="text-lg font-semibold text-blue-800">{result}</p>
        </div>
      )}

      {!playerChoice && (
        <div className="space-y-4">
          <p className="text-center text-gray-700 font-semibold mb-4">Choose your move:</p>
          <div className="flex gap-4">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                className="px-8 py-6 bg-white border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">{choiceEmojis[choice]}</div>
                <p className="text-sm font-semibold text-gray-700 capitalize">{choice}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


