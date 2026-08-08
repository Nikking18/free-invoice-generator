import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Free Invoice Generator - 100% Client-Side & Private',
    short_name: 'Free Invoice',
    description: 'Build and download professional PDF invoices instantly in your browser with 100% data privacy.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
