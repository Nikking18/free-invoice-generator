import type { Metadata } from 'next';
import React from 'react';
import { BLOG_POSTS } from '../../lib/blogs';
import { BlogPageClient } from '../../components/BlogPageClient';

export const metadata: Metadata = {
  title: 'Invoicing Guides, Tax Rules & Freelance Billing Articles | Free Invoice Generator',
  description:
    'Comprehensive guides on freelance invoicing, payment terms (Net 15 vs Net 30), statutory late fees, international VAT, client privacy, and 5-year tax record compliance.',
  keywords: [
    'freelance invoicing guide',
    'invoice payment terms',
    'late fee statutory interest',
    'international vat invoicing',
    'tax record retention 5 year rule',
    'client side invoice security',
    'invoicing best practices 2026',
  ],
  openGraph: {
    title: 'Invoicing Guides & Freelance Billing Masterclass | Free Invoice Generator',
    description:
      'Learn how to create professional PDF invoices, calculate statutory late fees, navigate cross-border VAT, and enforce payment terms.',
    url: 'https://www.freeinvoice.live/blog',
    siteName: 'Free Invoice Generator',
    type: 'website',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'Free Invoice Generator Knowledge Base',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invoicing Guides & Freelance Billing Masterclass',
    description:
      'Learn how to create professional PDF invoices, calculate statutory late fees, navigate cross-border VAT, and enforce payment terms.',
    images: ['/favicon.png'],
  },
  alternates: {
    canonical: 'https://www.freeinvoice.live/blog',
  },
};

export default function BlogPage() {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Invoicing Guides & Freelance Billing Articles',
    url: 'https://www.freeinvoice.live/blog',
    description:
      'Comprehensive guides on freelance invoicing, payment terms, statutory late fees, tax retention, and client privacy.',
    publisher: {
      '@type': 'Organization',
      name: 'Free Invoice Generator',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.freeinvoice.live/favicon.png',
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: BLOG_POSTS.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.freeinvoice.live/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.freeinvoice.live',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog & Invoicing Guides',
        item: 'https://www.freeinvoice.live/blog',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPageClient />
    </>
  );
}
