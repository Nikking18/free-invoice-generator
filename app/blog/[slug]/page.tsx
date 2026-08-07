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

  return {
    title: `${post.title} | Free Invoice Generator Guide`,
    description: post.summary,
    keywords: [
      post.category,
      'invoice guide',
      'freelance billing',
      'payment terms',
      post.title.toLowerCase(),
    ],
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://www.freeinvoice.live/blog/${post.slug}`,
      siteName: 'Free Invoice Generator',
      type: 'article',
      publishedTime: new Date().toISOString(),
      authors: ['Nikhil Khanpara'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.summary,
    'author': {
      '@type': 'Person',
      'name': 'Nikhil Khanpara',
      'url': 'https://github.com/Nikking18',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Free Invoice Generator',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.freeinvoice.live/favicon.png',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://www.freeinvoice.live/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient slug={slug} />
    </>
  );
}
