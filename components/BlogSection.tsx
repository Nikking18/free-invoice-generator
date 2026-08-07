'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Calendar,
  Search,
  Sparkles,
  Tag
} from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../lib/blogs';

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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-500/20 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Freelancer & Business Knowledge Hub</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Invoicing Insights, Guides <br className="hidden sm:inline" />
          <span className="font-serif italic font-normal text-amber-600 dark:text-amber-400">& Best Practices</span>
        </h1>
        
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          Master billing strategies, payment term negotiations, late payment recovery frameworks, and financial privacy to get paid faster.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 p-4 sm:p-6 rounded-2xl shadow-xs space-y-4 max-w-4xl mx-auto">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by topic, keyword, or guide..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-amber-500/40 rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-900 dark:text-amber-300 font-semibold border border-amber-500/20">
                  <Tag className="w-3 h-3 text-amber-600" />
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-gray-400 font-mono text-[11px]">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors leading-snug">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {post.summary}
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1 font-mono text-[11px]">
                <Calendar className="w-3 h-3 text-gray-400" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-gray-900 dark:text-white group-hover:text-amber-600 group-hover:translate-x-1 transition-all">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            No articles found matching "{searchQuery}"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs font-bold text-amber-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
