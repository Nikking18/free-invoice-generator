import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  BookOpen, 
  ArrowRight,
  Share2,
  Tag
} from 'lucide-react';
import { BLOG_POSTS, getBlogPostBySlug } from '../../../lib/blogs';
import { KofiFooterSection, KofiOverlayWidget } from '../../../components/KofiWidgets';
import { FeedbackWidget } from '../../../components/FeedbackWidget';

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
    title: `${post.title} | Invoicing Guide`,
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
      url: `https://free-invoice-generator-red.vercel.app/blog/${post.slug}`,
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
      canonical: `https://free-invoice-generator-red.vercel.app/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

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
        'url': 'https://free-invoice-generator-red.vercel.app/favicon.png',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://free-invoice-generator-red.vercel.app/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-gray-900 font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gray-900 text-white flex items-center justify-center rounded-sm font-bold text-xs">
              <div className="w-3.5 h-[2px] bg-white"></div>
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-gray-900 uppercase">
              Free Invoice Generator
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Create Invoice</span>
          </Link>
        </div>
      </header>

      {/* Article Content Container */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 w-full">
        
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-gray-900 transition-colors">Blog & News</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </nav>

        {/* Post Title Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 font-semibold border border-amber-500/20">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              {post.category}
            </span>
            <span className="text-gray-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {post.summary}
          </p>
        </div>

        {/* Article Body */}
        <article className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-gray-800 leading-relaxed">
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 font-normal">
            {post.content.intro}
          </p>

          {post.content.sections.map((sec, idx) => (
            <div key={idx} className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                {sec.heading}
              </h2>
              
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {sec.body}
              </p>

              {sec.bullets && (
                <ul className="space-y-2 pl-2 pt-1">
                  {sec.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sec.proTip && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs sm:text-sm text-amber-900 flex items-start gap-3 shadow-2xs">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-amber-950">Pro Tip: </strong>
                    {sec.proTip}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Key Takeaway Box */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-6 rounded-2xl space-y-2 text-emerald-950">
            <h3 className="font-bold text-base flex items-center gap-2 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Key Takeaway
            </h3>
            <p className="text-sm text-emerald-900 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* Author Box */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                NK
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Nikhil Khanpara</h4>
                <p className="text-xs text-gray-500">Creator of Free Invoice Generator</p>
              </div>
            </div>

            <Link
              href="/"
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Create Invoice Now</span>
            </Link>
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span>Related Guides</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group bg-white border border-gray-200 hover:border-amber-500/40 p-5 rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                      {rel.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="pt-3 text-[11px] font-bold text-gray-700 flex items-center gap-1 group-hover:text-amber-600">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Support & Footer */}
      <KofiFooterSection />

      <footer className="bg-gray-950 text-gray-400 border-t border-gray-900 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Free Invoice Generator. 100% Client-Side & Private.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Invoice Builder
            </Link>
            <span className="text-gray-800">•</span>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
              Blog & News
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating Widgets */}
      <KofiOverlayWidget />
      <FeedbackWidget />
    </div>
  );
}
