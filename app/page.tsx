'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Button from '@/src/components/ui/Button';
import Header from '@/src/components/layout/Header';
import { useAuth } from '@/src/hooks/useAuth';
import { getRandomQuote, motivationalQuotes, focusQuotes } from '@/src/utils/quotes';
import GamesCarousel from '@/src/components/ui/GamesCarousel';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [quote, setQuote] = useState<string | null>(null);
  const [focusQuote, setFocusQuote] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize quotes only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setQuote(getRandomQuote(motivationalQuotes));
    setFocusQuote(getRandomQuote(focusQuotes));
  }, []);

  // Rotate quotes every 5 seconds
  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(() => {
      setQuote(getRandomQuote(motivationalQuotes));
      setFocusQuote(getRandomQuote(focusQuotes));
    }, 5000);
    return () => clearInterval(interval);
  }, [isMounted]);

  const handleStartBreak = () => {
    if (!isAuthenticated) {
      router.push('/auth/signin?callbackUrl=/mood-selection');
    } else {
      router.push('/mood-selection');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <main className="flex-1 flex flex-col items-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full">
        <div className="w-full lg:w-[95%] xl:w-[92%] max-w-7xl space-y-4 sm:space-y-6 md:space-y-8 my-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="inline-block">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Focus Refresh
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-gray-700 font-medium px-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Recharge your mind with engaging mini-games
            </p>
            
            {/* Motivational Quote */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-blue-200 animate-float animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 italic px-2">
                {quote ? `"${quote}"` : 'Loading...'}
              </p>
            </div>
          </div>

          {/* Games Carousel */}
          <div className="w-full animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <GamesCarousel />
          </div>

          {/* How it Works */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 animate-scale-in" style={{ animationDelay: '0.9s' }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4 sm:mb-6">
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-500 transform hover:scale-105 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl animate-bounce-in" style={{ animationDelay: '0.4s' }}>
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Select Your Mood</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Tell us how you're feeling right now</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-purple-50 hover:bg-purple-100 transition-all duration-500 transform hover:scale-105 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl animate-bounce-in" style={{ animationDelay: '0.6s' }}>
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Choose Duration</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Pick 5, 10, or 15 minutes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-pink-50 hover:bg-pink-100 transition-all duration-500 transform hover:scale-105 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl animate-bounce-in" style={{ animationDelay: '0.8s' }}>
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Play & Refresh</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Enjoy a fun game tailored to your mood</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-all duration-500 transform hover:scale-105 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl animate-bounce-in" style={{ animationDelay: '1s' }}>
                  4
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Get Back to Work</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Gentle reminder when break time ends</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 flex justify-center">
              <Button
                label={isAuthenticated ? "Start Your Break 🚀" : "Sign In to Start 🚀"}
                onClick={handleStartBreak}
                variant="primary"
                className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              />
            </div>
          </div>

          {/* Data Storage Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-2">💾 About Your Data</h3>
            <p className="text-sm text-blue-700 mb-2">
              Your game progress, badges, and preferences are stored locally on your device. This means:
            </p>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1 mb-3">
              <li>✅ Data is private and stays on your device</li>
              <li>⚠️ Data is not synced across devices</li>
              <li>⚠️ Clearing browser data will reset your progress</li>
              <li>💡 Export your data regularly from your profile to backup</li>
            </ul>
            <p className="text-xs text-blue-600 italic">
              💡 Tip: Visit your profile page to export/import your data anytime!
            </p>
          </div>

          {/* Sign In Required Notice */}
          {!isAuthenticated && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-300 shadow-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-2xl sm:text-3xl flex-shrink-0">🔐</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Sign In Required</h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-3">
                    You must sign in with Google to play games, track your progress, and earn badges. It's quick and free!
                  </p>
                  <a
                    href="/auth/signin"
                    className="inline-block w-full sm:w-auto text-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🔐 Sign In with Google
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Profile & Feedback Links */}
          <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
            {isAuthenticated ? (
              <>
                <a
                  href="/profile"
                  className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  🏆 View Profile & Badges
                </a>
                <a
                  href="/roadmap"
                  className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  🗺️ View Roadmap
                </a>
                <a
                  href="/feedback"
                  className="inline-block px-4 sm:px-6 py-2 sm:py-3 text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-4 transition-colors text-sm sm:text-base"
                >
                  💬 Share Feedback
                </a>
              </>
            ) : (
              <a
                href="/roadmap"
                className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                🗺️ See What's Coming Next
              </a>
            )}
          </div>

          {/* Focus Quote */}
          <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-indigo-200 text-center">
            <p className="text-base sm:text-lg text-gray-700 italic font-medium px-2">
              {focusQuote ? `"${focusQuote}"` : 'Loading...'}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">— Focus Quote of the Day</p>
          </div>
        </div>
      </main>
    </div>
  );
}
