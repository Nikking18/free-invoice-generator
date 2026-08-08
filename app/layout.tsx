import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.freeinvoice.live'),
  title: 'Free Invoice Generator - 100% Client-Side, Private & Serverless PDF Maker',
  description:
    'Create, customize, and download professional PDF invoices instantly in your browser. 100% private, no signup, no servers, full client-side security.',
  keywords: [
    'free invoice generator',
    'invoice generator no signup',
    'privacy focused invoice maker',
    'pdf invoice maker online',
    'free invoice template',
    'freelancer invoice generator',
    'client side invoice app',
    'serverless invoice generator',
    'business invoice builder',
    'download invoice pdf',
  ],
  authors: [{ name: 'Nikhil Khanpara', url: 'https://github.com/Nikking18' }],
  creator: 'Nikhil Khanpara',
  publisher: 'Nikhil Khanpara',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/favicon.png' }],
  },
  openGraph: {
    title: 'Free Invoice Generator - 100% Private & Client-Side PDF Maker',
    description:
      'Build professional invoices in seconds without signups or backend servers. Complete data privacy directly in your browser.',
    url: 'https://www.freeinvoice.live',
    siteName: 'Free Invoice Generator',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'Free Invoice Generator Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Generator - 100% Client-Side & Private',
    description:
      'Create and download PDF invoices instantly. 100% serverless, private, and free forever.',
    images: ['/favicon.png'],
    creator: '@nikhilkhanpara',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.freeinvoice.live',
  },
  verification: {
    google: 'rjwcAI5BxBAP2_FSZhm98CBFA_NH-p1mbQM2azpEjxs',
  },
};

import { LanguageProvider } from '../lib/i18n/LanguageContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Free Invoice Generator',
    'url': 'https://www.freeinvoice.live',
    'description': '100% Client-Side & Private Invoice Builder for Freelancers, Agencies, and Small Businesses.',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'author': {
      '@type': 'Person',
      'name': 'Nikhil Khanpara',
      'url': 'https://github.com/Nikking18',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="rjwcAI5BxBAP2_FSZhm98CBFA_NH-p1mbQM2azpEjxs" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined') {
                    var _fetch = window.fetch;
                    function makeWritable(obj) {
                      if (!obj) return;
                      try {
                        Object.defineProperty(obj, 'fetch', {
                          get: function() { return _fetch; },
                          set: function(v) { _fetch = v; },
                          configurable: true,
                          enumerable: true
                        });
                      } catch(e) {}
                    }
                    makeWritable(window);
                    if (typeof Window !== 'undefined' && Window.prototype) {
                      makeWritable(Window.prototype);
                    }
                    if (typeof globalThis !== 'undefined') {
                      makeWritable(globalThis);
                    }
                  }
                } catch(e) {}

                try {
                  var dark = localStorage.getItem('fig_dark_mode');
                  if (dark === 'true') {
                    document.documentElement.classList.add('dark');
                  } else if (dark === 'false') {
                    document.documentElement.classList.remove('dark');
                  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
