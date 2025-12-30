'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGameContext } from '@/src/context/GameContext';
import { useAuth } from '@/src/hooks/useAuth';
import Card from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';
import Header from '@/src/components/layout/Header';
import LoadingSkeleton from '@/src/components/ui/LoadingSkeleton';
import { getRandomQuote, motivationalQuotes } from '@/src/utils/quotes';
import type { Mood } from '@/src/types';

const moods: { value: Mood; label: string; emoji: string; description: string; color: string; bgGradient: string }[] = [
  { value: 'tired', label: 'Tired', emoji: '😴', description: 'Feeling sleepy or low energy', color: 'from-blue-400 to-cyan-400', bgGradient: 'bg-gradient-to-br from-blue-50 to-cyan-50' },
  { value: 'bored', label: 'Bored', emoji: '😑', description: 'Need something engaging', color: 'from-purple-400 to-pink-400', bgGradient: 'bg-gradient-to-br from-purple-50 to-pink-50' },
  { value: 'unfocused', label: 'Unfocused', emoji: '🤯', description: 'Mind is wandering', color: 'from-orange-400 to-red-400', bgGradient: 'bg-gradient-to-br from-orange-50 to-red-50' },
  { value: 'stressed', label: 'Stressed', emoji: '😰', description: 'Feeling overwhelmed', color: 'from-green-400 to-emerald-400', bgGradient: 'bg-gradient-to-br from-green-50 to-emerald-50' },
];

export default function MoodSelectionPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { mood, setMood } = useGameContext();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?callbackUrl=/mood-selection');
    }
  }, [isAuthenticated, isLoading, router]);

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

  const handleMoodSelect = (selectedMood: Mood) => {
    setMood(selectedMood);
  };

  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    setQuote(getRandomQuote(motivationalQuotes));
  }, []);

  const handleContinue = () => {
    if (mood) {
      router.push('/timer-selection');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <Header showBackButton backHref="/" />
      <main className="flex-1 w-full lg:w-[90%] max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-y-auto">
        <div className="text-center mb-4 sm:mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 animate-fade-in px-2" style={{ animationDelay: '0.3s' }}>
            How are you feeling?
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-3 sm:mb-4 animate-fade-in px-2" style={{ animationDelay: '0.5s' }}>
            Select your current mood to get a personalized game recommendation
          </p>
          <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 border-2 border-blue-200 animate-float animate-fade-in mx-2" style={{ animationDelay: '0.7s' }}>
            {quote ? (
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 italic">
                "{quote}"
              </p>
            ) : (
              <LoadingSkeleton type="text" width="300px" height="24px" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
          {moods.map((moodOption, index) => {
            const isSelected = mood === moodOption.value;
            return (
              <div
                key={moodOption.value}
                onClick={() => handleMoodSelect(moodOption.value)}
                className={`
                  relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500
                  ${isSelected
                    ? 'scale-105 shadow-2xl ring-4 ring-blue-500 border-4 border-blue-500 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-100'
                    : 'hover:scale-102 shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 animate-scale-in opacity-100'
                  }
                  ${!isSelected ? moodOption.bgGradient : ''}
                `}
                style={{ animationDelay: isSelected ? '0s' : `${0.9 + index * 0.2}s` }}
              >
                {/* Selected Checkmark Badge - Top Right */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-20 animate-bounce-in">
                    <div className="bg-green-500 rounded-full p-2 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Selection Indicator Border */}
                {isSelected && (
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl pointer-events-none animate-pulse-glow" />
                )}

                <div className="p-4 sm:p-6 md:p-8 text-center relative z-10">
                  <div className={`text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 transform transition-all duration-500 animate-float ${isSelected ? 'scale-110' : 'hover:scale-110'}`} style={{ animationDelay: `${1.1 + index * 0.2}s` }}>
                    {moodOption.emoji}
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ${moodOption.color} bg-clip-text text-transparent ${isSelected ? 'scale-105' : ''} transition-transform duration-500`}>
                    {moodOption.label}
                  </h3>
                  <p className={`text-sm sm:text-base text-gray-700 font-medium ${isSelected ? 'text-gray-800 font-semibold' : ''} transition-all duration-500`}>
                    {moodOption.description}
                  </p>
                  {isSelected && (
                    <div className="mt-3 sm:mt-4 inline-block px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm sm:text-base font-bold shadow-lg animate-pulse-glow transform scale-110">
                    ✓ Selected
                  </div>
                  )}
                  {!isSelected && (
                    <div className="mt-3 sm:mt-4 inline-block px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-200 text-gray-500 rounded-full text-xs sm:text-sm font-medium opacity-50">
                      Click to select
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center animate-fade-in px-2" style={{ animationDelay: '1.7s' }}>
          <Button
            label={mood ? "Continue →" : "Select a mood to continue"}
            onClick={handleContinue}
            variant="primary"
            disabled={!mood}
            className={`w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg transition-all duration-500 ${mood ? 'hover:shadow-xl transform hover:scale-105' : ''}`}
          />
        </div>
      </main>
    </div>
  );
}

