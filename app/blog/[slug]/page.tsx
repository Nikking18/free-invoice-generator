import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Clock, 
  Calendar, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Share2, 
  User, 
  BookOpen
} from 'lucide-react';
import { getAllBlogPosts, getBlogPostBySlug } from '../../../lib/blogs';
import { KofiFooterSection, KofiOverlayWidget } from '../../../components/KofiWidgets';
import { FeedbackWidget } from '../../../components/FeedbackWidget';

interface PageParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Free Invoice Generator',
    };
  }

  return {
    title: `${post.title} | Free Invoice Generator`,
    description: post.summary,
    keywords: [
      post.category.toLowerCase(),
      'freelance invoice',
      'invoice template',
      'billing guide',
      post.title.toLowerCase(),
    ],
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: `https://free-invoice-generator-red.vercel.app/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://free-invoice-generator-red.vercel.app/blog/${post.slug}`,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage({ params }: PageParams) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.summary,
    'author': {
      '@type': 'Person',
      'name': post.author.name,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Free Invoice Generator',
      'url': 'https://free-invoice-generator-red.vercel.app',
    },
    'datePublished': post.date,
    'mainEntityOfPage': `https://free-invoice-generator-red.vercel.app/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col justify-between">
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Header Bar */}
      <header className="no-print bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs sm:text-sm font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Create Invoice</span>
          </Link>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Article Breadcrumb & Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold border border-amber-500/20">
              {post.category}
            </span>
            <span className="text-gray-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
            <span className="text-gray-400 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {post.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 pt-2 border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="w-10 h-10 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 flex items-center justify-center font-bold text-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{post.author.name}</div>
              <div className="text-xs text-gray-500">{post.author.role}</div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-md space-y-8 text-base text-gray-800 dark:text-gray-200 leading-relaxed">
          {/* Summary Box */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-5 rounded-2xl text-amber-950 dark:text-amber-200 font-medium text-sm sm:text-base">
            {post.content.intro}
          </div>

          {/* Structured Sections */}
          {post.content.sections.map((sec, idx) => (
            <div key={idx} className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {sec.heading}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {sec.body}
              </p>

              {sec.bullets && (
                <ul className="space-y-2 pl-2 pt-2">
                  {sec.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sec.proTip && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-800 dark:text-gray-200 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-gray-900 dark:text-white">Pro Tip: </strong>
                    {sec.proTip}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Key Takeaway Box */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-6 rounded-2xl space-y-2 text-emerald-950 dark:text-emerald-200">
            <h3 className="font-bold text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Key Takeaway
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* Call To Action Box */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-4">
            <h3 className="text-xl font-bold">Ready to create a professional invoice?</h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
              Build, customize, and export high-resolution PDF invoices instantly directly in your browser. 100% free & client-side private.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-sm rounded-xl transition-all shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>Create Free Invoice Now</span>
            </Link>
          </div>
        </article>

        {/* Related Articles Grid */}
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Related Invoicing Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                href={`/blog/${rel.slug}`}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-2 group"
              >
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 font-medium">
                  {rel.category}
                </span>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                  {rel.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Ko-fi Banner Section */}
      <KofiFooterSection />

      {/* Footer */}
      <footer className="no-print bg-gray-950 text-gray-400 border-t border-gray-900 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span>Created by <strong>Nikhil Khanpara</strong></span>
            <span>•</span>
            <Link href="/" className="hover:text-white transition-colors">Free Invoice Generator</Link>
          </div>
          <span>100% Client-Side & Private</span>
        </div>
      </footer>

      {/* Floating Widgets */}
      <KofiOverlayWidget />
      <FeedbackWidget />
    </div>
  );
}
