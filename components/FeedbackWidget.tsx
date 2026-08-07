'use client';

import React from 'react';
import { MessageSquarePlus, ExternalLink } from 'lucide-react';

export function FeedbackWidget() {
  const googleFormUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLScUP7c8Av1NXwCB5oKcO51P0cdisGfSnpc8kVa6osjpa37jZQ/viewform?usp=header';

  return (
    <div className="no-print fixed bottom-6 right-6 z-40">
      <a
        href={googleFormUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share your Feedback & Suggestions"
        className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 sm:px-4 sm:py-3 bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700/80 backdrop-blur-md"
      >
        {/* Active Pulse Dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>

        <MessageSquarePlus className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
        <span className="tracking-tight">Feedback</span>
        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors shrink-0" />
      </a>
    </div>
  );
}
