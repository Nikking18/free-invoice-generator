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
        className="group inline-flex items-center gap-2 px-3.5 py-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-sm border border-black transition-colors"
      >
        <MessageSquarePlus className="w-3.5 h-3.5 text-white shrink-0" />
        <span className="tracking-tight">Feedback</span>
        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors shrink-0" />
      </a>
    </div>
  );
}
