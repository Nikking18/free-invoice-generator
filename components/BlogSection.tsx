'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  X,
  Calendar,
  Layers,
  Globe
} from 'lucide-react';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { AppLanguage } from '../lib/i18n/translations';

export interface MultilingualContent {
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  intro: string;
  sections: {
    heading: string;
    body: string;
    bullets?: string[];
    proTip?: string;
  }[];
  conclusion: string;
}

export interface BlogPostData {
  id: string;
  slug: string;
  translations: Record<AppLanguage, MultilingualContent>;
}

// Complete Multilingual Blog #1 & Topic Roadmap
export const BLOG_POSTS: BlogPostData[] = [
  {
    id: 'blog-1',
    slug: 'professional-freelance-invoicing-guide',
    translations: {
      en: {
        title: 'The Ultimate Guide to Professional Freelance Invoicing (2026 Checklist)',
        category: 'Invoicing 101',
        readTime: '6 min read',
        date: 'August 2026',
        summary: 'Master the anatomy of a professional invoice. Learn what essential fields must be included to avoid payment delays and get paid on time every time.',
        intro: 'Creating a professional invoice is one of the most vital operations in running a successful freelance or small business. A clear, well-structured invoice eliminates confusion, speeds up approvals from corporate accounting departments, and protects your legal right to compensation.',
        sections: [
          {
            heading: '1. Header & Business Identification',
            body: 'Your invoice must clearly state your business name, logo, legal address, contact email, and phone number. Equally important is identifying your client\'s company name, point of contact, and billing address.',
            bullets: [
              'Business Legal Name & Logo',
              'Tax ID / VAT Number (mandatory for EU & international transactions)',
              'Client Billing Contact & Department Name',
            ],
            proTip: 'Always address the invoice directly to the accounts payable manager or project lead to prevent routing delays.',
          },
          {
            heading: '2. Unique Invoice Number & Issue Date',
            body: 'Every invoice requires a unique sequential invoice number (e.g., INV-2026-001). Sequential numbering is mandatory for tax compliance and enables rapid searching during financial audits.',
            bullets: [
              'Sequential numbering structure (e.g., INV-001 or YYYY-MM-001)',
              'Invoice Issue Date (the exact date of issue)',
              'Explicit Due Date calculated strictly from your payment terms',
            ],
          },
          {
            heading: '3. Detailed Line-Item Breakdown',
            body: 'Avoid vague descriptions like "Consulting services". Break down your deliverables into individual line items with quantity, unit rate, hours worked, and subtotal per item.',
            proTip: 'Itemized invoices build client trust and result in 35% faster approval rates by finance departments.',
          },
          {
            heading: '4. Explicit Payment Terms & Payment Instructions',
            body: 'Clearly outline your accepted payment methods (bank transfer, Stripe, PayPal) along with account numbers or payment handles. State your payment terms (e.g., Net 15 Days) and any applicable late fee terms.',
          },
        ],
        conclusion: 'By standardizing your invoice workflow with automated numbering, clear line items, and explicit payment instructions, you transform billing from a friction point into a seamless experience.',
      },
      es: {
        title: 'La Guía Definitiva de Facturación Profesional para Freelancers (Lista de Control 2026)',
        category: 'Facturación 101',
        readTime: '6 min de lectura',
        date: 'Agosto 2026',
        summary: 'Domina la anatomía de una factura profesional. Conoce los campos esenciales que deben incluirse para evitar retrasos y cobrar a tiempo siempre.',
        intro: 'Crear una factura profesional es una de las operaciones más vitales para dirigir un negocio independiente exitoso. Una factura clara elimina confusiones, acelera aprobaciones y protege tu derecho al cobro.',
        sections: [
          {
            heading: '1. Encabezado e Identificación de la Empresa',
            body: 'Tu factura debe indicar claramente el nombre de tu empresa, dirección, correo y teléfono. Es igual de importante identificar los datos de facturación de tu cliente.',
            bullets: [
              'Nombre legal y logotipo de la empresa',
              'Número de Identificación Fiscal / NIF / RUC',
              'Contacto y departamento de facturación del cliente',
            ],
            proTip: 'Dirige la factura directamente al responsable de cuentas por pagar para evitar demoras.',
          },
          {
            heading: '2. Número de Factura Único y Fecha de Emisión',
            body: 'Cada factura requiere un número secuencial único (ej. FACT-2026-001). La numeración correlativa es obligatoria para la contabilidad oficial.',
            bullets: [
              'Estructura de numeración secuencial',
              'Fecha exacta de emisión',
              'Fecha límite de pago calculada según tus términos',
            ],
          },
          {
            heading: '3. Desglose Detallado de Conceptos',
            body: 'Evita descripciones vagas. Detalla cada servicio con cantidad, precio unitario, horas trabajadas y subtotal.',
            proTip: 'Las facturas desglosadas generan confianza y se aprueban hasta un 35% más rápido.',
          },
          {
            heading: '4. Términos e Instrucciones de Pago Claras',
            body: 'Detalla tus métodos de pago aceptados (transferencia bancaria, IBAN, PayPal) y especifica los plazos (ej. Neto 15 Días).',
          },
        ],
        conclusion: 'Al estandarizar tus facturas con numeración automática e instrucciones claras, transformas el cobro en un proceso ágil y profesional.',
      },
      fr: {
        title: 'Le Guide Ultime de la Facturation Professionnelle pour Freelances (Checklist 2026)',
        category: 'Facturation 101',
        readTime: '6 min de lecture',
        date: 'Août 2026',
        summary: 'Maîtrisez l\'anatomie d\'une facture professionnelle. Découvrez les champs essentiels pour éviter les retards et être payé à temps.',
        intro: 'La création d\'une facture professionnelle est essentielle à la réussite de votre activité indépendante. Une facture claire accélère la validation par le service comptabilité.',
        sections: [
          {
            heading: '1. En-tête et Identification de l\'Entreprise',
            body: 'Indiquez clairement votre nom commercial, adresse, email et SIRET/TVA. Identifiez également le destinataire chez votre client.',
            bullets: [
              'Nom légal et logo',
              'Numéro SIRET / Numéro de TVA Intracommunautaire',
              'Coordonnées du service facturation client',
            ],
            proTip: 'Adressez la facture directement au responsable comptable pour accélérer le traitement.',
          },
          {
            heading: '2. Numéro de Facture Unique et Date d\'Émission',
            body: 'Chaque facture doit comporter un numéro séquentiel unique (ex. FAC-2026-001) conformément aux obligations comptables.',
            bullets: [
              'Numérotation chronologique continue',
              'Date d\'émission exacte',
              'Date d\'échéance explicite',
            ],
          },
          {
            heading: '3. Détail des Prestations et Services',
            body: 'Détaillez vos prestations par ligne avec quantité, prix unitaire, heures et sous-total.',
            proTip: 'Un détail précis renforce la confiance et accélère le paiement de 35%.',
          },
          {
            heading: '4. Conditions et Instructions de Règlement',
            body: 'Précisez vos coordonnées bancaires (IBAN/BIC), vos modes de paiement et les pénalités de retard applicables.',
          },
        ],
        conclusion: 'En numérotant et détaillant vos factures avec soin, vous sécurisez vos encaissements au quotidien.',
      },
      de: {
        title: 'Der Ultimative Leitfaden für Professionelle Freiberufler-Rechnungen (Checkliste 2026)',
        category: 'Rechnungswesen 101',
        readTime: '6 Min. Lesezeit',
        date: 'August 2026',
        summary: 'Meistern Sie den Aufbau einer professionellen Rechnung. Erfahren Sie, welche Pflichtangaben erforderlich sind, um pünktlich bezahlt zu werden.',
        intro: 'Die Erstellung einer ordnungsgemäßen Rechnung ist entscheidend für den Erfolg Ihres Freiberufler-Geschäfts. Eine transparente Rechnung verhindert Rückfragen in der Buchhaltung.',
        sections: [
          {
            heading: '1. Kopfzeile & Unternehmensdaten',
            body: 'Ihre Rechnung muss Firmennamen, Anschrift, E-Mail und Steuernummer/Ust-IdNr. sowie die Daten des Rechnungsempfängers enthalten.',
            bullets: [
              'Firmenname & Logo',
              'Steuernummer / Umsatzsteuer-Identifikationsnummer (Ust-IdNr.)',
              'Kunden-Ansprechpartner & Rechnungsadresse',
            ],
            proTip: 'Senden Sie die Rechnung direkt an die zuständige Buchhaltung.',
          },
          {
            heading: '2. Fortlaufende Rechnungsnummer & Rechnungsdatum',
            body: 'Jede Rechnung benötigt eine eindeutige fortlaufende Nummer (z. B. RE-2026-001) gemäß den gesetzlichen Vorgaben.',
            bullets: [
              'Fortlaufende Nummernstruktur',
              'Rechnungsdatum (Ausstellungsdatum)',
              'Konkretes Fälligkeitsdatum',
            ],
          },
          {
            heading: '3. Detaillierte Leistungsaufschlüsselung',
            body: 'Schlüsseln Sie Ihre Leistungen nach Menge, Einzelpreis und Gesamtbetrag auf.',
            proTip: 'Detaillierte Rechnungen sorgen für Vertrauen und beschleunigen die Freigabe um 35 %.',
          },
          {
            heading: '4. Zahlungsbedingungen & Bankverbindung',
            body: 'Geben Sie IBAN, BIC, Zahlungsziel (z. B. 14 Tage netto) sowie etwaige Verzugszinsen an.',
          },
        ],
        conclusion: 'Mit einer strukturierten Rechnungsstellung sichern Sie Ihren Liquiditätsfluss professionell ab.',
      },
    },
  },
];

// Content UI Translations
const BLOG_UI_TRANSLATIONS: Record<AppLanguage, {
  tag: string;
  title: string;
  subtitle: string;
  readArticle: string;
  keyTakeaway: string;
  createInvoiceNow: string;
  publishedBy: string;
  upcomingTopicsTitle: string;
  upcomingTopicsSubtitle: string;
}> = {
  en: {
    tag: 'Invoicing Knowledge Hub & Guides',
    title: 'Master Freelance Invoicing & Financial Best Practices',
    subtitle: 'Expert guides, payment term strategies, and late payment recovery frameworks to help you get paid faster.',
    readArticle: 'Read Full Article',
    keyTakeaway: 'Key Takeaway',
    createInvoiceNow: 'Create Invoice Now',
    publishedBy: 'Published by Free Invoice Generator',
    upcomingTopicsTitle: 'Upcoming Blog Series Topics',
    upcomingTopicsSubtitle: 'We are expanding our knowledge base step-by-step. Here are the next high-ranking topics in our queue:',
  },
  es: {
    tag: 'Centro de Conocimiento y Guías de Facturación',
    title: 'Domina la Facturación Freelance y las Mejores Prácticas',
    subtitle: 'Guías expertas, estrategias de plazos de pago y plantillas para cobrar más rápido.',
    readArticle: 'Leer Artículo Completo',
    keyTakeaway: 'Conclusión Clave',
    createInvoiceNow: 'Crear Factura Ahora',
    publishedBy: 'Publicado por Generador de Facturas Gratis',
    upcomingTopicsTitle: 'Próximos Temas del Blog',
    upcomingTopicsSubtitle: 'Estamos ampliando nuestra base de conocimientos paso a paso. Próximos temas:',
  },
  fr: {
    tag: 'Guides & Centre de Connaissances Facturation',
    title: 'Maîtrisez la Facturation Freelance & Bonnes Pratiques',
    subtitle: 'Guides d\'experts, stratégies de paiement et conseils pour être payé plus vite.',
    readArticle: 'Lire l\'Article Complet',
    keyTakeaway: 'À Retenir',
    createInvoiceNow: 'Créer une Facture Maintenant',
    publishedBy: 'Publié par Générateur de Facture Gratuit',
    upcomingTopicsTitle: 'Prochains Sujets à Paraître',
    upcomingTopicsSubtitle: 'Nous enrichissons notre guide étape par étape. Prochains articles en préparation :',
  },
  de: {
    tag: 'Wissenszentrum & Leitfäden für Rechnungsstellung',
    title: 'Meistern Sie Freiberufler-Rechnungen & Finanzen',
    subtitle: 'Praxis-Leitfäden, Zahlungsziel-Strategien und Tipps für schnelle Zahlungseingänge.',
    readArticle: 'Vollständigen Artikel Lesen',
    keyTakeaway: 'Wichtigstes Fazit',
    createInvoiceNow: 'Jetzt Rechnung Erstellen',
    publishedBy: 'Veröffentlicht von Kostenloser Rechnungs-Generator',
    upcomingTopicsTitle: 'Kommende Blog-Themen',
    upcomingTopicsSubtitle: 'Wir erweitern unsere Wissensdatenbank Schritt für Schritt. Die nächsten Themen:',
  },
};

// Planned Topics Roadmap
const UPCOMING_TOPICS = [
  {
    num: '02',
    title: 'Net 15 vs. Net 30 vs. Due Upon Receipt: Choosing the Best Payment Terms',
    category: 'Payment Terms',
    desc: 'Compare payment term strategies to optimize cash flow and incentivize early payments.',
  },
  {
    num: '03',
    title: 'How to Handle Unpaid Invoices & Enforce Late Fees (Email Templates)',
    category: 'Late Payments',
    desc: 'Step-by-step payment reminder schedules and legal 1.5% interest penalty clauses.',
  },
  {
    num: '04',
    title: 'Why 100% Client-Side Invoicing Keeps Your Financial Data Safe',
    category: 'Privacy & Security',
    desc: 'How browser-native local storage eliminates cloud server breach risks.',
  },
];

interface BlogSectionProps {
  onStartInvoiceClick: () => void;
}

export function BlogSection({ onStartInvoiceClick }: BlogSectionProps) {
  const { appLanguage } = useTranslation();
  const [activePost, setActivePost] = useState<BlogPostData | null>(null);

  const ui = BLOG_UI_TRANSLATIONS[appLanguage] || BLOG_UI_TRANSLATIONS['en'];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{ui.tag}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {ui.title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          {ui.subtitle}
        </p>
      </div>

      {/* Published Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BLOG_POSTS.map((post) => {
          const content = post.translations[appLanguage] || post.translations['en'];
          return (
            <article
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold border border-amber-500/20">
                    {content.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 font-mono">
                    <Clock className="w-3 h-3" />
                    {content.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors leading-snug">
                  {content.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                  {content.summary}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {content.date}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
                  <span>{ui.readArticle}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Planned Topics Roadmap Section */}
      <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {ui.upcomingTopicsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {ui.upcomingTopicsSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {UPCOMING_TOPICS.map((topic) => (
            <div
              key={topic.num}
              className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 p-5 rounded-xl space-y-2 relative"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-gray-400">Topic {topic.num}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {topic.category}
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                {topic.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {topic.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reader Modal Drawer */}
      {activePost && (() => {
        const postContent = activePost.translations[appLanguage] || activePost.translations['en'];
        return (
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
                    {postContent.category}
                  </span>
                  <span className="text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {postContent.readTime}
                  </span>
                  <span className="text-gray-400 font-mono flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {appLanguage.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {postContent.title}
                </h2>
              </div>

              {/* Article Body */}
              <div className="space-y-6 text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed border-t border-b border-gray-100 dark:border-gray-800 py-6">
                <p className="font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
                  {postContent.intro}
                </p>

                {postContent.sections.map((sec, idx) => (
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
                    {ui.keyTakeaway}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300">
                    {postContent.conclusion}
                  </p>
                </div>
              </div>

              {/* Modal Footer Call-To-Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs text-gray-400 font-mono">
                  {ui.publishedBy}
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
                    <span>{ui.createInvoiceNow}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
