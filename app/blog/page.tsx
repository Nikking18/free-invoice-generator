'use client';

import React from 'react';
import Link from 'next/link';
import { BlogHeader } from '../../components/BlogHeader';
import { BlogSection } from '../../components/BlogSection';
import { KofiFooterSection, KofiOverlayWidget } from '../../components/KofiWidgets';
import { FeedbackWidget } from '../../components/FeedbackWidget';

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans antialiased">
      {/* Blog Navigation Header */}
      <BlogHeader backLink="/" backText="Back to App" />

      {/* Main Blog & News Section */}
      <main className="flex-1 bg-white">
        <BlogSection />
      </main>

      {/* Support & Footer */}
      <KofiFooterSection />

      <footer className="bg-white text-gray-800 border-t border-gray-200 py-6 text-xs text-center">
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
