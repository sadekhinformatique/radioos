// Per-tenant rate limiting for RadioOS
// Each radio has its own rate limits to prevent one tenant from degrading others

// Rate limit configurations per tenant
interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export const TENANT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // API requests
  api: {
    windowMs: 60 * 1000,      // 1 minute
    max: 100,                  // 100 requests per minute per tenant
  },
  // File uploads
  uploads: {
    windowMs: 60 * 1000,      // 1 minute
    max: 10,                   // 10 uploads per minute
  },
  // Messages (dedications, listener messages)
  messages: {
    windowMs: 60 * 1000,      // 1 minute
    max: 30,                   // 30 messages per minute
  },
  // Poll votes
  pollVotes: {
    windowMs: 60 * 1000,      // 1 minute
    max: 20,                   // 20 votes per minute
  },
  // Stream status checks
  streamChecks: {
    windowMs: 60 * 1000,      // 1 minute
    max: 300,                  // 300 checks (5 per second)
  },
};

type RateLimitCategory = keyof typeof TENANT_RATE_LIMITS;

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (replace with Redis in production)
const tenantRateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of tenantRateLimitStore.entries()) {
      if (now > entry.resetTime) {
        tenantRateLimitStore.delete(key);
      }
    }
  }, 60000);
}

/**
 * Get max limit for a category
 */
function getMaxLimit(category: RateLimitCategory): number {
  return TENANT_RATE_LIMITS[category]?.max ?? 100;
}

/**
 * Get window duration for a category
 */
function getWindowMs(category: RateLimitCategory): number {
  return TENANT_RATE_LIMITS[category]?.windowMs ?? 60000;
}

/**
 * Check tenant rate limit
 */
export function checkTenantRateLimit(
  radioId: string,
  category: RateLimitCategory
): { allowed: boolean; remaining: number; resetIn: number } {
  const windowMs = getWindowMs(category);
  const max = getMaxLimit(category);
  const key = `tenant:${radioId}:${category}`;
  const now = Date.now();

  const entry = tenantRateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    tenantRateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: max - 1,
      resetIn: windowMs,
    };
  }

  if (entry.count >= max) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: max - entry.count,
    resetIn: entry.resetTime - now,
  };
}

/**
 * Middleware-style rate limit check with response headers
 */
export async function withTenantRateLimit(
  request: Request,
  category: RateLimitCategory,
  handler: () => Promise<Response>
): Promise<Response> {
  // Extract radio_id from request (URL path or header)
  const radioId = extractRadioId(request);
  
  if (!radioId) {
    // No radio context, use global rate limit
    return handler();
  }

  const { allowed, remaining, resetIn } = checkTenantRateLimit(radioId, category);

  if (!allowed) {
    // Rate limit exceeded
    await logRateLimitExceeded(radioId, category);
    
    return new Response(
      JSON.stringify({
        error: 'Limite de requêtes atteinte pour cette radio',
        retryIn: Math.ceil(resetIn / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(getMaxLimit(category)),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil((Date.now() + resetIn) / 1000)),
          'Retry-After': String(Math.ceil(resetIn / 1000)),
        },
      }
    );
  }

  // Execute handler
  const response = await handler();

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', String(getMaxLimit(category)));
  response.headers.set('X-RateLimit-Remaining', String(remaining));

  return response;
}

/**
 * Extract radio_id from request
 */
function extractRadioId(request: Request): string | null {
  const url = new URL(request.url);
  
  // Check URL path: /api/v1/radios/{radioId}/...
  const pathParts = url.pathname.split('/');
  const radiosIndex = pathParts.indexOf('radios');
  if (radiosIndex !== -1 && pathParts[radiosIndex + 1]) {
    return pathParts[radiosIndex + 1];
  }

  // Check header
  const radioHeader = request.headers.get('x-radio-id');
  if (radioHeader) return radioHeader;

  // Check query parameter
  const radioParam = url.searchParams.get('radio_id');
  if (radioParam) return radioParam;

  return null;
}

/**
 * Log rate limit exceeded events
 */
async function logRateLimitExceeded(
  radioId: string,
  category: RateLimitCategory
): Promise<void> {
  console.error(
    JSON.stringify({
      type: 'RATE_LIMIT_EXCEEDED',
      radioId,
      category,
      timestamp: new Date().toISOString(),
    })
  );

  // TODO: Write to security_incidents table
}

/**
 * Get current rate limit status for a tenant
 */
export function getTenantRateLimitStatus(
  radioId: string
): Record<RateLimitCategory, { used: number; limit: number; resetsIn: number }> {
  const now = Date.now();
  const status = {} as Record<RateLimitCategory, { used: number; limit: number; resetsIn: number }>;

  for (const category of Object.keys(TENANT_RATE_LIMITS) as RateLimitCategory[]) {
    const key = `tenant:${radioId}:${category}`;
    const entry = tenantRateLimitStore.get(key);
    const max = getMaxLimit(category);

    if (!entry || now > entry.resetTime) {
      status[category] = {
        used: 0,
        limit: max,
        resetsIn: 0,
      };
    } else {
      status[category] = {
        used: entry.count,
        limit: max,
        resetsIn: Math.ceil((entry.resetTime - now) / 1000),
      };
    }
  }

  return status;
}
