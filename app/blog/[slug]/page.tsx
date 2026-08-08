import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPostBySlug } from '../../../lib/blogs';
import { BlogPostClient } from '../../../components/BlogPostClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found - Free Invoice Generator',
    };
  }

  const publishedDate = '2026-08-01T00:00:00.000Z';

  return {
    title: `${post.title} | Free Invoice Generator`,
    description: post.summary,
    keywords: [
      post.category,
      'invoice guide',
      'freelance billing',
      'payment terms',
      'pdf invoice generator',
      'tax invoice best practices',
      post.title.toLowerCase(),
    ],
    authors: [{ name: 'Nikhil Khanpara', url: 'https://github.com/Nikking18' }],
    openGraph: {
      title: `${post.title} | Free Invoice Generator Guide`,
      description: post.summary,
      url: `https://www.freeinvoice.live/blog/${post.slug}`,
      siteName: 'Free Invoice Generator',
      type: 'article',
      publishedTime: publishedDate,
      modifiedTime: new Date().toISOString(),
      authors: ['Nikhil Khanpara'],
      images: [
        {
          url: '/favicon.png',
          width: 512,
          height: 512,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Free Invoice Generator`,
      description: post.summary,
      images: ['/favicon.png'],
      creator: '@nikhilkhanpara',
    },
    alternates: {
      canonical: `https://www.freeinvoice.live/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = '2026-08-01T00:00:00.000Z';

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: publishedDate,
    dateModified: new Date().toISOString(),
    inLanguage: 'en-US',
    articleSection: post.category,
    author: {
      '@type': 'Person',
      name: 'Nikhil Khanpara',
      url: 'https://github.com/Nikking18',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Free Invoice Generator',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.freeinvoice.live/favicon.png',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://www.freeinvoice.live/blog/${post.slug}`,
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
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.freeinvoice.live/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPostClient slug={slug} />
    </>
  );
}
