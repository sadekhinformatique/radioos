'use client';

import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useI18n } from '@/i18n/hooks';
import { locales, languageMetadata, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        title="Changer de langue"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{languageMetadata[locale].flag}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">Langue</p>
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition ${
                    locale === loc
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{languageMetadata[loc].flag}</span>
                  <span className="flex-1 text-left">{languageMetadata[loc].name}</span>
                  {locale === loc && <Check className="w-4 h-4 text-orange-500" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// RTL Layout wrapper
export function RTLWrapper({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      {children}
    </div>
  );
}
