'use client';

import { useState } from 'react';

interface ChessProps {
  onComplete?: () => void;
}

type Piece = 'R' | 'N' | 'B' | 'Q' | 'K' | 'P' | 'r' | 'n' | 'b' | 'q' | 'k' | 'p' | '';
type Color = 'white' | 'black';

const initialBoard: Piece[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const pieceNames: Record<Piece, string> = {
  'R': '♜', 'N': '♞', 'B': '♝', 'Q': '♛', 'K': '♚', 'P': '♟',
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  '': '',
};

export default function Chess({ onComplete }: ChessProps) {
  const [board, setBoard] = useState<Piece[][]>(initialBoard.map(row => [...row]));
  const [currentPlayer, setCurrentPlayer] = useState<Color>('white');
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Color | null>(null);
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);

  const isWhitePiece = (piece: Piece): boolean => {
    return piece !== '' && piece === piece.toUpperCase();
  };

  const isBlackPiece = (piece: Piece): boolean => {
    return piece !== '' && piece === piece.toLowerCase();
  };

  const isValidMove = (from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    const piece = board[from.row][from.col];
    if (piece === '') return false;

    const isWhite = isWhitePiece(piece);
    const targetPiece = board[to.row][to.col];
    const isTargetWhite = targetPiece !== '' && isWhitePiece(targetPiece);

    // Can't capture own pieces
    if (targetPiece !== '' && ((isWhite && isTargetWhite) || (!isWhite && !isTargetWhite))) {
      return false;
    }

    // Simple move validation (simplified for demo)
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    // Pawn moves
    if (piece.toLowerCase() === 'p') {
      if (isWhite) {
        // White pawn
        if (from.row === 6 && to.row === 4 && colDiff === 0 && targetPiece === '') return true;
        if (to.row === from.row - 1 && colDiff === 0 && targetPiece === '') return true;
        if (to.row === from.row - 1 && colDiff === 1 && targetPiece !== '' && !isTargetWhite) return true;
      } else {
        // Black pawn
        if (from.row === 1 && to.row === 3 && colDiff === 0 && targetPiece === '') return true;
        if (to.row === from.row + 1 && colDiff === 0 && targetPiece === '') return true;
        if (to.row === from.row + 1 && colDiff === 1 && targetPiece !== '' && isTargetWhite) return true;
      }
      return false;
    }

    // Rook moves (horizontal/vertical)
    if (piece.toLowerCase() === 'r') {
      if (rowDiff === 0 || colDiff === 0) return true;
      return false;
    }

    // Bishop moves (diagonal)
    if (piece.toLowerCase() === 'b') {
      if (rowDiff === colDiff) return true;
      return false;
    }

    // Queen moves (any direction)
    if (piece.toLowerCase() === 'q') {
      if (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) return true;
      return false;
    }

    // King moves (one square any direction)
    if (piece.toLowerCase() === 'k') {
      if (rowDiff <= 1 && colDiff <= 1) return true;
      return false;
    }

    // Knight moves (L-shape)
    if (piece.toLowerCase() === 'n') {
      if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) return true;
      return false;
    }

    return false;
  };

  const handleSquareClick = (row: number, col: number) => {
    if (gameOver) return;

    const piece = board[row][col];
    const isPieceWhite = piece !== '' && isWhitePiece(piece);
    const isPieceBlack = piece !== '' && isBlackPiece(piece);

    // If no square selected, select this square if it's the current player's piece
    if (!selectedSquare) {
      if ((currentPlayer === 'white' && isPieceWhite) || (currentPlayer === 'black' && isPieceBlack)) {
        setSelectedSquare({ row, col });
      }
      return;
    }

    // If clicking the same square, deselect
    if (selectedSquare.row === row && selectedSquare.col === col) {
      setSelectedSquare(null);
      return;
    }

    // Try to make a move
    if (isValidMove(selectedSquare, { row, col })) {
      const newBoard = board.map(r => [...r]);
      const capturedPiece = newBoard[row][col];
      
      // Capture piece
      if (capturedPiece !== '') {
        if (isWhitePiece(capturedPiece)) {
          setCapturedWhite(prev => [...prev, capturedPiece]);
        } else {
          setCapturedBlack(prev => [...prev, capturedPiece]);
        }

        // Check if king was captured (game over)
        if (capturedPiece.toLowerCase() === 'k') {
          setGameOver(true);
          setWinner(currentPlayer);
          if (onComplete) {
            setTimeout(() => onComplete(), 2000);
          }
        }
      }

      // Move piece
      newBoard[row][col] = newBoard[selectedSquare.row][selectedSquare.col];
      newBoard[selectedSquare.row][selectedSquare.col] = '';

      setBoard(newBoard);
      setSelectedSquare(null);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    } else {
      // Invalid move, select new square if it's the current player's piece
      if ((currentPlayer === 'white' && isPieceWhite) || (currentPlayer === 'black' && isPieceBlack)) {
        setSelectedSquare({ row, col });
      } else {
        setSelectedSquare(null);
      }
    }
  };

  const resetGame = () => {
    setBoard(initialBoard.map(row => [...row]));
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setGameOver(false);
    setWinner(null);
    setCapturedWhite([]);
    setCapturedBlack([]);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">♟️ Chess</h2>
        {!gameOver && (
          <p className="text-sm text-gray-600">
            Current Player: <span className={`font-bold ${currentPlayer === 'white' ? 'text-gray-800' : 'text-gray-600'}`}>
              {currentPlayer === 'white' ? '⚪ White' : '⚫ Black'}
            </span>
          </p>
        )}
        {gameOver && winner && (
          <p className="text-lg font-bold text-green-600">
            🎉 {winner === 'white' ? 'White' : 'Black'} Wins!
          </p>
        )}
      </div>

      <div className="flex gap-6 items-start">
        {/* Captured pieces - White */}
        {capturedWhite.length > 0 && (
          <div className="bg-white rounded-lg p-3 border-2 border-gray-300">
            <p className="text-xs font-semibold text-gray-600 mb-2">Captured (White):</p>
            <div className="flex flex-wrap gap-1">
              {capturedWhite.map((piece, i) => (
                <span key={i} className="text-2xl">{pieceNames[piece]}</span>
              ))}
            </div>
          </div>
        )}

        {/* Chess Board */}
        <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-blue-200">
          <div className="grid grid-cols-8 gap-0 border-4 border-gray-800">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                const isLight = (rowIndex + colIndex) % 2 === 0;
                const isPieceWhite = piece !== '' && isWhitePiece(piece);
                const isPieceBlack = piece !== '' && isBlackPiece(piece);
                const isValidTarget = selectedSquare && isValidMove(selectedSquare, { row: rowIndex, col: colIndex });

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    disabled={gameOver}
                    className={`
                      w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-3xl md:text-4xl
                      ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                      ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''}
                      ${isValidTarget && !isSelected ? 'ring-2 ring-green-400' : ''}
                      hover:opacity-80 transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {piece !== '' && (
                      <span className={isPieceWhite ? 'text-gray-800' : 'text-gray-900'}>
                        {pieceNames[piece]}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Captured pieces - Black */}
        {capturedBlack.length > 0 && (
          <div className="bg-white rounded-lg p-3 border-2 border-gray-300">
            <p className="text-xs font-semibold text-gray-600 mb-2">Captured (Black):</p>
            <div className="flex flex-wrap gap-1">
              {capturedBlack.map((piece, i) => (
                <span key={i} className="text-2xl">{pieceNames[piece]}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold"
        >
          🔄 New Game
        </button>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 max-w-md">
        <p className="text-xs text-gray-700 text-center">
          <strong>How to play:</strong> Click a piece to select it, then click a valid square to move. 
          Capture the opponent's king to win!
        </p>
      </div>
    </div>
  );
}


