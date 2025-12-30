'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import Header from '@/src/components/layout/Header';
import LoadingSkeleton from '@/src/components/ui/LoadingSkeleton';
import { getTodayChallenge, type DailyChallenge } from '@/src/utils/dailyChallenges';
import { gameCategories, getAllCategories } from '@/src/utils/gameCategories';

export default function DailyChallengePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, userId } = useAuth();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?callbackUrl=/daily-challenge');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (userId) {
      const todayChallenge = getTodayChallenge(userId);
      setChallenge(todayChallenge);
    }
  }, [userId]);

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

  if (!isAuthenticated) {
    return null;
  }

  if (!challenge) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <Header showBackButton backHref="/" />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <LoadingSkeleton type="text" width="300px" height="24px" className="mx-auto mb-4" />
            <LoadingSkeleton type="rect" width="400px" height="200px" className="mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  const allCategories = getAllCategories();
  const category = allCategories.find(cat =>
    gameCategories[cat].some(g => g.id === challenge.gameId)
  );
  const game = category ? gameCategories[category].find(g => g.id === challenge.gameId) : null;
  const gameEmoji = game?.name.split(' ')[0] || '🎮';

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 overflow-hidden">
      <Header showBackButton backHref="/" />
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="w-full lg:w-[90%] max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
              🎯 Daily Challenge
            </h1>
            <p className="text-gray-600">Complete today's challenge to earn bonus rewards!</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-orange-200">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{gameEmoji}</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{challenge.title}</h2>
              <p className="text-lg text-gray-600 mb-4">{challenge.description}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 mb-6 border-2 border-orange-300">
              <h3 className="font-bold text-gray-800 mb-2">🎁 Reward:</h3>
              {challenge.reward.type === 'bonus' && challenge.reward.bonusPoints && (
                <p className="text-lg text-orange-700 font-semibold">
                  +{challenge.reward.bonusPoints} Bonus Points
                </p>
              )}
              {challenge.reward.type === 'badge' && challenge.reward.badgeId && (
                <p className="text-lg text-orange-700 font-semibold">
                  Special Badge: {challenge.reward.badgeId}
                </p>
              )}
            </div>

            {challenge.targetScore && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Target Score:</span> {challenge.targetScore} points
                </p>
              </div>
            )}

            {challenge.targetCompletion !== undefined && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Goal:</span> {challenge.targetCompletion ? 'Complete the game' : 'Play the game'}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push(`/game/${challenge.gameId}`)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-orange-300"
                aria-label="Start daily challenge game"
              >
                🚀 Start Challenge
              </button>
              <button
                onClick={() => router.push('/timer-selection')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all focus:outline-none focus:ring-4 focus:ring-gray-300"
                aria-label="Go to game selection"
              >
                Browse All Games
              </button>
            </div>

            {challenge.completed && (
              <div className="mt-6 p-4 bg-green-100 rounded-xl border-2 border-green-400 text-center">
                <p className="text-lg font-bold text-green-800">✅ Challenge Completed!</p>
                <p className="text-sm text-green-700 mt-1">Great job! Come back tomorrow for a new challenge.</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>New challenges are available every day at midnight.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

