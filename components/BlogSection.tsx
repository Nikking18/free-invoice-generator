'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  ArrowRight, 
  Calendar,
  Search,
  BookOpen
} from 'lucide-react';
import { BLOG_POSTS } from '../lib/blogs';

export function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Invoicing 101', 'Payment Terms', 'Late Payments', 'Privacy & Security'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-black">
      {/* Clean Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 text-black text-xs font-semibold border border-gray-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge Hub</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
          Blog & Invoicing Guides
        </h1>
        
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          Actionable invoicing advice, payment term strategies, late payment recovery frameworks, and financial privacy guides for freelancers and small businesses.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-xl shadow-xs space-y-4 max-w-4xl">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, keyword, or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white border border-gray-200 hover:border-black rounded-xl p-6 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-black font-semibold border border-gray-200">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-gray-500 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-gray-400" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-black group-hover:underline transition-all leading-snug">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3">
                {post.summary}
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1 font-mono text-[11px]">
                <Calendar className="w-3 h-3 text-gray-400" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-black group-hover:translate-x-1 transition-transform">
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 space-y-3">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-sm font-semibold text-black">
            No articles found matching "{searchQuery}"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs font-bold text-black hover:underline"
          >
            Clear search filters
          </button>
        </div>
      )}
    </div>
  );
}
