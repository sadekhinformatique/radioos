// Immutable Audit Log System for RadioOS
// Append-only - no one can modify or delete entries, including SUPER_ADMIN

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Audit event types
export const AUDIT_EVENTS = {
  // Authentication
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
  AUTH_LOGIN_FAILED: 'auth.login_failed',
  AUTH_PASSWORD_RESET: 'auth.password_reset',
  
  // User management
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_ROLE_CHANGED: 'user.role_changed',
  USER_INVITED: 'user.invited',
  
  // Radio management
  RADIO_CREATED: 'radio.created',
  RADIO_UPDATED: 'radio.updated',
  RADIO_DELETED: 'radio.deleted',
  RADIO_SETTINGS_CHANGED: 'radio.settings_changed',
  
  // Content
  STREAM_CREATED: 'stream.created',
  STREAM_UPDATED: 'stream.updated',
  STREAM_DELETED: 'stream.deleted',
  STREAM_STATUS_CHANGED: 'stream.status_changed',
  PODCAST_UPLOADED: 'podcast.uploaded',
  PODCAST_DELETED: 'podcast.deleted',
  SHOW_CREATED: 'show.created',
  SHOW_UPDATED: 'show.updated',
  
  // Interactions
  MESSAGE_RECEIVED: 'message.received',
  MESSAGE_DELETED: 'message.deleted',
  DEDICATION_RECEIVED: 'dedication.received',
  DEDICATION_APPROVED: 'dedication.approved',
  DEDICATION_REJECTED: 'dedication.rejected',
  POLL_CREATED: 'poll.created',
  POLL_VOTE_CAST: 'poll.vote_cast',
  
  // Advertising
  AD_CAMPAIGN_CREATED: 'ad.campaign_created',
  AD_CAMPAIGN_UPDATED: 'ad.campaign_updated',
  AD_CAMPAIGN_DELETED: 'ad.campaign_deleted',
  
  // API
  API_KEY_CREATED: 'api_key.created',
  API_KEY_DELETED: 'api_key.deleted',
  API_REQUEST: 'api.request',
  
  // Security
  SECURITY_RATE_LIMIT: 'security.rate_limit',
  SECURITY_WEBHOOK_INVALID: 'security.webhook_invalid',
  SECURITY_UNAUTHORIZED_ACCESS: 'security.unauthorized_access',
  SECURITY_PATH_TRAVERSAL: 'security.path_traversal',
  SECURITY_SUSPICIOUS_ACTIVITY: 'security.suspicious_activity',
  
  // System
  SYSTEM_BACKUP: 'system.backup',
  SYSTEM_MIGRATION: 'system.migration',
} as const;

export type AuditEvent = (typeof AUDIT_EVENTS)[keyof typeof AUDIT_EVENTS];

interface AuditLogEntry {
  id: string;
  event: AuditEvent;
  actor_id?: string;
  actor_email?: string;
  actor_role?: string;
  radio_id?: string;
  target_type?: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  checksum: string;
}

interface AuditLogOptions {
  event: AuditEvent;
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  radioId?: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  request?: Request;
}

/**
 * Create an immutable audit log entry
 */
export async function createAuditLog(options: AuditLogOptions): Promise<void> {
  const entry: AuditLogEntry = {
    id: crypto.randomUUID(),
    event: options.event,
    actor_id: options.actorId,
    actor_email: options.actorEmail,
    actor_role: options.actorRole,
    radio_id: options.radioId,
    target_type: options.targetType,
    target_id: options.targetId,
    metadata: options.metadata,
    ip_address: options.request
      ? options.request.headers.get('x-forwarded-for')?.split(',')[0] ||
        options.request.headers.get('x-real-ip') ||
        'unknown'
      : undefined,
    user_agent: options.request?.headers.get('user-agent') || undefined,
    created_at: new Date().toISOString(),
    checksum: '', // Will be computed
  };

  // Compute checksum for integrity verification
  entry.checksum = computeChecksum(entry);

  // Write to database
  await writeAuditLog(entry);
}

/**
 * Compute checksum for integrity verification
 */
function computeChecksum(entry: Omit<AuditLogEntry, 'checksum'>): string {
  const data = JSON.stringify({
    id: entry.id,
    event: entry.event,
    actor_id: entry.actor_id,
    radio_id: entry.radio_id,
    target_type: entry.target_type,
    target_id: entry.target_id,
    created_at: entry.created_at,
  });

  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Write audit log to database
 * This is append-only - no UPDATE or DELETE allowed
 */
async function writeAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Insert only - the database RLS policy should prevent UPDATE/DELETE
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        id: entry.id,
        event: entry.event,
        actor_id: entry.actor_id,
        actor_email: entry.actor_email,
        actor_role: entry.actor_role,
        radio_id: entry.radio_id,
        target_type: entry.target_type,
        target_id: entry.target_id,
        metadata: entry.metadata,
        ip_address: entry.ip_address,
        user_agent: entry.user_agent,
        created_at: entry.created_at,
        checksum: entry.checksum,
      });

    if (error) {
      console.error('[AUDIT] Failed to write audit log:', error);
    }
  } catch (error) {
    // Audit log failures should not break the application
    console.error('[AUDIT] Exception writing audit log:', error);
  }
}

/**
 * Verify audit log integrity
 */
export async function verifyAuditLogIntegrity(
  logId: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('id', logId)
      .single();

    if (error || !data) {
      return { valid: false, error: 'Log non trouvé' };
    }

    // Recompute checksum
    const entryWithoutChecksum = { ...data };
    delete entryWithoutChecksum.checksum;
    const expectedChecksum = computeChecksum(entryWithoutChecksum);

    if (data.checksum !== expectedChecksum) {
      return { valid: false, error: 'Intégrité compromise' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Erreur de vérification' };
  }
}

/**
 * Query audit logs (read-only)
 */
export async function queryAuditLogs(filters: {
  radioId?: string;
  actorId?: string;
  event?: AuditEvent;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}): Promise<{
  logs: AuditLogEntry[];
  total: number;
}> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters.radioId) {
    query = query.eq('radio_id', filters.radioId);
  }
  if (filters.actorId) {
    query = query.eq('actor_id', filters.actorId);
  }
  if (filters.event) {
    query = query.eq('event', filters.event);
  }
  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate.toISOString());
  }
  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate.toISOString());
  }

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('[AUDIT] Query failed:', error);
    return { logs: [], total: 0 };
  }

  return {
    logs: data || [],
    total: count || 0,
  };
}

/**
 * Export audit logs as CSV
 */
export async function exportAuditLogs(
  radioId: string,
  startDate: Date,
  endDate: Date
): Promise<string> {
  const { logs } = await queryAuditLogs({
    radioId,
    startDate,
    endDate,
    limit: 10000,
  });

  const headers = [
    'ID',
    'Event',
    'Actor ID',
    'Actor Email',
    'Actor Role',
    'Target Type',
    'Target ID',
    'IP Address',
    'User Agent',
    'Created At',
    'Checksum',
  ];

  const rows = logs.map((log) => [
    log.id,
    log.event,
    log.actor_id || '',
    log.actor_email || '',
    log.actor_role || '',
    log.target_type || '',
    log.target_id || '',
    log.ip_address || '',
    log.user_agent || '',
    log.created_at,
    log.checksum,
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  return csv;
}
