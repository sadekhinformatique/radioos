// Webhook signature verification for incoming webhooks
// Supports HMAC-SHA256 for WhatsApp, monitoring, and payment providers

import crypto from 'crypto';

// Webhook provider configurations
const WEBHOOK_PROVIDERS = {
  whatsapp: {
    secret: process.env.WHATSAPP_WEBHOOK_SECRET || '',
    headerName: 'x-hub-signature-256',
    algorithm: 'sha256',
  },
  stripe: {
    secret: process.env.STRIPE_WEBHOOK_SECRET || '',
    headerName: 'stripe-signature',
    algorithm: 'sha256',
  },
  monitoring: {
    secret: process.env.MONITORING_WEBHOOK_SECRET || '',
    headerName: 'x-webhook-signature',
    algorithm: 'sha256',
  },
} as const;

type WebhookProvider = keyof typeof WEBHOOK_PROVIDERS;

interface VerificationResult {
  valid: boolean;
  provider?: WebhookProvider;
  error?: string;
}

interface WebhookLog {
  provider: string;
  timestamp: string;
  ip?: string;
  valid: boolean;
  error?: string;
  path?: string;
}

/**
 * Verify webhook signature using HMAC-SHA256
 */
export async function verifyWebhookSignature(
  request: Request,
  provider: WebhookProvider
): Promise<VerificationResult> {
  const config = WEBHOOK_PROVIDERS[provider];
  
  if (!config.secret) {
    await logWebhookAttempt({
      provider,
      timestamp: new Date().toISOString(),
      valid: false,
      error: 'Webhook secret not configured',
    });
    return { valid: false, error: 'Configuration manquante' };
  }

  // Get signature from header
  const signature = request.headers.get(config.headerName);
  if (!signature) {
    await logWebhookAttempt({
      provider,
      timestamp: new Date().toISOString(),
      valid: false,
      error: 'Missing signature header',
      path: new URL(request.url).pathname,
    });
    return { valid: false, error: 'Signature manquante' };
  }

  try {
    // Get raw body
    const body = await request.text();
    
    // Compute expected signature
    const expectedSignature = crypto
      .createHmac(config.algorithm, config.secret)
      .update(body)
      .digest('hex');

    // Compare signatures (constant-time comparison)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(`${config.algorithm}=${expectedSignature}`)
    );

    if (!isValid) {
      await logWebhookAttempt({
        provider,
        timestamp: new Date().toISOString(),
        valid: false,
        error: 'Invalid signature',
        path: new URL(request.url).pathname,
      });
      return { valid: false, error: 'Signature invalide' };
    }

    await logWebhookAttempt({
      provider,
      timestamp: new Date().toISOString(),
      valid: true,
      path: new URL(request.url).pathname,
    });

    return { valid: true, provider };
  } catch (error) {
    await logWebhookAttempt({
      provider,
      timestamp: new Date().toISOString(),
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return { valid: false, error: 'Erreur de vérification' };
  }
}

/**
 * Auto-detect provider and verify
 */
export async function verifyWebhook(
  request: Request
): Promise<VerificationResult> {
  // Try each provider
  for (const provider of Object.keys(WEBHOOK_PROVIDERS) as WebhookProvider[]) {
    if (request.headers.has(WEBHOOK_PROVIDERS[provider].headerName)) {
      return verifyWebhookSignature(request, provider);
    }
  }

  return { valid: false, error: 'Provider non reconnu' };
}

/**
 * Log webhook verification attempt
 */
async function logWebhookAttempt(log: WebhookLog): Promise<void> {
  // In production, write to audit_logs table
  if (log.valid) {
    console.log(`[WEBHOOK] Valid: ${log.provider} at ${log.timestamp}`);
  } else {
    // Log security incidents
    console.error(`[WEBHOOK SECURITY] Invalid: ${log.provider} - ${log.error} at ${log.timestamp}`);
    
    // TODO: Write to security_incidents table
    // This should trigger an alert for invalid webhook attempts
  }
}

/**
 * Create a webhook endpoint with verification
 */
export function createVerifiedWebhookHandler(
  provider: WebhookProvider,
  handler: (body: unknown) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    // Verify signature first
    const verification = await verifyWebhookSignature(request, provider);
    
    if (!verification.valid) {
      return new Response(
        JSON.stringify({ error: 'Signature invalide' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Parse body after verification
      const body = await request.json();
      return handler(body);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Corps de requête invalide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
