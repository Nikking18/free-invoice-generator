'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppLanguage, APP_TRANSLATIONS } from './translations';

const LANGUAGE_KEY = 'fig_app_language';

interface LanguageContextType {
  appLanguage: AppLanguage;
  setAppLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  appLanguage: 'en',
  setAppLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [appLanguage, setAppLanguageState] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LANGUAGE_KEY) as AppLanguage | null;
        if (saved && (saved === 'en' || saved === 'es' || saved === 'fr' || saved === 'de')) {
          return saved;
        }
      } catch (err) {
        console.error('Failed to read app language setting:', err);
      }
    }
    return 'en';
  });

  const setAppLanguage = (lang: AppLanguage) => {
    setAppLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LANGUAGE_KEY, lang);
      } catch (err) {
        console.error('Failed to save app language setting:', err);
      }
    }
  };

  const t = (key: string): string => {
    const dict = APP_TRANSLATIONS[appLanguage] || APP_TRANSLATIONS.en;
    return dict[key] || APP_TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ appLanguage, setAppLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
