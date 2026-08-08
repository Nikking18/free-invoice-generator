'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { BlogHeader } from './BlogHeader';
import { BlogSection } from './BlogSection';
import { KofiFooterSection, KofiOverlayWidget } from './KofiWidgets';
import { FeedbackWidget } from './FeedbackWidget';
import { PrivacyModal } from './PrivacyBanner';
import { useTranslation } from '../lib/i18n/LanguageContext';

export function BlogPageClient() {
  const { t } = useTranslation();
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans antialiased">
      {/* Blog Navigation Header */}
      <BlogHeader backLink="/" backTextKey="btnBackToApp" defaultBackText="Back to App" />

      {/* Main Blog & News Section */}
      <main className="flex-1 bg-white">
        <BlogSection />
      </main>

      {/* Support & Footer */}
      <KofiFooterSection />

      <footer className="bg-white text-gray-800 border-t border-gray-200 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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

      {/* Widgets */}
      <KofiOverlayWidget />
      <FeedbackWidget />
    </div>
  );
}
