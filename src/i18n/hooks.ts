'use client';

import { useState, useCallback, createContext, useContext, ReactNode, createElement } from 'react';
import { type Locale, defaultLocale, t } from './config';

// Context for i18n
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider component
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('radioos-locale') as Locale) || defaultLocale;
    }
    return defaultLocale;
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('radioos-locale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const translate = useCallback((key: string) => t(key, locale), [locale]);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const value: I18nContextType = { locale, setLocale, t: translate, dir };

  return createElement(I18nContext.Provider, { value }, children);
}

// Hook to use i18n
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Return defaults if used outside provider
    return {
      locale: defaultLocale,
      setLocale: () => {},
      t: (key: string) => t(key, defaultLocale),
      dir: 'ltr' as const,
    };
  }
  return context;
}

// Hook for translations only
export function useTranslations(locale?: Locale) {
  const currentLocale = locale || defaultLocale;
  return useCallback((key: string) => t(key, currentLocale), [currentLocale]);
}
