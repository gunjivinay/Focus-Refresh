import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Log sign-in attempt for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('[NextAuth] Sign-in attempt:', {
          email: user.email,
          name: user.name,
          accountProvider: account?.provider,
          hasAccessToken: !!account?.access_token,
        });
      }
      
      // Allow all sign-ins for now
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Log redirect for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('[NextAuth] Redirect callback:', { url, baseUrl });
      }
      
      // Always redirect to home page after sign-in, unless it's a game or specific flow
      // Ignore profile redirects - always go to home
      if (url && url !== baseUrl) {
        // Handle relative URLs
        if (url.startsWith('/')) {
          // Don't redirect to profile - always go to home
          if (url === '/profile' || url.includes('/profile')) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[NextAuth] Ignoring profile redirect, going to home');
            }
            return baseUrl;
          }
          
          // Allow redirects to games, mood-selection, timer-selection, etc.
          // But not to profile
          const redirectUrl = `${baseUrl}${url}`;
          if (process.env.NODE_ENV === 'development') {
            console.log('[NextAuth] Redirecting to:', redirectUrl);
          }
          return redirectUrl;
        }
        
        // Handle absolute URLs from same origin
        try {
          const urlObj = new URL(url);
          if (urlObj.origin === baseUrl) {
            // Don't redirect to profile
            if (urlObj.pathname === '/profile' || urlObj.pathname.includes('/profile')) {
              return baseUrl;
            }
            return url;
          }
        } catch (e) {
          // Invalid URL, fall through to baseUrl
        }
      }
      
      // Default to home page
      return baseUrl;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('[NextAuth] Session created:', {
          email: session.user?.email,
          userId: (session.user as any)?.id,
        });
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id || user.email || '';
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      if (process.env.NODE_ENV === 'development' && user) {
        console.log('[NextAuth] JWT token updated:', {
          email: user.email,
          sub: token.sub,
        });
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

