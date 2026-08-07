import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  FileText,
  ChevronLeft
} from 'lucide-react';
import { getAllBlogPosts } from '../../lib/blogs';
import { KofiFooterSection, KofiOverlayWidget } from '../../components/KofiWidgets';
import { FeedbackWidget } from '../../components/FeedbackWidget';

export const metadata: Metadata = {
  title: 'Blog & Invoicing Guides | Free Invoice Generator',
  description: 'Explore expert guides on freelance invoicing, payment terms (Net 15 vs Net 30), recovering unpaid invoices, tax compliance, and financial privacy.',
  keywords: [
    'invoice blog',
    'freelance billing guides',
    'payment terms explained',
    'late fee email templates',
    'privacy invoicing software',
  ],
  alternates: {
    canonical: 'https://free-invoice-generator-red.vercel.app/blog',
  },
};

export default function BlogHubPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col justify-between">
      {/* Header Bar */}
      <header className="no-print bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gray-900 text-white dark:bg-white dark:text-gray-900 flex items-center justify-center rounded-sm font-bold shadow-xs">
              <div className="w-4 h-[2px] bg-white dark:bg-gray-900" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-none tracking-tight uppercase">
                  Free Invoice Generator
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-sm uppercase">
                  Blog & News
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs sm:text-sm font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Create Invoice</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Page Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Invoicing Knowledge Hub & News</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Guides, Payment Term Strategies & Freelance Financial Advice
          </h1>

          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Everything you need to build professional invoice workflows, get paid faster, enforce late fee penalties, and protect your client privacy.
          </p>
        </div>

        {/* Featured First Article Banner */}
        {posts[0] && (
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-gray-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-3xl">
              <div className="flex items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  Featured Guide
                </span>
                <span className="text-gray-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {posts[0].readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                <Link href={`/blog/${posts[0].slug}`} className="hover:text-amber-400 transition-colors">
                  {posts[0].title}
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {posts[0].summary}
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href={`/blog/${posts[0].slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Blog Post Grid (All 10 Posts) */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3">
            All Articles & Guides ({posts.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold border border-amber-500/20">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 font-mono">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Ko-fi Banner Section */}
      <KofiFooterSection />

      {/* Footer */}
      <footer className="no-print bg-gray-950 text-gray-400 border-t border-gray-900 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span>Created by <strong>Nikhil Khanpara</strong></span>
            <span>•</span>
            <Link href="/" className="hover:text-white transition-colors">Free Invoice Generator</Link>
          </div>
          <span>100% Client-Side & Private</span>
        </div>
      </footer>

      {/* Widgets */}
      <KofiOverlayWidget />
      <FeedbackWidget />
    </div>
  );
}
