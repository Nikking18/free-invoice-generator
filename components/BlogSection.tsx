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
  Globe
} from 'lucide-react';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { AppLanguage } from '../lib/i18n/translations';

interface BlogContentSection {
  heading: string;
  body: string;
  bullets?: string[];
  proTip?: string;
}

interface BlogPostLocalized {
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  intro: string;
  sections: BlogContentSection[];
  conclusion: string;
}

const BLOG_POST_1: Record<AppLanguage, BlogPostLocalized> = {
  en: {
    title: 'The Ultimate Guide to Professional Freelance Invoicing: What to Include & Best Practices',
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
        proTip: 'Non-sequential or missing invoice numbers trigger tax audit red flags and delay accounting processing.',
      },
      {
        heading: '3. Detailed Line-Item Breakdown',
        body: 'Avoid vague descriptions like "Consulting services". Break down your deliverables into individual line items with quantity, unit rate, hours worked, and subtotal per item.',
        bullets: [
          'Clear deliverable descriptions',
          'Quantity & Unit Price breakdown',
          'Taxable indicator flags per item',
        ],
        proTip: 'Itemized invoices build client trust and result in 35% faster invoice approval rates.',
      },
      {
        heading: '4. Explicit Payment Terms & Payment Instructions',
        body: 'State payment terms clearly (e.g., Net 15 Days, Net 30 Days, or 50% Deposit). Provide exact bank transfer details (IBAN/SWIFT), PayPal email, or payment link.',
        bullets: [
          'Net 15 / Net 30 payment terms',
          'Bank SWIFT/IBAN & ACH details',
          'Late payment penalty terms (e.g., 1.5% monthly interest)',
        ],
        proTip: 'Offering a 2% early payment discount (2/10 Net 30) can accelerate client payments by up to 10 days.',
      },
    ],
    conclusion: 'By standardizing your invoice workflow with automated numbering, clear line items, and explicit payment instructions, you transform billing from a friction point into a seamless experience.',
  },
  es: {
    title: 'La Guía Definitiva de Facturación Freelance Profesional: Qué Incluir y Mejores Prácticas',
    category: 'Facturación 101',
    readTime: '6 min de lectura',
    date: 'Agosto 2026',
    summary: 'Domine la estructura de una factura profesional. Aprenda qué campos esenciales incluir para evitar retrasos en sus cobros y recibir pagos a tiempo.',
    intro: 'Crear una factura profesional es una operación fundamental para freelancers y pequeñas empresas. Una factura bien estructurada elimina confusiones, acelera las aprobaciones contables y protege sus derechos de cobro.',
    sections: [
      {
        heading: '1. Encabezado e Identificación Comercial',
        body: 'Su factura debe indicar claramente el nombre de su empresa, logotipo, dirección fiscal, correo de contacto y teléfono, así como la información del cliente.',
        bullets: [
          'Nombre comercial y Logotipo',
          'Número de Identificación Fiscal / NIF / RFC',
          'Contacto de Facturación del Cliente',
        ],
        proTip: 'Dirija siempre la factura directamente al responsable de cuentas por pagar para evitar demoras.',
      },
      {
        heading: '2. Número de Factura Secuencial Único y Fecha',
        body: 'Cada factura requiere un número correlativo único (ej. FACT-2026-001). La numeración secuencial es obligatoria para el cumplimiento fiscal.',
        bullets: [
          'Estructura secuencial (ej. FACT-001 o AAAA-MM-001)',
          'Fecha de emisión exacta',
          'Fecha de vencimiento calculada',
        ],
        proTip: 'Las facturas sin número secuencial generan alertas en auditorías fiscales y retrasan cobros.',
      },
      {
        heading: '3. Desglose Detallado de Artículos y Servicios',
        body: 'Evite descripciones vagas como "Servicios de consultoría". Desglose sus entregables en líneas individuales indicando cantidad, precio unitario y subtotal.',
        bullets: [
          'Descripción detallada de entregables',
          'Desglose de Cantidad y Precio Unitario',
          'Indicador de Impuestos por artículo',
        ],
        proTip: 'Las facturas detalladas generan mayor confianza y se aprueban un 35% más rápido.',
      },
      {
        heading: '4. Términos e Instrucciones de Pago Claras',
        body: 'Especifique los plazos de pago (ej. Neto a 15 días, 30 días o Depósito del 50%). Proporcione datos bancarios precisos (IBAN/SWIFT) o enlaces de pago.',
        bullets: [
          'Términos Neto 15 / Neto 30 días',
          'Datos bancarios IBAN, SWIFT o PayPal',
          'Cláusula de penalización por pago tardío (ej. 1.5% mensual)',
        ],
        proTip: 'Ofrecer un descuento por pago anticipado del 2% puede adelantar sus cobros hasta 10 días.',
      },
    ],
    conclusion: 'Estandarizar su proceso de facturación con numeración automática e instrucciones claras transforma el cobro en una experiencia fluida.',
  },
  fr: {
    title: 'Le Guide Ultime de la Facturation Indépendante Professionnelle: Éléments Essentiels et Bonnes Pratiques',
    category: 'Facturation 101',
    readTime: '6 min de lecture',
    date: 'Août 2026',
    summary: 'Maîtrisez la structure d\'une facture professionnelle. Découvrez les mentions obligatoires pour éviter les retards de paiement et encaisser à temps.',
    intro: 'La création d\'une facture professionnelle est essentielle pour le succès des indépendants et PME. Une facture claire accélère la validation comptable et protège vos revenus.',
    sections: [
      {
        heading: '1. En-tête et Identification de l\'Entreprise',
        body: 'Votre facture doit indiquer clairement votre nom commercial, logo, adresse légale, email, numéro SIRET/TVA ainsi que les coordonnées du client.',
        bullets: [
          'Nom d\'entreprise & Logo',
          'Numéro SIRET / Numéro de TVA intracommunautaire',
          'Contact et service facturation du client',
        ],
        proTip: 'Adressez toujours la facture directement au responsable de la comptabilité pour éviter les retards.',
      },
      {
        heading: '2. Numéro de Facture Séquentiel Unique et Dates',
        body: 'Chaque facture doit comporter un numéro séquentiel ininterrompu (ex. FACT-2026-001), obligatoire pour la conformité fiscale.',
        bullets: [
          'Numérotation séquentielle (ex. FACT-001)',
          'Date d\'émission exacte',
          'Date d\'échéance calculée',
        ],
        proTip: 'Une numérotation non séquentielle est une anomalie majeure lors des contrôles fiscaux.',
      },
      {
        heading: '3. Détail des Prestations et Tarifs',
        body: 'Évitez les descriptions vagues. Détaillez chaque prestation avec quantité, prix unitaire, nombre d\'heures et sous-total.',
        bullets: [
          'Description précise des livrables',
          'Quantité et Prix Unitaire',
          'Taux de TVA applicable par article',
        ],
        proTip: 'Des factures détaillées augmentent le taux d\'approbation rapide de 35%.',
      },
      {
        heading: '4. Conditions et Instructions de Paiement',
        body: 'Indiquez clairement le délai de paiement (Net 15 jours, Net 30 jours, ou acompte de 50%) ainsi que vos coordonnées bancaires (IBAN/BIC).',
        bullets: [
          'Conditions de paiement Net 15 / Net 30',
          'Coordonnées bancaires IBAN & BIC',
          'Pénalités de retard applicables (ex. 1.5% par mois)',
        ],
        proTip: 'Proposer un d\'escompte de 2% pour paiement anticipé accélère les règlements de 10 jours.',
      },
    ],
    conclusion: 'En standardisant votre processus de facturation, vous transformez l\'encaissement en un processus fluide et professionnel.',
  },
  de: {
    title: 'Der ultimative Leitfaden für professionelle Rechnungsstellung: Wichtige Bestandteile & Best Practices',
    category: 'Rechnungswesen 101',
    readTime: '6 Min. Lesezeit',
    date: 'August 2026',
    summary: 'Meistern Sie den Aufbau einer professionellen Rechnung. Lernen Sie alle Pflichtangaben kennen, um Zahlungsverzögerungen zu vermeiden.',
    intro: 'Eine professionelle Rechnung ist das Rückgrat jedes Freelancers und Unternehmens. Eine ordnungsgemäße Rechnung beschleunigt die Buchhaltungsfreigabe und sichert Ihre Zahlungsansprüche.',
    sections: [
      {
        heading: '1. Kopfzeile & Unternehmensangaben',
        body: 'Ihre Rechnung muss Firmenname, Logo, Adresse, E-Mail, Telefonnummer sowie Ihre Steuernummer / USt-IdNr. und Kundendaten enthalten.',
        bullets: [
          'Firmenname & Logo',
          'Steuernummer / USt-IdNr.',
          'Rechnungsadresse des Kunden',
        ],
        proTip: 'Richten Sie die Rechnung direkt an den zuständigen Ansprechpartner der Buchhaltung.',
      },
      {
        heading: '2. Fortlaufende Rechnungsnummer & Datumsangaben',
        body: 'Jede Rechnung benötigt eine einmalige fortlaufende Rechnungsnummer (z. B. RE-2026-001) gemäß GoBD-Standards.',
        bullets: [
          'Fortlaufendes Nummernsystem (z. B. RE-001)',
          'Ausstellungsdatum der Rechnung',
          'Fälligkeitsdatum gemäß Zahlungsziel',
        ],
        proTip: 'Lücken in der Rechnungsnummerierung führen bei Betriebsprüfungen zu Beanstandungen.',
      },
      {
        heading: '3. Detaillierte Postenaufstellung',
        body: 'Vermeiden Sie pauschale Formulierungen. Schlüsseln Sie Leistungen nach Menge, Einzelpreis, Stundensatz und Nettobetrag auf.',
        bullets: [
          'Präzise Leistungsbeschreibung',
          'Menge & Einzelpreis',
          'Ausgewiesener Steuersatz je Position',
        ],
        proTip: 'Detaillierte Aufstellungen erhöhen die Freigabegeschwindigkeit um 35%.',
      },
      {
        heading: '4. Zahlungsbedingungen & Bankverbindung',
        body: 'Nennen Sie Ihr Zahlungsziel (z. B. 14 Tage netto, 30 Tage netto) und geben Sie Ihre Bankverbindung (IBAN/BIC) an.',
        bullets: [
          'Zahlungsziel (z. B. 14 Tage netto)',
          'Bankverbindung IBAN & BIC',
          'Verzugszinsen-Hinweis (z. B. 1,5% mtl.)',
        ],
        proTip: 'Gewähren Sie 2% Skonto bei Zahlung innerhalb von 10 Tagen für schnellere Geldeingänge.',
      },
    ],
    conclusion: 'Ein strukturierter Rechnungsprozess garantiert pünktliche Zahlungseingänge und professionelles Auftreten.',
  },
};

interface BlogSectionProps {
  onStartInvoiceClick: () => void;
}

export function BlogSection({ onStartInvoiceClick }: BlogSectionProps) {
  const { appLanguage } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const post = BLOG_POST_1[appLanguage] || BLOG_POST_1.en;

  const uiLabels = {
    en: {
      hubBadge: 'Invoicing Knowledge Hub & Guides',
      hubTitle: 'Master Freelance Invoicing & Financial Best Practices',
      hubSubtitle: 'Expert guides, payment term strategies, and late payment recovery frameworks to help you get paid faster.',
      readFull: 'Read Full Article',
      keyTakeaway: 'Key Takeaway',
      createNow: 'Create Invoice Now',
      publishedBy: 'Published by Free Invoice Generator',
      langNotice: 'Reading in',
    },
    es: {
      hubBadge: 'Centro de Conocimiento y Guías de Facturación',
      hubTitle: 'Domine la Facturación Freelance y Mejores Prácticas',
      hubSubtitle: 'Guías expertas, estrategias de pago y plantillas para cobrar sus facturas más rápido.',
      readFull: 'Leer Artículo Completo',
      keyTakeaway: 'Conclusión Clave',
      createNow: 'Crear Factura Ahora',
      publishedBy: 'Publicado por Generador de Facturas Gratis',
      langNotice: 'Leyendo en',
    },
    fr: {
      hubBadge: 'Centre de Connaissances & Guides de Facturation',
      hubTitle: 'Maîtrisez la Facturation et les Bonnes Pratiques',
      hubSubtitle: 'Guides d\'experts et stratégies de paiement pour accélérer vos règlements.',
      readFull: 'Lire l\'Article Complet',
      keyTakeaway: 'Points Clés',
      createNow: 'Créer une Facture',
      publishedBy: 'Publié par Générateur de Facture Gratuit',
      langNotice: 'Lecture en',
    },
    de: {
      hubBadge: 'Wissensbereich & Leitfäden zur Rechnungsstellung',
      hubTitle: 'Rechnungsstellung & Finanzielle Best Practices Meistern',
      hubSubtitle: 'Experten-Leitfäden und Zahlungsstrategien für schnellere Zahlungseingänge.',
      readFull: 'Vollständigen Artikel Lesen',
      keyTakeaway: 'Kernaussage',
      createNow: 'Jetzt Rechnung Erstellen',
      publishedBy: 'Veröffentlicht von Kostenloser Rechnungsgenerator',
      langNotice: 'Lesen auf',
    },
  }[appLanguage] || {
    hubBadge: 'Invoicing Knowledge Hub & Guides',
    hubTitle: 'Master Freelance Invoicing & Financial Best Practices',
    hubSubtitle: 'Expert guides, payment term strategies, and late payment recovery frameworks to help you get paid faster.',
    readFull: 'Read Full Article',
    keyTakeaway: 'Key Takeaway',
    createNow: 'Create Invoice Now',
    publishedBy: 'Published by Free Invoice Generator',
    langNotice: 'Reading in',
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{uiLabels.hubBadge}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {uiLabels.hubTitle}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          {uiLabels.hubSubtitle}
        </p>

        {/* Current Active Language Indicator */}
        <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium pt-1">
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>{uiLabels.langNotice}: <strong className="uppercase text-gray-800 dark:text-gray-200">{appLanguage}</strong></span>
        </div>
      </div>

      {/* Featured Blog Card */}
      <div className="max-w-4xl mx-auto">
        <article
          onClick={() => setIsModalOpen(true)}
          className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold border border-amber-500/20">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-gray-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors leading-snug">
            {post.title}
          </h3>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            {post.summary}
          </p>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
              <span>{uiLabels.readFull}</span>
              <ArrowRight className="w-4 h-4 text-emerald-500" />
            </span>
          </div>
        </article>
      </div>

      {/* Full Article Reader Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 pr-8">
              <div className="flex items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold border border-amber-500/20">
                  {post.category}
                </span>
                <span className="text-gray-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {post.title}
              </h2>
            </div>

            {/* Article Content */}
            <div className="space-y-6 text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed border-t border-b border-gray-100 dark:border-gray-800 py-6">
              <p className="font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
                {post.intro}
              </p>

              {post.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2.5">
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
                  {uiLabels.keyTakeaway}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300">
                  {post.conclusion}
                </p>
              </div>
            </div>

            {/* Modal Footer Call-To-Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-gray-400 font-mono">
                {uiLabels.publishedBy}
              </span>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onStartInvoiceClick();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{uiLabels.createNow}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
