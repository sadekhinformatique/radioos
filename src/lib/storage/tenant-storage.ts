// Tenant-isolated storage for RadioOS
// Every file is organized under /radios/{radio_id}/...

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const STORAGE_BUCKET = 'radioos-files';

// File categories with their paths
export const STORAGE_PATHS = {
  PODCASTS: (radioId: string, podcastId: string) => 
    `radios/${radioId}/podcasts/${podcastId}`,
  LOGOS: (radioId: string) => 
    `radios/${radioId}/logos`,
  ADS: (radioId: string, campaignId: string) => 
    `radios/${radioId}/ads/${campaignId}`,
  DEDICATIONS: (radioId: string, dedicationId: string) => 
    `radios/${radioId}/dedications/${dedicationId}`,
  SHOWS: (radioId: string, showId: string) => 
    `radios/${radioId}/shows/${showId}`,
  AVATARS: (radioId: string) => 
    `radios/${radioId}/avatars`,
} as const;

interface StorageUploadResult {
  path: string;
  url: string;
  size: number;
  contentType: string;
}

interface SignedUrlResult {
  url: string;
  expiresAt: Date;
}

/**
 * Generate a tenant-isolated file path
 */
export function getTenantPath(
  radioId: string, 
  category: keyof typeof STORAGE_PATHS,
  ...args: string[]
): string {
  const pathFn = STORAGE_PATHS[category];
  if (typeof pathFn === 'function') {
    return (pathFn as (...a: string[]) => string)(radioId, ...args);
  }
  throw new Error(`Invalid storage category: ${category}`);
}

/**
 * Upload a file with tenant isolation
 * Verifies user belongs to the radio tenant before upload
 */
export async function uploadToTenantStorage(
  radioId: string,
  category: keyof typeof STORAGE_PATHS,
  fileId: string,
  file: File,
  options?: {
    upsert?: boolean;
    contentType?: string;
  }
): Promise<StorageUploadResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Verify user belongs to this radio
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: membership } = await supabase
    .from('radio_members')
    .select('id')
    .eq('radio_id', radioId)
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    throw new Error('Accès refusé: vous n\'êtes pas membre de cette radio');
  }

  // Build the path
  const basePath = getTenantPath(radioId, category, fileId);
  const fileName = file.name;
  const fullPath = `${basePath}/${fileName}`;

  // Validate file size (max 100MB for audio, 5MB for images)
  const isAudio = file.type.startsWith('audio/');
  const maxSize = isAudio ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
  
  if (file.size > maxSize) {
    throw new Error(`Fichier trop volumineux. Max: ${maxSize / (1024 * 1024)}MB`);
  }

  // Validate content type
  const allowedTypes = [
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac',
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf',
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Type de fichier non autorisé');
  }

  // Upload file
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fullPath, file, {
      upsert: options?.upsert ?? false,
      contentType: options?.contentType ?? file.type,
    });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fullPath);

  return {
    path: fullPath,
    url: urlData.publicUrl,
    size: file.size,
    contentType: file.type,
  };
}

/**
 * Generate a signed URL for tenant-isolated file
 * CRITICAL: Verifies user belongs to the radio before generating
 */
export async function getTenantSignedUrl(
  radioId: string,
  filePath: string,
  options?: {
    expiresIn?: number; // seconds, default 3600 (1 hour)
  }
): Promise<SignedUrlResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // CRITICAL SECURITY CHECK: Verify user belongs to this radio
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: membership } = await supabase
    .from('radio_members')
    .select('id')
    .eq('radio_id', radioId)
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    // SECURITY: Log this attempt
    await logSecurityEvent({
      type: 'UNAUTHORIZED_STORAGE_ACCESS',
      userId: user.id,
      radioId,
      filePath,
      details: 'User attempted to access file from different radio',
    });
    throw new Error('Accès refusé: tentative d\'accès non autorisé');
  }

  // Verify the file path starts with this radio's directory
  const expectedPrefix = `radios/${radioId}/`;
  if (!filePath.startsWith(expectedPrefix)) {
    await logSecurityEvent({
      type: 'PATH_TRAVERSAL_ATTEMPT',
      userId: user.id,
      radioId,
      filePath,
      details: 'File path does not match radio directory',
    });
    throw new Error('Chemin de fichier invalide');
  }

  // Generate signed URL
  const expiresIn = options?.expiresIn ?? 3600;
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filePath, expiresIn);

  if (error) throw error;

  return {
    url: data.signedUrl,
    expiresAt: new Date(Date.now() + expiresIn * 1000),
  };
}

/**
 * Delete a file from tenant storage
 */
export async function deleteFromTenantStorage(
  radioId: string,
  filePath: string
): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Verify ownership
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: membership } = await supabase
    .from('radio_members')
    .select('role')
    .eq('radio_id', radioId)
    .eq('user_id', user.id)
    .single();

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    throw new Error('Accès refusé: permissions insuffisantes');
  }

  // Verify path
  const expectedPrefix = `radios/${radioId}/`;
  if (!filePath.startsWith(expectedPrefix)) {
    throw new Error('Chemin de fichier invalide');
  }

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath]);

  if (error) throw error;
}

// Helper for security logging (temporary, will use audit_logs)
async function logSecurityEvent(event: {
  type: string;
  userId: string;
  radioId?: string;
  filePath?: string;
  details: string;
}) {
  console.error('[SECURITY]', JSON.stringify(event));
}
