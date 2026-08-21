// Date, Number, and Currency Formatting for RadioOS
// Supports French, Arabic, and English locales

import { type Locale } from '@/i18n/config';

// Timezone mapping for African countries
export const TIMEZONES: Record<string, string> = {
  'SN': 'Africa/Dakar',       // Sénégal
  'CI': 'Africa/Abidjan',     // Côte d'Ivoire
  'ML': 'Africa/Bamako',      // Mali
  'BF': 'Africa/Ouagadougou', // Burkina Faso
  'NE': 'Africa/Niamey',      // Niger
  'GN': 'Africa/Conakry',     // Guinée
  'CM': 'Africa/Douala',      // Cameroun
  'TG': 'Africa/Lome',        // Togo
  'BJ': 'Africa/Porto-Novo',  // Bénin
  'CD': 'Africa/Kinshasa',    // RD Congo
  'GA': 'Africa/Libreville',  // Gabon
  'CG': 'Africa/Brazzaville', // Congo
  'DZ': 'Africa/Algiers',     // Algérie
  'MA': 'Africa/Casablanca',  // Maroc
  'TN': 'Africa/Tunis',       // Tunisie
  'NG': 'Africa/Lagos',       // Nigeria
  'GH': 'Africa/Accra',       // Ghana
  'KE': 'Africa/Nairobi',     // Kenya
  'ET': 'Africa/Addis_Ababa', // Éthiopie
  'ZA': 'Africa/Johannesburg', // Afrique du Sud
  'EG': 'Africa/Cairo',       // Égypte
};

// Default timezone if not specified
const DEFAULT_TIMEZONE = 'Africa/Dakar';

/**
 * Format date with timezone support
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {},
  timezone?: string,
  locale: Locale = 'fr'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const tz = timezone || DEFAULT_TIMEZONE;

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : locale === 'en' ? 'en-US' : 'fr-FR', {
    timeZone: tz,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d);
}

/**
 * Format date and time
 */
export function formatDateTime(
  date: string | Date,
  timezone?: string,
  locale: Locale = 'fr'
): string {
  return formatDate(
    date,
    {
      hour: '2-digit',
      minute: '2-digit',
    },
    timezone,
    locale
  );
}

/**
 * Format relative time (il y a X minutes, etc.)
 */
export function formatRelativeTime(
  date: string | Date,
  locale: Locale = 'fr'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (locale === 'fr') {
    if (seconds < 60) return "à l'instant";
    if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (days < 7) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    return formatDate(d, { day: 'numeric', month: 'short' });
  }

  if (locale === 'ar') {
    if (seconds < 60) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return formatDate(d, { day: 'numeric', month: 'short' }, undefined, 'ar');
  }

  // English
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDate(d, { day: 'numeric', month: 'short' }, undefined, 'en');
}

/**
 * Format number with locale-specific separators
 * French: 1 284 (space separator)
 * English: 1,284 (comma separator)
 */
export function formatNumber(
  num: number,
  locale: Locale = 'fr',
  options?: Intl.NumberFormatOptions
): string {
  const localeCode = locale === 'ar' ? 'ar-SA' : locale === 'en' ? 'en-US' : 'fr-FR';
  
  return new Intl.NumberFormat(localeCode, {
    useGrouping: true,
    ...options,
  }).format(num);
}

/**
 * Format compact number (1.2K, 1.3M)
 */
export function formatCompactNumber(
  num: number,
  locale: Locale = 'fr'
): string {
  const localeCode = locale === 'ar' ? 'ar-SA' : locale === 'en' ? 'en-US' : 'fr-FR';
  
  return new Intl.NumberFormat(localeCode, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Format percentage
 */
export function formatPercent(
  value: number,
  locale: Locale = 'fr',
  options?: Intl.NumberFormatOptions
): string {
  const localeCode = locale === 'ar' ? 'ar-SA' : locale === 'en' ? 'en-US' : 'fr-FR';
  
  return new Intl.NumberFormat(localeCode, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(value / 100);
}

/**
 * Format currency (FCFA)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'XOF',
  locale: Locale = 'fr'
): string {
  const localeCode = locale === 'ar' ? 'ar-SA' : locale === 'en' ? 'en-US' : 'fr-FR';
  
  return new Intl.NumberFormat(localeCode, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 o';
  
  const units = ['o', 'Ko', 'Mo', 'Go', 'To'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

/**
 * Format duration (seconds to HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Format duration in human readable form
 */
export function formatDurationHuman(
  seconds: number,
  locale: Locale = 'fr'
): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (locale === 'fr') {
    if (h > 0) return `${h}h ${m}min`;
    return `${m} min`;
  }

  if (locale === 'ar') {
    if (h > 0) return `${h} ساعة ${m} دقيقة`;
    return `${m} دقيقة`;
  }

  // English
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Pluralization helper (handles French/Arabic/English)
 */
export function pluralize(
  count: number,
  singular: string,
  plural: string,
  locale: Locale = 'fr'
): string {
  if (locale === 'ar') {
    return count === 1 ? singular : plural;
  }
  
  // French and English: 0 or 2+ = plural, 1 = singular
  return count <= 1 ? singular : plural;
}

/**
 * Get timezone for a country code
 */
export function getTimezone(countryCode: string): string {
  return TIMEZONES[countryCode] || DEFAULT_TIMEZONE;
}

/**
 * Format listener count
 */
export function formatListenerCount(
  count: number,
  locale: Locale = 'fr'
): string {
  return `${formatNumber(count, locale)} ${pluralize(count, 'auditeur', 'auditeurs', locale)}`;
}
