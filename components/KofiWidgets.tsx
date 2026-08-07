'use client';

import React, { useEffect, useRef } from 'react';
import { Coffee, Sparkles } from 'lucide-react';

export function KofiFooterSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderWidget = () => {
      if (typeof window !== 'undefined' && (window as any).kofiwidget2 && containerRef.current) {
        try {
          (window as any).kofiwidget2.init('Support me on Ko-fi', '#000000', 'Y0H123WFGA');
          const html = (window as any).kofiwidget2.getHTML();
          containerRef.current.innerHTML = html;
        } catch (e) {
          console.error('Error rendering Ko-fi footer widget:', e);
        }
      }
    };

    if (typeof window !== 'undefined') {
      if ((window as any).kofiwidget2) {
        renderWidget();
      } else {
        const scriptId = 'kofi-widget-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
          script.async = true;
          script.onload = renderWidget;
          document.body.appendChild(script);
        } else {
          script.addEventListener('load', renderWidget);
        }
      }
    }
  }, []);

  return (
    <section className="no-print bg-gray-900 text-white border-t border-gray-800 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-gray-800/60 border border-gray-700/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl">
          
          {/* Left Content */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Enjoying this free tool?
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3" /> Support Independent Dev
                </span>
              </div>
              
              <p className="text-sm text-gray-300 leading-relaxed">
                If you find this invoice generator helpful, consider supporting independent development to keep tools like this free, private, and serverless.
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex flex-col items-center sm:items-end shrink-0 w-full sm:w-auto">
            <div ref={containerRef} className="inline-flex items-center min-h-[42px]">
              {/* Fallback button while script loads */}
              <a
                href="https://ko-fi.com/Y0H123WFGA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 shadow-md border border-gray-700"
              >
                <img
                  src="https://storage.ko-fi.com/cdn/cup-border.png"
                  alt="Ko-fi"
                  className="w-5 h-4 object-contain brightness-200"
                />
                <span>Support me on Ko-fi</span>
              </a>
            </div>
            <span className="text-[11px] text-gray-400 mt-1.5 font-mono">
              Every coffee fuels future free tools ☕
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

    const initOverlay = () => {
      if ((window as any).kofiWidgetOverlay) {
        if (document.querySelector('[id^="kofi-widget-overlay"]') || document.querySelector('.floatingchat-container-wrap')) {
          return;
        }
        try {
          (window as any).kofiWidgetOverlay.draw('nikhilkhanpara', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Support me',
            'floating-chat.donateButton.background-color': '#323842',
            'floating-chat.donateButton.text-color': '#fff'
          });
        } catch (e) {
          console.error('Error drawing Ko-fi overlay widget:', e);
        }
      }
    };

    if ((window as any).kofiWidgetOverlay) {
      initOverlay();
    } else {
      const scriptId = 'kofi-overlay-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
        script.async = true;
        script.onload = initOverlay;
        document.body.appendChild(script);
      } else {
        script.addEventListener('load', initOverlay);
      }
    }
  }, []);

  return null;
}
