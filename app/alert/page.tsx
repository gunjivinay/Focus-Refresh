'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGameContext } from '@/src/context/GameContext';
import Button from '@/src/components/ui/Button';
import Header from '@/src/components/layout/Header';
import { useEffect, useState, Suspense } from 'react';
import { getRandomQuote, completionQuotes, focusQuotes } from '@/src/utils/quotes';
import { ALL_BADGES } from '@/src/types/badges';
import type { BadgeId } from '@/src/types/badges';

const motivationalMessages = [
  "You are absolutely amazing! 🌟",
  "You're doing incredible work! Keep it up! 💪",
  "You're a true champion! Well done! 🏆",
  "You're absolutely fantastic! Keep shining! ✨",
  "You're brilliant and unstoppable! 🚀",
  "You're doing great things! So proud! 🎯",
  "You're an inspiration! Keep going! 💎",
  "You're absolutely wonderful! Amazing job! 🎪",
  "You're a superstar! Keep it up! ⭐",
  "You're incredible! You've got this! 🔥",
];

function AlertContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGameCompleted = searchParams.get('completed') === 'true';
  const badgesParam = searchParams.get('badges');
  const newBadges = badgesParam ? badgesParam.split(',') : [];
  const { resetContext, timerDuration } = useGameContext();
  const [message, setMessage] = useState<string | null>(null);
  const [focusQuote, setFocusQuote] = useState<string | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);

  useEffect(() => {
    setMessage(getRandomQuote(completionQuotes));
    setFocusQuote(getRandomQuote(focusQuotes));
    setMotivationalMessage(getRandomQuote(motivationalMessages));
  }, []);

  const handleEndBreak = () => {
    resetContext();
    router.push('/');
  };

  const handleExtendBreak = () => {
    // Extend break by 5 minutes (300 seconds)
    router.push('/timer-selection');
  };

  useEffect(() => {
    // Reset context when leaving this page
    return () => {
      // Context will be reset when user clicks "End Break"
    };
  }, []);

  const minutes = timerDuration ? Math.floor(timerDuration / 60) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pt-4 sm:pt-6 md:pt-8">
        <div className="w-full lg:w-[90%] max-w-3xl space-y-4 sm:space-y-6">
          {/* Main Alert Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 text-center space-y-4 sm:space-y-6 md:space-y-8 animate-bounce-in transform hover:scale-[1.02] transition-all duration-500" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-block animate-float animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl animate-spin-slow">⏰</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
                  {isGameCompleted ? 'Game Complete!' : 'Break Complete!'}
                </h1>
                <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-orange-200 space-y-3 sm:space-y-4 animate-scale-in" style={{ animationDelay: '0.8s' }}>
                  {isGameCompleted && (
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300 space-y-3 animate-slide-in-up" style={{ animationDelay: '1s' }}>
                      <p className="text-2xl text-green-800 font-bold leading-relaxed">
                        {motivationalMessage || 'Loading...'}
                      </p>
                      <p className="text-lg text-green-700">You completed the game! You are great! 🎉</p>
                      
                      {newBadges.length > 0 && (
                        <div className="mt-4 pt-4 border-t-2 border-green-400">
                          <p className="text-lg font-bold text-green-800 mb-3">🎖️ New Badge Earned!</p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            {newBadges.map((badgeId) => {
                              const badge = ALL_BADGES[badgeId as BadgeId];
                              if (!badge) return null;
                              return (
                                <div
                                  key={badgeId}
                                  className="bg-white rounded-xl p-4 border-2 border-yellow-400 shadow-lg transform scale-110 animate-pulse"
                                >
                                  <div className="text-4xl mb-2">{badge.emoji}</div>
                                  <div className="font-bold text-gray-800 text-sm">{badge.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-2xl text-gray-800 font-semibold leading-relaxed">
                    {message || 'Loading...'}
                  </p>
                </div>
              </div>
              {minutes > 0 && (
                <div className="inline-block px-6 py-3 bg-blue-100 rounded-full">
                  <p className="text-lg font-semibold text-blue-800">
                    ⏱️ You took a {minutes}-minute break
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <Button
                label="🎯 End Break & Get Back to Work"
                onClick={handleEndBreak}
                variant="primary"
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500"
              />
              <Button
                label="⏱️ Extend 5 Minutes"
                onClick={handleExtendBreak}
                variant="secondary"
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold transition-all duration-500"
              />
            </div>
            
            {/* Feedback Link */}
            <div className="pt-6 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '1.4s' }}>
              <p className="text-center text-gray-600 mb-3">Enjoyed your break?</p>
              <a
                href="/feedback"
                className="block text-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-500 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                💬 Share Your Experience
              </a>
            </div>
          </div>

          {/* Motivational Quote Card */}
          <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-2xl p-8 shadow-lg border-2 border-indigo-200 text-center animate-slide-in-up animate-fade-in" style={{ animationDelay: '1.6s' }}>
            <p className="text-xl text-gray-800 italic font-semibold mb-3">
              {focusQuote ? `"${focusQuote}"` : 'Loading...'}
            </p>
            <p className="text-sm text-gray-600">— Focus Quote to Inspire You</p>
          </div>

          {/* Achievement Badge */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '1.8s' }}>
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-6 py-3 shadow-lg animate-scale-in">
              <p className="text-lg font-bold text-white">
                🏆 You've completed your break! Ready to achieve great things!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import LoadingSkeleton from '@/src/components/ui/LoadingSkeleton';

export default function AlertPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
        <div className="text-center space-y-4">
          <LoadingSkeleton type="circle" width="64px" height="64px" className="mx-auto" />
          <LoadingSkeleton type="text" width="200px" height="24px" className="mx-auto" />
        </div>
      </div>
    }>
      <AlertContent />
    </Suspense>
  );
}

