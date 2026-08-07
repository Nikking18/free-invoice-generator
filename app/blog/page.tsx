'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { BlogSection } from '../../components/BlogSection';
import { KofiFooterSection, KofiOverlayWidget } from '../../components/KofiWidgets';
import { FeedbackWidget } from '../../components/FeedbackWidget';

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans antialiased">
      {/* Blog Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-black hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to App</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center rounded-sm font-bold text-xs">
              <div className="w-3.5 h-[2px] bg-white"></div>
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-black uppercase">
              Free Invoice Generator
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-bold rounded-md transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </Link>
        </div>
      </header>

      {/* Main Blog & News Section */}
      <main className="flex-1 bg-white">
        <BlogSection />
      </main>

      {/* Support & Footer */}
      <KofiFooterSection />

      <footer className="bg-white text-gray-700 border-t border-gray-200 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Free Invoice Generator. 100% Client-Side & Private.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-black font-semibold hover:underline">
              Invoice Builder
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/blog" className="text-black font-semibold hover:underline">
              Blog & News
            </Link>
          </div>
        </div>
      </footer>

      {/* Widgets */}
      <KofiOverlayWidget />
      <FeedbackWidget />
    </div>
  );
}
