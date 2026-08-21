// Data Privacy Compliance for RadioOS
// GDPR-like compliance for African radio markets

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// Privacy configuration (configurable per tenant)
export interface PrivacyConfig {
  // IP retention period in days
  ipRetentionDays: number;
  
  // Require consent for tracking
  requireTrackingConsent: boolean;
  
  // Data retention for analytics
  analyticsRetentionDays: number;
  
  // Enable data export
  enableDataExport: boolean;
  
  // Enable right to be forgotten
  enableRightToErasure: boolean;
}

// Default privacy settings
export const DEFAULT_PRIVACY_CONFIG: PrivacyConfig = {
  ipRetentionDays: 30,
  requireTrackingConsent: true,
  analyticsRetentionDays: 365,
  enableDataExport: true,
  enableRightToErasure: true,
};

// Consent types
export const CONSENT_TYPES = {
  TRACKING: 'tracking',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  THIRD_PARTY: 'third_party',
} as const;

export type ConsentType = (typeof CONSENT_TYPES)[keyof typeof CONSENT_TYPES];

interface ConsentRecord {
  id: string;
  listener_ip: string;
  consent_type: ConsentType;
  granted: boolean;
  timestamp: string;
  expires_at?: string;
  radio_id?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Record listener consent
 */
export async function recordConsent(
  listenerIp: string,
  consentType: ConsentType,
  granted: boolean,
  radioId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Hash IP for storage (we don't store raw IPs)
  const hashedIp = await hashIp(listenerIp);

  const { error } = await supabase
    .from('listener_consents')
    .insert({
      listener_ip_hash: hashedIp,
      consent_type: consentType,
      granted,
      radio_id: radioId,
      metadata,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    });

  if (error) {
    console.error('[PRIVACY] Failed to record consent:', error);
  }
}

/**
 * Check if listener has given consent
 */
export async function checkConsent(
  listenerIp: string,
  consentType: ConsentType,
  radioId?: string
): Promise<boolean> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const hashedIp = await hashIp(listenerIp);

  let query = supabase
    .from('listener_consents')
    .select('granted')
    .eq('listener_ip_hash', hashedIp)
    .eq('consent_type', consentType)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1);

  if (radioId) {
    query = query.eq('radio_id', radioId);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return false; // No consent found = no consent given
  }

  return data.granted;
}

/**
 * Anonymize IP address (truncate last octet)
 */
export function anonymizeIp(ip: string): string {
  // IPv4: 192.168.1.100 -> 192.168.1.0
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }

  // IPv6: truncate last 80 bits
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      return `${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}::`;
    }
  }

  return '0.0.0.0';
}

/**
 * Hash IP for storage (one-way)
 */
async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + (process.env.IP_HASH_SALT || 'radioos-salt'));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Delete listener data (Right to Erasure)
 */
export async function deleteListenerData(
  listenerIp: string,
  radioId?: string
): Promise<{ deleted: boolean; recordsDeleted: number }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const hashedIp = await hashIp(listenerIp);
  let totalDeleted = 0;

  // Delete consent records
  let consentQuery = supabase
    .from('listener_consents')
    .delete()
    .eq('listener_ip_hash', hashedIp);

  if (radioId) {
    consentQuery = consentQuery.eq('radio_id', radioId);
  }

  const { count: consentDeleted } = await consentQuery;
  totalDeleted += consentDeleted || 0;

  // Delete analytics records
  let analyticsQuery = supabase
    .from('analytics')
    .delete()
    .eq('listener_ip_hash', hashedIp);

  if (radioId) {
    analyticsQuery = analyticsQuery.eq('radio_id', radioId);
  }

  const { count: analyticsDeleted } = await analyticsQuery;
  totalDeleted += analyticsDeleted || 0;

  // Delete message records
  let messagesQuery = supabase
    .from('messages')
    .delete()
    .eq('sender_ip_hash', hashedIp);

  if (radioId) {
    messagesQuery = messagesQuery.eq('radio_id', radioId);
  }

  const { count: messagesDeleted } = await messagesQuery;
  totalDeleted += messagesDeleted || 0;

  return {
    deleted: true,
    recordsDeleted: totalDeleted,
  };
}

/**
 * Export listener data (Right to Data Portability)
 */
export async function exportListenerData(
  listenerIp: string,
  radioId?: string
): Promise<Record<string, unknown>> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const hashedIp = await hashIp(listenerIp);

  // Get consents
  let consentQuery = supabase
    .from('listener_consents')
    .select('*')
    .eq('listener_ip_hash', hashedIp);

  if (radioId) {
    consentQuery = consentQuery.eq('radio_id', radioId);
  }

  const { data: consents } = await consentQuery;

  // Get analytics
  let analyticsQuery = supabase
    .from('analytics')
    .select('*')
    .eq('listener_ip_hash', hashedIp);

  if (radioId) {
    analyticsQuery = analyticsQuery.eq('radio_id', radioId);
  }

  const { data: analytics } = await analyticsQuery;

  // Get messages
  let messagesQuery = supabase
    .from('messages')
    .select('*')
    .eq('sender_ip_hash', hashedIp);

  if (radioId) {
    messagesQuery = messagesQuery.eq('radio_id', radioId);
  }

  const { data: messages } = await messagesQuery;

  return {
    exportDate: new Date().toISOString(),
    consents: consents || [],
    analytics: analytics || [],
    messages: messages || [],
  };
}

/**
 * Purge old IP data based on retention policy
 */
export async function purgeOldIpData(
  retentionDays: number
): Promise<{ purged: number }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const cutoffDate = new Date(
    Date.now() - retentionDays * 24 * 60 * 60 * 1000
  ).toISOString();

  // Purge old analytics
  const { count: analyticsPurged } = await supabase
    .from('analytics')
    .delete()
    .lt('created_at', cutoffDate)
    .not('listener_ip_hash', 'is', null);

  // Purge old messages with IP
  const { count: messagesPurged } = await supabase
    .from('messages')
    .delete()
    .lt('created_at', cutoffDate)
    .not('sender_ip_hash', 'is', null);

  return {
    purged: (analyticsPurged || 0) + (messagesPurged || 0),
  };
}

/**
 * Get privacy policy for a radio
 */
export async function getPrivacyPolicy(
  radioId: string
): Promise<{
  policy: string;
  version: string;
  acceptedAt?: string;
}> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('privacy_policies')
    .select('*')
    .eq('radio_id', radioId)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    // Return default policy
    return {
      policy: getDefaultPrivacyPolicy(),
      version: '1.0',
    };
  }

  return {
    policy: data.policy_text,
    version: data.version,
    acceptedAt: data.accepted_at,
  };
}

/**
 * Accept privacy policy
 */
export async function acceptPrivacyPolicy(
  radioId: string,
  version: string,
  listenerIp?: string
): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const hashedIp = listenerIp ? await hashIp(listenerIp) : undefined;

  const { error } = await supabase
    .from('privacy_policy_acceptances')
    .insert({
      radio_id: radioId,
      policy_version: version,
      listener_ip_hash: hashedIp,
      accepted_at: new Date().toISOString(),
    });

  if (error) {
    console.error('[PRIVACY] Failed to record policy acceptance:', error);
  }
}

/**
 * Default privacy policy text
 */
function getDefaultPrivacyPolicy(): string {
  return `
# Politique de Confidentialité - RadioOS

## Collecte de données
Nous collectons uniquement les données nécessaires au fonctionnement du service :
- Adresse IP (anonymisée après 30 jours)
- Statistiques d'écoute (agrégées)
- Messages et dédicaces envoyés

## Utilisation des données
Vos données sont utilisées pour :
- Améliorer l'expérience d'écoute
- Fournir des statistiques à la radio
- Assurer la sécurité du service

## Vos droits
Conformément aux réglementations en vigueur, vous disposez des droits suivants :
- **Droit d'accès** : obtenir une copie de vos données
- **Droit de rectification** : corriger vos données
- **Droit à l'effacement** : supprimer vos données
- **Droit à la portabilité** : recevoir vos données dans un format structuré

## Contact
Pour exercer vos droits, contactez la radio ou l'adresse : privacy@radioos.app
`.trim();
}
