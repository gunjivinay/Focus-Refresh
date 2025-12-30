'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAllGames } from '@/src/utils/gameRecommendations';
import { getGameInstruction } from '@/src/utils/gameInstructions';
import type { GameType } from '@/src/types';

export default function GamesCarousel() {
  const router = useRouter();
  const games = getAllGames();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const autoScroll = () => {
      if (isPausedRef.current) {
        animationFrameRef.current = requestAnimationFrame(autoScroll);
        return;
      }

      scrollPosition += scrollSpeed;
      
      // Reset to beginning when reaching the end (infinite loop)
      if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationFrameRef.current = requestAnimationFrame(autoScroll);
    };

    animationFrameRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleGameClick = (gameId: GameType) => {
    router.push(`/game/${gameId}`);
  };

  // Duplicate games for infinite scroll effect
  const duplicatedGames = [...games, ...games, ...games];

  return (
    <div className="w-full py-4 sm:py-6 md:py-8 flex justify-center">
      <div className="w-[95%] sm:w-[90%] max-w-7xl">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🎮 All Games
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Explore our collection of {games.length} games</p>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          className="flex gap-6 overflow-x-hidden scrollbar-hide"
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {duplicatedGames.map((gameId, index) => {
            const instruction = getGameInstruction(gameId);
            if (!instruction) return null;

            return (
              <div
                key={`${gameId}-${index}`}
                className="flex-shrink-0 w-64 sm:w-72 md:w-80"
              >
                <div
                  onClick={() => handleGameClick(gameId)}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border-2 border-blue-200 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl h-full"
                >
                  <div className="text-center space-y-2 sm:space-y-3">
                    <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{instruction.emoji}</div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-1">{instruction.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 min-h-[2.5rem]">{instruction.description}</p>
                    <div className="pt-2">
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg">
                        Play →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
