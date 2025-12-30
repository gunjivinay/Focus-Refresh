'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/src/components/layout/Header';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please check your .env.local file.';
      case 'AccessDenied':
        return 'Access denied. Make sure your email is added as a test user in Google Cloud Console.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      default:
        return error || 'An error occurred during sign-in.';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-extrabold text-red-600 mb-4">
              Sign In Error
            </h1>
            <p className="text-gray-600 mb-4">
              {getErrorMessage(error)}
            </p>
            {error === 'AccessDenied' && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <strong>Solution:</strong> Go to{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials/consent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google Cloud Console
                  </a>{' '}
                  and add your email as a test user.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="w-full block text-center px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
            >
              Back to Home
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && error && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600 font-mono">
                Error code: {error}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}


