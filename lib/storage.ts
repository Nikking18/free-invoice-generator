import { BusinessProfile } from './types';

const PROFILE_KEY = 'fig_business_profile';
const DARK_MODE_KEY = 'fig_dark_mode';

export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  name: 'Acme Services & Consulting',
  ownerName: 'Jane Doe',
  email: 'hello@acmeservices.example',
  phone: '(555) 234-5678',
  website: 'https://acmeservices.example',
  address: '123 Creative Studio Way\nSuite 400\nAustin, TX 78701',
  taxId: 'XX-XXXXXXX',
  logoBase64: '',
  defaultCurrency: 'USD',
  defaultCurrencySymbol: '$',
  defaultTaxRate: 8.25,
  defaultPaymentTerms: 'Net 15 Days',
  defaultNotes: 'Thank you for your business! Please remit payment within the agreed terms.',
  defaultTerms: 'Payment due within terms. Late payments subject to 1.5% monthly service fee.',
};

export function getStoredBusinessProfile(): BusinessProfile {
  if (typeof window === 'undefined') return DEFAULT_BUSINESS_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_BUSINESS_PROFILE;
    return { ...DEFAULT_BUSINESS_PROFILE, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to parse stored business profile:', err);
    return DEFAULT_BUSINESS_PROFILE;
  }
}

export function saveStoredBusinessProfile(profile: BusinessProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save business profile:', err);
  }
}

export function clearStoredBusinessProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (err) {
    console.error('Failed to clear business profile:', err);
  }
}

export function getStoredDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const val = localStorage.getItem(DARK_MODE_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

export function saveStoredDarkMode(isDark: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
  } catch (err) {
    console.error('Failed to save dark mode setting:', err);
  }
}
