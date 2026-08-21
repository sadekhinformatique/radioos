// RadioOS Design System — TypeScript Tokens
// Import these values for programmatic use (charts, dynamic styles)

export const COLORS = {
  // Brand
  primary: '#F97316',
  primaryHover: '#EA580C',
  primaryActive: '#C2410C',
  primaryLight: '#FFF7ED',
  primaryMuted: '#FED7AA',

  // Secondary
  secondary: '#6366F1',
  secondaryHover: '#4F46E5',
  secondaryActive: '#4338CA',
  secondaryLight: '#EEF2FF',

  // Neutral
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#6366F1',

  // Semantic
  success: '#16A34A',
  successLight: '#DCFCE7',
  successText: '#15803D',

  warning: '#D97706',
  warningLight: '#FEF3C7',
  warningText: '#92400E',

  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  dangerText: '#991B1B',

  info: '#2563EB',
  infoLight: '#DBEAFE',
  infoText: '#1E40AF',

  // Data Visualization (daltonism-friendly)
  data1: '#3B82F6',
  data2: '#F97316',
  data3: '#10B981',
  data4: '#8B5CF6',
  data5: '#EC4899',
} as const;

export const CHART_COLORS = [
  COLORS.data1,
  COLORS.data2,
  COLORS.data3,
  COLORS.data4,
  COLORS.data5,
];

export const DARK_COLORS = {
  background: '#0F1117',
  surface: '#1A1D27',
  surfaceElevated: '#22252F',
  border: '#2D3140',
  borderStrong: '#3D4155',
  textPrimary: '#F0F1F4',
  textSecondary: '#9CA3B0',
  textTertiary: '#6B7280',
  textInverse: '#111827',
  primary: '#FB923C',
  primaryHover: '#F97316',
  primaryActive: '#EA580C',
  primaryLight: '#2D1B0E',
  primaryMuted: '#452212',
  secondary: '#818CF8',
  secondaryHover: '#6366F1',
  secondaryActive: '#4F46E5',
  secondaryLight: '#1E1B4B',
  success: '#22C55E',
  successLight: '#052E16',
  successText: '#4ADE80',
  warning: '#FBBF24',
  warningLight: '#451A03',
  warningText: '#FCD34D',
  danger: '#EF4444',
  dangerLight: '#450A0A',
  dangerText: '#FCA5A5',
  info: '#3B82F6',
  infoLight: '#172554',
  infoText: '#93C5FD',
} as const;

// Typography scale
export const TYPOGRAPHY = {
  display: { size: '2.5rem', lineHeight: '1.2', weight: 600 },
  h1: { size: '1.75rem', lineHeight: '1.2', weight: 600 },
  h2: { size: '1.375rem', lineHeight: '1.25', weight: 600 },
  h3: { size: '1.125rem', lineHeight: '1.3', weight: 500 },
  body: { size: '0.9375rem', lineHeight: '1.5', weight: 400 },
  bodySm: { size: '0.8125rem', lineHeight: '1.5', weight: 400 },
  caption: { size: '0.75rem', lineHeight: '1.4', weight: 400 },
} as const;

// Spacing scale (base 4px)
export const SPACING = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
} as const;

// Border radius
export const RADIUS = {
  sm: '0.375rem',   // 6px — buttons, inputs
  md: '0.5rem',     // 8px — cards, modals
  lg: '0.75rem',    // 12px — large cards
  xl: '1rem',       // 16px — hero sections
  full: '9999px',   // Pills, avatars
} as const;

// Shadows
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  laptop: 1440,
  desktop: 1920,
} as const;

// Z-index scale
export const Z_INDEX = {
  dropdown: 50,
  sticky: 100,
  modalBackdrop: 200,
  modal: 300,
  toast: 400,
  tooltip: 500,
} as const;

// Layout constants
export const LAYOUT = {
  contentMaxWidth: '1280px',
  sidebarWidth: '260px',
  sidebarCollapsedWidth: '72px',
  topbarHeight: '64px',
  minTouchTarget: '44px',
} as const;

// Status badge mapping — consistent across ALL modules
export const STATUS_BADGES: Record<string, { className: string; label: string }> = {
  // Generic statuses
  pending: { className: 'badge-pending', label: 'En attente' },
  active: { className: 'badge-active', label: 'Actif' },
  inactive: { className: 'badge-neutral', label: 'Inactif' },
  rejected: { className: 'badge-rejected', label: 'Rejeté' },
  approved: { className: 'badge-approved', label: 'Approuvé' },
  played: { className: 'badge-played', label: 'Joué' },
  expired: { className: 'badge-expired', label: 'Expiré' },
  paused: { className: 'badge-paused', label: 'En pause' },
  cancelled: { className: 'badge-rejected', label: 'Annulé' },
  completed: { className: 'badge-active', label: 'Terminé' },
  draft: { className: 'badge-neutral', label: 'Brouillon' },

  // Streaming
  online: { className: 'badge-online', label: 'En ligne' },
  offline: { className: 'badge-offline', label: 'Hors ligne' },
  buffering: { className: 'badge-warning', label: 'Chargement' },

  // Billing
  paid: { className: 'badge-active', label: 'Payé' },
  unpaid: { className: 'badge-danger', label: 'Impayé' },
  overdue: { className: 'badge-danger', label: 'En retard' },

  // Messages
  read: { className: 'badge-info', label: 'Lu' },
  unread: { className: 'badge-warning', label: 'Non lu' },
  sent: { className: 'badge-active', label: 'Envoyé' },
  failed: { className: 'badge-danger', label: 'Échoué' },

  // Support tickets
  open: { className: 'badge-warning', label: 'Ouvert' },
  in_progress: { className: 'badge-info', label: 'En cours' },
  resolved: { className: 'badge-active', label: 'Résolu' },
} as const;

/**
 * Format a number for compact display (Section D.6)
 * e.g., 1284 -> "1.28K", 1284000 -> "1.28M"
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Get status badge class for a given status string
 */
export function getStatusBadge(status: string): { className: string; label: string } {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_');
  return STATUS_BADGES[normalized] || { className: 'badge-neutral', label: status };
}

/**
 * Get semantic color for a metric change
 */
export function getChangeColor(value: number, invertPositive = false): string {
  const isPositive = invertPositive ? value < 0 : value > 0;
  return isPositive ? 'positive' : 'negative';
}
