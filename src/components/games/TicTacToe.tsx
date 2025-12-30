'use client';

import { useState } from 'react';

interface TicTacToeProps {
  onComplete?: () => void;
}

type Player = 'X' | 'O' | null;
type Board = Player[];

export default function TicTacToe({ onComplete }: TicTacToeProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [gameMode, setGameMode] = useState<'single' | 'multi' | null>(null);

  const checkWinner = (board: Board): Player | 'tie' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every(cell => cell !== null)) {
      return 'tie';
    }

    return null;
  };

  const getBestMove = (board: Board, player: Player): number => {
    // Simple AI: Try to win, block opponent, or take center/corners
    const opponent = player === 'X' ? 'O' : 'X';
    
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = player;
        if (checkWinner(newBoard) === player) {
          return i;
        }
      }
    }

    // Block opponent
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = opponent;
        if (checkWinner(newBoard) === opponent) {
          return i;
        }
      }
    }

    // Take center
    if (!board[4]) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !board[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available
    const available = board.map((cell, i) => !cell ? i : -1).filter(i => i !== -1);
    return available[Math.floor(Math.random() * available.length)];
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || (gameMode === 'single' && currentPlayer === 'O')) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'X') {
        setXWins(prev => prev + 1);
      } else if (gameWinner === 'O') {
        setOWins(prev => prev + 1);
      }
      
      if (onComplete && (xWins + (gameWinner === 'X' ? 1 : 0) >= 3 || oWins + (gameWinner === 'O' ? 1 : 0) >= 3)) {
        setTimeout(() => onComplete(), 2000);
      }
      return;
    }

    if (gameMode === 'single') {
      // AI's turn
      setTimeout(() => {
        const aiMove = getBestMove(newBoard, 'O');
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);

        const aiWinner = checkWinner(aiBoard);
        if (aiWinner) {
          setWinner(aiWinner);
          if (aiWinner === 'O') {
            setOWins(prev => prev + 1);
          }
        } else {
          setCurrentPlayer('X');
        }
      }, 500);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const resetMatch = () => {
    resetGame();
    setXWins(0);
    setOWins(0);
  };

  if (!gameMode) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">⭕</div>
          <h2 className="text-3xl font-bold text-gray-800">Tic-Tac-Toe</h2>
          <p className="text-gray-600">Choose your game mode</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setGameMode('single')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg"
          >
            🎮 Play vs AI
          </button>
          <button
            onClick={() => setGameMode('multi')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg shadow-lg"
          >
            👥 Two Players
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">⭕ Tic-Tac-Toe</h2>
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">X Wins</p>
            <p className="text-xl font-bold text-blue-600">{xWins}</p>
          </div>
          <span className="text-gray-400">-</span>
          <div className="text-center">
            <p className="text-sm text-gray-600">O Wins</p>
            <p className="text-xl font-bold text-red-600">{oWins}</p>
          </div>
        </div>
        {!winner && (
          <p className="text-sm text-gray-600">
            Current Player: <span className={`font-bold ${currentPlayer === 'X' ? 'text-blue-600' : 'text-red-600'}`}>{currentPlayer}</span>
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
        <div className="grid grid-cols-3 gap-2 w-64 h-64">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner || (gameMode === 'single' && currentPlayer === 'O')}
              className={`w-20 h-20 border-2 border-gray-300 rounded-lg text-4xl font-bold transition-all ${
                cell === 'X'
                  ? 'bg-blue-100 text-blue-600 border-blue-400'
                  : cell === 'O'
                  ? 'bg-red-100 text-red-600 border-red-400'
                  : 'bg-white hover:bg-gray-50 hover:border-blue-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      {winner && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 animate-fade-in">
          <p className="text-lg font-semibold text-green-800 text-center">
            {winner === 'tie' ? "🤝 It's a tie!" : `🎉 ${winner} Wins!`}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold"
        >
          New Game
        </button>
        <button
          onClick={resetMatch}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
        >
          Reset Match
        </button>
      </div>
    </div>
  );
}


