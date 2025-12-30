'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/components/layout/Header';
import Button from '@/src/components/ui/Button';
import LoadingSkeleton from '@/src/components/ui/LoadingSkeleton';
import { getUserStats, setUserName, getBadgeProgress } from '@/src/utils/userStats';
import type { UserStats } from '@/src/utils/userStats';
import { ALL_BADGES } from '@/src/types/badges';
import type { BadgeId } from '@/src/types/badges';
import { useAuth } from '@/src/hooks/useAuth';
import { shareProfile, shareBadge } from '@/src/utils/shareUtils';
import { sanitizeUserName } from '@/src/utils/sanitize';
import DataExport from '@/src/components/ui/DataExport';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, userId, isLoading } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [badgeProgress, setBadgeProgress] = useState(getBadgeProgress(userId || undefined));
  const [showDataExport, setShowDataExport] = useState(false);

  // Show loading state while checking authentication
  useEffect(() => {
    // Wait for session to load before checking authentication
    if (isLoading) {
      return;
    }

    // Only redirect if we're sure the user is not authenticated
    // Don't set callbackUrl - let it go to home after sign-in
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }
    
    // Load user stats once authenticated
    const userStats = getUserStats(userId || undefined);
    setStats(userStats);
    if (userStats) {
      setNewName(userStats.userName || user?.name || 'Player');
    } else if (user?.name) {
      setNewName(user.name);
    }
    setBadgeProgress(getBadgeProgress(userId || undefined));
  }, [userId, user, isAuthenticated, isLoading, router]);

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

  const handleSaveName = () => {
    if (newName.trim()) {
      setUserName(newName.trim(), userId || undefined);
      const updated = getUserStats(userId || undefined);
      setStats(updated);
    }
    setEditingName(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  if (!stats) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <LoadingSkeleton type="circle" width="64px" height="64px" className="mx-auto" />
          <LoadingSkeleton type="text" width="200px" height="24px" className="mx-auto" />
        </div>
      </div>
    );
  }

  const earnedBadges = stats.badges.map(id => ALL_BADGES[id]);
  const unearnedBadges = Object.values(ALL_BADGES).filter(badge => !stats.badges.includes(badge.id));

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="w-full lg:w-[90%] max-w-5xl mx-auto space-y-4 sm:space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="px-3 py-2 border-2 border-blue-500 rounded-lg text-xl font-bold"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setNewName(stats.userName);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-800">{stats.userName}</h1>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{badgeProgress.earned}/{badgeProgress.total}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
                <button
                  onClick={async () => {
                    await shareProfile(
                      stats.userName,
                      stats.totalGamesPlayed,
                      badgeProgress.earned,
                      badgeProgress.total
                    );
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Share profile"
                >
                  📤 Share Profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalGamesPlayed}</div>
                <div className="text-xs sm:text-sm text-gray-600">Games Played</div>
              </div>
              <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.gamesCompleted}</div>
                <div className="text-xs sm:text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalScore}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Score</div>
              </div>
              <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.playStreak}</div>
                <div className="text-xs sm:text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Earned Badges */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-green-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              🏆 Your Badges ({earnedBadges.length})
            </h2>
            {earnedBadges.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-600 text-center py-6 sm:py-8">Play games to earn your first badge! 🎯</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border-2 ${getRarityColor(badge.rarity)} text-center transform hover:scale-105 transition-all relative group`}
                  >
                    <div className="text-4xl mb-2">{badge.emoji}</div>
                    <div className="font-bold text-gray-800 text-sm">{badge.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
                    <div className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                      badge.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                      badge.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                      badge.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {badge.rarity}
                    </div>
                    <button
                      onClick={async () => {
                        await shareBadge(badge.name, badge.emoji);
                      }}
                      className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-0 group-hover:opacity-100"
                      aria-label={`Share ${badge.name} badge`}
                    >
                      📤 Share
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unearned Badges (Locked) */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              🔒 Locked Badges ({unearnedBadges.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {unearnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-center opacity-60"
                >
                  <div className="text-4xl mb-2 filter grayscale">🔒</div>
                  <div className="font-bold text-gray-600 text-sm">{badge.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{badge.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Game History */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-indigo-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">📊 Recent Games</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.gameHistory.slice(-10).reverse().map((game, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">{game.gameId || 'Unknown'}</div>
                    <div className="text-xs text-gray-600">
                      {new Date(game.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">Score: {game.score}</div>
                    <div className={`text-xs ${game.completed ? 'text-green-600' : 'text-gray-500'}`}>
                      {game.completed ? '✓ Completed' : 'Incomplete'}
                    </div>
                  </div>
                </div>
              ))}
              {stats.gameHistory.length === 0 && (
                <p className="text-gray-600 text-center py-4">No games played yet. Start playing to see your history!</p>
              )}
            </div>
          </div>

          {/* Data Export Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-purple-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              💾 Data Management
            </h2>
            {showDataExport ? (
              <DataExport onClose={() => setShowDataExport(false)} />
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Your game data is stored locally on this device. Export your data regularly to prevent loss if you clear browser data or switch devices.
                </p>
                <button
                  onClick={() => setShowDataExport(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  📤 Export / Import Data
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              label="← Back to Home"
              onClick={() => router.push('/')}
              variant="primary"
              className="px-8"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

