'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import Header from '@/src/components/layout/Header';
import { useAuth } from '@/src/hooks/useAuth';
import { getRandomQuote, motivationalQuotes } from '@/src/utils/quotes';
import { saveFeedback, getAllFeedback, getMoodEmoji, type Feedback } from '@/src/utils/feedback';
import { sanitizeFeedback, sanitizeUserName } from '@/src/utils/sanitize';

export default function FeedbackPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [mood, setMood] = useState<'overwhelmed' | 'bored' | 'sleepy' | 'other'>('overwhelmed');
  const [rating, setRating] = useState<number>(5);
  const [submitted, setSubmitted] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    setQuote(getRandomQuote(motivationalQuotes));
    // Load existing feedbacks
    setAllFeedbacks(getAllFeedback());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save feedback (sanitize user input)
    saveFeedback({
      text: sanitizeFeedback(feedback || 'No comment provided'),
      rating: Math.max(1, Math.min(5, rating)), // Ensure rating is 1-5
      mood,
      userName: sanitizeUserName(user?.name || 'Anonymous'),
    });
    
    console.log('Feedback submitted:', { feedback, mood, rating });
    setSubmitted(true);
    
    // Reload feedbacks to show the new one
    setAllFeedbacks(getAllFeedback());
    
    // Show success message for 3 seconds, then redirect
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header />
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
          <div className="max-w-2xl w-full text-center space-y-6">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-4xl font-bold text-green-600">Thank You!</h1>
            <p className="text-xl text-gray-700">
              Your feedback has been submitted. We really appreciate it!
            </p>
            <p className="text-lg text-gray-600 italic">{quote ? `"${quote}"` : 'Loading...'}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="w-full lg:w-[90%] max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-6 sm:mb-8 animate-fade-in px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Share Your Experience
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            We'd love to hear how Focus Refresh helped you!
          </p>
          <div className="mt-3 sm:mt-4 inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 border-2 border-blue-200">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 italic">{quote ? `"${quote}"` : 'Loading...'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              How would you rate your experience?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-transform hover:scale-125 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good!' : rating === 2 ? 'Okay' : 'Needs improvement'}
            </p>
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              When do you use Focus Refresh?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'overwhelmed', label: '😰 Overwhelmed', emoji: '😰' },
                { value: 'bored', label: '😑 Bored', emoji: '😑' },
                { value: 'sleepy', label: '😴 Sleepy', emoji: '😴' },
                { value: 'other', label: '✨ Other', emoji: '✨' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMood(option.value as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mood === option.value
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">{option.label.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Share your thoughts (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g., 'I really enjoyed playing chess puzzles when I felt overwhelmed. It helped me refocus and get back to work!'"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none h-32 text-gray-700"
            />
            <p className="text-sm text-gray-500 mt-2">
              Tell us what you liked, what could be improved, or how it helped you!
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Submit Feedback 🚀
            </button>
          </div>
        </form>

        {/* What Others Are Saying */}
        <div className="mt-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 border-2 border-indigo-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">What Others Are Saying</h3>
          {allFeedbacks.length === 0 ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <p className="text-gray-700 italic mb-2">
                  "I really enjoyed playing Sudoku when I felt overwhelmed. It helped me refocus and get back to work!"
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-gray-500">— Sarah, Developer</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getMoodEmoji('overwhelmed')}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Dec 30, 2024</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <p className="text-gray-700 italic mb-2">
                  "The brain teasers are perfect when I'm feeling bored. They keep my mind sharp and engaged!"
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-gray-500">— Mike, Student</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getMoodEmoji('bored')}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Dec 29, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {allFeedbacks.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-md">
                  <p className="text-gray-700 italic mb-3">
                    "{sanitizeFeedback(item.text)}"
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-sm font-medium text-gray-600">
                      — {sanitizeUserName(item.userName || 'Anonymous')}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getMoodEmoji(item.mood)}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={star <= item.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

