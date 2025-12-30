import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/src/context/GameContext";
import SessionProvider from "@/src/components/providers/SessionProvider";
import ErrorBoundary from "@/src/components/ui/ErrorBoundary";
import StorageNotice from "@/src/components/ui/StorageNotice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focus Refresh - Take a Break with Engaging Mini-Games",
  description: "Refresh your mind with short games and puzzles. Choose from 50+ games, set your break duration, and get back to work recharged. Perfect for productivity breaks!",
  keywords: ["focus refresh", "break games", "productivity", "mini games", "brain break", "puzzle games", "mental refresh", "focus games", "productivity breaks"],
  authors: [{ name: "Focus Refresh" }],
  openGraph: {
    title: "Focus Refresh - Take a Break with Engaging Mini-Games",
    description: "Refresh your mind with short games and puzzles. Choose from 50+ games and get back to work recharged!",
    type: "website",
    locale: "en_US",
    siteName: "Focus Refresh",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Refresh - Take a Break",
    description: "Refresh your mind with engaging mini-games. 50+ games available!",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#3b82f6",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Focus Refresh" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <SessionProvider>
            <GameProvider>
              <div className="min-h-screen">
                {children}
                <StorageNotice />
              </div>
            </GameProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
