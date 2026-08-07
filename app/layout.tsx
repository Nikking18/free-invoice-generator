import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Free Invoice Generator - 100% Client-Side & Private',
  description: 'Create, edit, download, and manage professional invoices directly in your browser. No signups, no servers, complete privacy.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
