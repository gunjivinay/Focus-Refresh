'use client';

import { useEffect, useState } from 'react';
import { isStorageAvailable, getStorageUsage } from '@/src/utils/storageHelpers';

export default function StorageNotice() {
  const [showNotice, setShowNotice] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{ used: number; available: number; percentage: number } | null>(null);

  useEffect(() => {
    // Check if storage is available
    if (!isStorageAvailable()) {
      setShowNotice(true);
      return;
    }

    // Check storage usage
    const usage = getStorageUsage();
    if (usage.percentage > 80) {
      setShowNotice(true);
      setStorageInfo(usage);
    }

    // Listen for storage errors
    const handleStorageError = (event: CustomEvent) => {
      setShowNotice(true);
    };

    window.addEventListener('storage-error' as any, handleStorageError as EventListener);

    return () => {
      window.removeEventListener('storage-error' as any, handleStorageError as EventListener);
    };
  }, []);

  if (!showNotice) return null;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-yellow-50 border-2 border-yellow-400 rounded-xl shadow-xl p-4 z-50 animate-slide-in-up">
      <div className="flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h4 className="font-bold text-yellow-800 mb-1">Storage Notice</h4>
          {!isStorageAvailable() ? (
            <p className="text-sm text-yellow-700">
              Your browser is blocking local storage. Some features may not work. Please enable cookies/storage in your browser settings.
            </p>
          ) : storageInfo && storageInfo.percentage > 80 ? (
            <div>
              <p className="text-sm text-yellow-700 mb-2">
                Storage is {storageInfo.percentage.toFixed(1)}% full ({formatBytes(storageInfo.used)} used).
              </p>
              <p className="text-sm text-yellow-700">
                Please export your data or clear old browser data to prevent issues.
              </p>
            </div>
          ) : (
            <p className="text-sm text-yellow-700">
              Your data is stored locally on this device. Export your data regularly to prevent loss.
            </p>
          )}
        </div>
        <button
          onClick={() => setShowNotice(false)}
          className="text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
          aria-label="Close notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

