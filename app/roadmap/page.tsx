'use client';

import { useState } from 'react';
import Header from '@/src/components/layout/Header';
import Button from '@/src/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  estimatedDate?: string;
  votes?: number;
}

const roadmapItems: RoadmapItem[] = [
  {
    id: '1',
    title: 'Leaderboards & Rankings',
    description: 'Compete with other players! See global rankings, weekly challenges, and top performers.',
    status: 'planned',
    priority: 'high',
    estimatedDate: 'Q1 2025',
    votes: 0,
  },
  {
    id: '2',
    title: 'Multiplayer Games',
    description: 'Play against friends in real-time! Challenge mode, tournaments, and head-to-head battles.',
    status: 'planned',
    priority: 'high',
    estimatedDate: 'Q2 2025',
    votes: 0,
  },
  {
    id: '3',
    title: 'Cloud Sync & Cross-Device',
    description: 'Access your progress from any device! Sync badges, stats, and game history across all your devices.',
    status: 'planned',
    priority: 'high',
    estimatedDate: 'Q1 2025',
    votes: 0,
  },
  {
    id: '4',
    title: 'Custom Game Creator',
    description: 'Create your own mini-games! Share them with the community and play games made by others.',
    status: 'planned',
    priority: 'medium',
    estimatedDate: 'Q3 2025',
    votes: 0,
  },
  {
    id: '5',
    title: 'Team Challenges',
    description: 'Form teams and compete together! Team leaderboards, group challenges, and collaborative goals.',
    status: 'planned',
    priority: 'medium',
    estimatedDate: 'Q2 2025',
    votes: 0,
  },
  {
    id: '6',
    title: 'AI-Powered Game Recommendations',
    description: 'Get personalized game suggestions based on your mood, performance, and preferences using AI.',
    status: 'planned',
    priority: 'medium',
    estimatedDate: 'Q2 2025',
    votes: 0,
  },
  {
    id: '7',
    title: 'Achievement System 2.0',
    description: 'More badges, rare achievements, achievement tiers, and special rewards for milestones.',
    status: 'in-progress',
    priority: 'high',
    estimatedDate: 'Q1 2025',
    votes: 0,
  },
  {
    id: '8',
    title: 'Social Features',
    description: 'Follow friends, share achievements, send challenges, and see what games your network is playing.',
    status: 'planned',
    priority: 'medium',
    estimatedDate: 'Q2 2025',
    votes: 0,
  },
  {
    id: '9',
    title: 'Mobile App (iOS & Android)',
    description: 'Native mobile apps for iOS and Android! Play on the go with optimized mobile experience.',
    status: 'planned',
    priority: 'high',
    estimatedDate: 'Q3 2025',
    votes: 0,
  },
  {
    id: '10',
    title: 'Premium Features',
    description: 'Unlock exclusive games, remove ads, priority support, and advanced analytics with premium subscription.',
    status: 'planned',
    priority: 'low',
    estimatedDate: 'Q4 2025',
    votes: 0,
  },
  {
    id: '11',
    title: 'Voice Commands',
    description: 'Control games with your voice! Hands-free gaming for accessibility and convenience.',
    status: 'planned',
    priority: 'low',
    estimatedDate: 'Q3 2025',
    votes: 0,
  },
  {
    id: '12',
    title: 'Dark Mode Theme',
    description: 'Beautiful dark mode for night-time gaming! Customizable themes and color schemes.',
    status: 'planned',
    priority: 'medium',
    estimatedDate: 'Q1 2025',
    votes: 0,
  },
  {
    id: '13',
    title: 'Game Analytics Dashboard',
    description: 'Detailed insights into your gaming habits! Track performance, identify strengths, and improve.',
    status: 'planned',
    priority: 'medium',
    estimatedDate: 'Q2 2025',
    votes: 0,
  },
  {
    id: '14',
    title: 'Weekly Tournaments',
    description: 'Compete in weekly tournaments! Win prizes, earn exclusive badges, and climb the leaderboard.',
    status: 'planned',
    priority: 'high',
    estimatedDate: 'Q2 2025',
    votes: 0,
  },
  {
    id: '15',
    title: 'Offline Mode',
    description: 'Play games offline! Download games for offline play when you have no internet connection.',
    status: 'planned',
    priority: 'medium',
    estimatedDate: 'Q3 2025',
    votes: 0,
  },
];

export default function RoadmapPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<RoadmapItem[]>(roadmapItems);
  const [filter, setFilter] = useState<'all' | 'high' | 'in-progress' | 'completed'>('all');
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());

  const handleVote = (itemId: string) => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    if (votedItems.has(itemId)) {
      // Unvote
      setItems(items.map(item => 
        item.id === itemId ? { ...item, votes: (item.votes || 0) - 1 } : item
      ));
      setVotedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    } else {
      // Vote
      setItems(items.map(item => 
        item.id === itemId ? { ...item, votes: (item.votes || 0) + 1 } : item
      ));
      setVotedItems(prev => new Set(prev).add(itemId));
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const votes = Array.from(votedItems);
      localStorage.setItem('roadmap-votes', JSON.stringify(votes));
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'high') return item.priority === 'high';
    if (filter === 'in-progress') return item.status === 'in-progress';
    if (filter === 'completed') return item.status === 'completed';
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    // Sort by status (in-progress first, then planned, then completed)
    const statusOrder = { 'in-progress': 0, 'planned': 1, 'completed': 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    // Then by votes
    return (b.votes || 0) - (a.votes || 0);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'planned':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="w-full lg:w-[90%] xl:w-[92%] max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-blue-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              🗺️ Product Roadmap
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              See what's coming next! Vote for features you want most.
            </p>
            <p className="text-sm text-gray-500">
              Your feedback shapes our future. Help us prioritize what to build next!
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Features
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'high'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              High Priority
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'in-progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Roadmap Items */}
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-white to-blue-50 rounded-xl p-5 sm:p-6 border-2 border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(item.status)}`}>
                        {item.status === 'completed' ? '✅ Completed' : 
                         item.status === 'in-progress' ? '🚧 In Progress' : 
                         '📋 Planned'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(item.priority)}`}>
                        {item.priority === 'high' ? '🔥 High' : 
                         item.priority === 'medium' ? '⚡ Medium' : 
                         '💡 Low'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    {item.estimatedDate && (
                      <p className="text-sm text-gray-500">
                        📅 Estimated: <span className="font-semibold">{item.estimatedDate}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleVote(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        votedItems.has(item.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <span>{votedItems.has(item.id) ? '👍' : '👍'}</span>
                      <span>{item.votes || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 border-2 border-blue-300 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Have a Feature Idea?
            </h3>
            <p className="text-gray-700 mb-4">
              We'd love to hear your suggestions! Your feedback helps us build features you actually want.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                label="💬 Share Feedback"
                onClick={() => router.push('/feedback')}
                variant="primary"
                className="px-6"
              />
              <Button
                label="🏠 Back to Home"
                onClick={() => router.push('/')}
                variant="secondary"
                className="px-6"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

