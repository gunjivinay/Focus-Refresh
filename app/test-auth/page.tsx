'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [envCheck, setEnvCheck] = useState<{
    hasClientId: boolean;
    hasClientSecret: boolean;
    hasNextAuthUrl: boolean;
    hasNextAuthSecret: boolean;
  } | null>(null);

  useEffect(() => {
    // Check if environment variables are accessible (client-side check)
    fetch('/api/auth/providers')
      .then(res => res.json())
      .then(data => {
        console.log('Auth providers:', data);
        setEnvCheck({
          hasClientId: !!data?.google?.id,
          hasClientSecret: true, // Can't check secret client-side
          hasNextAuthUrl: true, // Can't check client-side
          hasNextAuthSecret: true, // Can't check client-side
        });
      })
      .catch(err => {
        console.error('Error checking providers:', err);
      });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Session Status</h2>
            <p>Status: <span className="font-mono">{status}</span></p>
            {session ? (
              <div className="mt-2">
                <p>Email: {session.user?.email}</p>
                <p>Name: {session.user?.name}</p>
                <p>User ID: {(session.user as any)?.id}</p>
              </div>
            ) : (
              <p className="text-gray-600">Not signed in</p>
            )}
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Environment Check</h2>
            {envCheck ? (
              <ul className="space-y-1">
                <li>Google Client ID: {envCheck.hasClientId ? '✅' : '❌'}</li>
                <li>Google Client Secret: {envCheck.hasClientSecret ? '✅ (server-side only)' : '❌'}</li>
                <li>NEXTAUTH_URL: {envCheck.hasNextAuthUrl ? '✅ (server-side only)' : '❌'}</li>
                <li>NEXTAUTH_SECRET: {envCheck.hasNextAuthSecret ? '✅ (server-side only)' : '❌'}</li>
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div className="p-4 bg-blue-50 rounded">
            <h2 className="font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Check the browser console (F12) for any errors</li>
              <li>Check the terminal running `npm run dev` for NextAuth debug logs</li>
              <li>If status is "unauthenticated", try signing in</li>
              <li>If you see errors, check the terminal for detailed logs</li>
            </ol>
          </div>

          <div className="mt-6">
            <a
              href="/auth/signin"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Sign In Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


