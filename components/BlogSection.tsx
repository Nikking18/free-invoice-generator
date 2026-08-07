'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  X,
  Share2,
  Calendar
} from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Invoicing 101' | 'Payment Terms' | 'Late Payments' | 'Privacy & Security';
  readTime: string;
  date: string;
  summary: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      bullets?: string[];
      proTip?: string;
    }[];
    conclusion: string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Ultimate Guide to Professional Freelance Invoicing (2026 Checklist)',
    slug: 'professional-freelance-invoicing-guide',
    category: 'Invoicing 101',
    readTime: '6 min read',
    date: 'August 2026',
    summary: 'Master the anatomy of a professional invoice. Learn what essential fields must be included to avoid payment delays and get paid on time every time.',
    content: {
      intro: 'Creating a professional invoice is one of the most vital operations in running a successful freelance or small business. A clear, well-structured invoice eliminates confusion, speeds up approvals from corporate accounting departments, and protects your legal right to compensation.',
      sections: [
        {
          heading: '1. Header & Business Identification',
          body: 'Your invoice must clearly state your business name, logo, legal address, contact email, and phone number. Equally important is identifying your client\'s company name, point of contact, and billing address.',
          bullets: [
            'Business Name & Logo',
            'Tax ID / VAT Number (if applicable)',
            'Client Billing Contact & Department',
          ],
          proTip: 'Always address the invoice to the accounts payable manager or project owner directly to prevent routing delays.',
        },
        {
          heading: '2. Unique Invoice Number & Invoice Date',
          body: 'Every invoice requires a unique sequential invoice number (e.g., INV-2026-001). Sequential numbering is mandatory for accounting compliance and enables rapid searching during tax audits.',
          bullets: [
            'Sequential numbering structure (e.g., INV-001 or YYYY-MM-001)',
            'Invoice Issue Date (the exact day it is delivered)',
            'Explicit Due Date calculated from your payment terms',
          ],
        },
        {
          heading: '3. Detailed Line-Item Breakdown',
          body: 'Avoid vague descriptions like "Consulting services". Break down your deliverables into individual line items with quantity, unit rate, hours worked, and subtotal per item.',
          proTip: 'Itemized invoices build client trust and result in 35% faster invoice approval rates.',
        },
      ],
      conclusion: 'By standardizing your invoice workflow with automated numbering, clear line items, and explicit payment instructions, you transform billing from a friction point into a seamless experience.',
    },
  },
  {
    id: 'post-2',
    title: 'Net 15 vs. Net 30 vs. Due Upon Receipt: Choosing the Best Payment Terms',
    slug: 'net-15-vs-net-30-payment-terms-explained',
    category: 'Payment Terms',
    readTime: '5 min read',
    date: 'August 2026',
    summary: 'Compare payment term strategies to optimize your cash flow. Discover when to use Net 15, Net 30, upfront deposits, or early payment discounts.',
    content: {
      intro: 'Payment terms dictate when your client is legally required to pay for completed services. Selecting the right terms balances your cash flow needs with client expectations.',
      sections: [
        {
          heading: 'Due Upon Receipt',
          body: 'Payment is required immediately upon delivery of the invoice. Ideal for one-time projects, small billing amounts, or new clients without established payment histories.',
        },
        {
          heading: 'Net 15 & Net 30 Days',
          body: 'Net 15 means payment is due within 15 calendar days, while Net 30 grants a 30-day window. Net 15 is the preferred standard for service freelancers, providing a healthy balance between client processing time and cash flow predictability.',
          bullets: [
            'Net 15: Fast cash flow turnaround for freelancers',
            'Net 30: Standard enterprise and corporate accounts payable timelines',
            '2/10 Net 30: 2% discount if paid within 10 days, full price at 30 days',
          ],
          proTip: 'Offering a 2% early payment discount (2/10 Net 30) can accelerate client payments by up to 10 days.',
        },
        {
          heading: '50% Upfront Deposit Structure',
          body: 'For large retainer projects or long-term developments, requiring a 50% deposit upfront before work commences protects you against client ghosting and covers early expenses.',
        },
      ],
      conclusion: 'Include explicit payment terms on both your initial project contract and every issued invoice.',
    },
  },
  {
    id: 'post-3',
    title: 'How to Handle Unpaid Invoices & Enforce Late Fees (Email Templates)',
    slug: 'handle-unpaid-invoices-late-fee-email-templates',
    category: 'Late Payments',
    readTime: '7 min read',
    date: 'August 2026',
    summary: 'Step-by-step framework for recovering overdue client payments. Learn how to write polite payment reminders and charge late fees legally.',
    content: {
      intro: 'Unpaid invoices jeopardize your business stability. Having a systematic reminder process allows you to collect overdue funds firmly while maintaining positive client relationships.',
      sections: [
        {
          heading: 'Automated Friendly Reminders (3 Days Before Due Date)',
          body: 'Send a gentle polite reminder 3 days before the invoice is due attached with the PDF copy. Most late payments are simply oversight, not malice.',
          proTip: 'Include a direct payment link or wire transfer instructions right in the email body.',
        },
        {
          heading: 'Overdue Follow-Up (Day 1 & Day 7 Post Due Date)',
          body: 'If the due date passes without payment, send a direct polite notice referencing the invoice number, balance due, and original due date.',
        },
        {
          heading: 'Charging Interest & Late Penalty Fees',
          body: 'Standard freelance late fees range from 1.5% to 2.0% monthly interest added to the overdue balance. To enforce late fees, the penalty clause must be clearly stated in your original project contract and on the original invoice.',
          bullets: [
            'Example clause: "Late payments are subject to a 1.5% monthly service fee."',
            'Send an updated revised invoice with the added late fee line item.',
          ],
        },
      ],
      conclusion: 'Consistent follow-up schedules ensure you get paid promptly without damaging professional relationships.',
    },
  },
  {
    id: 'post-4',
    title: 'Why 100% Client-Side Invoicing Keeps Your Financial Data Safe',
    slug: 'client-side-privacy-serverless-invoicing-benefits',
    category: 'Privacy & Security',
    readTime: '4 min read',
    date: 'August 2026',
    summary: 'Discover how serverless, browser-native invoice generators eliminate data breach risks by storing all sensitive financial records locally on your device.',
    content: {
      intro: 'Traditional cloud invoicing apps store your private client details, rates, and financial transactions on centralized remote database servers. If those servers suffer a data breach, your sensitive business data can be exposed.',
      sections: [
        {
          heading: 'Zero Backend Server Storage',
          body: 'With a 100% client-side app, all invoice creation, calculation, and PDF generation happen directly inside your web browser using HTML5 LocalStorage and IndexedDB technology.',
          bullets: [
            'No server data leaks',
            'No tracking of client contact info',
            'No selling of business analytics',
          ],
        },
        {
          heading: 'Complete Offline Capability',
          body: 'Because your app logic and stored clients run locally in your browser, you can create, edit, and print invoices even without an active internet connection.',
        },
      ],
      conclusion: 'Enjoy total control over your business records with zero cloud exposure.',
    },
  },
];

interface BlogSectionProps {
  onStartInvoiceClick: () => void;
}

export function BlogSection({ onStartInvoiceClick }: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = ['All', 'Invoicing 101', 'Payment Terms', 'Late Payments', 'Privacy & Security'];

  const filteredPosts = selectedCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === selectedCategory);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Invoicing Knowledge Hub & Guides</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Master Freelance Invoicing & Financial Best Practices
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Expert guides, payment term strategies, and late payment recovery frameworks to help you get paid faster.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs font-semibold'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setActivePost(post)}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold border border-amber-500/20">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-gray-400 font-mono">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors leading-snug">
                {post.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {post.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Reader Modal Drawer */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 pr-8">
              <div className="flex items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold border border-amber-500/20">
                  {activePost.category}
                </span>
                <span className="text-gray-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activePost.readTime}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {activePost.title}
              </h2>
            </div>

            {/* Article Body */}
            <div className="space-y-6 text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed border-t border-b border-gray-100 dark:border-gray-800 py-6">
              <p className="font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
                {activePost.content.intro}
              </p>

              {activePost.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {sec.heading}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {sec.body}
                  </p>

                  {sec.bullets && (
                    <ul className="space-y-1.5 pl-4 pt-1">
                      {sec.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.proTip && (
                    <div className="mt-3 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Pro Tip: </strong>
                        {sec.proTip}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-5 rounded-2xl space-y-2 text-emerald-950 dark:text-emerald-200">
                <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Key Takeaway
                </h4>
                <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300">
                  {activePost.content.conclusion}
                </p>
              </div>
            </div>

            {/* Modal Footer Call-To-Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-gray-400 font-mono">
                Published by Free Invoice Generator
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActivePost(null);
                    onStartInvoiceClick();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Create Invoice Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
