import { AppLanguage, InvoiceLanguage } from './i18n/translations';

export type { AppLanguage, InvoiceLanguage };

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export type PdfTemplateStyle = 'classic' | 'minimal' | 'compact';

export type UnitType = 
  | 'hour' 
  | 'item' 
  | 'service' 
  | 'day' 
  | 'flat' 
  | 'sq ft' 
  | 'mile' 
  | 'custom';

export type DiscountType = 'flat' | 'percent';

export interface BusinessProfile {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  taxId?: string;
  logoBase64?: string;
  defaultCurrency: string;
  defaultCurrencySymbol: string;
  defaultTaxRate: number;
  defaultPaymentTerms: string;
  defaultNotes: string;
  defaultTerms: string;
  defaultTemplateStyle?: PdfTemplateStyle;
  defaultInvoiceLanguage?: InvoiceLanguage;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReusableItem {
  id: string;
  name: string;
  description: string;
  unitType: UnitType | string;
  defaultUnitPrice: number;
  taxable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitType: UnitType | string;
  unitPrice: number;
  discount: number;
  taxable: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  status: InvoiceStatus;
  
  // Client Info
  clientId?: string;
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress: string;

  // Project Info
  projectTitle?: string;
  poNumber?: string;

  // Template Style & Language
  templateStyle?: PdfTemplateStyle;
  invoiceLanguage?: InvoiceLanguage;

  // Line items & Financials
  lineItems: LineItem[];
  invoiceDiscountType: DiscountType;
  invoiceDiscountValue: number;
  taxRate: number;
  shippingFee: number;
  amountPaid: number;

  // Notes & Footer
  notes: string;
  paymentInstructions: string;
  terms: string;

  // Computed fields saved for quick listing
  subtotal: number;
  discountTotal: number;
  taxableSubtotal: number;
  taxTotal: number;
  grandTotal: number;
  balanceDue: number;

  createdAt: string;
  updatedAt: string;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  businessProfile: BusinessProfile;
  clients: Client[];
  items: ReusableItem[];
  invoices: Invoice[];
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)', locale: 'en-GB' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)', locale: 'en-AU' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)', locale: 'ja-JP' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)', locale: 'en-IN' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan (CNY ¥)', locale: 'zh-CN' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)', locale: 'de-CH' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (S$)', locale: 'en-SG' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real (R$)', locale: 'pt-BR' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso (MX$)', locale: 'es-MX' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand (R)', locale: 'en-ZA' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar (NZ$)', locale: 'en-NZ' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)', locale: 'ar-AE' },
];

export const UNIT_TYPES: { label: string; value: UnitType }[] = [
  { label: 'Hours', value: 'hour' },
  { label: 'Items / Qty', value: 'item' },
  { label: 'Services', value: 'service' },
  { label: 'Days', value: 'day' },
  { label: 'Flat Fee', value: 'flat' },
  { label: 'Sq Ft', value: 'sq ft' },
  { label: 'Miles', value: 'mile' },
  { label: 'Custom', value: 'custom' },
];

export const PAYMENT_TERMS_OPTIONS = [
  { label: 'Due on Receipt', days: 0 },
  { label: 'Net 7 Days', days: 7 },
  { label: 'Net 15 Days', days: 15 },
  { label: 'Net 30 Days', days: 30 },
  { label: 'Net 60 Days', days: 60 },
  { label: 'Custom Date', days: -1 },
];
