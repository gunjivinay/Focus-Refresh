'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useGameContext } from '@/src/context/GameContext';
import { useAuth } from '@/src/hooks/useAuth';
import { getRecommendedGame, getAllGames } from '@/src/utils/gameRecommendations';
import { getRandomQuote, motivationalQuotes } from '@/src/utils/quotes';
import { getGameInstruction } from '@/src/utils/gameInstructions';
import { gameCategories, getAllCategories, type GameCategory, type CategorizedGame } from '@/src/utils/gameCategories';
import { getPreferences, toggleFavoriteGame, addRecentGame } from '@/src/utils/userPreferences';
import { getGameDifficulty, getDifficultyColor, getDifficultyLabel } from '@/src/utils/gameDifficulty';
import { getGameStatistics } from '@/src/utils/userStats';
import { sounds, setSoundEnabled, isSoundEnabled } from '@/src/utils/soundEffects';
import Button from '@/src/components/ui/Button';
import Header from '@/src/components/layout/Header';
import InstructionsPopup from '@/src/components/ui/InstructionsPopup';
import LoadingSkeleton from '@/src/components/ui/LoadingSkeleton';
import type { TimerDuration, GameType } from '@/src/types';

const timerOptions: { value: TimerDuration; label: string; minutes: number }[] = [
  { value: 300, label: '5 minutes', minutes: 5 },
  { value: 600, label: '10 minutes', minutes: 10 },
  { value: 900, label: '15 minutes', minutes: 15 },
];

export default function TimerSelectionPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, userId } = useAuth();
  const { mood, timerDuration, selectedGame, setTimerDuration, setSelectedGame } = useGameContext();
  const [quote, setQuote] = useState<string | null>(null);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [selectedGameForInstructions, setSelectedGameForInstructions] = useState<GameType>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<GameType[]>([]);
  const [recentGames, setRecentGames] = useState<GameType[]>([]);
  const [soundEnabled, setSoundEnabledState] = useState(true);

  // Load preferences
  useEffect(() => {
    if (userId) {
      const prefs = getPreferences(userId || undefined);
      setFavorites(prefs.favoriteGames);
      setRecentGames(prefs.recentGames);
      setSoundEnabledState(prefs.soundEnabled);
      setSoundEnabled(prefs.soundEnabled);
    }
  }, [userId]);

  useEffect(() => {
    setQuote(getRandomQuote(motivationalQuotes));
  }, []);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?callbackUrl=/timer-selection');
    }
  }, [isAuthenticated, isLoading, router]);

  // Set recommended game when mood is available
  useEffect(() => {
    if (mood && !selectedGame) {
      const recommended = getRecommendedGame(mood);
      setSelectedGame(recommended);
    }
  }, [mood, selectedGame, setSelectedGame]);

  // Redirect if no mood selected
  useEffect(() => {
    if (!mood) {
      router.push('/mood-selection');
    }
  }, [mood, router]);

  const handleTimerSelect = (duration: TimerDuration) => {
    setTimerDuration(duration);
    if (soundEnabled) sounds.click();
  };

  const handleStartGame = () => {
    if (timerDuration && selectedGame) {
      if (userId) {
        addRecentGame(selectedGame, userId);
      }
      if (soundEnabled) sounds.gameStart();
      router.push(`/game/${selectedGame}`);
    }
  };

  const handleToggleFavorite = (gameId: GameType, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFavorite = toggleFavoriteGame(gameId, userId || undefined);
    const prefs = getPreferences(userId || undefined);
    setFavorites(prefs.favoriteGames);
    if (soundEnabled) {
      if (isFavorite) sounds.success();
      else sounds.click();
    }
  };

  // Filter games based on search and category
  const filteredGamesByCategory = useMemo(() => {
    const allCategories = getAllCategories();
    const result: Partial<Record<GameCategory, CategorizedGame[]>> = {};

    allCategories.forEach(category => {
      let games = gameCategories[category];

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        games = games.filter(game => {
          const name = game.name.toLowerCase();
          const desc = game.description.toLowerCase();
          return name.includes(query) || desc.includes(query);
        });
      }

      // Filter by selected category
      if (selectedCategory === 'all') {
        result[category] = games;
      } else if (selectedCategory === 'favorites') {
        result[category] = games.filter(g => favorites.includes(g.id));
      } else if (selectedCategory === 'recent') {
        result[category] = games.filter(g => recentGames.includes(g.id));
      } else if (selectedCategory === category) {
        result[category] = games;
      }
    });

    return result;
  }, [searchQuery, selectedCategory, favorites, recentGames]);

  const filteredRecommendedGame = useMemo(() => {
    if (!mood) return null;
    const recommendedGameId = getRecommendedGame(mood);
    const allCategories = getAllCategories();
    const category = allCategories.find(cat =>
      gameCategories[cat].some(g => g.id === recommendedGameId)
    );
    if (!category) return null;
    const game = gameCategories[category].find(g => g.id === recommendedGameId);
    if (!game) return null;

    // Apply filters
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const name = game.name.toLowerCase();
      const desc = game.description.toLowerCase();
      if (!name.includes(query) && !desc.includes(query)) return null;
    }

    if (selectedCategory === 'favorites' && !favorites.includes(recommendedGameId)) return null;
    if (selectedCategory === 'recent' && !recentGames.includes(recommendedGameId)) return null;
    if (selectedCategory !== 'all' && selectedCategory !== category) return null;

    return game;
  }, [mood, searchQuery, selectedCategory, favorites, recentGames]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <LoadingSkeleton type="circle" width="64px" height="64px" className="mx-auto" />
          <LoadingSkeleton type="text" width="200px" height="24px" className="mx-auto" />
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const allCategories = getAllCategories();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <Header showBackButton backHref="/mood-selection" />
      <main className="flex-1 w-full lg:w-[90%] max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-y-auto pb-20 sm:pb-24">
        <div className="text-center mb-4 sm:mb-6 md:mb-8 animate-fade-in px-2" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            How long is your break?
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-3 sm:mb-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Choose your break duration
          </p>
          <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 border-2 border-blue-200 animate-float animate-fade-in" style={{ animationDelay: '0.7s' }}>
            {quote ? (
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 italic">
                "{quote}"
              </p>
            ) : (
              <LoadingSkeleton type="text" width="300px" height="24px" />
            )}
          </div>
        </div>

        {/* Timer Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
          {timerOptions.map((option, index) => {
            const isSelected = timerDuration === option.value;
            return (
              <div
                key={option.value}
                onClick={() => handleTimerSelect(option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTimerSelect(option.value);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Select ${option.label} break duration`}
                aria-pressed={isSelected}
                className={`
                  relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-blue-300
                  ${isSelected
                    ? 'scale-105 shadow-2xl ring-4 ring-blue-500 border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 animate-glow opacity-100'
                    : 'hover:scale-102 shadow-lg hover:shadow-xl bg-white border-2 border-gray-200 hover:border-blue-300 animate-scale-in opacity-100'
                  }
                `}
                style={{ animationDelay: isSelected ? '0s' : `${0.9 + index * 0.2}s` }}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 z-20 animate-bounce-in" aria-label="Selected">
                    <div className="bg-green-500 rounded-full p-2 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-6 md:p-8 text-center">
                  <div className={`text-4xl sm:text-5xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r ${isSelected ? 'from-blue-600 to-purple-600 scale-110' : 'from-gray-400 to-gray-600'} bg-clip-text text-transparent transition-all duration-500`}>
                    {option.minutes}
                  </div>
                  <p className={`text-lg sm:text-xl font-semibold mb-2 transition-all duration-500 ${isSelected ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
                    {option.label}
                  </p>
                  {isSelected && (
                    <div className="mt-2 sm:mt-3 inline-block px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm sm:text-base font-bold shadow-lg animate-pulse-glow transform scale-110">
                      ✓ Selected
                    </div>
                  )}
                  {!isSelected && (
                    <div className="mt-2 sm:mt-3 inline-block px-3 sm:px-4 py-1 sm:py-2 bg-gray-200 text-gray-500 rounded-full text-xs font-medium opacity-50">
                      Click to select
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {timerDuration && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border-2 border-indigo-200 animate-slide-in-up animate-fade-in" style={{ animationDelay: '1.5s' }}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center animate-fade-in" style={{ animationDelay: '1.7s' }}>
              🎮 Choose Your Game
            </h2>

            {/* Search and Filter Bar */}
            <div className="mb-6 space-y-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games..."
                  aria-label="Search games"
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder:text-gray-500"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Category Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  aria-pressed={selectedCategory === 'all'}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('favorites')}
                  aria-pressed={selectedCategory === 'favorites'}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedCategory === 'favorites'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ⭐ Favorites ({favorites.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('recent')}
                  aria-pressed={selectedCategory === 'recent'}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedCategory === 'recent'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🕐 Recent ({recentGames.length})
                </button>
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={selectedCategory === category}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Game Card */}
            {filteredRecommendedGame && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">⭐</span>
                  Recommended for You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(() => {
                    const game = filteredRecommendedGame;
                    const isSelected = selectedGame === game.id;
                    const isFavorite = favorites.includes(game.id);
                    const difficulty = getGameDifficulty(game.id);
                    const stats = getGameStatistics(game.id, userId || undefined);
                    const gameEmoji = game.name.split(' ')[0];

                    return (
                      <div
                        onClick={() => setSelectedGame(game.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedGame(game.id);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Select ${game.name}`}
                        aria-pressed={isSelected}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                          isSelected
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl ring-4 ring-blue-300 scale-105'
                            : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg hover:scale-102'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-green-500 rounded-full p-2 shadow-lg animate-bounce-in" aria-label="Selected">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <div className="text-4xl mb-3 text-center" aria-hidden="true">{gameEmoji}</div>
                        <h4 className={`text-lg font-bold mb-2 ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                          {game.name.replace(/^[^\s]+\s/, '')}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{game.description}</p>
                        
                        {/* Difficulty Badge */}
                        <div className="mb-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getDifficultyColor(difficulty)}`}>
                            {getDifficultyLabel(difficulty)}
                          </span>
                        </div>

                        {/* Game Statistics */}
                        {stats.playCount > 0 && (
                          <div className="text-xs text-gray-500 mb-3 space-y-1">
                            <div>Played: {stats.playCount} times</div>
                            <div>Completion: {stats.completionRate.toFixed(0)}%</div>
                            <div>High Score: {stats.highScore}</div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => handleToggleFavorite(game.id, e)}
                              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                              className={`rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isFavorite
                                  ? 'text-red-500 hover:bg-red-100'
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                            >
                              <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedGameForInstructions(game.id);
                                setInstructionsOpen(true);
                              }}
                              aria-label="View game instructions"
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                          <input
                            type="radio"
                            name="game"
                            checked={isSelected}
                            onChange={() => setSelectedGame(game.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            aria-label={`Select ${game.name}`}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Recent Games Section */}
            {selectedCategory === 'recent' && recentGames.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">🕐</span>
                  Recently Played
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recentGames.slice(0, 8).map((gameId) => {
                    const allCategories = getAllCategories();
                    const category = allCategories.find(cat =>
                      gameCategories[cat].some(g => g.id === gameId)
                    );
                    if (!category) return null;
                    const game = gameCategories[category].find(g => g.id === gameId);
                    if (!game) return null;

                    const isSelected = selectedGame === game.id;
                    const isFavorite = favorites.includes(game.id);
                    const difficulty = getGameDifficulty(game.id);
                    const stats = getGameStatistics(game.id, userId || undefined);
                    const gameEmoji = game.name.split(' ')[0];

                    return (
                      <div
                        key={game.id}
                        onClick={() => setSelectedGame(game.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedGame(game.id);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Select ${game.name}`}
                        aria-pressed={isSelected}
                        className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                          isSelected
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl ring-2 ring-blue-300 scale-105'
                            : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg hover:scale-102'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1.5 shadow-lg animate-bounce-in" aria-label="Selected">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <div className="text-3xl mb-2 text-center" aria-hidden="true">{gameEmoji}</div>
                        <h4 className={`text-base font-bold mb-2 text-center ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                          {game.name.replace(/^[^\s]+\s/, '')}
                        </h4>
                        <div className="mb-2 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getDifficultyColor(difficulty)}`}>
                            {getDifficultyLabel(difficulty)}
                          </span>
                        </div>
                        {stats.playCount > 0 && (
                          <div className="text-xs text-gray-500 mb-3 text-center">
                            Played {stats.playCount}x • {stats.completionRate.toFixed(0)}% complete
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <button
                            onClick={(e) => handleToggleFavorite(game.id, e)}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            className={`rounded-full p-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isFavorite
                                ? 'text-red-500 hover:bg-red-100'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            <svg className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <input
                            type="radio"
                            name="game"
                            checked={isSelected}
                            onChange={() => setSelectedGame(game.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            aria-label={`Select ${game.name}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Categorized Game Cards */}
            <div className="space-y-8">
              {allCategories.map((category) => {
                const games = filteredGamesByCategory[category] || [];
                const recommendedGameId = getRecommendedGame(mood);
                const displayGames = games.filter(game => 
                  !filteredRecommendedGame || game.id !== recommendedGameId
                );

                if (displayGames.length === 0) return null;

                return (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-3 flex items-center gap-2">
                      <span className="text-2xl" aria-hidden="true">
                        {category === 'Puzzle & Logic' && '🧩'}
                        {category === 'Memory & Pattern' && '🧠'}
                        {category === 'Word & Language' && '📝'}
                        {category === 'Math & Numbers' && '🔢'}
                        {category === 'Action & Arcade' && '🎮'}
                        {category === 'Creative & Art' && '🎨'}
                        {category === 'Trivia & Quiz' && '❓'}
                        {category === 'Physical & Movement' && '🏃'}
                        {category === 'Coding & Programming' && '💻'}
                      </span>
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {displayGames.map((game: CategorizedGame) => {
                        const isGameSelected = selectedGame === game.id;
                        const isFavorite = favorites.includes(game.id);
                        const difficulty = getGameDifficulty(game.id);
                        const stats = getGameStatistics(game.id, userId || undefined);
                        const gameEmoji = game.name.split(' ')[0];

                        return (
                          <div
                            key={game.id}
                            onClick={() => setSelectedGame(game.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedGame(game.id);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`Select ${game.name}`}
                            aria-pressed={isGameSelected}
                            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                              isGameSelected
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl ring-2 ring-blue-300 scale-105'
                                : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg hover:scale-102'
                            }`}
                          >
                            {isGameSelected && (
                              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1.5 shadow-lg animate-bounce-in" aria-label="Selected">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            <div className="text-3xl mb-2 text-center" aria-hidden="true">{gameEmoji}</div>
                            <h4 className={`text-base font-bold mb-2 text-center ${isGameSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                              {game.name.replace(/^[^\s]+\s/, '')}
                            </h4>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2 text-center min-h-[2.5rem]">
                              {game.description}
                            </p>
                            
                            {/* Difficulty Badge */}
                            <div className="mb-2 text-center">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getDifficultyColor(difficulty)}`}>
                                {getDifficultyLabel(difficulty)}
                              </span>
                            </div>

                            {/* Game Statistics */}
                            {stats.playCount > 0 && (
                              <div className="text-xs text-gray-500 mb-3 text-center space-y-1">
                                <div>Played {stats.playCount}x</div>
                                <div>{stats.completionRate.toFixed(0)}% complete</div>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => handleToggleFavorite(game.id, e)}
                                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                  className={`rounded-full p-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    isFavorite
                                      ? 'text-red-500 hover:bg-red-100'
                                      : 'text-gray-400 hover:bg-gray-100'
                                  }`}
                                >
                                  <svg className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedGameForInstructions(game.id);
                                    setInstructionsOpen(true);
                                  }}
                                  aria-label="View game instructions"
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              </div>
                              <input
                                type="radio"
                                name="game"
                                checked={isGameSelected}
                                onChange={() => setSelectedGame(game.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                aria-label={`Select ${game.name}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sticky Start Game Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-t-2 border-blue-200 shadow-lg z-50 py-3 sm:py-4">
          <div className="w-full lg:w-[90%] max-w-5xl mx-auto px-3 sm:px-4">
            <div className="flex justify-center animate-fade-in">
              <Button
                label={timerDuration && selectedGame ? "🚀 Start Game" : "Select timer and game to continue"}
                onClick={handleStartGame}
                variant="primary"
                disabled={!timerDuration || !selectedGame}
                className={`w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                  timerDuration && selectedGame ? 'hover:shadow-xl transform hover:scale-105' : ''
                }`}
                aria-label={timerDuration && selectedGame ? "Start the selected game" : "Select timer and game to continue"}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Instructions Popup */}
      {selectedGameForInstructions && (() => {
        const instruction = getGameInstruction(selectedGameForInstructions);
        if (!instruction) return null;
        return (
          <InstructionsPopup
            isOpen={instructionsOpen}
            onClose={() => setInstructionsOpen(false)}
            title={instruction.title}
            description={instruction.description}
            instructions={instruction.instructions}
            gameEmoji={instruction.emoji}
          />
        );
      })()}
    </div>
  );
}
