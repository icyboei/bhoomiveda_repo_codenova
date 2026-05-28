'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string; author: string; avatar: string; avatarColor: string;
  location: string; content: string; tags: string[];
  likes: number; liked: boolean; time: string;
}

const trendingTopics = [
  { topic: "Kharif Sowing 2025", posts: 342 },
  { topic: "Organic Farming", posts: 218 },
  { topic: "PM Kisan Scheme", posts: 195 },
  { topic: "Wheat MSP Increase", posts: 167 },
  { topic: "Drip Irrigation", posts: 134 },
];

export default function DashboardCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/dashboard/community');
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch { console.error('Failed to fetch posts'); }
    finally { setLoading(false); }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch('/api/dashboard/community/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p =>
          p.id === postId
            ? { ...p, liked: data.liked, likes: data.liked ? p.likes + 1 : p.likes - 1 }
            : p
        ));
      }
    } catch { toast.error('Failed to like post'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">🌾 Farmer Community</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect with fellow farmers, share experiences, and learn together.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">👨‍🌾</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">No posts yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to share your farming experience!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: post.avatarColor }}>
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{post.author}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin size={10} />{post.location} · {post.time}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-3">{post.content}</p>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${post.liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-400'}`}>
                    <Heart size={15} fill={post.liked ? 'currentColor' : 'none'} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                    <MessageCircle size={15} />
                    {Math.floor(Math.random() * 50 + 5)}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
                    <Share2 size={15} />
                    {Math.floor(Math.random() * 20 + 2)}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">🔥 Trending Topics</h3>
            <div className="space-y-3">
              {trendingTopics.map(t => (
                <div key={t.topic} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{t.topic}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">{t.posts} posts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 text-white">
            <h3 className="font-bold mb-2">💬 Join the Discussion</h3>
            <p className="text-sm text-green-100 mb-3">Share your farming tips, ask questions, and help fellow farmers.</p>
            <div className="text-xs bg-white/20 rounded-xl p-3">
              <strong>Top Contributors:</strong>
              <div className="mt-1 space-y-1 text-green-100">
                <div>🥇 Mahesh Patel — 2840 pts</div>
                <div>🥈 Sunita Devi — 2610 pts</div>
                <div>🥉 Ramesh Kumar — 2390 pts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
