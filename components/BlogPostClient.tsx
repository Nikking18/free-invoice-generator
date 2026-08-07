'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  BookOpen, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { getBlogPostBySlug, getBlogPosts } from '../lib/blogs';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { BlogHeader } from './BlogHeader';
import { KofiFooterSection, KofiOverlayWidget } from './KofiWidgets';
import { FeedbackWidget } from './FeedbackWidget';
import { PrivacyModal } from './PrivacyBanner';

interface BlogPostClientProps {
  slug: string;
}

export function BlogPostClient({ slug }: BlogPostClientProps) {
  const { appLanguage, t } = useTranslation();
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const post = getBlogPostBySlug(slug, appLanguage);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black font-sans antialiased justify-center items-center p-8 space-y-4">
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <Link href="/blog" className="px-4 py-2 bg-black text-white rounded-md text-xs font-bold">
          {t('btnAllArticles')}
        </Link>
      </div>
    );
  }

  const allPosts = getBlogPosts(appLanguage);
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans antialiased">
      {/* Blog Navigation Header with Clickable Logo & Language Switcher */}
      <BlogHeader backLink="/blog" backTextKey="btnAllArticles" defaultBackText="All Articles" />

      {/* Main Article Container */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 w-full bg-white text-black">
        
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-black transition-colors">{t('appName')}</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-black transition-colors">{t('blogTitle')}</Link>
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </nav>

        {/* Article Title Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-black font-semibold border border-gray-200">
              {post.category}
            </span>
            <span className="text-gray-500 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {post.readTime}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {post.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium bg-gray-50 p-4 rounded-lg border border-gray-200">
            {post.summary}
          </p>
        </div>

        {/* Article Content Body */}
        <article className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-8 text-black leading-relaxed">
          <p className="text-base sm:text-lg leading-relaxed text-gray-800 font-normal">
            {post.content.intro}
          </p>

          {post.content.sections.map((sec, idx) => (
            <div key={idx} className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight border-b border-gray-100 pb-2">
                {sec.heading}
              </h2>
              
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                {sec.body}
              </p>

              {sec.bullets && (
                <ul className="space-y-2 pl-2 pt-1">
                  {sec.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-black font-medium">
                      <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sec.proTip && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-black flex items-start gap-3">
                  <span className="font-bold text-black shrink-0">💡 Pro Tip:</span>
                  <div>{sec.proTip}</div>
                </div>
              )}
            </div>
          ))}

          {/* Key Takeaway Box */}
          <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg space-y-2 text-black">
            <h3 className="font-bold text-base flex items-center gap-2 text-black">
              <CheckCircle2 className="w-5 h-5 text-black" />
              {t('lblKeyTakeaway')}
            </h3>
            <p className="text-sm text-gray-800 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* Author Signature & CTA */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-black text-white font-bold flex items-center justify-center text-sm">
                NK
              </div>
              <div>
                <h4 className="text-sm font-bold text-black">Nikhil Khanpara</h4>
                <p className="text-xs text-gray-600">Creator of Free Invoice Generator</p>
              </div>
            </div>

            <Link
              href="/"
              className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{t('lblCreateInvoice')}</span>
            </Link>
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-black" />
              <span>{t('lblRelatedGuides')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group bg-white border border-gray-200 hover:border-black p-5 rounded-xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-black rounded-md border border-gray-200">
                      {rel.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-black group-hover:underline line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="pt-3 text-[11px] font-bold text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{t('btnReadArticle')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Support & Footer */}
      <KofiFooterSection />

      <footer className="bg-white text-gray-800 border-t border-gray-200 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600">
            © {new Date().getFullYear()} {t('footerCopyrightNotice')}
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="inline-flex items-center gap-1.5 text-gray-700 hover:text-black transition-colors font-medium cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              <span>{t('footerPrivacyNotice')}</span>
            </button>
            <span className="text-gray-300">•</span>
            <Link href="/" className="text-black font-semibold hover:underline">
              {t('appName')}
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/blog" className="text-black font-semibold hover:underline">
              {t('blogTitle')}
            </Link>
          </div>
        </div>
      </footer>

      {/* Privacy Notice Modal */}
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />

      {/* Floating Widgets */}
      <KofiOverlayWidget />
      <FeedbackWidget />
    </div>
  );
}
