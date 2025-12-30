'use client';

import { useState, useEffect } from 'react';

interface MemoryFlipProps {
  onComplete?: () => void;
}

interface Card {
  id: number;
  value: number;
  flipped: boolean;
  matched: boolean;
}

export default function MemoryFlip({ onComplete }: MemoryFlipProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const pairs = 5;
    const cardValues: number[] = [];
    for (let i = 1; i <= pairs; i++) {
      cardValues.push(i, i);
    }
    
    // Shuffle
    for (let i = cardValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
    }

    const newCards: Card[] = cardValues.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false,
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: number) => {
    const card = cards[cardId];
    if (card.flipped || card.matched || flippedCards.length >= 2) return;

    const newCards = [...cards];
    newCards[cardId].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = newCards[firstId];
      const secondCard = newCards[secondId];

      if (firstCard.value === secondCard.value) {
        // Match!
        newCards[firstId].matched = true;
        newCards[secondId].matched = true;
        setCards(newCards);
        setFlippedCards([]);

        // Check if all matched
        setTimeout(() => {
          if (newCards.every(c => c.matched)) {
            setGameWon(true);
            if (onComplete) {
              setTimeout(() => onComplete(), 3000);
            }
          }
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          newCards[firstId].flipped = false;
          newCards[secondId].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (gameWon) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800">You Won!</h3>
          <p className="text-xl text-gray-700">
            Completed in <span className="font-bold text-blue-600">{moves}</span> moves!
          </p>
          <button
            onClick={initializeGame}
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
        <h2 className="text-2xl font-bold text-gray-800">🃏 Memory Flip</h2>
        <p className="text-sm text-gray-600">
          Moves: <span className="font-bold text-blue-600">{moves}</span>
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3 max-w-lg">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.matched || flippedCards.length >= 2}
            className={`aspect-square rounded-xl border-2 transition-all transform ${
              card.matched
                ? 'bg-green-100 border-green-500 opacity-50'
                : card.flipped
                ? 'bg-blue-100 border-blue-500'
                : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
            } disabled:opacity-50`}
          >
            {card.flipped || card.matched ? (
              <span className="text-3xl font-bold text-gray-800">{card.value}</span>
            ) : (
              <span className="text-2xl">❓</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={initializeGame}
        className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold"
      >
        Reset Game
      </button>
    </div>
  );
}


