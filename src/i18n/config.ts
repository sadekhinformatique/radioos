// Supported languages
export const locales = ['fr', 'ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

// Language metadata
export const languageMetadata: Record<Locale, { name: string; dir: 'ltr' | 'rtl'; flag: string }> = {
  fr: { name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  ar: { name: 'العربية', dir: 'rtl', flag: '🇩🇿' },
  en: { name: 'English', dir: 'ltr', flag: '🇬🇧' },
};

// Translation dictionaries
const translations: Record<Locale, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.streaming': 'Diffusion',
    'nav.messages': 'Messages',
    'nav.dedications': 'Dédicaces',
    'nav.podcasts': 'Podcasts',
    'nav.programs': 'Programmes',
    'nav.shows': 'Émissions',
    'nav.polls': 'Sondages',
    'nav.analytics': 'Statistiques',
    'nav.advertising': 'Publicité',
    'nav.users': 'Équipe',
    'nav.settings': 'Paramètres',
    'nav.billing': 'Facturation',
    'nav.notifications': 'Notifications',
    'nav.support': 'Support',
    'nav.activity': 'Activité',
    'nav.apiKeys': 'Clés API',
    'nav.apiDocs': 'Documentation API',
    'nav.emailPreview': 'Aperçu emails',

    // Dashboard
    'dashboard.welcome': 'Bienvenue',
    'dashboard.listeners': 'Auditeurs',
    'dashboard.listeners.live': 'Auditeurs en direct',
    'dashboard.streams': 'Flux',
    'dashboard.messages.count': 'Messages',
    'dashboard.podcasts.count': 'Podcasts',
    'dashboard.quickActions': 'Actions rapides',
    'dashboard.recentActivity': 'Activité récente',

    // Streaming
    'streaming.title': 'Diffusion en direct',
    'streaming.active': 'Flux actifs',
    'streaming.offline': 'Hors ligne',
    'streaming.add': 'Ajouter un flux',
    'streaming.url': 'URL du flux',
    'streaming.bitrate': 'Débit',

    // Messages
    'messages.title': 'Boîte de réception',
    'messages.inbox': 'Entrants',
    'messages.sent': 'Envoyés',
    'messages.read': 'Lus',
    'messages.unread': 'Non lus',
    'messages.reply': 'Répondre',
    'messages.forward': 'Transférer',

    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.search': 'Rechercher',
    'common.loading': 'Chargement...',
    'common.empty': 'Aucune donnée',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.confirm': 'Confirmer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',

    // Auth
    'auth.login': 'Connexion',
    'auth.register': 'Inscription',
    'auth.logout': 'Déconnexion',
    'auth.forgotPassword': 'Mot de passe oublié',
    'auth.resetPassword': 'Réinitialiser le mot de passe',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',

    // Landing
    'landing.hero.title': 'Votre radio, enfin numérique',
    'landing.hero.subtitle': 'La plateforme SaaS complète pour gérer votre radio en ligne',
    'landing.cta': 'Commencer maintenant',
    'landing.features': 'Fonctionnalités',
    'landing.pricing': 'Tarifs',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.streaming': 'البث المباشر',
    'nav.messages': 'الرسائل',
    'nav.dedications': 'الهدايا والتهاني',
    'nav.podcasts': 'البودكاست',
    'nav.programs': 'البرامج',
    'nav.shows': 'البرامج التلفزيونية',
    'nav.polls': 'الاستطلاعات',
    'nav.analytics': 'الإحصائيات',
    'nav.advertising': 'الإعلانات',
    'nav.users': 'الفريق',
    'nav.settings': 'الإعدادات',
    'nav.billing': 'الفواتير',
    'nav.notifications': 'الإشعارات',
    'nav.support': 'الدعم',
    'nav.activity': 'النشاط',
    'nav.apiKeys': 'مفاتيح API',
    'nav.apiDocs': 'توثيق API',
    'nav.emailPreview': 'معاينة البريد',

    // Dashboard
    'dashboard.welcome': 'مرحباً',
    'dashboard.listeners': 'المستمعون',
    'dashboard.listeners.live': 'المستمعون مباشرة',
    'dashboard.streams': 'البث',
    'dashboard.messages.count': 'الرسائل',
    'dashboard.podcasts.count': 'البودكاست',
    'dashboard.quickActions': 'الإجراءات السريعة',
    'dashboard.recentActivity': 'النشاط الأخير',

    // Streaming
    'streaming.title': 'البث المباشر',
    'streaming.active': 'البث النشط',
    'streaming.offline': 'غير متصل',
    'streaming.add': 'إضافة بث',
    'streaming.url': 'رابط البث',
    'streaming.bitrate': 'معدل البت',

    // Messages
    'messages.title': 'صندوق الوارد',
    'messages.inbox': 'الوارد',
    'messages.sent': 'المرسل',
    'messages.read': 'مقروء',
    'messages.unread': 'غير مقروء',
    'messages.reply': 'رد',
    'messages.forward': 'إعادة',

    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.search': 'بحث',
    'common.loading': 'جاري التحميل...',
    'common.empty': 'لا توجد بيانات',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.confirm': 'تأكيد',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',

    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'التسجيل',
    'auth.logout': 'تسجيل الخروج',
    'auth.forgotPassword': 'نسيت كلمة المرور',
    'auth.resetPassword': 'إعادة تعيين كلمة المرور',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',

    // Landing
    'landing.hero.title': 'راديوك، أخيراً رقمياً',
    'landing.hero.subtitle': 'منصة SaaS شاملة لإدارة راديوك عبر الإنترنت',
    'landing.cta': 'ابدأ الآن',
    'landing.features': 'الميزات',
    'landing.pricing': 'الأسعار',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.streaming': 'Streaming',
    'nav.messages': 'Messages',
    'nav.dedications': 'Dedications',
    'nav.podcasts': 'Podcasts',
    'nav.programs': 'Programs',
    'nav.shows': 'Shows',
    'nav.polls': 'Polls',
    'nav.analytics': 'Analytics',
    'nav.advertising': 'Advertising',
    'nav.users': 'Team',
    'nav.settings': 'Settings',
    'nav.billing': 'Billing',
    'nav.notifications': 'Notifications',
    'nav.support': 'Support',
    'nav.activity': 'Activity',
    'nav.apiKeys': 'API Keys',
    'nav.apiDocs': 'API Docs',
    'nav.emailPreview': 'Email Preview',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.listeners': 'Listeners',
    'dashboard.listeners.live': 'Live listeners',
    'dashboard.streams': 'Streams',
    'dashboard.messages.count': 'Messages',
    'dashboard.podcasts.count': 'Podcasts',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.recentActivity': 'Recent Activity',

    // Streaming
    'streaming.title': 'Live Streaming',
    'streaming.active': 'Active streams',
    'streaming.offline': 'Offline',
    'streaming.add': 'Add stream',
    'streaming.url': 'Stream URL',
    'streaming.bitrate': 'Bitrate',

    // Messages
    'messages.title': 'Inbox',
    'messages.inbox': 'Inbox',
    'messages.sent': 'Sent',
    'messages.read': 'Read',
    'messages.unread': 'Unread',
    'messages.reply': 'Reply',
    'messages.forward': 'Forward',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.empty': 'No data',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.forgotPassword': 'Forgot Password',
    'auth.resetPassword': 'Reset Password',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',

    // Landing
    'landing.hero.title': 'Your radio, finally digital',
    'landing.hero.subtitle': 'The complete SaaS platform to manage your online radio',
    'landing.cta': 'Get Started',
    'landing.features': 'Features',
    'landing.pricing': 'Pricing',
  },
};

// Get translation
export function t(key: string, locale: Locale = defaultLocale): string {
  return translations[locale][key] || translations[defaultLocale][key] || key;
}

// Get all translations for a locale
export function getTranslations(locale: Locale): Record<string, string> {
  return translations[locale];
}
