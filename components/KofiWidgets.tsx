'use client';

import React, { useEffect } from 'react';
import { Coffee, Sparkles } from 'lucide-react';
import { useTranslation } from '../lib/i18n/LanguageContext';

export function KofiFooterSection() {
  const { t } = useTranslation();

  return (
    <section className="no-print bg-white text-black border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          
          {/* Left Content */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base sm:text-lg font-bold text-black tracking-tight">
                  {t('footerSupportTitle')}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-black border border-gray-200">
                  <Sparkles className="w-3 h-3 text-black" /> {t('footerSupportBadge')}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed">
                {t('footerSupportDesc')}
              </p>
            </div>
          </div>

          {/* Right Action Button - Native Zero-CLS High-Performance Link */}
          <div className="flex flex-col items-center sm:items-end shrink-0 w-full sm:w-auto">
            <a
              href="https://ko-fi.com/nikhilkhanpara"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footerSupportBtn')}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 shadow-md border border-black cursor-pointer active:scale-98"
            >
              <Coffee className="w-4 h-4 text-white shrink-0" />
              <span>{t('footerSupportBtn')}</span>
            </a>
            <span className="text-[11px] text-gray-500 mt-1.5 font-mono">
              {t('footerSupportCaption')}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

export function KofiOverlayWidget() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let loaded = false;
    const loadOverlay = () => {
      if (loaded || document.getElementById('kofi-overlay-script')) return;
      loaded = true;

      const script = document.createElement('script');
      script.id = 'kofi-overlay-script';
      script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).kofiWidgetOverlay) {
          try {
            (window as any).kofiWidgetOverlay.draw('nikhilkhanpara', {
              type: 'floating-chat',
              'floating-chat.donateButton.text': 'Support me',
              'floating-chat.donateButton.background-color': '#000000',
              'floating-chat.donateButton.text-color': '#ffffff',
            });
            setTimeout(() => {
              const iframes = document.querySelectorAll('iframe:not([title])');
              iframes.forEach((iframe) => {
                iframe.setAttribute('title', 'Support Developer on Ko-fi');
              });
            }, 1000);
          } catch (e) {
            console.error('Error initializing Ko-fi overlay widget:', e);
          }
        }
      };
      document.body.appendChild(script);

      window.removeEventListener('scroll', loadOverlay);
      window.removeEventListener('pointerdown', loadOverlay);
      window.removeEventListener('mousemove', loadOverlay);
      window.removeEventListener('touchstart', loadOverlay);
    };

    window.addEventListener('scroll', loadOverlay, { passive: true });
    window.addEventListener('pointerdown', loadOverlay, { passive: true });
    window.addEventListener('mousemove', loadOverlay, { passive: true });
    window.addEventListener('touchstart', loadOverlay, { passive: true });

    const timer = setTimeout(loadOverlay, 7000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', loadOverlay);
      window.removeEventListener('pointerdown', loadOverlay);
      window.removeEventListener('mousemove', loadOverlay);
      window.removeEventListener('touchstart', loadOverlay);
    };
  }, []);

  return null;
}
