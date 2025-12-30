'use client';

import { useState, useEffect } from 'react';

interface MemoryMatchProps {
  onComplete?: () => void;
}

interface Card {
  id: number;
  value: number;
  flipped: boolean;
  matched: boolean;
}

export default function MemoryMatch({ onComplete }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize game with 8 pairs (16 cards total)
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const pairs = 8;
    const cardValues: number[] = [];
    
    // Create pairs
    for (let i = 1; i <= pairs; i++) {
      cardValues.push(i, i);
    }
    
    // Shuffle cards
    const shuffled = cardValues.sort(() => Math.random() - 0.5);
    
    // Create card objects
    const newCards: Card[] = shuffled.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false,
    }));
    
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  const handleCardClick = (cardId: number) => {
    if (isDisabled || flippedCards.length >= 2) return;
    
    const card = cards[cardId];
    if (card.flipped || card.matched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Flip the card
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === cardId ? { ...c, flipped: true } : c
      )
    );

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setIsDisabled(true);
      setMoves(prev => prev + 1);

      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards[firstId];
        const secondCard = cards[secondId];

        if (firstCard.value === secondCard.value) {
          // Match found!
          setMatchedPairs(prev => [...prev, firstCard.value]);
          setCards(prevCards =>
            prevCards.map(c =>
              c.value === firstCard.value ? { ...c, matched: true, flipped: true } : c
            )
          );
        } else {
          // No match, flip cards back
          setCards(prevCards =>
            prevCards.map(c =>
              newFlippedCards.includes(c.id) ? { ...c, flipped: false } : c
            )
          );
        }

        setFlippedCards([]);
        setIsDisabled(false);
      }, 1000);
    }
  };

  // Check if game is complete
  useEffect(() => {
    if (matchedPairs.length === 8 && cards.length > 0) {
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 500);
    }
  }, [matchedPairs.length, cards.length, onComplete]);

  const formatCardContent = (value: number) => {
    // Use emojis or numbers for card values
    const emojis = ['🎯', '🎨', '🎭', '🎪', '🎬', '🎮', '🎲', '🎸'];
    return emojis[value - 1] || value;
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Memory Match</h2>
          <p className="text-gray-600">Find all matching pairs!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Moves: <span className="font-bold">{moves}</span></div>
          <div className="text-sm text-gray-600">
            Pairs Found: <span className="font-bold">{matchedPairs.length}/8</span>
          </div>
        </div>
      </div>

      {matchedPairs.length === 8 && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
          <p className="text-xl font-bold text-green-800">
            🎉 Congratulations! You found all pairs!
          </p>
          <p className="text-sm text-green-700 mt-1">
            Great job! You can keep playing or wait for the timer.
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={isDisabled || card.matched}
            className={`
              aspect-square rounded-lg text-3xl md:text-4xl font-bold
              transition-all duration-300 transform
              ${card.flipped || card.matched
                ? 'bg-blue-200 text-blue-800 rotateY-0'
                : 'bg-gray-300 text-gray-600 hover:bg-gray-400 rotateY-180'
              }
              ${card.matched ? 'opacity-60' : ''}
              ${isDisabled && !card.flipped && !card.matched ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
            `}
            style={{
              transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(180deg)',
            }}
          >
            {card.flipped || card.matched ? formatCardContent(card.value) : '?'}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={initializeGame}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}


