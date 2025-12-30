'use client';

import Link from 'next/link';
import { getUserStats } from '@/src/utils/userStats';
import { useAuth } from '@/src/hooks/useAuth';
import { signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getPreferences, toggleSound } from '@/src/utils/userPreferences';
import { setSoundEnabled, isSoundEnabled } from '@/src/utils/soundEffects';

interface HeaderProps {
  showBackButton?: boolean;
  backHref?: string;
}

export default function Header({ showBackButton = false, backHref = '/' }: HeaderProps) {
  const [badgeCount, setBadgeCount] = useState(0);
  const [userName, setUserName] = useState('');
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const { user, isAuthenticated, userId } = useAuth();

  useEffect(() => {
    const stats = getUserStats(userId || undefined);
    if (stats) {
      setBadgeCount(stats.badges.length);
      setUserName(stats.userName || user?.name || 'Player');
    } else if (user?.name) {
      setUserName(user.name);
    }

    // Load sound preference
    if (userId) {
      const prefs = getPreferences(userId);
      setSoundEnabledState(prefs.soundEnabled);
      setSoundEnabled(prefs.soundEnabled);
    }
  }, [userId, user]);

  const handleToggleSound = () => {
    const newState = toggleSound(userId || undefined);
    setSoundEnabledState(newState);
    setSoundEnabled(newState);
  };

  return (
    <header className="w-full py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 border-b-2 border-gray-200 bg-gradient-to-r from-white to-blue-50 shadow-sm">
      <div className="w-full lg:w-[90%] max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2 sm:gap-4">
        <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all">
          🎯 Focus Refresh
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
          {isAuthenticated && user && (
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
              {user.image && (
                <img src={user.image} alt={user.name || ''} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
              )}
              <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">{user.name || userName}</span>
            </div>
          )}
          {isAuthenticated && (
            <button
              onClick={handleToggleSound}
              aria-label={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all font-medium text-sm border ${
                soundEnabled
                  ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          )}
          {badgeCount > 0 && (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all font-semibold text-sm sm:text-base shadow-lg"
            >
              <span>🏆</span>
              <span>{badgeCount}</span>
            </Link>
          )}
          {isAuthenticated && (
            <Link
              href="/roadmap"
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all font-semibold text-sm sm:text-base shadow-lg"
            >
              <span>🗺️</span>
              <span className="hidden sm:inline">Roadmap</span>
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => signOut()}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium border border-gray-200 hover:border-red-300"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-xs sm:text-sm"
            >
              Sign In
            </Link>
          )}
          {showBackButton && (
            <Link
              href={backHref}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium border border-gray-200 hover:border-blue-300"
            >
              ← Back
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
