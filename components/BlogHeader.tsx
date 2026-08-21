'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Globe } from 'lucide-react';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { AppLanguage } from '../lib/i18n/translations';

interface BlogHeaderProps {
  backLink?: string;
  backText?: string;
  backTextKey?: string;
  defaultBackText?: string;
}

export function BlogHeader({ backLink = '/', backText, backTextKey, defaultBackText = 'Back to App' }: BlogHeaderProps) {
  const { appLanguage, setAppLanguage, t } = useTranslation();

  const displayBackText = backTextKey ? t(backTextKey) : (backText || defaultBackText);

  return (
    <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        <div className="flex items-center space-x-3">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-black hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{displayBackText}</span>
          </Link>

          {/* Clickable Logo & Title Redirecting to Homepage */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
            title="Go to Free Invoice Generator Home"
          >
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center rounded-sm font-bold text-xs shrink-0">
              <div className="w-3.5 h-[2px] bg-white"></div>
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-black uppercase">
              {t('appName')}
            </span>
          </Link>
        </div>

        {/* Action Controls & Language Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Product Hunt Badge */}
          <a
            href="https://www.producthunt.com/products/free-invoice-generator-23?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-free-invoice-generator-5b070a33-64e9-4f15-b14b-a0653c2d0ffd"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center transition-transform hover:scale-105 shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1218077&theme=neutral&t=1787308287940"
              alt="Free Invoice Generator - Create professional invoices. No signup. 100% free. | Product Hunt"
              width={190}
              height={41}
              className="w-[190px] h-[41px]"
            />
          </a>

          {/* Language Dropdown Selector */}
          <div className="flex items-center space-x-1 border border-gray-200 bg-gray-50 rounded-md px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-gray-700 shrink-0" />
            <select
              value={appLanguage}
              onChange={(e) => setAppLanguage(e.target.value as AppLanguage)}
              className="bg-transparent text-xs font-semibold text-black focus:outline-none cursor-pointer"
              aria-label="Interface Language"
            >
              <option value="en">English (EN)</option>
              <option value="es">Español (ES)</option>
              <option value="fr">Français (FR)</option>
              <option value="de">Deutsch (DE)</option>
            </select>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-bold rounded-md transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">{t('lblCreateInvoice')}</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
